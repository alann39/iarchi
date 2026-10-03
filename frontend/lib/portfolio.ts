import 'server-only'

import {defineQuery} from 'next-sanity'

import {client} from '@/sanity/lib/client'

// ---------------------------------------------------------------------------
// Contract data shapes — specs/03-CONTRACTS.md §3.
// Shared between the chat API route (server) and chat UI components (client).
// ---------------------------------------------------------------------------

export interface ProjectCardData {
  title: string
  year: string
  description: string
  tags: string[]
  githubUrl?: string
  demoUrl?: string
  coverImageUrl?: string
  featured: boolean
}

export interface ExperienceCardData {
  company: string
  role: string
  /** e.g. "2023 — Now", composed from startDate/endDate */
  period: string
  description: string
  tags: string[]
}

export interface SkillGroupData {
  title: string
  skills: string[]
}

export interface ContactData {
  platform: string
  label: string
  url: string
}

export interface ProfileData {
  name: string
  tagline: string
  location: string
  availability: string
  bio: string
  photoUrl?: string
}

export interface SiteSettingsData {
  cvUrl?: string
  contactEmail?: string
}

export interface PortfolioData {
  profile: ProfileData | null
  projects: ProjectCardData[]
  experience: ExperienceCardData[]
  skillGroups: SkillGroupData[]
  socialLinks: ContactData[]
  suggestedQuestions: string[]
  siteSettings: SiteSettingsData | null
}

// ---------------------------------------------------------------------------
// GROQ queries — specs/03-CONTRACTS.md §4.
// ---------------------------------------------------------------------------

const profileQuery = defineQuery(`*[_type == "profile"][0]{
  name, tagline, location, availability, bio,
  "photoUrl": photo.asset->url
}`)

const projectsQuery = defineQuery(`*[_type == "project"] | order(sortOrder asc){
  title, year, description, tags, githubUrl, demoUrl,
  "coverImageUrl": cover.asset->url, featured
}`)

const experienceQuery = defineQuery(`*[_type == "experience"] | order(sortOrder asc){
  company, role, startDate, endDate, description, tags
}`)

const skillGroupsQuery = defineQuery(`*[_type == "skillGroup"] | order(sortOrder asc){
  title, skills
}`)

const socialLinksQuery = defineQuery(`*[_type == "socialLink"] | order(sortOrder asc){
  platform, label, url
}`)

const suggestedQuestionsQuery = defineQuery(`*[_type == "suggestedQuestion"] | order(sortOrder asc){
  question
}`)

const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  "cvUrl": cvFile.asset->url, contactEmail
}`)

// ---------------------------------------------------------------------------
// Raw GROQ result shapes. Optional fields come back as null from Sanity;
// mappers below normalize them into the contract shapes.
// ---------------------------------------------------------------------------

interface RawProject {
  title: string
  year: string
  description: string
  tags: string[] | null
  githubUrl: string | null
  demoUrl: string | null
  coverImageUrl: string | null
  featured: boolean | null
}

interface RawExperience {
  company: string
  role: string
  startDate: string
  endDate: string | null
  description: string | null
  tags: string[] | null
}

interface RawProfile {
  name: string
  tagline: string
  location: string | null
  availability: string | null
  bio: string
  photoUrl: string | null
}

interface RawSkillGroup {
  title: string
  skills: string[] | null
}

interface RawSocialLink {
  platform: string
  label: string
  url: string
}

interface RawSuggestedQuestion {
  question: string
}

interface RawSiteSettings {
  cvUrl: string | null
  contactEmail: string | null
}

function toProjectCardData(raw: RawProject): ProjectCardData {
  return {
    title: raw.title,
    year: raw.year,
    description: raw.description,
    tags: raw.tags ?? [],
    githubUrl: raw.githubUrl ?? undefined,
    demoUrl: raw.demoUrl ?? undefined,
    coverImageUrl: raw.coverImageUrl ?? undefined,
    featured: raw.featured ?? false,
  }
}

function toExperienceCardData(raw: RawExperience): ExperienceCardData {
  return {
    company: raw.company,
    role: raw.role,
    period: raw.endDate ? `${raw.startDate} — ${raw.endDate}` : raw.startDate,
    description: raw.description ?? '',
    tags: raw.tags ?? [],
  }
}

function toProfileData(raw: RawProfile): ProfileData {
  return {
    name: raw.name,
    tagline: raw.tagline,
    location: raw.location ?? '',
    availability: raw.availability ?? '',
    bio: raw.bio,
    photoUrl: raw.photoUrl ?? undefined,
  }
}

function toSkillGroupData(raw: RawSkillGroup): SkillGroupData {
  return {title: raw.title, skills: raw.skills ?? []}
}

function toContactData(raw: RawSocialLink): ContactData {
  return {platform: raw.platform, label: raw.label, url: raw.url}
}

function toSiteSettingsData(raw: RawSiteSettings): SiteSettingsData {
  return {
    cvUrl: raw.cvUrl ?? undefined,
    contactEmail: raw.contactEmail ?? undefined,
  }
}

async function fetchPortfolio(): Promise<PortfolioData> {
  const [
    rawProfile,
    rawProjects,
    rawExperience,
    rawSkillGroups,
    rawSocialLinks,
    rawQuestions,
    rawSettings,
  ] = await Promise.all([
    client.fetch<RawProfile | null>(profileQuery),
    client.fetch<RawProject[]>(projectsQuery),
    client.fetch<RawExperience[]>(experienceQuery),
    client.fetch<RawSkillGroup[]>(skillGroupsQuery),
    client.fetch<RawSocialLink[]>(socialLinksQuery),
    client.fetch<RawSuggestedQuestion[]>(suggestedQuestionsQuery),
    client.fetch<RawSiteSettings | null>(siteSettingsQuery),
  ])

  return {
    profile: rawProfile ? toProfileData(rawProfile) : null,
    projects: rawProjects.map(toProjectCardData),
    experience: rawExperience.map(toExperienceCardData),
    skillGroups: rawSkillGroups.map(toSkillGroupData),
    socialLinks: rawSocialLinks.map(toContactData),
    suggestedQuestions: rawQuestions.map((q: RawSuggestedQuestion) => q.question),
    siteSettings: rawSettings ? toSiteSettingsData(rawSettings) : null,
  }
}

// ---------------------------------------------------------------------------
// 60-second in-memory cache. The API route calls getPortfolio() per request;
// this keeps Sanity load low while content edits surface within a minute.
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 60_000

let cache: {data: PortfolioData; fetchedAt: number} | null = null

/**
 * Returns the full portfolio content in contract shapes.
 * Server-only — called by app/api/chat/route.ts.
 */
export async function getPortfolio(): Promise<PortfolioData> {
  const now = Date.now()
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data
  }
  const data = await fetchPortfolio()
  cache = {data, fetchedAt: now}
  return data
}

'use client';

import type {ProfileData} from '@/lib/portfolio';

import {ContactCard} from './cards/ContactCard';
import {ExperienceCard} from './cards/ExperienceCard';
import {ProjectCard} from './cards/ProjectCard';
import {SkillsCard} from './cards/SkillsCard';
import type {ToolEvent} from './types';

export interface ToolRendererProps {
  /** A tool call executed server-side, delivered via SSE — specs/03-CONTRACTS.md §1. */
  tool: ToolEvent;
}

const MONO = "font-['IBM_Plex_Mono',monospace]";
const DISPLAY = "font-['Space_Grotesk',sans-serif]";

/** Compact profile block for the show_profile tool (no dedicated card in §8). */
function ProfileBlock({profile}: {profile: ProfileData}) {
  return (
    <div className="border-t border-[rgba(16,20,24,0.12)] py-4">
      <p className={`${DISPLAY} text-[18px] font-semibold tracking-[-0.01em] text-[#101418]`}>
        {profile.name}
      </p>
      {profile.tagline && (
        <p className={`${MONO} mt-1 text-[11px] uppercase tracking-[0.12em] text-[#6E7680]`}>
          {profile.tagline}
        </p>
      )}
      <p className="mt-2 text-[14px] leading-[1.55] text-[#6E7680]">{profile.bio}</p>
    </div>
  );
}

/**
 * Routes an executed tool call to its rich card component.
 * Unknown tools render nothing — never crash the stream.
 * Specs/03-CONTRACTS.md §2, specs/06-UI-SPEC.md §8.
 */
export function ToolRenderer({tool}: ToolRendererProps) {
  switch (tool.name) {
    case 'show_projects': {
      const projects = tool.result.projects ?? [];
      if (projects.length === 0) return null;
      return (
        <div>
          {projects.map((project, i) => (
            <ProjectCard key={`${project.title}-${i}`} project={project} index={i} />
          ))}
        </div>
      );
    }
    case 'show_experience': {
      const experience = tool.result.experience ?? [];
      if (experience.length === 0) return null;
      return (
        <div>
          {experience.map((item, i) => (
            <ExperienceCard key={`${item.company}-${item.role}-${i}`} experience={item} />
          ))}
        </div>
      );
    }
    case 'show_skills': {
      const groups = tool.result.groups ?? [];
      if (groups.length === 0) return null;
      return <SkillsCard groups={groups} />;
    }
    case 'show_contact': {
      const contacts = tool.result.contacts ?? [];
      if (contacts.length === 0) return null;
      return <ContactCard contacts={contacts} />;
    }
    case 'show_profile': {
      const profile = tool.result.profile;
      if (!profile) return null;
      return <ProfileBlock profile={profile} />;
    }
    default:
      return null;
  }
}

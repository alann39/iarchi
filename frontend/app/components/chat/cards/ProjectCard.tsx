'use client';

import Image from 'next/image';
import {ArrowUpRight} from 'lucide-react';

import type {ProjectCardData} from '@/lib/portfolio';

export interface ProjectCardProps {
  project: ProjectCardData;
  /** 0-based position; rendered as a mono index numeral (01, 02, …). */
  index: number;
}

const MONO = "font-['IBM_Plex_Mono',monospace]";
const DISPLAY = "font-['Space_Grotesk',sans-serif]";

/**
 * Project ledger row — specs/06-UI-SPEC.md §8.
 * Flat, hairline top rule, mono index numeral. No shadow.
 */
export function ProjectCard({project, index}: ProjectCardProps) {
  const numeral = String(index + 1).padStart(2, '0');
  const initial = project.title.charAt(0).toUpperCase() || '?';

  return (
    <article className="border-t border-[rgba(16,20,24,0.12)] py-[18px] transition-colors duration-150 hover:border-[rgba(16,20,24,0.35)]">
      <div className={`flex items-baseline gap-3 ${MONO} text-[13px] text-[#6E7680]`}>
        <span>{numeral}</span>
        <span className="ml-auto">{project.year}</span>
      </div>

      <h4 className={`${DISPLAY} mt-1 text-[18px] font-semibold tracking-[-0.01em] text-[#101418]`}>
        {project.title}
      </h4>

      {project.coverImageUrl ? (
        <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-[12px]">
          <Image
            src={project.coverImageUrl}
            alt={`${project.title} cover`}
            fill
            className="object-cover"
            sizes="(max-width: 720px) 100vw, 720px"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="mt-3 flex aspect-[16/10] items-center justify-center rounded-[12px] bg-[#E9EBED]"
        >
          <span className={`${MONO} text-[32px] font-semibold text-[rgba(16,20,24,0.35)]`}>
            {initial}
          </span>
        </div>
      )}

      <p className="mt-3 line-clamp-2 text-[14px] leading-[1.55] text-[#6E7680]">
        {project.description}
      </p>

      {project.tags.length > 0 && (
        <p className={`${MONO} mt-2 text-[11px] uppercase tracking-[0.08em] text-[#6E7680]`}>
          {project.tags.join(' · ')}
        </p>
      )}

      {(project.githubUrl || project.demoUrl) && (
        <div className={`${MONO} mt-2.5 flex gap-4 text-[13px]`}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#FF4D00] hover:underline"
            >
              GitHub
              <ArrowUpRight size={13} />
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#FF4D00] hover:underline"
            >
              Demo
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      )}
    </article>
  );
}

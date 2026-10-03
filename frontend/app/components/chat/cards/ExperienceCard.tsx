'use client';

import type {ExperienceCardData} from '@/lib/portfolio';

export interface ExperienceCardProps {
  experience: ExperienceCardData;
}

const MONO = "font-['IBM_Plex_Mono',monospace]";

/**
 * Experience ledger row — specs/06-UI-SPEC.md §8.
 * Role semibold + company muted; duration mono right; hairline dividers.
 */
export function ExperienceCard({experience}: ExperienceCardProps) {
  return (
    <article className="border-t border-[rgba(16,20,24,0.12)] py-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[16px] font-semibold text-[#101418]">
          {experience.role}{' '}
          <span className="font-normal text-[#6E7680]">{experience.company}</span>
        </p>
        <span className={`shrink-0 ${MONO} text-[12px] text-[#6E7680]`}>
          {experience.period}
        </span>
      </div>
      {experience.description && (
        <p className="mt-1 text-[14px] leading-[1.55] text-[#6E7680]">
          {experience.description}
        </p>
      )}
    </article>
  );
}

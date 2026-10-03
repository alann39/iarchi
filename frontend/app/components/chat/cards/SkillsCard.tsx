'use client';

import type {SkillGroupData} from '@/lib/portfolio';

export interface SkillsCardProps {
  groups: SkillGroupData[];
}

const MONO = "font-['IBM_Plex_Mono',monospace]";

/**
 * Skills ledger block — specs/06-UI-SPEC.md §8.
 * Kicker mono group title + inline skill list separated by ·.
 */
export function SkillsCard({groups}: SkillsCardProps) {
  if (groups.length === 0) return null;

  return (
    <div className="border-t border-[rgba(16,20,24,0.12)] py-4">
      {groups.map((group) => (
        <div key={group.title} className="mb-3 last:mb-0">
          <p className={`${MONO} text-[11px] uppercase tracking-[0.12em] text-[#6E7680]`}>
            {group.title}
          </p>
          <p className="mt-1 text-[14px] leading-[1.55] text-[#101418]">
            {group.skills.join(' · ')}
          </p>
        </div>
      ))}
    </div>
  );
}

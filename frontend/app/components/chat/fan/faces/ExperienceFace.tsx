'use client';

import type {ExperienceCardData} from '@/lib/portfolio';

import {experienceIcon} from '../fanIcons';

export interface ExperienceFaceProps {
  experience: ExperienceCardData;
  index: number;
}

/** Ledger slip: ink typebar, code, per-card icon, role, org · period. */
export function ExperienceFace({experience, index}: ExperienceFaceProps) {
  const Icon = experienceIcon(experience.role, experience.company);
  const code = `E.${String(index + 1).padStart(2, '0')}`;
  return (
    <div className="fan-face">
      <div className="fan-typebar fan-typebar--ink" />
      <div className="fan-coderow">
        <span className="fan-code">{code}</span>
        <Icon className="fan-ico" size={20} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <p className="fan-title">{experience.role}</p>
      <p className="fan-sub">
        {experience.company}
        <br />
        {experience.period}
      </p>
      <div className="fan-chips">
        {experience.tags.slice(0, 1).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

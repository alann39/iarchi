'use client';

import type {PickData} from '@/lib/portfolio';

import {movieIcon} from '../fanIcons';

export interface MovieFaceProps {
  pick: PickData;
  index: number;
}

/** Ticket stub: dashed stub + vertical year, code + icon, title, director. */
export function MovieFace({pick, index}: MovieFaceProps) {
  const Icon = movieIcon(index);
  const code = `F.${String(index + 1).padStart(2, '0')}`;
  return (
    <div className="fan-face fan-face--stub">
      <div className="fan-stub" aria-hidden="true">
        <span>{pick.year ?? '····'}</span>
      </div>
      <div className="fan-coderow">
        <span className="fan-code">{code}</span>
        <Icon className="fan-ico" size={20} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <p className="fan-title">{pick.title}</p>
      <p className="fan-sub">{pick.creator}</p>
    </div>
  );
}

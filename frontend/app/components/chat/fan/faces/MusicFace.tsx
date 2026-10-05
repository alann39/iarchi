'use client';

import type {PickData} from '@/lib/portfolio';

import {musicIcon} from '../fanIcons';
import {MiniPlayer} from '../MiniPlayer';

export interface MusicFaceProps {
  pick: PickData;
  index: number;
}

/** Tape strip: code + icon, working play button, track — artist, live progress. */
export function MusicFace({pick, index}: MusicFaceProps) {
  const Icon = musicIcon(index);
  const code = `M.${String(index + 1).padStart(2, '0')}`;
  return (
    <div className="fan-face">
      <div className="fan-coderow">
        <span className="fan-code">{code}</span>
        <Icon className="fan-ico" size={20} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <div className="fan-playrow">
        <MiniPlayer src={pick.previewUrl} title={pick.title} />
        <div className="min-w-0">
          <p className="fan-title fan-title--sm">{pick.title}</p>
          <p className="fan-sub">{pick.creator}</p>
        </div>
      </div>
    </div>
  );
}

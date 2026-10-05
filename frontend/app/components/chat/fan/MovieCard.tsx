'use client';

import type {PickData} from '@/lib/portfolio';

export interface MovieCardProps {
  pick: PickData;
}

/**
 * Full movie card for the stack modal (TASK-17): portrait poster +
 * title/creator/year/note. TasteCard's square crop doesn't suit posters,
 * so movies get this dedicated row instead of reusing it.
 */
export function MovieCard({pick}: MovieCardProps) {
  return (
    <article className="fan-moviecard">
      {pick.artworkUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pick.artworkUrl}
          alt={`${pick.title} poster`}
          className="fan-poster"
          loading="lazy"
        />
      ) : (
        <div className="fan-poster fan-poster--fallback" aria-hidden="true">
          ▸
        </div>
      )}
      <div className="min-w-0">
        <h4>{pick.title}</h4>
        <p className="meta">
          {pick.creator}
          {pick.year ? ` · ${pick.year}` : ''}
        </p>
        {pick.note && <p className="note">{pick.note}</p>}
      </div>
    </article>
  );
}

'use client';

import {useEffect, useRef, useState} from 'react';

import type {ProfileData} from '@/lib/portfolio';

interface HeroHeadlineProps {
  /** Profile from Sanity. Null renders the E3 empty state (never a blank page). */
  profile: ProfileData | null;
}

const MONO = "font-['IBM_Plex_Mono',monospace]";

// P3 egg 1 — "the ■ keeps count" (specs/04-TASKS.md TASK-16).
const DECLASSIFIED_KEY = 'iarchi_declassified';
const CLICKS_NEEDED = 5;
/** Decay window: the counter resets if clicks are slower than this. */
const DECAY_MS = 1500;

/**
 * Hero headline — direction A ("The Input Is the Hero"), approved 2026-10-03.
 * Minimal by construction: a mono kicker (name + availability inline, no
 * separate pill), a two-word H1, and a one-line sub. The bio paragraph is
 * gone — the story lives behind "Read the full story" and the chat itself.
 * Total: ~9 words above the fold.
 *
 * The orange ■ in the kicker is clickable (P3 egg 1): 5 clicks within the
 * decay window reveals a DECLASSIFIED field-note card. Card content is a
 * placeholder — Archi's lore to write.
 */
export function HeroHeadline({profile}: HeroHeadlineProps) {
  const [declassified, setDeclassified] = useState(false);
  const [clicks, setClicks] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // localStorage is client-only — read after mount to avoid hydration mismatch.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(DECLASSIFIED_KEY) === '1') setDeclassified(true);
    } catch {
      // Private mode etc. — the egg just won't persist. Never crash the hero.
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleSquareClick = () => {
    if (declassified) return;
    const next = clicks + 1;
    if (timer.current) clearTimeout(timer.current);
    if (next >= CLICKS_NEEDED) {
      setDeclassified(true);
      setClicks(0);
      try {
        window.localStorage.setItem(DECLASSIFIED_KEY, '1');
      } catch {
        // Non-fatal — see above.
      }
      return;
    }
    setClicks(next);
    timer.current = setTimeout(() => setClicks(0), DECAY_MS);
  };

  if (!profile) {
    return (
      <div>
        <p className={`${MONO} text-[11px] uppercase tracking-[0.12em] text-[#6E7680]`}>
          Content loading — check back soon
        </p>
        <h1 className="mt-3 font-['Space_Grotesk',sans-serif] text-[32px] font-bold leading-[1.05] tracking-[-0.02em] text-[#101418] max-md:text-[26px]">
          Portfolio content coming soon.
        </h1>
      </div>
    );
  }

  const availability = profile.availability?.trim();

  return (
    <div>
      <p
        className={`flex items-center gap-2.5 ${MONO} text-[11px] uppercase tracking-[0.12em] text-[#101418]`}
      >
        <button
          type="button"
          onClick={handleSquareClick}
          aria-label="A small orange square. It keeps count."
          className="inline-block h-2 w-2 shrink-0 cursor-pointer bg-[#FF4D00] transition-transform duration-100 active:translate-y-[1px]"
        />
        {profile.name} — AI portfolio{availability ? ` · ${availability}` : ''}
        {clicks > 0 && !declassified && (
          <span aria-hidden="true" className="text-[10px] text-[rgba(16,20,24,0.4)]">
            {'■'.repeat(clicks)} {clicks}/{CLICKS_NEEDED}
          </span>
        )}
      </p>
      <h1 className="mt-[18px] font-['Space_Grotesk',sans-serif] text-[44px] font-bold leading-[1.02] tracking-[-0.02em] text-[#101418] max-md:text-[34px]">
        Ask me
        <br />
        anything.
      </h1>
      <p className="mt-3.5 text-[15px] leading-[1.6] text-[#6E7680]">
        This site is a conversation, not a r&eacute;sum&eacute;.
      </p>

      {declassified && (
        <div className="relative mt-6 border border-[#FF4D00] bg-white p-5">
          <span
            aria-hidden="true"
            className={`absolute right-3 top-3 rotate-3 border border-[#FF4D00] px-2 py-0.5 ${MONO} text-[10px] uppercase tracking-[0.14em] text-[#FF4D00]`}
          >
            Declassified
          </span>
          <p className={`${MONO} text-[11px] uppercase tracking-[0.12em] text-[#FF4D00]`}>
            ■ Field note #001
          </p>
          <p className="mt-2 max-w-[52ch] text-[14px] italic leading-[1.6] text-[#6E7680]">
            [Archi&apos;s lore goes here — his to write. One unhinged-but-tasteful truth: tabs-vs-spaces
            verdict, debugging snack, most cursed bug.]
          </p>
          <p className={`${MONO} mt-3 text-[10px] uppercase tracking-[0.12em] text-[rgba(16,20,24,0.4)]`}>
            ■ already declassified — the square rests.
          </p>
        </div>
      )}
    </div>
  );
}

import type {ProfileData} from '@/lib/portfolio';

interface HeroHeadlineProps {
  /** Profile from Sanity. Null renders the E3 empty state (never a blank page). */
  profile: ProfileData | null;
}

/**
 * Hero headline — direction A ("The Input Is the Hero"), approved 2026-10-03.
 * Minimal by construction: a mono kicker (name + availability inline, no
 * separate pill), a two-word H1, and a one-line sub. The bio paragraph is
 * gone — the story lives behind "Read the full story" and the chat itself.
 * Total: ~9 words above the fold.
 */
export function HeroHeadline({profile}: HeroHeadlineProps) {
  if (!profile) {
    return (
      <div>
        <p className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.12em] text-[#6E7680]">
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
      <p className="flex items-center gap-2.5 font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.12em] text-[#101418]">
        <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 bg-[#FF4D00]" />
        {profile.name} — AI portfolio{availability ? ` · ${availability}` : ''}
      </p>
      <h1 className="mt-[18px] font-['Space_Grotesk',sans-serif] text-[44px] font-bold leading-[1.02] tracking-[-0.02em] text-[#101418] max-md:text-[34px]">
        Ask me
        <br />
        anything.
      </h1>
      <p className="mt-3.5 text-[15px] leading-[1.6] text-[#6E7680]">
        This site is a conversation, not a r&eacute;sum&eacute;.
      </p>
    </div>
  );
}

import type {ProfileData} from '@/lib/portfolio';

interface HeroHeadlineProps {
  /** Profile from Sanity. Null renders the E3 empty state (never a blank page). */
  profile: ProfileData | null;
}

/**
 * Hero headline — specs/06-UI-SPEC.md §4.
 * "{name} — {tagline}." in Space Grotesk 700 + bio subline in DM Sans muted.
 * When no profile data exists (07-UX-FLOWS.md E3), shows the coming-soon state.
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

  return (
    <div>
      <h1 className="font-['Space_Grotesk',sans-serif] text-[32px] font-bold leading-[1.05] tracking-[-0.02em] text-[#101418] max-md:text-[26px]">
        {profile.name} — {profile.tagline}
      </h1>
      <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-[#6E7680]">{profile.bio}</p>
    </div>
  );
}

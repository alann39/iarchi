interface AvailabilityPillProps {
  /** Availability text from profile. Null/empty hides the pill (never a placeholder). */
  availability: string | null;
}

/**
 * Availability status — specs/06-UI-SPEC.md §3.
 * Mono uppercase kicker with an 8px accent square. Crisp, no animation.
 * Hidden when there is no availability data.
 */
export function AvailabilityPill({availability}: AvailabilityPillProps) {
  if (!availability) return null;

  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 bg-[#FF4D00]" />
      <span className="font-['IBM_Plex_Mono',monospace] text-[11px] uppercase tracking-[0.12em] text-[#101418]">
        {availability}
      </span>
    </div>
  );
}

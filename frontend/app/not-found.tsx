import Link from 'next/link';

const MONO = "font-['IBM_Plex_Mono',monospace]";

/**
 * Delightful 404 — P3 egg 3 (specs/04-TASKS.md TASK-16).
 * Static and minimal: the joke is the manifest language, not a mini-game.
 * No animation beyond the 100ms mechanical press on the button.
 */
export default function NotFound() {
  return (
    <section className="bg-[#101418] text-[#F4F5F6]">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-[720px] flex-col items-center justify-center px-5 py-24 text-center">
        <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-[#FF4D00]`}>
          ■ Signal lost
        </p>
        <p
          aria-hidden="true"
          className={`${MONO} mt-4 text-[clamp(72px,14vw,128px)] font-semibold leading-none tracking-[-0.04em]`}
        >
          404
        </p>
        <p className={`${MONO} mt-4 text-[12px] uppercase tracking-[0.08em] text-[rgba(244,245,246,0.6)]`}>
          Route not on manifest
        </p>
        <Link
          href="/"
          className={`${MONO} mt-8 inline-block bg-[#FF4D00] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#101418] transition-transform duration-100 active:translate-y-[2px]`}
        >
          Return to console
        </Link>
      </div>
    </section>
  );
}

import type {Metadata} from 'next';

const MONO = "font-['IBM_Plex_Mono',monospace]";

export const metadata: Metadata = {
  title: 'Colophon',
  description:
    "Build manifest for Archi's portfolio — typefaces, palette, stack. An undocumented route for the curious.",
};

/**
 * Hidden /colophon route — P3 egg 5 (specs/04-TASKS.md TASK-16).
 * A build-manifest page in the instrument-panel voice. Undocumented: no nav
 * link anywhere; found via the DevTools console hint or by guessing.
 */
export default function ColophonPage() {
  const rows: [string, string][] = [
    ['Typeface', 'Space Grotesk · DM Sans · IBM Plex Mono'],
    ['Palette', '#F4F5F6 · #101418 · #FF4D00'],
    ['Stack', 'Next.js · Sanity · Vercel · OpenRouter'],
    ['Motion', '100ms mechanical press. Nothing else.'],
    ['Cookies', 'None were harmed. Or used.'],
  ];
  return (
    <div className="mx-auto w-full max-w-[720px] px-5 py-16">
      <p className={`${MONO} text-[11px] uppercase tracking-[0.14em] text-[#6E7680]`}>
        ■ Undocumented route
      </p>
      <h1 className="mt-3 font-['Space_Grotesk',sans-serif] text-[32px] font-bold tracking-[-0.02em] text-[#101418]">
        Colophon
      </h1>
      <p className="mt-2 text-[15px] leading-[1.6] text-[#6E7680]">
        Build manifest. You found the page that isn&apos;t linked anywhere.
      </p>
      <dl className="mt-8 border-t border-[#101418]">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col gap-1 border-b border-[rgba(16,20,24,0.12)] py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <dt className={`${MONO} shrink-0 text-[11px] uppercase tracking-[0.12em] text-[rgba(16,20,24,0.55)]`}>
              {label}
            </dt>
            <dd className="text-[15px] text-[#101418] sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

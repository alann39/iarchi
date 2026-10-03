import Link from 'next/link';
import {Briefcase, Link2, Mail} from 'lucide-react';
import {siBehance, siGithub, siGmail, siInstagram, siTelegram, siWhatsapp, siX} from 'simple-icons';

import {getPortfolio} from '@/lib/portfolio';
import type {ContactData, PortfolioData} from '@/lib/portfolio';

import {AvailabilityPill} from './components/chat/AvailabilityPill';
import {HeroHeadline} from './components/chat/HeroHeadline';
import {HomeClient} from './components/chat/HomeClient';

// FALLBACK: default suggested questions when Sanity has none (Constitution §3).
const FALLBACK_QUESTIONS = ['What have you built?', "What's your work history?", 'How can I contact you?'];

const MONO = "font-['IBM_Plex_Mono',monospace]";

/**
 * Brand icon for a social platform. Mirrors the mapping in
 * app/components/chat/cards/ContactCard.tsx (simple-icons per-brand imports;
 * LinkedIn has no glyph in simple-icons v16 — use a stand-in).
 */
function SocialIcon({platform}: {platform: string}) {
  const key = platform.toLowerCase();

  if (key.includes('linkedin')) {
    return <Briefcase size={20} aria-hidden="true" />;
  }

  const path =
    key.includes('github')
      ? siGithub.path
      : key === 'x' || key.includes('twitter')
        ? siX.path
        : key.includes('instagram')
          ? siInstagram.path
          : key.includes('behance')
            ? siBehance.path
            : key.includes('whatsapp')
              ? siWhatsapp.path
              : key.includes('telegram')
                ? siTelegram.path
                : key.includes('gmail')
                  ? siGmail.path
                  : null;

  if (path) {
    return (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    );
  }
  if (key.includes('mail')) {
    return <Mail size={20} aria-hidden="true" />;
  }
  return <Link2 size={20} aria-hidden="true" />;
}

/**
 * Site header — specs/06-UI-SPEC.md §2.
 * Left: social icons (20px, muted → ink on hover). Right: segmented
 * [Home | Blog] with the active pill on Home (Blog links to /posts).
 */
function SiteHeader({socialLinks}: {socialLinks: ContactData[]}) {
  return (
    <header className="sticky top-0 z-20 bg-[#F4F5F6]/80 backdrop-blur-[16px]">
      <div className="mx-auto flex w-full max-w-[720px] items-center justify-between px-5 py-3">
        <div className="flex items-center gap-4">
          {socialLinks.map((s) => (
            <a
              key={`${s.platform}-${s.url}`}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-[#6E7680] transition-colors duration-150 hover:text-[#101418]"
            >
              <SocialIcon platform={s.platform} />
            </a>
          ))}
        </div>
        <nav aria-label="Sections" className={`${MONO} relative flex rounded-full bg-[#E9EBED] p-[3px] text-[13px]`}>
          <span
            aria-hidden="true"
            className="absolute bottom-[3px] left-[3px] top-[3px] w-[calc(50%-3px)] rounded-full bg-white shadow-[0_1px_3px_rgba(16,20,24,0.12)]"
          />
          <span className="relative z-10 rounded-full px-4 py-1.5 font-semibold text-[#101418]">Home</span>
          <Link
            href="/posts"
            className="relative z-10 rounded-full px-4 py-1.5 text-[#6E7680] transition-colors hover:text-[#101418]"
          >
            Blog
          </Link>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-[720px] px-5 pb-2.5">
        <p className={`${MONO} text-[11px] uppercase tracking-[0.12em] text-[#6E7680]`}>Archi.dev — Portfolio</p>
      </div>
      <div aria-hidden="true" className="h-px bg-[rgba(16,20,24,0.12)]" />
    </header>
  );
}

/**
 * Landing page — specs/06-UI-SPEC.md §1, specs/07-UX-FLOWS.md Flow 1.
 * Server Component: fetches the portfolio once, then hands interactive
 * state to the HomeClient wrapper. If Sanity is unreachable, degrades
 * gracefully per E3 (never a blank page, never a crash).
 */
export default async function Page() {
  let portfolio: PortfolioData | null = null;
  try {
    portfolio = await getPortfolio();
  } catch {
    // E3: Sanity empty/unreachable — render the coming-soon state below.
    portfolio = null;
  }

  const profile = portfolio?.profile ?? null;
  const socialLinks = portfolio?.socialLinks ?? [];
  const suggestedQuestions =
    portfolio && portfolio.suggestedQuestions.length > 0 ? portfolio.suggestedQuestions : FALLBACK_QUESTIONS;
  const cvUrl = portfolio?.siteSettings?.cvUrl;
  const contactEmail = portfolio?.siteSettings?.contactEmail;

  return (
    <div className="min-h-screen bg-[#F4F5F6] font-['DM_Sans',sans-serif] text-[#101418]">
      <SiteHeader socialLinks={socialLinks} />
      <main className="mx-auto w-full max-w-[720px] px-5 pb-48">
        <div className="pt-11">
          <AvailabilityPill availability={profile?.availability ?? null} />
        </div>
        <div className="mt-5">
          <HeroHeadline profile={profile} />
        </div>
        <HomeClient suggestedQuestions={suggestedQuestions} cvUrl={cvUrl} contactEmail={contactEmail} />
      </main>
    </div>
  );
}

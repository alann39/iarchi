import {getPortfolio} from '@/lib/portfolio';
import type {PortfolioData} from '@/lib/portfolio';

import {HeroHeadline} from './components/chat/HeroHeadline';
import {HomeClient} from './components/chat/HomeClient';
import {Reveal} from './components/Reveal';

// FALLBACK: default suggested questions when Sanity has none (Constitution §3).
const FALLBACK_QUESTIONS = ['What have you built?', "What's your work history?", 'How can I contact you?'];

/**
 * Landing page — specs/06-UI-SPEC.md §1, specs/07-UX-FLOWS.md Flow 1.
 * Server Component: fetches the portfolio once, then hands interactive
 * state to the HomeClient wrapper. If Sanity is unreachable, degrades
 * gracefully per E3 (never a blank page, never a crash).
 *
 * The site header lives in the root layout (persistent across navigations).
 * Entrance uses the staggered blur reveal (specs/05-DESIGN-SYSTEM.md §7):
 * pill → headline → ask, 60ms stagger, once.
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
  const suggestedQuestions =
    portfolio && portfolio.suggestedQuestions.length > 0 ? portfolio.suggestedQuestions : FALLBACK_QUESTIONS;
  const cvUrl = portfolio?.siteSettings?.cvUrl;
  const contactEmail = portfolio?.siteSettings?.contactEmail;

  return (
    <div className="min-h-screen bg-paper font-['DM_Sans',sans-serif] text-ink">
      <main className="mx-auto w-full max-w-[720px] px-5 pb-48">
        <Reveal className="pt-11" delay={0}>
          <HeroHeadline profile={profile} />
        </Reveal>
        <HomeClient suggestedQuestions={suggestedQuestions} cvUrl={cvUrl} contactEmail={contactEmail} />
      </main>
    </div>
  );
}

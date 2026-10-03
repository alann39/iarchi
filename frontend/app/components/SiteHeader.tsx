'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Briefcase, Link2, Mail} from 'lucide-react';
import {siBehance, siGithub, siGmail, siInstagram, siTelegram, siWhatsapp, siX} from 'simple-icons';

import type {ContactData} from '@/lib/portfolio';

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
 * [Home | Blog] with a TRAVELING active pill (200ms ease-lux,
 * specs/05-DESIGN-SYSTEM.md §7).
 *
 * Lives in the root layout so it stays mounted across page navigations —
 * that's what makes the pill travel instead of re-rendering.
 */
export function SiteHeader({socialLinks}: {socialLinks: ContactData[]}) {
  const pathname = usePathname();
  const active: 'home' | 'blog' = pathname?.startsWith('/posts') ? 'blog' : 'home';

  const tabClass = (isActive: boolean) =>
    `relative z-10 w-[72px] rounded-full py-1.5 text-center transition-colors duration-150 ${
      isActive ? 'font-semibold text-ink' : 'text-muted hover:text-ink'
    }`;

  return (
    <header className="sticky top-0 z-20 bg-paper/80 backdrop-blur-[16px]">
      <div className="mx-auto flex w-full max-w-[720px] items-center justify-between px-5 py-3">
        <div className="flex items-center gap-4">
          {socialLinks.map((s) => (
            <a
              key={`${s.platform}-${s.url}`}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-muted transition-colors duration-150 hover:text-ink"
            >
              <SocialIcon platform={s.platform} />
            </a>
          ))}
        </div>
        <nav aria-label="Sections" className={`${MONO} relative flex rounded-full bg-wash p-[3px] text-[13px]`}>
          <span
            aria-hidden="true"
            className={`absolute bottom-[3px] left-[3px] top-[3px] w-[calc(50%-3px)] rounded-full bg-white shadow-[0_1px_3px_rgba(16,20,24,0.12)] transition-transform duration-200 ease-lux ${
              active === 'blog' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
          <Link href="/" aria-current={active === 'home' ? 'page' : undefined} className={tabClass(active === 'home')}>
            Home
          </Link>
          <Link
            href="/posts"
            aria-current={active === 'blog' ? 'page' : undefined}
            className={tabClass(active === 'blog')}
          >
            Blog
          </Link>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-[720px] px-5 pb-2.5">
        <p className={`${MONO} text-[11px] uppercase tracking-[0.12em] text-muted`}>Archi.dev — Portfolio</p>
      </div>
      <div aria-hidden="true" className="h-px bg-hairline" />
    </header>
  );
}

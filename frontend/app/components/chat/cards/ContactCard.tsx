'use client';

import {Briefcase, Link2, Mail} from 'lucide-react';
import {siBehance, siGithub, siInstagram, siWhatsapp, siX} from 'simple-icons';

import type {ContactData} from '@/lib/portfolio';

export interface ContactCardProps {
  contacts: ContactData[];
}

const MONO = "font-['IBM_Plex_Mono',monospace]";

/**
 * Brand icon for a contact platform. Brand SVGs come from `simple-icons`
 * (tree-shakeable per-brand imports); UI fallback from lucide-react.
 * Note: simple-icons v16 ships no LinkedIn glyph (brand takedown), so
 * LinkedIn maps to a Briefcase icon. Specs/05-DESIGN-SYSTEM.md §8.
 */
function PlatformIcon({platform}: {platform: string}) {
  const key = platform.toLowerCase();

  // LinkedIn has no brand glyph in simple-icons v16 or lucide v1 —
  // use a professional-network stand-in instead of faking the logo.
  if (key.includes('linkedin')) {
    return <Briefcase size={16} className="shrink-0" aria-hidden="true" />;
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
              : null;

  if (path) {
    return (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="shrink-0"
      >
        <path d={path} />
      </svg>
    );
  }
  if (key.includes('mail')) {
    return <Mail size={16} className="shrink-0" aria-hidden="true" />;
  }
  return <Link2 size={16} className="shrink-0" aria-hidden="true" />;
}

/**
 * Contact ledger rows — specs/06-UI-SPEC.md §8.
 * Hairline rows: 16px icon + label + url mono muted; hover bg surface.
 */
export function ContactCard({contacts}: ContactCardProps) {
  if (contacts.length === 0) return null;

  return (
    <div>
      {contacts.map((contact, i) => (
        <a
          key={`${contact.platform}-${i}`}
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border-t border-[rgba(16,20,24,0.12)] px-1 py-[13px] text-[14px] text-[#101418] transition-colors last:border-b hover:bg-[#E9EBED]"
        >
          <PlatformIcon platform={contact.platform} />
          <span>{contact.label}</span>
          <span className={`${MONO} ml-auto truncate text-[13px] text-[#6E7680]`}>
            {contact.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </span>
        </a>
      ))}
    </div>
  );
}

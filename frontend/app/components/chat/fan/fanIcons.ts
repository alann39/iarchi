'use client';

import {
  Bot,
  Briefcase,
  Calculator,
  Clapperboard,
  Code,
  Disc3,
  Film,
  Globe,
  Headphones,
  Music,
  Rocket,
  type LucideIcon,
} from 'lucide-react';

/**
 * Per-card Lucide icon resolution for the story fan stacks (TASK-17).
 *
 * Decorative only — chosen by keyword heuristic, never a personal fact.
 * Unknown items fall back to the per-type default. If Archi ever wants
 * precise control, add an `icon` field to the Sanity schemas and read it
 * here instead of (or before) the heuristic.
 */

type Rule = [RegExp, LucideIcon];

const PROJECT_RULES: Rule[] = [
  [/bot|telegram|notinn|chat/i, Bot],
  [/web|site|portfolio|landing|iarchi/i, Globe],
  [/game|play/i, Rocket],
  [/data|ml|ai/i, Code],
];

const EXPERIENCE_RULES: Rule[] = [
  [/engineer|developer|software|code/i, Code],
  [/account|finance|ledger|audit/i, Calculator],
];

const MUSIC_ROTATION: LucideIcon[] = [Disc3, Music, Headphones];
const MOVIE_ROTATION: LucideIcon[] = [Clapperboard, Film];

function match(rules: Rule[], text: string, fallback: LucideIcon): LucideIcon {
  for (const [re, icon] of rules) {
    if (re.test(text)) return icon;
  }
  return fallback;
}

/** e.g. Notinn → Bot, iarchi → Globe, unknown → Rocket. */
export function projectIcon(title: string, tags: string[]): LucideIcon {
  return match(PROJECT_RULES, `${title} ${tags.join(' ')}`, Rocket);
}

/** e.g. Software Engineer → Code, Accounting → Calculator, unknown → Briefcase. */
export function experienceIcon(role: string, company: string): LucideIcon {
  return match(EXPERIENCE_RULES, `${role} ${company}`, Briefcase);
}

/** Rotates Disc3 → Music → Headphones so sibling cards differ. */
export function musicIcon(index: number): LucideIcon {
  return MUSIC_ROTATION[index % MUSIC_ROTATION.length] ?? Disc3;
}

/** Alternates Clapperboard / Film so sibling cards differ. */
export function movieIcon(index: number): LucideIcon {
  return MOVIE_ROTATION[index % MOVIE_ROTATION.length] ?? Clapperboard;
}

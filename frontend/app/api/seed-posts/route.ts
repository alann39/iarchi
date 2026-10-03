import {NextRequest} from 'next/server';

/**
 * TEMPORARY single-use seed endpoint — creates 3 dummy blog posts.
 * Created 2026-10-03 to populate the empty blog for UI testing.
 * Guarded by a one-time key; the whole file is deleted right after seeding.
 * Do NOT keep this route around.
 */

export const runtime = 'nodejs';

const SEED_KEY = 'wO0G-qB7NH39OCs7UHIkrlbWhlgbHvh8';

interface BlockChild {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
}

interface Block {
  _type: 'block';
  _key: string;
  style: string;
  listItem?: string;
  level?: number;
  markDefs: unknown[];
  children: BlockChild[];
}

function block(key: string, text: string, style = 'normal', listItem?: string): Block {
  return {
    _type: 'block',
    _key: key,
    style,
    ...(listItem ? {listItem, level: 1} : {}),
    markDefs: [],
    children: [{_type: 'span', _key: `${key}s`, text, marks: []}],
  };
}

const POSTS = [
  {
    title: '[Draft] Hello, blog.',
    slug: { _type: 'slug' as const, current: 'draft-hello-blog' },
    excerpt: 'Why this blog exists, and what I plan to write about.',
    date: '2026-10-01T10:00:00Z',
    content: [
      block('a1', 'This is a dummy post to test the blog UI. It will be replaced with real writing soon.'),
      block('a2', 'What to expect here', 'h2'),
      block('a3', 'Notes on building software — small, practical, no fluff.', 'normal', 'bullet'),
      block('a4', 'Experiments with design and interfaces.', 'normal', 'bullet'),
      block('a5', 'Occasional thoughts on learning and work.', 'normal', 'bullet'),
    ],
  },
  {
    title: '[Draft] Lessons from building Notinn',
    slug: { _type: 'slug' as const, current: 'draft-lessons-from-notinn' },
    excerpt: 'Small lessons from shipping a Telegram-first notes bot.',
    date: '2026-09-20T10:00:00Z',
    content: [
      block('b1', 'Notinn started as a personal itch: I kept losing thoughts to scattered chat apps and sticky notes. A Telegram bot turned out to be the lowest-friction capture tool — the app was already open all day.'),
      block('b2', 'Lesson 1: meet users where they are', 'h2'),
      block('b3', 'Nobody wants another app for a single job. Building inside Telegram removed onboarding entirely — no signup, no tutorial, just chat.'),
      block('b2b', 'Lesson 2: the dashboard can wait', 'h2'),
      block('b4', 'The bot worked for weeks before the web dashboard existed. Shipping the smallest useful loop first kept momentum up and feedback real.'),
    ],
  },
  {
    title: '[Draft] Why my portfolio is a chat interface',
    slug: { _type: 'slug' as const, current: 'draft-why-chat-portfolio' },
    excerpt: 'Resumes are static. Conversations are not.',
    date: '2026-09-05T10:00:00Z',
    content: [
      block('c1', 'A traditional portfolio makes every visitor read the same page in the same order. A chat interface flips that: you ask what you care about, and the site answers.'),
      block('c2', 'Recruiters ask about experience. Engineers ask about the stack. Friends ask what I am building now. One page cannot serve all three well — a conversation can.'),
      block('c3', 'Under the hood it is deliberately simple: a single API route, a system prompt built from structured content, and tool calls that render rich cards. No agent frameworks, no magic.'),
    ],
  },
];

export async function POST(req: NextRequest) {
  try {
    if (req.nextUrl.searchParams.get('key') !== SEED_KEY) {
      return Response.json({error: 'forbidden'}, {status: 403});
    }
    const token = process.env.SANITY_API_READ_TOKEN;
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    if (!token || !projectId) {
      return Response.json({error: 'sanity not configured'}, {status: 500});
    }
    const mutations = POSTS.map((p) => ({create: {_type: 'post', ...p}}));
    const url = `https://${projectId}.api.sanity.com/v2025-09-25/data/mutate/production`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify({mutations}),
      });
    } catch (e) {
      return Response.json(
        {error: 'fetch threw', message: e instanceof Error ? e.message : String(e), url: url.replace(projectId, '<pid>')},
        {status: 500},
      );
    }
    const data = await res.json().catch(() => null);
    return Response.json({ok: res.ok, status: res.status, data}, {status: res.ok ? 200 : 500});
  } catch (e) {
    return Response.json(
      {error: 'handler threw', message: e instanceof Error ? `${e.name}: ${e.message}` : String(e)},
      {status: 500},
    );
  }
}

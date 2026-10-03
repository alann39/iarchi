import type {Metadata} from 'next';

import {sanityFetch} from '@/sanity/lib/live';
import {allPostsQuery} from '@/sanity/lib/queries';

import {Reveal} from '@/app/components/Reveal';
import {PostSearch} from './PostSearch';
import type {PostListItem} from './PostCard';

const MONO = "font-['IBM_Plex_Mono',monospace]";

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes and essays by Archi on engineering, design, and building products.',
};

/** Revalidate the list every minute so new posts appear without a rebuild. */
export const revalidate = 60;

/**
 * Blog index — TASK-13. Server component: fetches posts once, hands the
 * list to the client search. Empty dataset renders a calm empty state
 * (never template onboarding, never a crash).
 */
export default async function PostsPage() {
  const {data} = await sanityFetch({query: allPostsQuery});

  const posts: PostListItem[] = (data ?? [])
    .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
    .map((p) => ({
      _id: p._id,
      title: p.title || 'Untitled',
      slug: p.slug as string,
      excerpt: p.excerpt ?? null,
      date: p.date ?? null,
    }));

  return (
    <div className="min-h-screen bg-paper font-['DM_Sans',sans-serif] text-ink">
      <main className="mx-auto w-full max-w-[720px] px-5 pb-48">
        <Reveal className="pt-11" delay={0}>
          <p className={`${MONO} text-[11px] uppercase tracking-[0.12em] text-muted`}>Blog</p>
          <h1 className="mt-3 font-['Space_Grotesk',sans-serif] text-[32px] font-bold leading-[1.05] tracking-[-0.02em] text-ink max-md:text-[26px]">
            Notes &amp; essays
          </h1>
          <p className="mt-3 max-w-[65ch] text-[16px] leading-[1.6] text-muted">
            Occasional writing on engineering, design, and building products.
          </p>
        </Reveal>
        <Reveal className="mt-8" delay={60}>
          <PostSearch posts={posts} />
        </Reveal>
      </main>
    </div>
  );
}

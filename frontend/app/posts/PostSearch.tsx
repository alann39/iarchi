'use client';

import {useMemo, useState} from 'react';
import {Search} from 'lucide-react';

import {PostCard, type PostListItem} from './PostCard';
import {Reveal} from '@/app/components/Reveal';

const MONO = "font-['IBM_Plex_Mono',monospace]";

/**
 * Blog list with client-side search (TASK-13).
 * Filters title + excerpt; empty query shows all. Staggered reveal on cards.
 */
export function PostSearch({posts}: {posts: PostListItem[]}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((p) => `${p.title} ${p.excerpt ?? ''}`.toLowerCase().includes(needle));
  }, [query, posts]);

  return (
    <div>
      <div className="relative">
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          aria-label="Search posts"
          className="w-full rounded-full border border-hairline bg-white py-2.5 pl-10 pr-4 text-[15px] text-ink placeholder:text-muted/60 focus:border-ink/35 focus:outline-none"
        />
      </div>

      {posts.length === 0 ? (
        <div className="mt-8 rounded-[12px] border border-hairline bg-white p-8 text-center">
          <p className={`${MONO} text-[11px] uppercase tracking-[0.12em] text-muted`}>No posts yet</p>
          <p className="mt-2 text-[15px] leading-[1.6] text-muted">Writing is in progress — check back soon.</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-[15px] text-muted">
          No posts match <span className={MONO}>“{query.trim()}”</span>.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {filtered.map((post, i) => (
            <Reveal key={post._id} delay={Math.min(i, 5) * 60}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

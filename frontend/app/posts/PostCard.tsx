import Link from 'next/link';

const MONO = "font-['IBM_Plex_Mono',monospace]";

/** Minimal post fields for list rendering (subset of the template query). */
export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  date?: string | null;
}

export function formatPostDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
}

/**
 * Editorial post card — specs/05-DESIGN-SYSTEM.md §6.
 * 1px hairline, no shadow; hover only brightens the border (150ms).
 * No lift, no tilt.
 */
export function PostCard({post}: {post: PostListItem}) {
  const date = formatPostDate(post.date);
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-[12px] border border-hairline bg-white p-5 transition-colors duration-150 hover:border-ink/35"
    >
      {date && (
        <p className={`${MONO} text-[11px] uppercase tracking-[0.12em] text-muted`}>
          <time dateTime={post.date ?? undefined}>{date}</time>
        </p>
      )}
      <h2 className="mt-2 font-['Space_Grotesk',sans-serif] text-[20px] font-semibold leading-[1.25] tracking-[-0.01em] text-ink">
        {post.title}
      </h2>
      {post.excerpt && <p className="mt-2 line-clamp-3 text-[15px] leading-[1.6] text-muted">{post.excerpt}</p>}
      <p className={`${MONO} mt-4 text-[12px] text-muted transition-colors duration-150 group-hover:text-accent`}>
        Read <span aria-hidden="true">→</span>
      </p>
    </Link>
  );
}

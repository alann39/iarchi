import type {Metadata, ResolvingMetadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {Reveal} from '@/app/components/Reveal'
import {PostCard, type PostListItem} from '../PostCard'

const MONO = "font-['IBM_Plex_Mono',monospace]"

/** Revalidate every minute so new/updated posts appear without a rebuild. */
export const revalidate = 60

function formatDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(
  { params: paramsPromise }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await paramsPromise
  const {data: post} = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

/**
 * Blog post detail — TASK-13. Same data layer as the template, restyled to
 * the Machine Room design system (no template grays). Unknown slug → 404.
 */
export default async function PostPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = await paramsPromise
  const {data: post} = await sanityFetch({query: postQuery, params})

  if (!post?._id) {
    return notFound()
  }

  const {data: more} = await sanityFetch({
    query: morePostsQuery,
    params: {skip: post._id, limit: 3},
  })

  const date = formatDate(post.date)
  const authorName =
    post.author && post.author.firstName && post.author.lastName
      ? `${post.author.firstName} ${post.author.lastName}`
      : null

  const morePosts: PostListItem[] = (more ?? [])
    .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
    .slice(0, 2)
    .map((p) => ({
      _id: p._id,
      title: p.title || 'Untitled',
      slug: p.slug as string,
      excerpt: p.excerpt ?? null,
      date: p.date ?? null,
    }))

  return (
    <div className="min-h-screen bg-paper font-['DM_Sans',sans-serif] text-ink">
      <main className="mx-auto w-full max-w-[720px] px-5 pb-48">
        <Reveal className="pt-11" delay={0}>
          <Link
            href="/posts"
            className={`${MONO} text-[12px] uppercase tracking-[0.12em] text-muted transition-colors duration-150 hover:text-ink`}
          >
            <span aria-hidden="true">←</span> Blog
          </Link>
          {date && (
            <p className={`${MONO} mt-6 text-[11px] uppercase tracking-[0.12em] text-muted`}>
              <time dateTime={post.date ?? undefined}>{date}</time>
              {authorName && <span> · {authorName}</span>}
            </p>
          )}
          <h1 className="mt-3 font-['Space_Grotesk',sans-serif] text-[36px] font-bold leading-[1.08] tracking-[-0.02em] text-ink max-md:text-[28px]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 max-w-[65ch] text-[17px] leading-[1.6] text-muted">{post.excerpt}</p>
          )}
        </Reveal>

        {post?.coverImage && (
          <Reveal className="mt-8" delay={60}>
            <Image
              id={post.coverImage.asset?._ref || ''}
              alt={post.coverImage.alt || ''}
              className="w-full rounded-[12px] border border-hairline"
              width={1024}
              height={538}
              mode="cover"
              hotspot={post.coverImage.hotspot}
              crop={post.coverImage.crop}
            />
          </Reveal>
        )}

        {post.content?.length && (
          <Reveal className="mt-8" delay={60}>
            <div className="[&_a]:text-accent prose-headings:font-['Space_Grotesk'] prose-headings:text-ink prose-p:text-ink/85 prose-strong:text-ink prose-li:text-ink/85 max-w-none text-[16px] leading-[1.7]">
              <PortableText value={post.content as PortableTextBlock[]} />
            </div>
          </Reveal>
        )}

        {morePosts.length > 0 && (
          <section aria-label="More posts" className="mt-16">
            <p className={`${MONO} text-[11px] uppercase tracking-[0.12em] text-muted`}>More posts</p>
            <div className="mt-4 grid gap-4">
              {morePosts.map((p, i) => (
                <Reveal key={p._id} delay={Math.min(i, 5) * 60}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

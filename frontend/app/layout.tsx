import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Space_Grotesk, DM_Sans, IBM_Plex_Mono} from 'next/font/google'
import { draftMode } from 'next/headers'
import type { ReactNode } from 'react'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import {SiteHeader} from '@/app/components/SiteHeader'
import {SanityLive} from '@/sanity/lib/live'
import {handleError} from '@/app/client-utils'
import {getPortfolio} from '@/lib/portfolio'

/**
 * Site metadata from Archi's portfolio content (never template demo text).
 * Falls back to a neutral default when Sanity is unreachable (E3).
 */
export async function generateMetadata(): Promise<Metadata> {
  let title = 'Archi — Portfolio'
  let description = 'AI-chat-first portfolio of Archi. Ask about projects, experience, and how to reach him.'
  try {
    const portfolio = await getPortfolio()
    if (portfolio.profile) {
      title = `${portfolio.profile.name} — ${portfolio.profile.tagline}`
      description = portfolio.profile.bio
    }
  } catch {
    // E3: keep the neutral fallback.
  }
  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
  }
}

// Design tokens — specs/05-DESIGN-SYSTEM.md §3.
// Space Grotesk (display) + DM Sans (body) replace the template's Inter;
// IBM Plex Mono (labels/kickers) is kept.
const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({ children }: { children: ReactNode }) {
  const {isEnabled: isDraftMode} = await draftMode()

  // Social links for the persistent site header (E3: header renders without
  // them when Sanity is unreachable — never a blank page).
  let socialLinks: Awaited<ReturnType<typeof getPortfolio>>['socialLinks'] = []
  try {
    socialLinks = (await getPortfolio()).socialLinks
  } catch {
    // keep empty
  }

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${ibmPlexMono.variable} bg-white text-black`}
    >
      <body>
        <section className="min-h-screen">
          {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
          <Toaster />
          {isDraftMode && (
            <>
              <DraftModeToast />
              {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
              <VisualEditing />
            </>
          )}
          {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
          <SanityLive onError={handleError} />
          {/* Persistent header — stays mounted across navigations so the
              segmented-control pill travels (specs/05-DESIGN-SYSTEM.md §7). */}
          <SiteHeader socialLinks={socialLinks} />
          <main className="">{children}</main>
        </section>
        <SpeedInsights />
      </body>
    </html>
  )
}

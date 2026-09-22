import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  Link,
} from '@tanstack/react-router'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { site } from '@/data/site'

import '../styles.css'

const title = `${site.name} — ${site.tagline}`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title },
      { name: 'description', content: site.description },
      { name: 'theme-color', content: '#100e0b' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: site.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:image', content: '/img/hero.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..600&family=Archivo:wght@400;500;600&display=swap',
      },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function NotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col justify-center px-6 py-40 sm:px-10">
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-6 text-[clamp(2.5rem,8vw,6rem)]">
          This page was never <span className="accent-em">built.</span>
        </h1>
        <p className="mt-6 max-w-lg text-ivory-dim">
          The link is wrong, or the work moved. Start from the beginning, or
          tell us what you were looking for.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/"
            className="bg-brass px-7 py-4 text-[0.78rem] tracking-[0.18em] text-ink uppercase transition-colors hover:bg-ivory"
          >
            Back home →
          </Link>
          <Link
            to="/contact"
            className="border border-line px-7 py-4 text-[0.78rem] tracking-[0.18em] uppercase transition-colors hover:border-brass hover:text-brass"
          >
            Contact us →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

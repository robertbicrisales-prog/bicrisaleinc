import type { ReactNode } from 'react'

/** Netlify Image CDN URL so pages never ship full-resolution source art. */
export function img(src: string, w: number, h?: number) {
  const params = new URLSearchParams({ url: src, w: String(w) })
  if (h) {
    params.set('h', String(h))
    params.set('fit', 'cover')
  }
  params.set('fm', 'webp')
  params.set('q', '72')
  return `/.netlify/images?${params.toString()}`
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`px-6 py-24 sm:px-10 md:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  )
}

export function Rule() {
  return <div className="h-px w-full bg-line" />
}

/** Oversized editorial page header used at the top of every subpage. */
export function PageHero({
  eyebrow,
  title,
  lede,
  index,
}: {
  eyebrow: string
  title: ReactNode
  lede: string
  index: string
}) {
  return (
    <header className="relative overflow-hidden border-b border-line px-6 pt-36 pb-16 sm:px-10 md:pt-44 md:pb-24">
      <div
        aria-hidden
        className="field-grain pointer-events-none absolute inset-0 opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-brass/8 blur-3xl"
      />
      <div className="relative mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="flex items-baseline gap-5">
            <span className="display text-brass-deep text-sm tracking-normal">
              {index}
            </span>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h1 className="display mt-7 text-[clamp(2.75rem,8vw,6.5rem)]">{title}</h1>
        </div>
        <div className="flex items-end md:col-span-4">
          <p className="text-ivory-dim max-w-sm text-lg leading-relaxed">{lede}</p>
        </div>
      </div>
    </header>
  )
}

export function Cta({
  to,
  children,
  variant = 'solid',
  href,
}: {
  to?: string
  href?: string
  children: ReactNode
  variant?: 'solid' | 'ghost'
}) {
  const base =
    'group inline-flex items-center gap-3 px-7 py-4 text-[0.8rem] font-medium tracking-[0.18em] uppercase transition-colors duration-300'
  const styles =
    variant === 'solid'
      ? 'bg-brass text-ink hover:bg-ivory'
      : 'border border-line text-ivory hover:border-brass hover:text-brass'
  const inner = (
    <>
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </>
  )
  if (href) {
    return (
      <a href={href} className={`${base} ${styles}`}>
        {inner}
      </a>
    )
  }
  // Rendered by callers that already hold a router Link; see CtaLink below.
  return (
    <span className={`${base} ${styles}`} data-to={to}>
      {inner}
    </span>
  )
}

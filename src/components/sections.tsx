import { Link } from '@tanstack/react-router'
import { Counter } from '@/components/Counter'
import { CtaAnchor, CtaLink } from '@/components/CtaLink'
import { Marquee } from '@/components/Marquee'
import { PayPalButton } from '@/components/PayPalButton'
import { Eyebrow, Section, img } from '@/components/ui'
import {
  clientMarquee,
  packages,
  site,
  stats,
  testimonials,
  type Package,
} from '@/data/site'

export function StatsBar() {
  return (
    <div className="border-y border-line bg-ink-2">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 sm:px-10 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-6 py-10 sm:px-0 sm:py-12 ${
              i % 2 === 1 ? 'border-l border-line' : ''
            } ${i > 1 ? 'border-t border-line lg:border-t-0' : ''} ${
              i === 2 ? 'lg:border-l' : ''
            } ${i === 3 ? 'lg:border-l' : ''} sm:pl-8`}
          >
            <p className="display text-[clamp(2.25rem,5vw,3.75rem)] text-ivory">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="eyebrow mt-3">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ClientStrip() {
  return (
    <div className="border-b border-line py-8">
      <p className="eyebrow mb-6 px-6 text-center sm:px-10">
        Trusted by leading brands
      </p>
      <Marquee items={clientMarquee} />
    </div>
  )
}

export function Testimonials({ limit = 3 }: { limit?: number }) {
  return (
    <Section className="border-t border-line">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Client Stories</Eyebrow>
          <h2 className="display mt-5 text-[clamp(2.25rem,5.5vw,4.5rem)]">
            What our <span className="accent-em">clients say</span>
          </h2>
        </div>
        <CtaLink to="/portfolio" variant="ghost">
          See the work
        </CtaLink>
      </div>

      <div className="mt-16 grid gap-px bg-line md:grid-cols-3">
        {testimonials.slice(0, limit).map((t) => (
          <figure
            key={t.name}
            className="group flex flex-col justify-between bg-ink p-9 transition-colors duration-500 hover:bg-ink-2"
          >
            <span
              aria-hidden
              className="display block text-6xl leading-none text-brass-deep/60 transition-colors duration-500 group-hover:text-brass"
            >
              “
            </span>
            <blockquote className="mt-5 text-lg leading-relaxed text-ivory">
              {t.quote}
            </blockquote>
            <figcaption className="mt-9 flex items-center gap-4 border-t border-line pt-6">
              <span className="display flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brass-deep text-brass">
                {t.initial}
              </span>
              <span>
                <span className="block text-sm text-ivory">{t.name}</span>
                <span className="block text-xs text-ivory-faint">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}

export function PackageCard({ pkg }: { pkg: Package }) {
  const recurring = pkg.cadence === 'per month'
  return (
    <article
      id={pkg.slug}
      className={`relative flex flex-col p-8 transition-colors duration-500 sm:p-10 ${
        pkg.featured
          ? 'bg-ink-3 ring-1 ring-brass-deep'
          : 'bg-ink-2 hover:bg-ink-3'
      }`}
    >
      {pkg.featured && (
        <span className="absolute -top-3 left-8 bg-brass px-3 py-1 text-[0.62rem] font-semibold tracking-[0.2em] text-ink uppercase sm:left-10">
          Most requested
        </span>
      )}

      <h3 className="display text-4xl">{pkg.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ivory-dim">
        {pkg.positioning}
      </p>

      <div className="mt-8 flex items-baseline gap-2 border-y border-line py-6">
        <span className="display text-5xl text-brass">
          ${pkg.price.toLocaleString()}
        </span>
        <span className="text-xs tracking-[0.16em] text-ivory-faint uppercase">
          {pkg.cadence}
        </span>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-xs">
        <div>
          <dt className="eyebrow">Timeline</dt>
          <dd className="mt-2 text-ivory-dim">{pkg.timeline}</dd>
        </div>
        <div>
          <dt className="eyebrow">Reserve with</dt>
          <dd className="mt-2 text-ivory-dim">
            ${pkg.deposit.toLocaleString()} {recurring ? 'first month' : 'deposit'}
          </dd>
        </div>
      </dl>

      <ul className="mt-8 flex-1 space-y-3">
        {pkg.includes.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-ivory-dim">
            <span aria-hidden className="mt-0.5 shrink-0 text-brass">
              ✦
            </span>
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-ivory-faint">
        <span className="eyebrow">Best for</span>
        <span className="mt-2 block text-ivory-dim">{pkg.bestFor}</span>
      </p>

      <div className="mt-8 space-y-3">
        <PayPalButton
          itemName={`${site.name} — ${pkg.name} (${recurring ? 'first month' : 'project deposit'})`}
          sku={pkg.slug}
          amount={pkg.deposit}
          recurring={recurring}
          label={recurring ? 'Start with PayPal' : 'Reserve with PayPal'}
        />
        <Link
          to="/contact"
          search={{ package: pkg.slug } as never}
          className="block w-full border border-line py-3.5 text-center text-[0.72rem] tracking-[0.16em] text-ivory-dim uppercase transition-colors duration-300 hover:border-brass hover:text-brass"
        >
          Ask about this package
        </Link>
      </div>
    </article>
  )
}

export function PackagesGrid({ limit }: { limit?: number }) {
  const list = limit ? packages.slice(0, limit) : packages
  return (
    <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
      {list.map((pkg) => (
        <PackageCard key={pkg.slug} pkg={pkg} />
      ))}
    </div>
  )
}

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <img
        src={img('/img/hero.png', 1600, 700)}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/60"
      />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-10 md:py-40">
        <div className="max-w-3xl">
          <Eyebrow>Six active builds at a time</Eyebrow>
          <h2 className="display mt-6 text-[clamp(2.5rem,7vw,5.5rem)]">
            Your competition is already{' '}
            <span className="accent-em">building.</span> Are you?
          </h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ivory-dim">
            Fifteen minutes, no deck, no pressure. An honest read on where the
            brand is, where it could be, and what it takes to close that gap.
          </p>
          <div className="mt-11 flex flex-wrap gap-4">
            <CtaLink to="/contact">Book your strategy call</CtaLink>
            <CtaAnchor href={site.instagram}>Follow on Instagram</CtaAnchor>
          </div>
        </div>
      </div>
    </section>
  )
}

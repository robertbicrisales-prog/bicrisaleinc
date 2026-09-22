import { Link, createFileRoute } from '@tanstack/react-router'
import { CtaLink } from '@/components/CtaLink'
import {
  ClientStrip,
  ClosingCta,
  StatsBar,
  Testimonials,
} from '@/components/sections'
import { Eyebrow, Section, img } from '@/components/ui'
import { difference, services, site } from '@/data/site'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      { title: `${site.name} — ${site.tagline}` },
      {
        name: 'description',
        content:
          'Bicrisale is a Chicago creative growth agency building full brand ecosystems: strategy, identity, content, websites and the campaigns that launch them.',
      },
    ],
  }),
})

function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ClientStrip />
      <ServicesPreview />
      <Difference />
      <Testimonials />
      <ClosingCta />
    </>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden border-b border-line">
      <img
        src={img('/img/hero.png', 1800, 1100)}
        alt="A dimly lit fine dining room with a marble bar and brass fixtures"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/35"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70"
      />

      <div className="relative mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col justify-end px-6 pt-36 pb-16 sm:px-10 md:pb-24">
        <div className="max-w-4xl">
          <div className="rise flex items-center gap-4" style={{ animationDelay: '80ms' }}>
            <span className="h-px w-10 bg-brass" />
            <Eyebrow>
              {site.city} — Est. {site.founded}
            </Eyebrow>
          </div>

          <h1 className="display mt-8 text-[clamp(3rem,10vw,8.5rem)]">
            <span className="rise block" style={{ animationDelay: '160ms' }}>
              Every brand has
            </span>
            <span
              className="rise accent-em block"
              style={{ animationDelay: '280ms' }}
            >
              potential.
            </span>
            <span className="rise block" style={{ animationDelay: '400ms' }}>
              We build what
            </span>
            <span className="rise block" style={{ animationDelay: '520ms' }}>
              comes next.
            </span>
          </h1>

          <p
            className="rise mt-10 max-w-xl text-lg leading-relaxed text-ivory-dim"
            style={{ animationDelay: '660ms' }}
          >
            We create whole brand ecosystems — strategy, content, websites,
            campaigns and the digital systems that hold them together. Built to
            scale, not just to launch.
          </p>

          <div
            className="rise mt-12 flex flex-wrap items-center gap-4"
            style={{ animationDelay: '780ms' }}
          >
            <CtaLink to="/contact">Book a strategy call</CtaLink>
            <CtaLink to="/portfolio" variant="ghost">
              See the work
            </CtaLink>
          </div>
        </div>

        <div className="mt-20 hidden items-center gap-3 md:flex">
          <span className="h-10 w-px bg-line" />
          <span className="text-[0.66rem] tracking-[0.3em] text-ivory-faint uppercase">
            Scroll
          </span>
        </div>
      </div>
    </section>
  )
}

function ServicesPreview() {
  return (
    <Section>
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Eyebrow>What we build</Eyebrow>
          <h2 className="display mt-6 text-[clamp(2.25rem,6vw,5rem)]">
            Full-spectrum{' '}
            <span className="accent-em">brand ecosystems</span>
          </h2>
        </div>
        <div className="flex flex-col justify-end gap-7 md:col-span-6 md:col-start-7">
          <p className="text-lg leading-relaxed text-ivory-dim">
            We do not only run your social. We build the whole thing — from the
            logo to the loyalty platform to the launch campaign. Every
            touchpoint, handled by one team.
          </p>
          <CtaLink to="/services" variant="ghost">
            All eight services
          </CtaLink>
        </div>
      </div>

      <div className="mt-20 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <Link
            key={service.slug}
            to="/services"
            hash={service.slug}
            className="group relative flex min-h-64 flex-col justify-between bg-ink p-8 transition-colors duration-500 hover:bg-ink-3"
          >
            <span className="display text-sm text-brass-deep transition-colors duration-500 group-hover:text-brass">
              {service.num}
            </span>
            <div>
              <h3 className="display text-3xl">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory-dim">
                {service.pitch}
              </p>
              <span className="mt-6 inline-block text-[0.7rem] tracking-[0.18em] text-brass uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  )
}

function Difference() {
  return (
    <Section className="border-t border-line bg-ink-2">
      <div className="max-w-3xl">
        <Eyebrow>The difference</Eyebrow>
        <h2 className="display mt-6 text-[clamp(2.25rem,6vw,5rem)]">
          Most agencies execute tasks.{' '}
          <span className="accent-em">We build businesses.</span>
        </h2>
      </div>

      <div className="mt-16 border-t border-line">
        {difference.map((row) => (
          <div
            key={row.us}
            className="group grid items-center gap-2 border-b border-line py-7 md:grid-cols-12 md:gap-8"
          >
            <p className="text-sm text-ivory-faint line-through decoration-clay/70 md:col-span-3">
              {row.them}
            </p>
            <p className="display text-2xl text-ivory transition-colors duration-500 group-hover:text-brass md:col-span-4">
              {row.us}
            </p>
            <p className="text-sm text-ivory-dim md:col-span-5">{row.note}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

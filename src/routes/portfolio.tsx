import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CtaLink } from '@/components/CtaLink'
import { ClosingCta, PackagesGrid, Testimonials } from '@/components/sections'
import { Eyebrow, PageHero, Section, img } from '@/components/ui'
import { caseStudies, site } from '@/data/site'

export const Route = createFileRoute('/portfolio')({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: `Portfolio — ${site.name}` },
      {
        name: 'description',
        content:
          'Six Bicrisale brand builds with the numbers behind them — restaurants, med spas, membership clubs and luxury retail — plus packages you can reserve.',
      },
    ],
  }),
})

const filters = ['All', 'Hospitality', 'Wellness', 'Membership', 'Retail']

/** Maps a case study to the filter chips above the grid. */
function matches(filter: string, category: string) {
  if (filter === 'All') return true
  const c = category.toLowerCase()
  if (filter === 'Hospitality')
    return c.includes('dining') || c.includes('casual')
  if (filter === 'Wellness') return c.includes('spa') || c.includes('dental')
  if (filter === 'Membership') return c.includes('membership')
  if (filter === 'Retail') return c.includes('retail')
  return true
}

function Portfolio() {
  const [filter, setFilter] = useState('All')
  const shown = caseStudies.filter((cs) => matches(filter, cs.category))

  return (
    <>
      <PageHero
        index="02 / 10"
        eyebrow="Selected work"
        title={
          <>
            The work, and
            <br />
            <span className="accent-em">what it earned.</span>
          </>
        }
        lede="Every build below shipped with a number attached. These are the ones the owners let us publish."
      />

      <Section>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`px-4 py-2.5 text-[0.7rem] tracking-[0.16em] uppercase transition-colors duration-300 ${
                filter === f
                  ? 'bg-brass text-ink'
                  : 'border border-line text-ivory-dim hover:border-brass hover:text-brass'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-14 space-y-px bg-line">
          {shown.map((cs, i) => (
            <article
              key={cs.slug}
              className={`group grid gap-8 bg-ink p-8 transition-colors duration-500 hover:bg-ink-2 md:grid-cols-12 md:gap-10 md:p-10 ${
                i % 2 === 1 ? 'md:[&>figure]:order-2' : ''
              }`}
            >
              <figure className="md:col-span-5">
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={img(cs.image, 800, 600)}
                    alt={`${cs.client} — ${cs.category}`}
                    loading={i > 1 ? 'lazy' : undefined}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-4 left-4 bg-ink/85 px-3 py-1.5 text-[0.62rem] tracking-[0.2em] text-ivory uppercase backdrop-blur-sm">
                    {cs.year}
                  </span>
                </div>
              </figure>

              <div className="flex flex-col justify-between md:col-span-7">
                <div>
                  <Eyebrow>{cs.category}</Eyebrow>
                  <h2 className="display mt-4 text-[clamp(1.85rem,3.4vw,2.75rem)]">
                    {cs.client}
                  </h2>
                  <p className="mt-3 text-lg text-brass italic">
                    {cs.headline}
                  </p>
                  <p className="mt-4 leading-relaxed text-ivory-dim">
                    {cs.summary}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {cs.scope.map((s) => (
                      <li
                        key={s}
                        className="border border-line px-3 py-1.5 text-[0.66rem] tracking-[0.12em] text-ivory-faint uppercase"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <dl className="mt-9 grid grid-cols-3 gap-6 border-t border-line pt-7">
                  {cs.results.map((r) => (
                    <div key={r.label}>
                      <dt className="display text-[clamp(1.5rem,2.6vw,2.25rem)] text-brass">
                        {r.value}
                      </dt>
                      <dd className="mt-1.5 text-[0.7rem] leading-snug text-ivory-faint">
                        {r.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>

        {shown.length === 0 && (
          <div className="mt-14 border border-line px-8 py-20 text-center">
            <p className="display text-3xl text-ivory">
              Nothing published in that category <span className="accent-em">yet.</span>
            </p>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-ivory-dim">
              We have worked in it — the owners just have not cleared the case
              study. Ask us and we will walk you through it on a call.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => setFilter('All')}
                className="border border-line px-7 py-4 text-[0.72rem] tracking-[0.16em] text-ivory-dim uppercase transition-colors hover:border-brass hover:text-brass"
              >
                Show all work
              </button>
              <CtaLink to="/contact">Ask about your category</CtaLink>
            </div>
          </div>
        )}
      </Section>

      {/* Packages live here as well as on /packages — most visitors decide right after the work. */}
      <Section id="packages" className="border-t border-line bg-ink-2">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Eyebrow>Engagements</Eyebrow>
            <h2 className="display mt-5 text-[clamp(2.25rem,5.5vw,4.25rem)]">
              Pick the build.{' '}
              <span className="accent-em">Reserve the date.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-6 md:col-span-5 md:col-start-8">
            <p className="leading-relaxed text-ivory-dim">
              Four ways to work with us. Each card shows the full engagement
              value and the deposit that holds your start date — paid through
              PayPal and credited in full against your first invoice.
            </p>
            <Link
              to="/packages"
              className="inline-block self-start border-b border-brass pb-1 text-sm text-brass transition-colors hover:border-ivory hover:text-ivory"
            >
              Full pricing detail & FAQ →
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <PackagesGrid />
        </div>
      </Section>

      <Testimonials limit={3} />
      <ClosingCta />
    </>
  )
}

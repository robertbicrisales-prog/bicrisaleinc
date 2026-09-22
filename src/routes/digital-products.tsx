import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CtaLink } from '@/components/CtaLink'
import { ClosingCta } from '@/components/sections'
import { Eyebrow, PageHero, Section, img } from '@/components/ui'
import { digitalProducts, site } from '@/data/site'

export const Route = createFileRoute('/digital-products')({
  component: DigitalProducts,
  head: () => ({
    meta: [
      { title: `Websites & Apps — ${site.name}` },
      {
        name: 'description',
        content:
          'Custom websites, e-commerce, membership portals, reservation systems, mobile apps and CRM integrations — built to convert and measured on it.',
      },
    ],
  }),
})

const screens = [
  {
    label: 'Reservations',
    lines: ['Tonight — 7:30pm', '4 guests · Main room', 'Confirm booking'],
  },
  {
    label: 'Membership',
    lines: ['Founding tier', 'Guest list · 2 remaining', 'View perks'],
  },
  {
    label: 'Ordering',
    lines: ['Cavatelli · 2', 'Pickup in 18 min', 'Pay & collect'],
  },
]

function DigitalProducts() {
  const [screen, setScreen] = useState(0)

  return (
    <>
      <PageHero
        index="07 / 10"
        eyebrow="Digital Products"
        title={
          <>
            Websites & <span className="accent-em">apps</span>
            <br />
            that convert.
          </>
        }
        lede="Your site is the hardest-working salesperson you employ. We build it to look exceptional and then hold it to the numbers."
      />

      <Section>
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-[clamp(1.25rem,2.2vw,1.65rem)] leading-relaxed text-ivory">
              Beautiful and slow is a failed website. Fast and forgettable is
              too. We build both halves: edge-deployed, accessible, sub-second
              pages carrying design that actually looks like your brand.
            </p>
            <p className="mt-6 leading-relaxed text-ivory-dim">
              Reservations, ordering, memberships and CRM are designed into the
              build from the first wireframe rather than bolted on after launch.
              We instrument the booking flow on day one, then spend the
              following months removing the friction the data exposes.
            </p>

            <div className="mt-12 grid gap-px bg-line sm:grid-cols-2">
              {digitalProducts.map((product) => (
                <div
                  key={product.title}
                  className="group bg-ink p-7 transition-colors duration-500 hover:bg-ink-3"
                >
                  <span
                    aria-hidden
                    className="text-xl text-brass-deep transition-colors duration-500 group-hover:text-brass"
                  >
                    {product.glyph}
                  </span>
                  <h3 className="display mt-4 text-2xl">{product.title}</h3>
                  <p className="mt-2 text-sm text-ivory-dim">{product.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive phone mockup — tap through the product patterns we ship. */}
          <div className="md:col-span-4 md:col-start-9">
            <div className="sticky top-28">
              <Eyebrow>Live patterns</Eyebrow>
              <div className="mt-6 mx-auto w-full max-w-64 rounded-[2.25rem] border border-line bg-ink-2 p-3 shadow-2xl shadow-black/60">
                <div className="relative aspect-9/19 overflow-hidden rounded-[1.75rem] bg-ink-3">
                  <img
                    src={img('/img/digital.png', 520, 1100)}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover opacity-35"
                  />
                  <div className="relative flex h-full flex-col justify-between p-5">
                    <div>
                      <span className="display text-xs text-brass">
                        {site.name}
                      </span>
                      <p className="eyebrow mt-6">
                        {screens[screen].label}
                      </p>
                    </div>
                    <ul key={screen} className="rise space-y-3">
                      {screens[screen].lines.map((line, i) => (
                        <li
                          key={line}
                          className={`px-3.5 py-3 text-xs ${
                            i === screens[screen].lines.length - 1
                              ? 'bg-brass text-center font-semibold text-ink'
                              : 'border border-line/80 bg-ink/70 text-ivory-dim'
                          }`}
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-2">
                {screens.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setScreen(i)}
                    aria-label={`Show ${s.label} screen`}
                    aria-pressed={i === screen}
                    className={`h-1.5 w-8 transition-colors duration-300 ${
                      i === screen ? 'bg-brass' : 'bg-line hover:bg-brass-deep'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 text-center text-[0.66rem] tracking-[0.2em] text-ivory-faint uppercase">
                Tap to explore
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line bg-ink-2">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow>How we build</Eyebrow>
            <h2 className="display mt-5 text-[clamp(2rem,4vw,3.25rem)]">
              Built on <span className="accent-em">fast</span> foundations.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <dl className="grid gap-px bg-line sm:grid-cols-2">
              {[
                ['Edge delivery', 'Served from the node nearest the visitor, globally.'],
                ['Accessibility first', 'Keyboard paths and contrast checked, not retrofitted.'],
                ['Instrumented flows', 'Every booking step measured from the first deploy.'],
                ['You own it', 'Source, artwork and licences transfer on final payment.'],
              ].map(([term, def]) => (
                <div key={term} className="bg-ink-2 p-7">
                  <dt className="display text-xl text-ivory">{term}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ivory-dim">
                    {def}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <CtaLink to="/contact">Scope a build</CtaLink>
            </div>
          </div>
        </div>
      </Section>

      <ClosingCta />
    </>
  )
}

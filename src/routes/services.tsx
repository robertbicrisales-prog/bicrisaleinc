import { createFileRoute } from '@tanstack/react-router'
import { CtaLink } from '@/components/CtaLink'
import { ClosingCta } from '@/components/sections'
import { Eyebrow, PageHero, Section } from '@/components/ui'
import { services, site } from '@/data/site'

export const Route = createFileRoute('/services')({
  component: Services,
  head: () => ({
    meta: [
      { title: `Services — ${site.name}` },
      {
        name: 'description',
        content:
          'Branding, marketing, content, websites, apps, paid media, campaigns and memberships — the eight disciplines Bicrisale builds in-house.',
      },
    ],
  }),
})

function Services() {
  return (
    <>
      <PageHero
        index="01 / 10"
        eyebrow="What we build"
        title={
          <>
            Eight disciplines.
            <br />
            <span className="accent-em">One team.</span>
          </>
        }
        lede="Each of these can stand alone. Together they are the reason a brand feels like one idea instead of eight vendors."
      />

      <Section>
        <div className="border-t border-line">
          {services.map((service) => (
            <article
              key={service.slug}
              id={service.slug}
              className="group grid scroll-mt-28 gap-8 border-b border-line py-14 md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-2">
                <span className="display text-5xl text-brass-deep transition-colors duration-500 group-hover:text-brass">
                  {service.num}
                </span>
              </div>

              <div className="md:col-span-5">
                <h2 className="display text-[clamp(2rem,4vw,3.25rem)]">
                  {service.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-ivory">
                  {service.pitch}
                </p>
                <p className="mt-5 leading-relaxed text-ivory-dim">
                  {service.detail}
                </p>
              </div>

              <div className="md:col-span-4 md:col-start-9">
                <Eyebrow>Included</Eyebrow>
                <ul className="mt-5 space-y-2.5">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 border-b border-line/60 pb-2.5 text-sm text-ivory-dim"
                    >
                      <span aria-hidden className="text-brass">
                        ✦
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <CtaLink to="/packages">See packages & pricing</CtaLink>
          <p className="max-w-sm text-sm leading-relaxed text-ivory-faint">
            Most brands start with a package because these are the combinations
            that actually work together.
          </p>
        </div>
      </Section>

      <ClosingCta />
    </>
  )
}

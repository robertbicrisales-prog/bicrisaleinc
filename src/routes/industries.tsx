import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CtaLink } from '@/components/CtaLink'
import { ClosingCta } from '@/components/sections'
import { Eyebrow, PageHero, Section, img } from '@/components/ui'
import { industries, site } from '@/data/site'

export const Route = createFileRoute('/industries')({
  component: Industries,
  head: () => ({
    meta: [
      { title: `Industries — ${site.name}` },
      {
        name: 'description',
        content:
          'Bicrisale builds for hospitality, nightlife, med spas, medical and beauty brands — categories where the brand is the product.',
      },
    ],
  }),
})

function Industries() {
  const [active, setActive] = useState(0)
  const industry = industries[active]

  return (
    <>
      <PageHero
        index="04 / 10"
        eyebrow="Industries"
        title={
          <>
            We speak
            <br />
            <span className="accent-em">your language.</span>
          </>
        }
        lede="We are deliberately narrow. Two categories where the brand is the product, plus the luxury and professional work that grew out of them."
      />

      <Section>
        <div
          role="tablist"
          aria-label="Industries"
          className="flex flex-col gap-px bg-line sm:flex-row"
        >
          {industries.map((ind, i) => (
            <button
              key={ind.slug}
              role="tab"
              type="button"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`flex-1 px-7 py-6 text-left transition-colors duration-400 ${
                i === active
                  ? 'bg-brass text-ink'
                  : 'bg-ink-2 text-ivory-dim hover:bg-ink-3 hover:text-ivory'
              }`}
            >
              <span className="block text-[0.66rem] tracking-[0.24em] uppercase opacity-70">
                0{i + 1}
              </span>
              <span className="display mt-2 block text-2xl">{ind.short}</span>
            </button>
          ))}
        </div>

        <div key={industry.slug} className="rise mt-14 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="relative aspect-4/5 overflow-hidden">
              <img
                src={img(industry.image, 900, 1125)}
                alt={industry.label}
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent"
              />
              <p className="absolute bottom-6 left-6 text-xs tracking-[0.2em] text-ivory uppercase">
                {industry.short}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center md:col-span-6">
            <Eyebrow>Where we thrive</Eyebrow>
            <h2 className="display mt-5 text-[clamp(1.85rem,4vw,3rem)]">
              {industry.lede}
            </h2>
            <p className="mt-6 leading-relaxed text-ivory-dim">
              {industry.body}
            </p>

            <p className="mt-8 border-l border-brass pl-5 text-sm leading-relaxed text-ivory">
              {industry.proof}
            </p>

            <ul className="mt-9 flex flex-wrap gap-2">
              {industry.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-line px-3.5 py-2 text-[0.7rem] tracking-[0.12em] text-ivory-dim uppercase transition-colors hover:border-brass hover:text-brass"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <CtaLink to="/contact">Schedule discovery call</CtaLink>
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line bg-ink-2">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <span className="inline-flex items-center gap-2 border border-brass-deep px-3.5 py-2 text-[0.66rem] tracking-[0.2em] text-brass uppercase">
              <span aria-hidden>◎</span> Pre-launch capable
            </span>
            <h2 className="display mt-7 text-[clamp(2rem,4.5vw,3.5rem)]">
              We can brand it before it <span className="accent-em">exists.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg leading-relaxed text-ivory-dim">
              Build-outs take months. Your audience does not have to wait for
              them. We can launch a complete brand — identity, site, content
              library, waitlist — while the space is still framed timber, so the
              opening lands to a room that already knows the name.
            </p>
            <dl className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                ['11 wks', 'Fastest full ecosystem, concept to launch'],
                ['18.7k', 'Largest pre-open waitlist we have built'],
                ['41 days', 'Longest opening-week reservation book'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="display text-3xl text-brass">{value}</dt>
                  <dd className="mt-2 text-xs leading-relaxed text-ivory-faint">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <ClosingCta />
    </>
  )
}

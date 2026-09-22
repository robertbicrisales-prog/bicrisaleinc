import { createFileRoute } from '@tanstack/react-router'
import { CtaLink } from '@/components/CtaLink'
import { ClosingCta } from '@/components/sections'
import { Eyebrow, PageHero, Section } from '@/components/ui'
import { processSteps, site } from '@/data/site'

export const Route = createFileRoute('/process')({
  component: Process,
  head: () => ({
    meta: [
      { title: `Our Process — ${site.name}` },
      {
        name: 'description',
        content:
          'Discovery, strategy, creation, launch, growth. The five-step system Bicrisale runs on every brand build — no guesswork, no shortcuts.',
      },
    ],
  }),
})

function Process() {
  return (
    <>
      <PageHero
        index="05 / 10"
        eyebrow="How we work"
        title={
          <>
            Our <span className="accent-em">five-step</span>
            <br />
            system.
          </>
        }
        lede="The same framework runs on every brand we build, whether it is a single room or a four-location group. No guesswork. No shortcuts."
      />

      <Section>
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-8">
            {processSteps.map((step, i) => (
              <article
                key={step.num}
                className="group relative grid gap-6 border-b border-line py-12 first:pt-0 last:border-0 sm:grid-cols-12"
              >
                <div className="sm:col-span-2">
                  <span className="display text-5xl text-brass-deep transition-colors duration-500 group-hover:text-brass">
                    {step.num}
                  </span>
                </div>
                <div className="sm:col-span-10">
                  <h2 className="display text-4xl">{step.title}</h2>
                  <p className="mt-3 text-lg text-ivory">{step.summary}</p>
                  <p className="mt-4 leading-relaxed text-ivory-dim">
                    {step.body}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {step.deliverables.map((d) => (
                      <li
                        key={d}
                        className="border border-line px-3.5 py-2 text-[0.7rem] tracking-[0.12em] text-ivory-dim uppercase"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                  {i < processSteps.length - 1 && (
                    <span
                      aria-hidden
                      className="mt-8 block h-6 w-px bg-brass-deep/50"
                    />
                  )}
                </div>
              </article>
            ))}
          </div>

          <aside className="md:col-span-4">
            <div className="sticky top-28 border border-line bg-ink-2 p-8">
              <Eyebrow>What you get weekly</Eyebrow>
              <ul className="mt-6 space-y-5 text-sm leading-relaxed text-ivory-dim">
                <li>
                  <span className="block text-ivory">A named lead</span>
                  One of the founders owns your build start to finish.
                </li>
                <li>
                  <span className="block text-ivory">Friday progress note</span>
                  What shipped, what is next, what we need from you.
                </li>
                <li>
                  <span className="block text-ivory">A live workspace</span>
                  Every file, shot list and draft visible to your team.
                </li>
                <li>
                  <span className="block text-ivory">No surprise invoices</span>
                  Milestone billing agreed before the first meeting ends.
                </li>
              </ul>
              <div className="mt-8">
                <CtaLink to="/contact">Start your brand build</CtaLink>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <ClosingCta />
    </>
  )
}

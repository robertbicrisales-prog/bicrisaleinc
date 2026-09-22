import { createFileRoute } from '@tanstack/react-router'
import { CtaLink } from '@/components/CtaLink'
import { ClosingCta, StatsBar, Testimonials } from '@/components/sections'
import { Eyebrow, PageHero, Section, img } from '@/components/ui'
import { site, team } from '@/data/site'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [
      { title: `About — ${site.name}` },
      {
        name: 'description',
        content:
          'Bicrisale is a four-person creative growth agency in Chicago. Six active builds at a time, founders on every project.',
      },
    ],
  }),
})

function About() {
  return (
    <>
      <PageHero
        index="08 / 10"
        eyebrow={`${site.city} — Est. ${site.founded}`}
        title={
          <>
            Real people.
            <br />
            <span className="accent-em">Real results.</span>
          </>
        }
        lede="Four people, deliberately. Small enough that a founder is on your project, experienced enough that you only need one agency."
      />

      <Section>
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="relative aspect-3/2 overflow-hidden">
              <img
                src={img('/img/studio.png', 1200, 800)}
                alt="The Bicrisale studio at dusk, brand boards laid across a walnut table"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-6 text-xs tracking-[0.18em] text-ivory-faint uppercase">
              {site.name} × {site.city}
            </p>
          </div>

          <div className="flex flex-col justify-center md:col-span-5">
            <Eyebrow>Why we exist</Eyebrow>
            <h2 className="display mt-5 text-[clamp(1.85rem,3.6vw,2.75rem)]">
              We got tired of watching good concepts lose to better branding.
            </h2>
            <p className="mt-6 leading-relaxed text-ivory-dim">
              {site.name} started in {site.founded} with one restaurant client
              and a borrowed camera. The pattern was obvious within a year: the
              rooms that filled were rarely the ones with the best food. They
              were the ones that looked like they were worth the trip.
            </p>
            <p className="mt-4 leading-relaxed text-ivory-dim">
              So we built an agency that can produce the whole picture —
              strategy, identity, photography, site, campaign — without handing
              your brand between four vendors who never speak.
            </p>
          </div>
        </div>
      </Section>

      <StatsBar />

      <Section>
        <div className="max-w-2xl">
          <Eyebrow>The team</Eyebrow>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,3.75rem)]">
            Who you'll <span className="accent-em">actually work with.</span>
          </h2>
          <p className="mt-6 leading-relaxed text-ivory-dim">
            No account managers relaying messages. You work with the people
            doing the work — which is also why we cap at six active builds.
          </p>
        </div>

        <div className="mt-16 grid gap-px bg-line sm:grid-cols-2">
          {team.map((person, i) => (
            <article
              key={person.name}
              className="group bg-ink p-8 transition-colors duration-500 hover:bg-ink-2 sm:p-10"
            >
              <span className="display text-sm text-brass-deep transition-colors duration-500 group-hover:text-brass">
                0{i + 1}
              </span>
              <h3 className="display mt-5 text-3xl">{person.name}</h3>
              <p className="mt-2 text-xs tracking-[0.16em] text-brass uppercase">
                {person.role}
              </p>
              <p className="mt-5 leading-relaxed text-ivory-dim">
                {person.bio}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line bg-ink-2">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow>How we operate</Eyebrow>
            <h2 className="display mt-5 text-[clamp(2rem,4vw,3.25rem)]">
              Four rules we <span className="accent-em">don't break.</span>
            </h2>
            <div className="mt-9">
              <CtaLink to="/process" variant="ghost">
                See the process
              </CtaLink>
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ol className="border-t border-line">
              {[
                [
                  'Six builds, no more',
                  'The ceiling that keeps a founder on every project. It means start dates are genuinely limited.',
                ],
                [
                  'The numbers come first',
                  'Targets are agreed in strategy and reported against monthly. Impressions are not a target.',
                ],
                [
                  'Everything in-house',
                  'Strategy, design, production and engineering under one roof. Nothing subcontracted quietly.',
                ],
                [
                  'You own the work',
                  'Source files, artwork and full paid-media licences transfer to you on final payment.',
                ],
              ].map(([title, body], i) => (
                <li
                  key={title}
                  className="grid gap-3 border-b border-line py-7 sm:grid-cols-12 sm:gap-6"
                >
                  <span className="display text-brass-deep sm:col-span-1">
                    0{i + 1}
                  </span>
                  <span className="display text-2xl sm:col-span-4">
                    {title}
                  </span>
                  <span className="text-sm leading-relaxed text-ivory-dim sm:col-span-7">
                    {body}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Testimonials limit={3} />
      <ClosingCta />
    </>
  )
}

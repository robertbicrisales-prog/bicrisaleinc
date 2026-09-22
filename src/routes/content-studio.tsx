import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CtaLink } from '@/components/CtaLink'
import { Marquee } from '@/components/Marquee'
import { ClosingCta } from '@/components/sections'
import { Eyebrow, PageHero, Section, img } from '@/components/ui'
import { site, studioCapabilities, studioGallery } from '@/data/site'

export const Route = createFileRoute('/content-studio')({
  component: ContentStudio,
  head: () => ({
    meta: [
      { title: `Content Studio — ${site.name}` },
      {
        name: 'description',
        content:
          'An in-house photo and video studio: editorial stills, short-form, commercial production and drone — a quarter of content in one production day.',
      },
    ],
  }),
})

function ContentStudio() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLightbox(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <PageHero
        index="06 / 10"
        eyebrow="Content Studio"
        title={
          <>
            We don't just <span className="accent-em">strategise.</span>
            <br />
            We create.
          </>
        }
        lede="Every asset you see across our work was produced in-house, by the same people who wrote the strategy behind it."
      />

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-[clamp(1.25rem,2.2vw,1.65rem)] leading-relaxed text-ivory">
              Most agencies brief a freelancer, wait three weeks, and hope the
              images match the deck. We shoot it ourselves — which is why a
              single production day can fill a quarter of your calendar.
            </p>
            <p className="mt-6 leading-relaxed text-ivory-dim">
              Editorial stills through cinematic video, styled on site, with the
              shot list built backwards from the campaign it has to feed. You
              leave the day with finished, licensed, paid-media-ready assets —
              not a folder of raws.
            </p>
            <div className="mt-10">
              <CtaLink to="/packages">Book a studio day — $2,400</CtaLink>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <Eyebrow>Capabilities</Eyebrow>
            <ul className="mt-6 grid grid-cols-2 gap-px bg-line">
              {studioCapabilities.map((cap) => (
                <li
                  key={cap}
                  className="bg-ink px-4 py-5 text-sm text-ivory-dim transition-colors duration-400 hover:bg-ink-3 hover:text-brass"
                >
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <div className="border-y border-line py-8">
        <Marquee
          items={[
            'Fine Dining',
            'Med Spa',
            'Brand Shoot',
            'Restaurant',
            'Portrait',
            'Nightlife',
            'Event',
            'Commercial',
            'Reels',
            'Drone',
            'Food',
            'Wellness',
          ]}
          separator="✦"
        />
      </div>

      <Section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Selected frames</Eyebrow>
            <h2 className="display mt-5 text-[clamp(2rem,5vw,3.75rem)]">
              Recent <span className="accent-em">production.</span>
            </h2>
          </div>
          <p className="text-xs tracking-[0.16em] text-ivory-faint uppercase">
            Select an image to enlarge
          </p>
        </div>

        <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {studioGallery.map((shot, i) => (
            <button
              key={shot.src + shot.label}
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative aspect-square overflow-hidden bg-ink"
            >
              <img
                src={img(shot.src, 700, 700)}
                alt={shot.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                <span className="eyebrow text-brass">{shot.label}</span>
                <p className="mt-1.5 text-sm text-ivory">{shot.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={studioGallery[lightbox].caption}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/96 p-6 backdrop-blur-sm"
        >
          <figure className="max-h-full max-w-4xl">
            <img
              src={img(studioGallery[lightbox].src, 1400)}
              alt={studioGallery[lightbox].caption}
              className="max-h-[75vh] w-full object-contain"
            />
            <figcaption className="mt-5 flex items-baseline justify-between gap-6">
              <span className="text-sm text-ivory">
                {studioGallery[lightbox].caption}
              </span>
              <span className="text-[0.66rem] tracking-[0.2em] text-ivory-faint uppercase">
                Press Esc to close
              </span>
            </figcaption>
          </figure>
        </div>
      )}

      <ClosingCta />
    </>
  )
}

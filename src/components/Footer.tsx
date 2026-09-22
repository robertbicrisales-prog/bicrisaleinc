import { Link } from '@tanstack/react-router'
import { site } from '@/data/site'

const columns = [
  {
    title: 'Services',
    links: [
      { label: 'Branding', to: '/services' },
      { label: 'Marketing', to: '/services' },
      { label: 'Content Studio', to: '/content-studio' },
      { label: 'Websites & Apps', to: '/digital-products' },
      { label: 'Paid Advertising', to: '/services' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'Restaurants', to: '/industries' },
      { label: 'Nightlife', to: '/industries' },
      { label: 'Med Spas', to: '/industries' },
      { label: 'Medical Practices', to: '/industries' },
      { label: 'Luxury Services', to: '/industries' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'Portfolio', to: '/portfolio' },
      { label: 'Packages & Pricing', to: '/packages' },
      { label: 'Our Process', to: '/process' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="display text-3xl">{site.name}</p>
            <p className="text-ivory-dim mt-5 max-w-xs text-sm leading-relaxed">
              {site.description}
            </p>
            <div className="mt-7 flex flex-col gap-2 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="text-ivory-dim transition-colors hover:text-brass"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}
                className="text-ivory-dim transition-colors hover:text-brass"
              >
                {site.phone}
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-ivory-dim transition-colors hover:text-brass"
              >
                {site.instagramHandle} ↗
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2 lg:col-span-2">
              <p className="eyebrow">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-ivory-dim text-sm transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2">
            <p className="eyebrow">Start</p>
            <p className="text-ivory-dim mt-5 text-sm leading-relaxed">
              Six active builds at a time. Start dates are limited.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-block border-b border-brass pb-1 text-sm text-brass transition-colors hover:border-ivory hover:text-ivory"
            >
              Book a strategy call →
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-7 text-xs text-ivory-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="tracking-[0.2em] uppercase">{site.reach}</p>
        </div>
      </div>
    </footer>
  )
}

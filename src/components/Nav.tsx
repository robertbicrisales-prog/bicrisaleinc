import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { nav, site } from '@/data/site'

function Wordmark() {
  return (
    <Link to="/" className="group flex items-baseline gap-2" aria-label={site.name}>
      <span className="display text-xl leading-none tracking-tight">
        {site.name}
      </span>
      <span className="h-1 w-1 rounded-full bg-brass transition-transform duration-300 group-hover:scale-150" />
    </Link>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? 'border-b border-line bg-ink/92 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
          <Wordmark />

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative text-[0.78rem] tracking-[0.14em] uppercase transition-colors duration-300 ${
                    active ? 'text-brass' : 'text-ivory-dim hover:text-ivory'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-2 left-0 h-px w-full bg-brass" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden bg-brass px-5 py-3 text-[0.72rem] font-medium tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:bg-ivory sm:inline-block"
            >
              Book a Call
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-line lg:hidden"
            >
              <span
                className={`h-px w-4 bg-ivory transition-transform duration-300 ${
                  open ? 'translate-y-[3.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-4 bg-ivory transition-transform duration-300 ${
                  open ? '-translate-y-[3.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-x-0 top-[73px] z-40 origin-top border-b border-line bg-ink/98 backdrop-blur-xl transition-all duration-400 lg:hidden ${
          open
            ? 'pointer-events-auto scale-y-100 opacity-100'
            : 'pointer-events-none scale-y-95 opacity-0'
        }`}
      >
        <nav className="flex flex-col px-6 py-4 sm:px-10">
          {[...nav, { label: 'Contact', to: '/contact' }].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="display border-b border-line/60 py-4 text-3xl text-ivory last:border-0 hover:text-brass"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

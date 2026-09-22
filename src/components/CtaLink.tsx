import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

const base =
  'group inline-flex items-center gap-3 px-7 py-4 text-[0.8rem] font-medium tracking-[0.18em] uppercase transition-colors duration-300'

const variants = {
  solid: 'bg-brass text-ink hover:bg-ivory',
  ghost: 'border border-line text-ivory hover:border-brass hover:text-brass',
} as const

export function CtaLink({
  to,
  children,
  variant = 'solid',
  search,
}: {
  to: string
  children: ReactNode
  variant?: keyof typeof variants
  search?: Record<string, string>
}) {
  return (
    <Link
      to={to}
      search={search as never}
      className={`${base} ${variants[variant]}`}
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  )
}

export function CtaAnchor({
  href,
  children,
  variant = 'ghost',
}: {
  href: string
  children: ReactNode
  variant?: keyof typeof variants
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className={`${base} ${variants[variant]}`}
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  )
}

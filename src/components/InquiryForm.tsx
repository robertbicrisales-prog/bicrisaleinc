import { useState } from 'react'
import {
  budgetOptions,
  industries,
  packages,
  site,
  timelineOptions,
} from '@/data/site'

const FORM_NAME = 'inquiry'
/** Must be the static skeleton in public/, not "/" — SSR would swallow the POST. */
const FORM_ENDPOINT = '/__forms.html'

type Fields = {
  name: string
  email: string
  company: string
  phone: string
  industry: string
  package: string
  budget: string
  timeline: string
  message: string
}

const empty: Fields = {
  name: '',
  email: '',
  company: '',
  phone: '',
  industry: '',
  package: '',
  budget: '',
  timeline: '',
  message: '',
}

function encode(data: Record<string, string>) {
  return Object.entries(data)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
}

const fieldClass =
  'w-full border-b border-line bg-transparent py-3.5 text-ivory transition-colors duration-300 placeholder:text-ivory-faint focus:border-brass focus:outline-none'

const selectClass = `${fieldClass} appearance-none pr-8`

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string
  children: string
  optional?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="eyebrow flex items-baseline gap-2">
      {children}
      {optional && (
        <span className="text-[0.6rem] tracking-normal normal-case text-ivory-faint/70">
          optional
        </span>
      )}
    </label>
  )
}

export function InquiryForm({ initialPackage }: { initialPackage?: string }) {
  const [fields, setFields] = useState<Fields>({
    ...empty,
    package: packages.some((p) => p.slug === initialPackage)
      ? (initialPackage as string)
      : '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>(
    'idle',
  )

  const update = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': FORM_NAME, ...fields }),
      })
      if (!res.ok) throw new Error(`Submission failed (${res.status})`)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="border border-brass-deep bg-ink-2 p-10 sm:p-14">
        <p className="eyebrow">Inquiry received</p>
        <h3 className="display mt-5 text-4xl">
          Thank you, {fields.name.split(' ')[0] || 'friend'}.
        </h3>
        <p className="mt-5 max-w-md leading-relaxed text-ivory-dim">
          One of the founders reads every inquiry. Expect a reply within one
          business day — usually with two or three questions and a calendar
          link.
        </p>
        <p className="mt-7 text-sm text-ivory-faint">
          Something urgent?{' '}
          <a
            href={`mailto:${site.email}`}
            className="border-b border-brass pb-0.5 text-brass hover:text-ivory"
          >
            {site.email}
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-9" noValidate={false}>
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden">
        <label>
          Do not fill this out <input name="bot-field" tabIndex={-1} />
        </label>
      </p>

      <div className="grid gap-9 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={fields.name}
            onChange={update}
            placeholder="Marco Reyes-Ferrante"
            className={fieldClass}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={fields.email}
            onChange={update}
            placeholder="you@yourbrand.com"
            className={fieldClass}
          />
        </div>
        <div>
          <Label htmlFor="company">Brand or business</Label>
          <input
            id="company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            value={fields.company}
            onChange={update}
            placeholder="Trinità"
            className={fieldClass}
          />
        </div>
        <div>
          <Label htmlFor="phone" optional>
            Phone
          </Label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={update}
            placeholder="(312) 000-0000"
            className={fieldClass}
          />
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <select
            id="industry"
            name="industry"
            required
            value={fields.industry}
            onChange={update}
            className={selectClass}
          >
            <option value="">Select one…</option>
            {industries.map((ind) => (
              <option key={ind.slug} value={ind.label}>
                {ind.label}
              </option>
            ))}
            <option value="Luxury Retail & Product">
              Luxury Retail & Product
            </option>
            <option value="Professional Services">Professional Services</option>
            <option value="Other">Something else</option>
          </select>
        </div>
        <div>
          <Label htmlFor="package" optional>
            Package of interest
          </Label>
          <select
            id="package"
            name="package"
            value={fields.package}
            onChange={update}
            className={selectClass}
          >
            <option value="">Not sure yet</option>
            {packages.map((pkg) => (
              <option key={pkg.slug} value={pkg.slug}>
                {pkg.name} — ${pkg.price.toLocaleString()} {pkg.cadence}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="budget">Budget range</Label>
          <select
            id="budget"
            name="budget"
            required
            value={fields.budget}
            onChange={update}
            className={selectClass}
          >
            <option value="">Select one…</option>
            {budgetOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="timeline">When do you need it live?</Label>
          <select
            id="timeline"
            name="timeline"
            required
            value={fields.timeline}
            onChange={update}
            className={selectClass}
          >
            <option value="">Select one…</option>
            {timelineOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">What are you building?</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={fields.message}
          onChange={update}
          placeholder="Tell us about the concept, where it stands today, and what is in the way."
          className={`${fieldClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <p
          role="alert"
          className="border border-clay/60 bg-clay/10 px-5 py-4 text-sm text-ivory"
        >
          That did not send. Try again, or email us directly at{' '}
          <a href={`mailto:${site.email}`} className="text-brass underline">
            {site.email}
          </a>
          .
        </p>
      )}

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex items-center gap-3 bg-brass px-8 py-4 text-[0.78rem] font-semibold tracking-[0.18em] text-ink uppercase transition-colors duration-300 hover:bg-ivory disabled:cursor-wait disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send inquiry'}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        <p className="max-w-xs text-xs leading-relaxed text-ivory-faint">
          Read by a founder, answered within one business day.
        </p>
      </div>
    </form>
  )
}

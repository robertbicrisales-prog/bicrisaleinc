import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHero, Section } from '@/components/ui'
import { site } from '@/data/site'
export const Route = createFileRoute('/contact')({
  component: Contact,
  head: () => ({ meta: [{ title: 'Contact — Bicrisale' }] }),
})
function Contact() {
  return (
    <>
      <PageHero
        index="10 / 10"
        eyebrow="Contact Bicrisale"
        title={
          <>
            Start the
            <br />
            <span className="accent-em">conversation.</span>
          </>
        }
        lede="Discuss your project, request a quote, or get help with a payment or receipt."
      />
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="display text-3xl">Tell us what you are building.</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-block text-brass underline underline-offset-8"
            >
              {site.email}
            </a>
            <p className="mt-5 text-sm text-ivory-dim">
              For payment support, include your PayPal transaction reference.
              Never send card numbers or security codes.
            </p>
          </div>
          <div className="border border-line bg-ink-2 p-8">
            <h2 className="display text-3xl">Already have a quote?</h2>
            <p className="mt-4 text-sm text-ivory-dim">
              Pay an agreed project amount or invoice through our secure
              checkout.
            </p>
            <Link
              to="/payments"
              search={{ product: 'custom' }}
              className="mt-6 inline-block text-brass underline underline-offset-8"
            >
              Make a payment →
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}

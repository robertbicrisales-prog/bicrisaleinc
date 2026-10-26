import { createFileRoute } from '@tanstack/react-router'
import { PaymentCheckout } from '@/components/PaymentCheckout'
import { PageHero, Section } from '@/components/ui'

export const Route = createFileRoute('/payments')({
  validateSearch: (search: Record<string, unknown>) => ({
    product: typeof search.product === 'string' ? search.product : undefined,
  }),
  head: () => ({
    meta: [
      { title: 'Secure Payments — Bicrisale' },
      {
        name: 'description',
        content:
          'Pay for SEO, PPC, Meta ads, website projects, and custom invoices securely through PayPal.',
      },
    ],
  }),
  component: Payments,
})
function Payments() {
  const { product } = Route.useSearch()
  return (
    <>
      <PageHero
        index="Payments"
        eyebrow="Bicrisale / Secure checkout"
        title={
          <>
            Good work starts
            <br />
            with <span className="accent-em">a clear agreement.</span>
          </>
        }
        lede="Your next campaign, website, or project milestone. Pay securely and receive a receipt by email."
      />
      <Section>
        <PaymentCheckout key={product} initialProduct={product} />
      </Section>
    </>
  )
}

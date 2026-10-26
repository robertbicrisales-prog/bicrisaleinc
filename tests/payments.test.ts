import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  checkoutInput,
  quote,
  apiBase,
  errorResponse,
  PaymentError,
} from '../netlify/lib/paypal.js'
import { verifiedCapture } from '../netlify/lib/settlement.js'
import handler from '../netlify/functions/payments.mts'
import type { Context } from '@netlify/functions'

const settings: Record<string, string> = {}
Object.defineProperty(globalThis, 'Netlify', {
  value: { env: { get: (name: string) => settings[name] } },
  configurable: true,
})
const input = (extra = {}) =>
  checkoutInput.parse({
    requestId: '40f89a5a-0eae-4da3-a697-ccf8e19bf314',
    product: 'seo-20',
    currency: 'USD',
    email: 'receipt@example.test',
    ...extra,
  })

test('catalog amounts are enforced by the server, including existing deposits', () => {
  assert.equal(quote(input({ amount: '1.00' })).amount, 32900)
  assert.equal(quote(input({ product: 'ppc-25' })).amount, 19900)
  assert.equal(quote(input({ product: 'meta-ads' })).amount, 19900)
  assert.equal(quote(input({ product: 'foundation' })).amount, 160000)
})
test('custom payments preserve cents and enforce boundaries', () => {
  assert.equal(
    quote(input({ product: 'website', currency: 'CAD', amount: '2719.43' }))
      .amount,
    271943,
  )
  for (const amount of ['0', '0.99', '100000.01'])
    assert.throws(() => quote(input({ product: 'custom', amount })))
  for (const amount of ['-1', 'NaN', '1.234', '1e3'])
    assert.throws(() => input({ product: 'custom', amount }))
  assert.throws(() => quote(input({ product: 'custom' })))
})
test('fixed products require configured conversion rates, while custom quotes accept supported currencies', () => {
  assert.throws(() => quote(input({ currency: 'CAD' })))
  settings.PAYPAL_USD_CAD_RATE = '1.37'
  assert.equal(quote(input({ currency: 'CAD' })).amount, 45073)
  delete settings.PAYPAL_USD_CAD_RATE
  assert.equal(
    quote(input({ product: 'custom', currency: 'EUR', amount: '482.17' }))
      .amount,
    48217,
  )
  assert.throws(() => input({ currency: 'INR' }))
})
test('subscriptions are limited to the SEO service and email is validated', () => {
  assert.equal(quote(input({ recurring: true })).amount, 32900)
  assert.throws(() => quote(input({ product: 'meta-ads', recurring: true })))
  assert.throws(() => input({ email: 'not-an-email' }))
  assert.throws(() => quote(input({ product: 'unknown' })))
})
const checkout = {
  id: 'checkout-reference',
  providerId: 'provider-order',
  amount: 32900,
  currency: 'USD',
}
const order = () => ({
  id: 'provider-order',
  status: 'COMPLETED',
  purchase_units: [
    {
      reference_id: checkout.id,
      invoice_id: checkout.id,
      payments: {
        captures: [
          {
            id: 'capture-reference',
            status: 'COMPLETED',
            amount: { currency_code: 'USD', value: '329.00' },
          },
        ],
      },
    },
  ],
})
test('confirmation requires the expected order, invoice, currency and full captured amount', () => {
  assert.equal(verifiedCapture(order(), checkout).id, 'capture-reference')
  for (const mismatch of [
    { providerId: 'another-order' },
    { id: 'another-invoice' },
    { amount: 32800 },
    { currency: 'EUR' },
  ])
    assert.throws(() => verifiedCapture(order(), { ...checkout, ...mismatch }))
  const pending = order()
  pending.purchase_units[0].payments.captures[0].status = 'PENDING'
  assert.throws(() => verifiedCapture(pending, checkout))
  const approved = order()
  approved.status = 'APPROVED'
  assert.throws(() => verifiedCapture(approved, checkout))
  const wrongInvoice = order()
  wrongInvoice.purchase_units[0].invoice_id = 'wrong'
  assert.throws(() => verifiedCapture(wrongInvoice, checkout))
})
test('live API is the default and missing configuration fails closed', async () => {
  assert.equal(apiBase(), 'https://api-m.paypal.com')
  const response = await handler(
    new Request('https://bicrisale.com/api/payments'),
    {} as Context,
  )
  assert.equal((await response.json()).ready, false)
  const blocked = await handler(
    new Request('https://bicrisale.com/api/payments', {
      method: 'POST',
      headers: {
        Origin: 'https://bicrisale.com',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'create' }),
    }),
    {} as Context,
  )
  assert.equal(blocked.status, 503)
  const crossOrigin = await handler(
    new Request('https://bicrisale.com/api/payments', {
      method: 'POST',
      headers: { Origin: 'https://another.example' },
    }),
    {} as Context,
  )
  assert.equal(crossOrigin.status, 403)
  assert.equal(errorResponse(new PaymentError('Bad amount')).status, 400)
  assert.equal(
    (
      await errorResponse(new Error('Internal private detail')).json()
    ).error.includes('Internal private detail'),
    false,
  )
})

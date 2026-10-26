import { createHash } from 'node:crypto'
import { z } from 'zod'
import { paymentCurrencies, paymentProducts } from '../../src/data/payments.js'
import { packages } from '../../src/data/site.js'

export class PaymentError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message)
  }
}
export function env(name: string) {
  return Netlify.env.get(name)
}
export function configured() {
  return !!(env('PAYPAL_CLIENT_ID') && env('PAYPAL_CLIENT_SECRET'))
}
export function apiBase() {
  return env('PAYPAL_ENVIRONMENT') === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'
}
export function digest(value: string) {
  return createHash('sha256').update(value).digest('hex')
}
export function exchangeRates() {
  const rate = (name: string) => {
    const n = Number(env(name))
    return Number.isFinite(n) && n > 0 ? n : null
  }
  return {
    USD: 1,
    CAD: rate('PAYPAL_USD_CAD_RATE'),
    EUR: rate('PAYPAL_USD_EUR_RATE'),
  }
}
export const checkoutInput = z.object({
  requestId: z.uuid(),
  product: z.string().max(80),
  email: z.email().max(254),
  currency: z.enum(paymentCurrencies),
  amount: z
    .string()
    .regex(/^\d{1,6}(\.\d{1,2})?$/)
    .optional(),
  note: z.string().trim().max(200).default(''),
  recurring: z.boolean().default(false),
  saveCard: z.boolean().default(false),
  card: z.boolean().default(false),
})
export function quote(input: z.infer<typeof checkoutInput>) {
  const product = paymentProducts.find((p) => p.id === input.product)
  const pkg = packages.find((p) => p.slug === input.product)
  if (!product && !pkg) throw new PaymentError('Select a valid service.')
  if (input.recurring && input.product !== 'seo-20')
    throw new PaymentError('Subscriptions are available for SEO only.')
  const base = product ? product.price : pkg!.deposit
  const rate = exchangeRates()[input.currency]
  if (base !== null && !rate)
    throw new PaymentError(
      'This service is currently priced in USD. Choose USD or use a custom payment for an agreed local-currency quote.',
    )
  const amount =
    base === null
      ? Math.round(Number(input.amount) * 100)
      : Math.round(base * rate! * 100)
  if (!Number.isSafeInteger(amount) || amount < 100 || amount > 10000000)
    throw new PaymentError('Enter an amount between 1.00 and 100,000.00.')
  return {
    amount,
    description:
      product?.name ??
      `${pkg!.name} — ${pkg!.slug === 'growth-retainer' ? 'first month' : 'deposit'}`,
  }
}
export async function paypal(
  path: string,
  body?: unknown,
  requestId?: string,
  method?: string,
) {
  if (!configured())
    throw new PaymentError(
      'Online payments are being configured. Please contact studio@bicrisale.com to arrange payment.',
      503,
    )
  const auth = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${env('PAYPAL_CLIENT_ID')}:${env('PAYPAL_CLIENT_SECRET')}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(15000),
  })
  if (!auth.ok)
    throw new PaymentError(
      'PayPal is unavailable. Please try again later.',
      502,
    )
  const token = await auth.json()
  const response = await fetch(`${apiBase()}${path}`, {
    method: method ?? (body === undefined ? 'GET' : 'POST'),
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
      ...(requestId ? { 'PayPal-Request-Id': requestId } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(20000),
  })
  if (!response.ok)
    throw new PaymentError(
      'PayPal could not complete this request. No success is confirmed; please retry or contact us before paying again.',
      502,
    )
  return response.status === 204 ? {} : response.json()
}
export function errorResponse(error: unknown) {
  if (error instanceof PaymentError)
    return Response.json(
      { error: error.message },
      { status: error.status, headers: { 'Cache-Control': 'no-store' } },
    )
  if (error instanceof z.ZodError || error instanceof SyntaxError)
    return Response.json(
      { error: 'Please check your email, amount, and payment details.' },
      { status: 400 },
    )
  // Do not log provider responses, credentials, or customer details.
  return Response.json(
    {
      error:
        'Payment service is temporarily unavailable. Please try again or contact us.',
    },
    { status: 503 },
  )
}

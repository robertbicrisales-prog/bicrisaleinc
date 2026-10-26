import type { Config, Context } from '@netlify/functions'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { database } from '../../db/index.js'
import { checkouts, paymentPlans, receipts } from '../../db/schema.js'
import {
  checkoutInput,
  configured,
  digest,
  env,
  errorResponse,
  exchangeRates,
  PaymentError,
  paypal,
  quote,
} from '../lib/paypal.js'
import { mailConfigured } from '../lib/receipts.js'
import { settleOrder } from '../lib/settlement.js'

async function seoPlan(amount: number, currency: string) {
  const db = database()
  const key = `seo-monthly-${currency}-${amount}`
  const [existing] = await db
    .select()
    .from(paymentPlans)
    .where(eq(paymentPlans.id, key))
  if (existing) return existing.providerId
  const product = await paypal(
    '/v1/catalogs/products',
    { name: 'Bicrisale 20 KWs SEO', type: 'SERVICE', category: 'ADVERTISING' },
    'bicrisale-seo-product-v1',
  )
  const plan = await paypal(
    '/v1/billing/plans',
    {
      product_id: product.id,
      name: `20 KWs SEO — ${currency} monthly`,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: { interval_unit: 'MONTH', interval_count: 1 },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: (amount / 100).toFixed(2),
              currency_code: currency,
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 2,
      },
    },
    key,
  )
  await db
    .insert(paymentPlans)
    .values({ id: key, providerId: plan.id })
    .onConflictDoNothing()
  return plan.id as string
}

export default async (req: Request, context: Context) => {
  try {
    const headers = { 'Cache-Control': 'no-store' }
    if (req.method === 'GET') {
      return Response.json(
        {
          ready: configured() && mailConfigured() && !!env('PAYPAL_WEBHOOK_ID'),
          cards: env('PAYPAL_ADVANCED_CARDS_ENABLED') === 'true',
          rates: exchangeRates(),
          message:
            configured() && mailConfigured() && !!env('PAYPAL_WEBHOOK_ID')
              ? null
              : 'Online payments are being configured. Contact studio@bicrisale.com to arrange payment.',
        },
        { headers },
      )
    }
    if (req.method !== 'POST')
      return new Response('Method not allowed', { status: 405 })
    if (req.headers.get('origin') !== new URL(req.url).origin)
      throw new PaymentError('Invalid request origin.', 403)
    if (Number(req.headers.get('content-length') || 0) > 12000)
      throw new PaymentError('Request too large.', 413)
    if (!configured() || !mailConfigured() || !env('PAYPAL_WEBHOOK_ID'))
      throw new PaymentError(
        'Online payments and receipt delivery are being configured. Contact studio@bicrisale.com.',
        503,
      )
    let session = context.cookies.get('bicrisale_checkout')
    if (!session) {
      session = crypto.randomUUID()
      context.cookies.set({
        name: 'bicrisale_checkout',
        value: session,
        httpOnly: true,
        secure: new URL(req.url).protocol === 'https:',
        sameSite: 'Lax',
        path: '/',
        maxAge: 86400,
      })
    }
    const sessionHash = digest(session)
    const db = database()
    const body = await req.json()
    const action = z
      .enum(['create', 'capture', 'subscription-status', 'sdk'])
      .parse(body.action)
    if (action === 'sdk') {
      const currency = z.enum(['USD', 'CAD', 'EUR']).parse(body.currency)
      const recurring = body.recurring === true
      const components =
        env('PAYPAL_ADVANCED_CARDS_ENABLED') === 'true' && !recurring
          ? 'buttons,card-fields'
          : 'buttons'
      // The public SDK client identifier is supplied only to PayPal's browser SDK.
      const params = new URLSearchParams({
        'client-id': env('PAYPAL_CLIENT_ID')!,
        currency,
        components,
        intent: recurring ? 'subscription' : 'capture',
        ...(recurring ? { vault: 'true' } : {}),
      })
      return Response.json(
        { src: `https://www.paypal.com/sdk/js?${params}` },
        { headers },
      )
    }
    if (action === 'create') {
      const input = checkoutInput.parse(body)
      if (
        input.card &&
        (input.recurring || env('PAYPAL_ADVANCED_CARDS_ENABLED') !== 'true')
      )
        throw new PaymentError('Card checkout is unavailable for this payment.')
      const { amount, description } = quote(input)
      await db
        .insert(checkouts)
        .values({
          id: input.requestId,
          sessionHash,
          email: input.email,
          product: input.product,
          description: input.note
            ? `${description} — ${input.note}`
            : description,
          amount,
          currency: input.currency,
          recurring: input.recurring,
          saveCard: input.card && input.saveCard,
        })
        .onConflictDoNothing()
      const [checkout] = await db
        .select()
        .from(checkouts)
        .where(
          and(
            eq(checkouts.id, input.requestId),
            eq(checkouts.sessionHash, sessionHash),
          ),
        )
      if (!checkout) throw new PaymentError('Checkout not found.', 404)
      if (
        checkout.amount !== amount ||
        checkout.currency !== input.currency ||
        checkout.email !== input.email ||
        checkout.recurring !== input.recurring ||
        checkout.saveCard !== (input.card && input.saveCard)
      )
        throw new PaymentError('Payment details changed. Restart checkout.')
      if (checkout.providerId)
        return Response.json(
          { id: checkout.providerId, checkoutId: checkout.id },
          { headers },
        )
      let result
      if (input.recurring) {
        const planId = await seoPlan(amount, input.currency)
        result = await paypal(
          '/v1/billing/subscriptions',
          {
            plan_id: planId,
            custom_id: checkout.id,
            subscriber: { email_address: input.email },
            application_context: {
              brand_name: 'Bicrisale',
              shipping_preference: 'NO_SHIPPING',
              user_action: 'SUBSCRIBE_NOW',
              return_url: `${new URL(req.url).origin}/payments`,
              cancel_url: `${new URL(req.url).origin}/payments`,
            },
          },
          checkout.id,
        )
        await db
          .update(checkouts)
          .set({ planId })
          .where(eq(checkouts.id, checkout.id))
      } else {
        result = await paypal(
          '/v2/checkout/orders',
          {
            intent: 'CAPTURE',
            purchase_units: [
              {
                reference_id: checkout.id,
                invoice_id: checkout.id,
                description: checkout.description.slice(0, 127),
                amount: {
                  currency_code: checkout.currency,
                  value: (amount / 100).toFixed(2),
                },
              },
            ],
            payment_source: input.card
              ? {
                  card: {
                    attributes: {
                      verification: { method: 'SCA_WHEN_REQUIRED' },
                      ...(input.saveCard
                        ? { vault: { store_in_vault: 'ON_SUCCESS' } }
                        : {}),
                    },
                    experience_context: {
                      shipping_preference: 'NO_SHIPPING',
                      return_url: `${new URL(req.url).origin}/payments`,
                      cancel_url: `${new URL(req.url).origin}/payments`,
                    },
                  },
                }
              : {
                  paypal: {
                    email_address: input.email,
                    experience_context: {
                      brand_name: 'Bicrisale',
                      shipping_preference: 'NO_SHIPPING',
                      user_action: 'PAY_NOW',
                      return_url: `${new URL(req.url).origin}/payments`,
                      cancel_url: `${new URL(req.url).origin}/payments`,
                    },
                  },
                },
          },
          checkout.id,
        )
      }
      await db
        .update(checkouts)
        .set({ providerId: result.id })
        .where(eq(checkouts.id, checkout.id))
      return Response.json(
        { id: result.id, checkoutId: checkout.id },
        { headers },
      )
    }
    const id = z.uuid().parse(body.checkoutId)
    const [checkout] = await db
      .select()
      .from(checkouts)
      .where(and(eq(checkouts.id, id), eq(checkouts.sessionHash, sessionHash)))
    if (!checkout?.providerId)
      throw new PaymentError('Checkout not found.', 404)
    if (action === 'subscription-status') {
      if (!checkout.recurring) throw new PaymentError('Invalid subscription.')
      const sub = await paypal(
        `/v1/billing/subscriptions/${encodeURIComponent(checkout.providerId)}`,
      )
      if (sub.custom_id !== checkout.id || sub.plan_id !== checkout.planId)
        throw new PaymentError('Subscription could not be verified.', 409)
      if (sub.status !== 'ACTIVE')
        throw new PaymentError(
          'Subscription approval is pending. No payment is confirmed yet.',
          409,
        )
      await db
        .update(checkouts)
        .set({ status: 'ACTIVE' })
        .where(eq(checkouts.id, id))
      return Response.json({ status: 'ACTIVE' }, { headers })
    }
    if (checkout.recurring) throw new PaymentError('Invalid payment type.')
    const result = await settleOrder(checkout, true)
    const [receipt] = await db
      .select({ status: receipts.status })
      .from(receipts)
      .where(eq(receipts.id, result.transactionId))
    return Response.json(
      { ...result, receiptSent: receipt?.status === 'sent' },
      { headers },
    )
  } catch (error) {
    return errorResponse(error)
  }
}
export const config: Config = {
  path: '/api/payments',
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] },
}

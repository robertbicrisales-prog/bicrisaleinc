import type { Config } from '@netlify/functions'
import { and, eq } from 'drizzle-orm'
import { database } from '../../db/index.js'
import { checkouts } from '../../db/schema.js'
import { env, errorResponse, PaymentError, paypal } from '../lib/paypal.js'
import { settleOrder } from '../lib/settlement.js'
import { recordReceipt } from '../lib/receipts.js'

export default async (req: Request) => {
  try {
    if (req.method !== 'POST')
      return new Response('Method not allowed', { status: 405 })
    if (!env('PAYPAL_WEBHOOK_ID'))
      throw new PaymentError('Webhook is not configured.', 503)
    const event = await req.json()
    const verification = await paypal(
      '/v1/notifications/verify-webhook-signature',
      {
        auth_algo: req.headers.get('paypal-auth-algo'),
        cert_url: req.headers.get('paypal-cert-url'),
        transmission_id: req.headers.get('paypal-transmission-id'),
        transmission_sig: req.headers.get('paypal-transmission-sig'),
        transmission_time: req.headers.get('paypal-transmission-time'),
        webhook_id: env('PAYPAL_WEBHOOK_ID'),
        webhook_event: event,
      },
    )
    if (verification.verification_status !== 'SUCCESS')
      throw new PaymentError('Invalid webhook signature.', 401)
    const db = database()
    const resource = event.resource
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const orderId = resource?.supplementary_data?.related_ids?.order_id
      if (orderId) {
        const [checkout] = await db
          .select()
          .from(checkouts)
          .where(eq(checkouts.providerId, orderId))
        if (checkout && !checkout.recurring) await settleOrder(checkout)
      }
    } else if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
      const subscriptionId = resource?.billing_agreement_id
      if (subscriptionId) {
        const [checkout] = await db
          .select()
          .from(checkouts)
          .where(eq(checkouts.providerId, subscriptionId))
        if (checkout?.recurring) {
          const sub = await paypal(
            `/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`,
          )
          if (
            sub.custom_id !== checkout.id ||
            sub.plan_id !== checkout.planId ||
            resource.state !== 'completed'
          )
            throw new PaymentError(
              'Subscription payment could not be verified.',
              409,
            )
          await recordReceipt(
            checkout,
            resource.id,
            Math.round(Number(resource.amount.total) * 100),
            resource.amount.currency,
          )
        }
      }
    } else if (
      [
        'BILLING.SUBSCRIPTION.ACTIVATED',
        'BILLING.SUBSCRIPTION.CANCELLED',
        'BILLING.SUBSCRIPTION.SUSPENDED',
        'BILLING.SUBSCRIPTION.EXPIRED',
      ].includes(event.event_type)
    ) {
      const [checkout] = await db
        .select()
        .from(checkouts)
        .where(eq(checkouts.providerId, resource.id))
      if (checkout?.recurring && resource.custom_id === checkout.id)
        await db
          .update(checkouts)
          .set({ status: resource.status })
          .where(eq(checkouts.id, checkout.id))
    } else if (event.event_type === 'VAULT.PAYMENT-TOKEN.CREATED') {
      const customerId = resource?.customer?.id
      if (customerId) {
        // PayPal's vault event identifies the customer rather than the order.
        const matched = await db
          .update(checkouts)
          .set({ vaultId: resource.id })
          .where(
            and(
              eq(checkouts.vaultCustomerId, customerId),
              eq(checkouts.saveCard, true),
            ),
          )
          .returning({ id: checkouts.id })
        if (!matched.length)
          throw new PaymentError(
            'Vault confirmation is awaiting payment reconciliation. Retry this notification.',
            409,
          )
      }
    }
    return new Response('OK')
  } catch (error) {
    return errorResponse(error)
  }
}
export const config: Config = { path: '/api/paypal/webhook' }

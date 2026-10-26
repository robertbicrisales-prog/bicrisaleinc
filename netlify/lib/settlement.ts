import { eq } from 'drizzle-orm'
import { database } from '../../db/index.js'
import { checkouts } from '../../db/schema.js'
import { PaymentError, paypal } from './paypal.js'
import { recordReceipt } from './receipts.js'

export async function settleOrder(
  checkout: typeof checkouts.$inferSelect,
  capture = false,
) {
  const db = database()
  let order = await paypal(
    `/v2/checkout/orders/${encodeURIComponent(checkout.providerId!)}`,
  )
  if (order.status !== 'COMPLETED' && capture) {
    order = await paypal(
      `/v2/checkout/orders/${encodeURIComponent(checkout.providerId!)}/capture`,
      {},
      `capture-${checkout.id}`,
    )
  }
  const paid = verifiedCapture(order, checkout)
  // Save only the provider vault reference after explicit consent, never card details.
  const vault = order.payment_source?.card?.attributes?.vault
  await db
    .update(checkouts)
    .set({
      status: 'COMPLETED',
      ...(checkout.saveCard && vault?.customer?.id
        ? { vaultCustomerId: vault.customer.id }
        : {}),
      ...(checkout.saveCard && vault?.status === 'VAULTED'
        ? { vaultId: vault.id }
        : {}),
    })
    .where(eq(checkouts.id, checkout.id))
  await recordReceipt(checkout, paid.id, checkout.amount, checkout.currency)
  return {
    status: 'COMPLETED',
    transactionId: paid.id,
    savedCard: checkout.saveCard && vault?.status === 'VAULTED',
  }
}

// PayPal redirects and SDK callbacks are not proof of payment.
export function verifiedCapture(
  order: {
    id?: string
    status?: string
    purchase_units?: Array<{
      reference_id?: string
      invoice_id?: string
      payments?: {
        captures?: Array<{
          id: string
          status: string
          amount: { currency_code: string; value: string }
        }>
      }
    }>
  },
  checkout: Pick<
    typeof checkouts.$inferSelect,
    'id' | 'providerId' | 'amount' | 'currency'
  >,
) {
  const unit = order.purchase_units?.[0]
  const paid = unit?.payments?.captures?.find((c) => c.status === 'COMPLETED')
  if (order.status !== 'COMPLETED' || !paid)
    throw new PaymentError(
      'Payment is still pending. A receipt is sent only after PayPal confirms payment.',
      409,
    )
  if (
    order.id !== checkout.providerId ||
    unit?.reference_id !== checkout.id ||
    unit?.invoice_id !== checkout.id ||
    paid.amount.currency_code !== checkout.currency ||
    Math.round(Number(paid.amount.value) * 100) !== checkout.amount
  )
    throw new PaymentError(
      'Payment details could not be verified. Please contact us.',
      409,
    )
  return paid
}

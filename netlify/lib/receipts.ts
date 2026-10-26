import nodemailer from 'nodemailer'
import { and, eq, lt, or, sql } from 'drizzle-orm'
import { database } from '../../db/index.js'
import { checkouts, receipts } from '../../db/schema.js'
import { env } from './paypal.js'
import { money } from '../../src/data/payments.js'

export function mailConfigured() {
  return !!(
    env('SMTP_HOST') &&
    env('SMTP_USER') &&
    env('SMTP_PASS') &&
    env('RECEIPT_FROM')
  )
}
export async function recordReceipt(
  checkout: typeof checkouts.$inferSelect,
  id: string,
  amount: number,
  currency: string,
) {
  if (amount !== checkout.amount || currency !== checkout.currency)
    throw new Error('Payment amount mismatch')
  await database()
    .insert(receipts)
    .values({ id, checkoutId: checkout.id, amount, currency })
    .onConflictDoNothing()
  await sendReceipt(id)
}
const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  )
export async function sendReceipt(id: string) {
  if (!mailConfigured()) return
  const db = database()
  const [receipt] = await db
    .update(receipts)
    .set({
      status: 'sending',
      claimedAt: new Date(),
      attempts: sql`${receipts.attempts} + 1`,
    })
    .where(
      and(
        eq(receipts.id, id),
        or(
          eq(receipts.status, 'pending'),
          and(
            eq(receipts.status, 'sending'),
            lt(receipts.claimedAt, new Date(Date.now() - 10 * 60 * 1000)),
          ),
        ),
      ),
    )
    .returning()
  if (!receipt) return
  const [checkout] = await db
    .select()
    .from(checkouts)
    .where(eq(checkouts.id, receipt.checkoutId))
  if (!checkout) return
  const transport = nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port: Number(env('SMTP_PORT') || 465),
    secure: (env('SMTP_PORT') || '465') === '465',
    requireTLS: true,
    auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
    connectionTimeout: 10000,
    socketTimeout: 15000,
  })
  const total = money(receipt.amount / 100, receipt.currency)
  try {
    await transport.sendMail({
      from: env('RECEIPT_FROM'),
      to: checkout.email,
      replyTo: 'studio@bicrisale.com',
      messageId: `<bicrisale-${receipt.id}@bicrisale.com>`,
      subject: `Bicrisale payment receipt — ${total}`,
      text: `BICRISALE\nPayment received\n\n${checkout.description}\nAmount paid: ${total} ${receipt.currency}\nTransaction: ${receipt.id}\nDate: ${receipt.createdAt.toISOString()}\n${checkout.recurring ? 'SEO subscription: monthly. Manage or cancel future payments in your PayPal automatic payments settings.\n' : ''}\nThank you for working with Bicrisale.\nQuestions: studio@bicrisale.com`,
      html: `<div style="font-family:Georgia,serif;max-width:560px;margin:auto;padding:40px;background:#15130f;color:#eee7d9"><p style="letter-spacing:4px;color:#c1a476">BICRISALE</p><h1>Payment received.</h1><p>${escapeHtml(checkout.description)}</p><h2>${escapeHtml(total)} ${receipt.currency}</h2><p>Transaction: ${escapeHtml(receipt.id)}</p><p>${receipt.createdAt.toISOString().slice(0, 10)}</p>${checkout.recurring ? '<p>SEO subscription: monthly. Manage or cancel future payments in your PayPal automatic payments settings.</p>' : ''}<hr><p>Thank you for working with Bicrisale.</p><p>Questions? <a style="color:#c1a476" href="mailto:studio@bicrisale.com">studio@bicrisale.com</a></p></div>`,
    })
    await db
      .update(receipts)
      .set({ status: 'sent', sentAt: new Date() })
      .where(eq(receipts.id, id))
  } catch {
    await db
      .update(receipts)
      .set({ status: 'pending' })
      .where(eq(receipts.id, id))
  } finally {
    transport.close()
  }
}

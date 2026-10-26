import type { Config } from '@netlify/functions'
import { and, eq, lt, or } from 'drizzle-orm'
import { database } from '../../db/index.js'
import { receipts } from '../../db/schema.js'
import { sendReceipt } from '../lib/receipts.js'
export default async () => {
  const pending = await database()
    .select({ id: receipts.id })
    .from(receipts)
    .where(
      and(
        lt(receipts.attempts, 12),
        or(
          eq(receipts.status, 'pending'),
          and(
            eq(receipts.status, 'sending'),
            lt(receipts.claimedAt, new Date(Date.now() - 10 * 60 * 1000)),
          ),
        ),
      ),
    )
    .limit(2)
  await Promise.all(pending.map((r) => sendReceipt(r.id)))
}
export const config: Config = { schedule: '*/10 * * * *' }

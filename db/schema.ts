import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

export const checkouts = pgTable('payment_checkouts', {
  id: text('id').primaryKey(),
  sessionHash: text('session_hash').notNull(),
  email: text('email').notNull(),
  product: text('product').notNull(),
  description: text('description').notNull(),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  recurring: boolean('recurring').notNull().default(false),
  saveCard: boolean('save_card').notNull().default(false),
  providerId: text('provider_id').unique(),
  planId: text('plan_id'),
  status: text('status').notNull().default('CREATED'),
  vaultId: text('vault_id'),
  vaultCustomerId: text('vault_customer_id'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const paymentPlans = pgTable('payment_plans', {
  id: text('id').primaryKey(),
  providerId: text('provider_id').notNull(),
})

// Only provider references are retained. Card numbers and CVVs never reach this database.
export const receipts = pgTable('payment_receipts', {
  id: text('id').primaryKey(),
  checkoutId: text('checkout_id')
    .notNull()
    .references(() => checkouts.id),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  status: text('status').notNull().default('pending'),
  attempts: integer('attempts').notNull().default(0),
  claimedAt: timestamp('claimed_at', { withTimezone: true }),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

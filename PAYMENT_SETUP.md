# PayPal payment setup

The `/packages` page links to `/payments`, which handles service orders, project deposits, website payments, and custom amounts. SEO costs USD 329 and offers a one-time payment or an optional monthly subscription. PPC costs USD 199 and Meta ads costs USD 199 per campaign. Website and custom payments use client-entered agreed amounts. Existing package deposits also use the verified checkout.

## Required secure environment settings

Configure these in Netlify's environment-variable settings with Functions scope. Do not put values in source files or send credentials in chat.

- `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`: credentials from the merchant's live PayPal application.
- `PAYPAL_ENVIRONMENT`: `live` for production (the default); `sandbox` for separate sandbox testing credentials.
- `PAYPAL_WEBHOOK_ID`: the webhook registered with that same application.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: authenticated SMTP service; port defaults to 465 with implicit TLS. Port 587 uses required STARTTLS.
- `RECEIPT_FROM`: a verified sender on the merchant's email domain, such as `Bicrisale <billing@bicrisale.com>`.

Checkout remains unavailable until PayPal, webhook verification, and receipt delivery are configured. Credentials supplied in conversation were not copied into the repository or configured through command-line arguments. Configure them securely and rotate any secret previously shared in chat before enabling live payments.

## Webhook

Register `https://bicrisale.com/api/paypal/webhook` in the live PayPal application and subscribe to:

- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.SALE.COMPLETED`
- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.SUSPENDED`
- `BILLING.SUBSCRIPTION.EXPIRED`
- `VAULT.PAYMENT-TOKEN.CREATED` when enabling saved cards

Signatures are verified with PayPal. Payment amounts, currencies, order references, and subscription plans are checked before recording payment receipts. Browser callbacks alone do not confirm payment. Subscription approval does not itself produce a paid receipt; each confirmed subscription charge produces one.

The first SEO subscription creates a PayPal service product and a monthly plan. There is no trial or setup fee. Customers approve recurring billing explicitly and manage/cancel future payments through PayPal. No minimum commitment was supplied, so none was added. Confirm monthly billing terms with the business before taking live subscriptions.

## Currencies

USD fixed prices are authoritative. Custom agreed amounts support USD, CAD, and EUR. Optional `PAYPAL_USD_CAD_RATE` and `PAYPAL_USD_EUR_RATE` settings enable fixed-price service checkout in those currencies using an explicitly displayed merchant quote rate. There is no automatic foreign-exchange feed, and the same numeric USD price is never silently relabeled in another currency.

PayPal does not support INR as a checkout currency. INR appears as unavailable with an explanation and a contact route. Accepting INR requires a separate payment provider; this integration cannot enable it through PayPal. PayPal may also restrict payments based on the merchant/buyer country combination.

## Saved cards

Enable Advanced Credit and Debit Card Payments and vaulting for the live PayPal application before setting `PAYPAL_ADVANCED_CARDS_ENABLED=true`. The browser checks SDK eligibility and offers PayPal when card checkout is unavailable. Card checkout uses PayPal-hosted Card Fields; card numbers and security codes never enter Bicrisale's application or database.

Saving is opt-in. PayPal stores the card and Bicrisale stores only a provider vault reference after confirmed vaulting. Card checkout is for one-time payments; SEO subscriptions use PayPal-approved recurring billing. Returning-customer card selection or charging saved cards is not exposed: it needs authenticated customer accounts and an explicit customer/mandate association. Email alone never grants access to a stored payment method.

## Records and receipts

Netlify Database stores checkout details, the supplied receipt email, provider references, and receipt delivery state. Drizzle migrations are generated in `netlify/database/migrations/` and applied by the deployment platform.

Bicrisale-branded receipts are sent by SMTP after a confirmed charge. Provider transaction IDs prevent duplicate receipt records. Delivery failures remain queued and retry every ten minutes, up to twelve attempts. Stable email Message-IDs help email systems recognize retries, but SMTP cannot guarantee exactly-once delivery after an ambiguous network failure. Review exhausted retries operationally. Refund/reversal accounting and refund emails are outside this payment checkout.

## Validation

Run `pnpm test:payments` for price, custom-amount, subscription, currency, confirmation, and configuration checks. Run `pnpm typecheck` after the development server has generated the TanStack route tree. A live charge was not performed. Test sandbox orders, declines, saved-card eligibility, 3-D Secure, subscription renewal/cancellation, webhook redelivery, and SMTP delivery before enabling production credentials.

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { money, paymentProducts } from '@/data/payments'
import { packages } from '@/data/site'

type Setup = {
  ready: boolean
  cards: boolean
  rates: Record<string, number | null>
  message: string | null
}
type Details = {
  requestId: string
  product: string
  currency: string
  amount?: string
  email: string
  note: string
  recurring: boolean
  saveCard: boolean
  card: boolean
}
type Result = {
  status: string
  transactionId?: string
  receiptSent?: boolean
  savedCard?: boolean
}
type Field = { render: (element: HTMLElement) => Promise<void> }
type CardFields = {
  isEligible: () => boolean
  NameField: (options?: unknown) => Field
  NumberField: (options?: unknown) => Field
  ExpiryField: (options?: unknown) => Field
  CVVField: (options?: unknown) => Field
  submit: () => Promise<void>
}
type SDK = {
  Buttons: (options: Record<string, unknown>) => {
    render: (element: HTMLElement) => Promise<void>
    close: () => Promise<void>
  }
  CardFields?: (options: Record<string, unknown>) => CardFields
}

async function api(body?: Record<string, unknown>) {
  const response = await fetch(
    '/api/payments',
    body
      ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      : undefined,
  )
  const result = await response.json()
  if (!response.ok)
    throw new Error(result.error || 'Payment service is unavailable.')
  return result
}
const fieldClass =
  'mt-2 w-full border border-line bg-ink px-4 py-3 text-ivory outline-none transition-colors focus:border-brass disabled:opacity-50'

export function PaymentCheckout({
  initialProduct = 'seo-20',
}: {
  initialProduct?: string
}) {
  const validProduct = [
    ...paymentProducts,
    ...packages.map((p) => ({ id: p.slug })),
  ].some((p) => p.id === initialProduct)
  const [productId, setProductId] = useState(
    validProduct ? initialProduct : 'seo-20',
  )
  const [currency, setCurrency] = useState('USD')
  const [recurring, setRecurring] = useState(false)
  const [card, setCard] = useState(false)
  const [setup, setSetup] = useState<Setup | null>(null)
  const [details, setDetails] = useState<Details | null>(null)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [cardReady, setCardReady] = useState(false)
  const cardFields = useRef<CardFields | null>(null)
  const buttonsHost = useRef<HTMLDivElement>(null)
  const nameHost = useRef<HTMLDivElement>(null)
  const numberHost = useRef<HTMLDivElement>(null)
  const expiryHost = useRef<HTMLDivElement>(null)
  const cvvHost = useRef<HTMLDivElement>(null)
  const checkoutId = useRef<string | null>(null)
  const product = paymentProducts.find((p) => p.id === productId)
  const pkg = packages.find((p) => p.slug === productId)
  const base = product ? product.price : (pkg?.deposit ?? null)
  const rate = setup?.rates[currency] ?? (currency === 'USD' ? 1 : null)
  const total =
    base !== null && rate ? Math.round(base * rate * 100) / 100 : null

  useEffect(() => {
    api()
      .then(setSetup)
      .catch(() =>
        setError(
          'Checkout is unavailable. Contact studio@bicrisale.com to arrange payment.',
        ),
      )
  }, [])
  useEffect(() => {
    if (!details) return
    let cancelled = false
    let script: HTMLScriptElement | undefined
    let buttons: ReturnType<SDK['Buttons']> | undefined
    const namespace = `bicrisalePayPal${Date.now()}`
    setLoading(true)
    setCardReady(false)
    setError('')
    const approve = async () => {
      setBusy(true)
      try {
        const response = await api({
          action: details.recurring ? 'subscription-status' : 'capture',
          checkoutId: checkoutId.current,
        })
        if (!cancelled) setResult(response)
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error
              ? e.message
              : 'Payment is not confirmed. Please contact us before paying again.',
          )
      } finally {
        if (!cancelled) setBusy(false)
      }
    }
    const create = async () => {
      const response = await api({ action: 'create', ...details })
      checkoutId.current = response.checkoutId
      return response.id
    }
    void (async () => {
      try {
        const { src } = await api({
          action: 'sdk',
          currency: details.currency,
          recurring: details.recurring,
        })
        if (cancelled) return
        await new Promise<void>((resolve, reject) => {
          script = document.createElement('script')
          script.src = src
          script.dataset.namespace = namespace
          script.onload = () => resolve()
          script.onerror = () =>
            reject(
              new Error(
                'PayPal could not load. Check your connection and try again.',
              ),
            )
          document.body.appendChild(script)
        })
        if (cancelled) return
        const sdk = (window as unknown as Record<string, SDK>)[namespace]
        const options = {
          onApprove: approve,
          onCancel: () => {
            setBusy(false)
            setError(
              'Checkout cancelled. No payment is confirmed. You can try again when ready.',
            )
          },
          onError: () => {
            setBusy(false)
            setError(
              'PayPal could not complete checkout. If you approved a payment, use “Check payment status” before trying again.',
            )
          },
        }
        if (details.card) {
          const fields = sdk.CardFields?.({
            ...options,
            createOrder: create,
            style: {
              input: { color: '#eee7d9', 'font-size': '16px' },
              '.invalid': { color: '#df8c76' },
            },
          })
          if (!fields?.isEligible())
            throw new Error(
              'Card checkout is unavailable for this account or region. Edit payment details and choose PayPal.',
            )
          cardFields.current = fields
          await Promise.all([
            fields.NameField().render(nameHost.current!),
            fields.NumberField().render(numberHost.current!),
            fields.ExpiryField().render(expiryHost.current!),
            fields.CVVField().render(cvvHost.current!),
          ])
          if (!cancelled) setCardReady(true)
        } else {
          buttons = sdk.Buttons({
            ...options,
            style: {
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: details.recurring ? 'subscribe' : 'pay',
            },
            ...(details.recurring
              ? { createSubscription: create }
              : { createOrder: create }),
          })
          await buttons.render(buttonsHost.current!)
        }
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : 'Unable to open PayPal checkout.',
          )
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
      cardFields.current = null
      void buttons?.close().catch(() => {})
      script?.remove()
      delete (window as unknown as Record<string, unknown>)[namespace]
    }
  }, [details])

  function continueCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    setDetails({
      requestId: crypto.randomUUID(),
      product: productId,
      currency,
      amount: base === null ? String(form.get('amount')) : undefined,
      email: String(form.get('email')).trim(),
      note: String(form.get('note') || '').trim(),
      recurring,
      card: card && !recurring,
      saveCard: form.get('saveCard') === 'on' && card && !recurring,
    })
    checkoutId.current = null
  }
  async function submitCard() {
    setBusy(true)
    setError('')
    try {
      await cardFields.current?.submit()
    } catch {
      setError(
        'Please check the card fields. If you approved a payment, check its status before trying again.',
      )
    } finally {
      setBusy(false)
    }
  }
  async function checkStatus() {
    setBusy(true)
    try {
      setResult(
        await api({
          action: details?.recurring ? 'subscription-status' : 'capture',
          checkoutId: checkoutId.current,
        }),
      )
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment is not confirmed.')
    } finally {
      setBusy(false)
    }
  }

  if (result)
    return (
      <div
        className="border border-brass-deep bg-ink-2 p-8 sm:p-12"
        role="status"
      >
        <p className="eyebrow text-brass">
          {result.status === 'ACTIVE'
            ? 'Subscription approved'
            : 'Payment confirmed'}
        </p>
        <h2 className="display mt-5 text-4xl">
          Thank you for choosing <span className="accent-em">Bicrisale.</span>
        </h2>
        <p className="mt-6 text-ivory-dim">
          {result.status === 'ACTIVE'
            ? 'Your monthly SEO subscription is active. A branded receipt is emailed after each payment is confirmed by PayPal.'
            : result.receiptSent
              ? `Your payment receipt has been emailed to ${details?.email}.`
              : `Your payment is confirmed. Your receipt is queued for delivery to ${details?.email}.`}
        </p>
        {result.transactionId && (
          <p className="mt-4 break-all text-sm text-ivory-faint">
            Transaction: {result.transactionId}
          </p>
        )}
        {result.savedCard && (
          <p className="mt-4 text-sm text-ivory-dim">
            Your card was securely saved with PayPal. Bicrisale retains only a
            payment reference.
          </p>
        )}
        {result.status === 'ACTIVE' && (
          <a
            href="https://www.paypal.com/myaccount/autopay/"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-brass underline"
          >
            Manage or cancel subscription in PayPal
          </a>
        )}
        <button
          type="button"
          onClick={() => {
            setDetails(null)
            setResult(null)
            checkoutId.current = null
          }}
          className="mt-8 block text-sm text-brass underline"
        >
          Make another payment
        </button>
      </div>
    )

  return (
    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
      <aside>
        <p className="eyebrow">Your payment</p>
        <h2 className="display mt-5 text-4xl sm:text-5xl">
          A clear scope.
          <br />
          <span className="accent-em">A secure checkout.</span>
        </h2>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory-dim">
          Select your service or pay a custom amount from an agreed quote. All
          charges show the currency before you approve payment.
        </p>
        <dl className="mt-10 space-y-5 border-t border-line pt-6 text-sm">
          <div>
            <dt className="text-brass">Secure payment</dt>
            <dd className="mt-1 text-ivory-dim">
              PayPal processes payments. Card numbers and security codes never
              pass through our servers.
            </dd>
          </div>
          <div>
            <dt className="text-brass">Receipt by email</dt>
            <dd className="mt-1 text-ivory-dim">
              Your Bicrisale receipt follows confirmed payment. SEO subscribers
              receive a receipt for every monthly charge.
            </dd>
          </div>
          <div>
            <dt className="text-brass">Paying from India</dt>
            <dd className="mt-1 text-ivory-dim">
              PayPal does not support INR checkout. Choose a supported currency
              if your account is eligible, or contact us for an INR payment
              arrangement.
            </dd>
          </div>
        </dl>
      </aside>
      <div className="border border-line bg-ink-2 p-6 sm:p-10">
        {!setup && !error && (
          <p className="animate-pulse text-sm text-ivory-dim" role="status">
            Checking payment availability…
          </p>
        )}
        {setup?.message && (
          <p
            className="mb-6 border-l-2 border-brass bg-ink p-4 text-sm text-ivory-dim"
            role="status"
          >
            {setup.message}
          </p>
        )}
        {!details ? (
          <form onSubmit={continueCheckout} className="space-y-6">
            <label className="block text-sm">
              Service
              <select
                name="product"
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value)
                  setRecurring(false)
                }}
                className={fieldClass}
              >
                {paymentProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.price !== null
                      ? ` — $${p.price} USD`
                      : ' — custom amount'}
                  </option>
                ))}
                {pkg && (
                  <option value={pkg.slug}>
                    {pkg.name} — {money(pkg.deposit, 'USD')} deposit / first
                    payment
                  </option>
                )}
              </select>
              <span className="mt-2 block text-xs text-ivory-faint">
                {product?.detail || pkg?.positioning}
              </span>
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm">
                Currency
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={fieldClass}
                >
                  <option value="USD">USD — US dollar</option>
                  <option value="CAD">CAD — Canadian dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="INR" disabled>
                    INR — unavailable with PayPal
                  </option>
                </select>
              </label>
              {base === null ? (
                <label className="block text-sm">
                  Agreed amount ({currency})
                  <input
                    name="amount"
                    type="number"
                    min="1"
                    max="100000"
                    step="0.01"
                    required
                    className={fieldClass}
                    placeholder="0.00"
                  />
                </label>
              ) : (
                <div className="text-sm">
                  Amount ({currency})
                  <p className="display mt-3 text-3xl text-brass">
                    {total === null ? 'Quote required' : money(total, currency)}
                  </p>
                </div>
              )}
            </div>
            {base !== null && !rate && (
              <p className="text-sm text-brass">
                This service is priced in USD. Choose USD, or select Custom
                payment to enter an agreed {currency} quote.
              </p>
            )}
            {currency !== 'USD' && base !== null && rate && (
              <p className="text-xs text-ivory-faint">
                Based on our quoted rate of 1 USD = {rate} {currency}. This
                amount is charged in {currency}.
              </p>
            )}
            {productId === 'seo-20' && (
              <fieldset className="border border-line p-4">
                <legend className="px-2 text-xs tracking-widest text-brass uppercase">
                  SEO billing
                </legend>
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name="billing"
                    checked={!recurring}
                    onChange={() => setRecurring(false)}
                    className="accent-brass"
                  />
                  One-time payment
                </label>
                <label className="mt-3 flex items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name="billing"
                    checked={recurring}
                    onChange={() => {
                      setRecurring(true)
                      setCard(false)
                    }}
                    className="accent-brass"
                  />
                  Monthly subscription
                </label>
                {recurring && (
                  <p className="mt-4 text-xs leading-relaxed text-ivory-dim">
                    {total !== null ? money(total, currency) : '$329 USD'} every
                    month, starting after approval. Renews automatically until
                    cancelled. Manage or cancel future payments in PayPal.
                  </p>
                )}
              </fieldset>
            )}
            <label className="block text-sm">
              Email for your receipt
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                maxLength={254}
                className={fieldClass}
                placeholder="you@company.com"
              />
            </label>
            <label className="block text-sm">
              Invoice or project reference{' '}
              <span className="text-ivory-faint">(optional)</span>
              <input
                name="note"
                maxLength={200}
                className={fieldClass}
                placeholder="Invoice number or business name"
              />
            </label>
            {setup?.cards && !recurring && (
              <fieldset>
                <legend className="text-sm">Payment method</legend>
                <div className="mt-3 flex flex-wrap gap-6 text-sm">
                  <label className="flex gap-2">
                    <input
                      type="radio"
                      name="method"
                      checked={!card}
                      onChange={() => setCard(false)}
                    />
                    PayPal
                  </label>
                  <label className="flex gap-2">
                    <input
                      type="radio"
                      name="method"
                      checked={card}
                      onChange={() => setCard(true)}
                    />
                    Debit or credit card
                  </label>
                </div>
                {card && (
                  <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-ivory-dim">
                    <input type="checkbox" name="saveCard" className="mt-1" />
                    Save my card securely with PayPal for future agreed
                    payments. Card saving is optional; no card number or
                    security code is stored by Bicrisale.
                  </label>
                )}
              </fieldset>
            )}
            {recurring && (
              <label className="flex items-start gap-3 text-xs leading-relaxed text-ivory-dim">
                <input type="checkbox" required className="mt-1" />I authorize
                the monthly SEO charge shown above until I cancel through
                PayPal.
              </label>
            )}
            <button
              disabled={!setup?.ready || (base !== null && !rate)}
              className="w-full bg-brass px-6 py-4 text-xs font-semibold tracking-[0.16em] text-ink uppercase transition hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue to secure checkout →
            </button>
          </form>
        ) : (
          <div>
            <p className="eyebrow text-brass">Review & pay</p>
            <h3 className="display mt-4 text-3xl">
              {product?.name || pkg?.name}
            </h3>
            <p className="display mt-3 text-3xl text-brass">
              {money(
                base === null ? Number(details.amount) : total!,
                details.currency,
              )}{' '}
              {details.recurring && <span className="text-lg">/ month</span>}
            </p>
            <p className="mt-4 break-all text-sm text-ivory-dim">
              Receipt to {details.email}
            </p>
            {details.note && (
              <p className="mt-2 text-sm text-ivory-faint">
                Reference: {details.note}
              </p>
            )}
            <div className="mt-8">
              {loading && (
                <p
                  role="status"
                  className="animate-pulse py-6 text-sm text-ivory-dim"
                >
                  Opening secure PayPal checkout…
                </p>
              )}
              {details.card ? (
                <div className="space-y-4">
                  <p className="text-xs text-ivory-faint">
                    Card fields are securely hosted by PayPal.
                  </p>
                  <div>
                    <p className="text-sm">Name on card</p>
                    <div
                      ref={nameHost}
                      className="mt-2 min-h-12 border border-line bg-ink"
                    />
                  </div>
                  <div>
                    <p className="text-sm">Card number</p>
                    <div
                      ref={numberHost}
                      className="mt-2 min-h-12 border border-line bg-ink"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm">Expiry date</p>
                      <div
                        ref={expiryHost}
                        className="mt-2 min-h-12 border border-line bg-ink"
                      />
                    </div>
                    <div>
                      <p className="text-sm">Security code</p>
                      <div
                        ref={cvvHost}
                        className="mt-2 min-h-12 border border-line bg-ink"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={busy || !cardReady}
                    onClick={() => void submitCard()}
                    className="w-full bg-brass py-4 text-sm font-semibold text-ink disabled:opacity-40"
                  >
                    {busy ? 'Processing…' : 'Pay securely'}
                  </button>
                </div>
              ) : (
                <div ref={buttonsHost} className="relative z-0" />
              )}
              {busy && (
                <p role="status" className="mt-4 text-sm text-ivory-dim">
                  Verifying with PayPal. Please keep this page open.
                </p>
              )}
            </div>
            {checkoutId.current && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void checkStatus()}
                className="mt-5 block text-sm text-brass underline disabled:opacity-50"
              >
                Check payment status
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setDetails(null)
                setError('')
              }}
              className="mt-6 block text-xs text-ivory-dim underline disabled:opacity-50"
            >
              Edit payment details
            </button>
          </div>
        )}
        {error && (
          <p
            role="alert"
            className="mt-6 border-l-2 border-brass bg-ink p-4 text-sm leading-relaxed text-brass"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

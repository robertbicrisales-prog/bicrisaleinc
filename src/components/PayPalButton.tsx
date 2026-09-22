import { site } from '@/data/site'

/**
 * PayPal Payments Standard checkout.
 *
 * A plain form POST to PayPal is deliberate here: it needs no client ID, no
 * SDK script and no server round-trip, so the buttons work the moment a real
 * business account is set in VITE_PAYPAL_BUSINESS. `target="_top"` keeps the
 * hand-off out of an iframe, which PayPal requires.
 */
export function PayPalButton({
  itemName,
  amount,
  sku,
  label = 'Pay deposit with PayPal',
  recurring = false,
  className = '',
}: {
  itemName: string
  amount: number
  sku: string
  label?: string
  recurring?: boolean
  className?: string
}) {
  const returnUrl =
    typeof window === 'undefined'
      ? undefined
      : `${window.location.origin}/packages?paid=${encodeURIComponent(sku)}`

  return (
    <form
      action="https://www.paypal.com/cgi-bin/webscr"
      method="post"
      target="_top"
      className={className}
    >
      <input type="hidden" name="cmd" value="_xclick" />
      <input type="hidden" name="business" value={site.paypalBusiness} />
      <input type="hidden" name="item_name" value={itemName} />
      <input type="hidden" name="item_number" value={sku} />
      <input type="hidden" name="amount" value={amount.toFixed(2)} />
      <input type="hidden" name="currency_code" value={site.currency} />
      <input type="hidden" name="no_shipping" value="1" />
      <input type="hidden" name="no_note" value="0" />
      <input
        type="hidden"
        name="cn"
        value="Anything we should know before we start?"
      />
      {returnUrl && <input type="hidden" name="return" value={returnUrl} />}
      {returnUrl && (
        <input type="hidden" name="cancel_return" value={returnUrl} />
      )}

      <button
        type="submit"
        className="group flex w-full items-center justify-center gap-3 bg-brass px-6 py-4 text-[0.78rem] font-semibold tracking-[0.16em] text-ink uppercase transition-colors duration-300 hover:bg-ivory"
      >
        <PayPalMark />
        <span>{label}</span>
      </button>
      <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-ivory-faint">
        {recurring
          ? `$${amount.toLocaleString()} first month — secured by PayPal. Cancel after the 3-month minimum.`
          : `$${amount.toLocaleString()} deposit — secured by PayPal, credited in full to your first invoice.`}
      </p>
    </form>
  )
}

function PayPalMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 shrink-0"
      fill="currentColor"
    >
      <path d="M7.4 21.2H4.1c-.3 0-.5-.3-.4-.6L6.5 3.3c.1-.4.4-.6.8-.6h6.1c3.6 0 5.6 1.8 5.1 5.1-.5 3.6-3.1 5.5-6.8 5.5h-2c-.4 0-.7.3-.8.6l-.7 6.7c0 .4-.4.6-.8.6Zm3.2-10.6h1.2c1.8 0 3.1-.8 3.4-2.6.2-1.4-.6-2-2.1-2h-1.3l-1.2 4.6Z" />
      <path
        d="M17.9 8.9c.4 2.9-1.6 5.4-5.3 5.4h-1.4c-.4 0-.7.3-.8.7l-.9 6c0 .3-.3.5-.6.5h2.7c.4 0 .7-.3.8-.6l.7-4.6c.1-.4.4-.6.8-.6h1.1c3.2 0 5.5-1.6 6-5 .3-1.9-.5-3.1-1.9-3.7-.3-.1-.6-.2-1-.3.0.1 0 .2 0 .2Z"
        opacity="0.55"
      />
    </svg>
  )
}

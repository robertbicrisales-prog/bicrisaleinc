import { Link } from '@tanstack/react-router'

export function PayPalButton({
  amount,
  sku,
  label = 'Pay with PayPal',
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
  return (
    <div className={className}>
      <Link
        to="/payments"
        search={{ product: sku }}
        className="flex w-full items-center justify-center bg-brass px-6 py-4 text-center text-[0.78rem] font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-ivory"
      >
        {label}
      </Link>
      <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-ivory-faint">
        ${amount.toLocaleString()} USD{' '}
        {recurring ? 'first-month payment' : 'deposit'} — secured by PayPal.{' '}
        {recurring
          ? 'This initial payment does not enroll you in automatic billing.'
          : 'Credited to your project invoice.'}
      </p>
    </div>
  )
}

export const paymentProducts = [
  {
    id: 'seo-20',
    name: '20 KWs SEO',
    price: 329,
    detail: 'SEO for 20 target keywords.',
    subscription: true,
  },
  {
    id: 'ppc-25',
    name: '25 KWs PPC campaign',
    price: 199,
    detail:
      'PPC campaign for 25 target keywords. Confirm media spend separately.',
    subscription: false,
  },
  {
    id: 'meta-ads',
    name: 'Meta ads campaign',
    price: 199,
    detail: 'A Meta advertising campaign. Confirm media spend separately.',
    subscription: false,
  },
  {
    id: 'website',
    name: 'Website design & development',
    price: null,
    detail: 'Enter the amount agreed for your website project.',
    subscription: false,
  },
  {
    id: 'custom',
    name: 'Custom payment',
    price: null,
    detail: 'Pay an agreed invoice, project milestone, or other amount.',
    subscription: false,
  },
] as const

export const paymentCurrencies = ['USD', 'CAD', 'EUR'] as const
export type PaymentCurrency = (typeof paymentCurrencies)[number]
export function money(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    value,
  )
}

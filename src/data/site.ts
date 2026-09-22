/**
 * Single source of truth for every piece of Bicrisale copy, navigation and
 * commerce data. Pages import from here so wording changes happen in one file.
 */

export const site = {
  name: 'Bicrisale',
  legalName: 'Bicrisale Creative Group',
  tagline: 'We Build What Comes Next',
  founded: 2022,
  city: 'Chicago',
  reach: 'Chicago, IL — Nationwide',
  email: 'studio@bicrisale.com',
  phone: '(312) 544-0198',
  instagram: 'https://instagram.com/bicrisale',
  instagramHandle: '@bicrisale',
  description:
    'Bicrisale is a creative growth agency. We build brands from the ground up — strategy, identity, content, and the systems that keep them growing.',
  /**
   * PayPal business account that receives package deposits. Override in Netlify
   * with the VITE_PAYPAL_BUSINESS env var; the fallback keeps the buttons
   * rendering (and sandbox-safe) until the real account is connected.
   */
  paypalBusiness:
    import.meta.env.VITE_PAYPAL_BUSINESS || 'billing@bicrisale.com',
  currency: 'USD',
}

export const nav = [
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Packages', to: '/packages' },
  { label: 'Industries', to: '/industries' },
  { label: 'Process', to: '/process' },
  { label: 'Studio', to: '/content-studio' },
  { label: 'Digital', to: '/digital-products' },
  { label: 'About', to: '/about' },
] as const

export const stats = [
  { value: 214, suffix: '', label: 'Projects Completed' },
  { value: 61.4, suffix: 'M', label: 'Organic Views Generated' },
  { value: 17, suffix: '', label: 'Industries Served' },
  { value: 4, suffix: '', label: 'Years Building Brands' },
]

export const clientMarquee = [
  'Pasta Via',
  'Trinità',
  'Élan-V Medspa',
  'The Vessel Room',
  'Halstead Social Club',
  'Bravo1 Wellness',
  'Nocturne Lounge',
  'Wren & Bell Dental',
  'Maison Ottava',
  'Foundry 312',
  'Salt & Cedar Group',
  'Aperture Studios',
]

export type Service = {
  num: string
  slug: string
  title: string
  pitch: string
  detail: string
  items: string[]
}

export const services: Service[] = [
  {
    num: '01',
    slug: 'branding',
    title: 'Branding',
    pitch: 'Identity systems built for recognition, not applause.',
    detail:
      'We start with positioning and end with a guideline document your team can actually run. Every mark, type choice and colour is tested at the sizes your customers really see — a sign above a door, a 40px avatar, a printed menu.',
    items: ['Brand Strategy', 'Logo Design', 'Brand Identity', 'Brand Guidelines'],
  },
  {
    num: '02',
    slug: 'marketing',
    title: 'Marketing',
    pitch: 'Campaigns meant to fill rooms and book tables.',
    detail:
      'Organic and paid run as one plan. We build the calendar, produce the assets, brief the creators, and hold the whole thing to booking numbers rather than impressions.',
    items: ['Social Media Marketing', 'Influencer Campaigns', 'Paid Advertising', 'Launch Campaigns'],
  },
  {
    num: '03',
    slug: 'content',
    title: 'Content',
    pitch: 'Photo, video and editorial work that stops the scroll.',
    detail:
      'Our studio shoots in-house, which means a full content library in one production day instead of six weeks of back-and-forth with three vendors.',
    items: ['Professional Photography', 'Video Production', 'Reels & Short-Form', 'Commercial Production'],
  },
  {
    num: '04',
    slug: 'websites',
    title: 'Websites',
    pitch: 'Conversion-engineered digital experiences built to perform.',
    detail:
      'Fast, accessible, edge-deployed sites with the reservation, ordering and CRM plumbing wired in — not bolted on after launch.',
    items: ['Custom Web Design', 'E-Commerce', 'Membership Portals', 'Reservation Systems'],
  },
  {
    num: '05',
    slug: 'apps',
    title: 'Apps',
    pitch: 'Mobile-first products your regulars actually open.',
    detail:
      'Loyalty, ordering and members-only experiences designed around one repeat behaviour, shipped to both stores and instrumented from day one.',
    items: ['App Design', 'Mobile Development', 'CRM Integrations'],
  },
  {
    num: '06',
    slug: 'paid-ads',
    title: 'Paid Ads',
    pitch: 'Performance media with margins you can trace.',
    detail:
      'Creative-led buying. We build the offer, produce a dozen variants, and kill what loses inside the first 72 hours.',
    items: ['Meta Advertising', 'Google Ads', 'TikTok Ads'],
  },
  {
    num: '07',
    slug: 'campaigns',
    title: 'Campaigns',
    pitch: 'Events and activations that create culture.',
    detail:
      'From soft-opening guest lists to multi-city brand activations — concepted, produced and documented by the same team.',
    items: ['Event Marketing', 'Launch Campaigns', 'Brand Activations'],
  },
  {
    num: '08',
    slug: 'memberships',
    title: 'Memberships',
    pitch: 'Loyalty systems that deepen the relationship.',
    detail:
      'Tiered membership, VIP access and recurring revenue — the platform, the perks architecture and the launch that fills it.',
    items: ['Membership Platforms', 'Loyalty Programs', 'VIP Communities'],
  },
]

export const industries = [
  {
    slug: 'hospitality',
    label: 'Restaurants, Nightlife & Hospitality',
    short: 'Hospitality',
    image: '/img/hospitality.png',
    lede: 'We know what it takes to fill rooms and keep them full.',
    body:
      'A restaurant is judged before anyone tastes anything. We build the identity, the photography and the reservation funnel as one piece of work, then keep the calendar loud all year — not just on opening week.',
    tags: [
      'Fine Dining Restaurants',
      'Bars & Cocktail Lounges',
      'Private Clubs',
      'Event Venues',
      'Hotel & Hospitality',
      'Ghost Kitchens',
    ],
    proof: 'Trinità went from a 3-week soft open to a 6-week reservation book.',
  },
  {
    slug: 'wellness',
    label: 'Wellness, Medical & Beauty',
    short: 'Wellness & Medical',
    image: '/img/wellness.png',
    lede: 'Trust is earned long before the appointment is booked.',
    body:
      'Clinical credibility and premium pricing come from the same place: how considered everything looks. We build the authority — provider photography, treatment storytelling, review engines — so the consult starts warm.',
    tags: [
      'Med Spas',
      'Medical Practices',
      'Dental Practices',
      'Health Brands',
      'Fitness Studios',
      'Beauty Brands',
    ],
    proof: 'Élan-V booked 148 consults in the first 60 days after relaunch.',
  },
]

export const processSteps = [
  {
    num: '01',
    title: 'Discovery',
    summary: 'We learn the business before we touch a pixel.',
    body:
      'Strategy sessions with the owners, a market and competitor audit, and a hard look at what your current presence is actually earning you. Nothing is designed until this is written down.',
    deliverables: ['Stakeholder sessions', 'Market research', 'Brand & channel audit'],
  },
  {
    num: '02',
    title: 'Strategy',
    summary: 'A roadmap specific to your category, not a template.',
    body:
      'Positioning, messaging architecture, channel mix, content direction and the growth targets we will be judged against.',
    deliverables: ['Positioning platform', 'Messaging architecture', 'Channel & growth plan'],
  },
  {
    num: '03',
    title: 'Creation',
    summary: 'Everything gets built in-house, in one place.',
    body:
      'Identity, website, photography, video, campaign assets — produced by one team so the whole system speaks with a single voice.',
    deliverables: ['Identity system', 'Website or app', 'Full content library'],
  },
  {
    num: '04',
    title: 'Launch',
    summary: 'Every channel moves on the same day.',
    body:
      'Organic, paid, creator activations and press fire together. Momentum is a function of density — a staggered launch leaks it.',
    deliverables: ['Multi-channel rollout', 'Creator activations', 'Press & PR push'],
  },
  {
    num: '05',
    title: 'Growth',
    summary: 'We stay, measure, and keep tightening it.',
    body:
      'Monthly reporting against the targets set in strategy, continuous content, and quarterly refinement of the offer and the media mix.',
    deliverables: ['Monthly reporting', 'Ongoing content', 'Quarterly strategy review'],
  },
]

export const difference = [
  { them: 'Make posts', us: 'Build audiences', note: 'Community, loyalty and organic reach' },
  { them: 'Execute tasks', us: 'Create systems', note: 'Repeatable growth infrastructure' },
  { them: 'Chase trends', us: 'Set the standard', note: 'Brands that define their category' },
  { them: 'Report vanity metrics', us: 'Drive real revenue', note: 'Bookings, clients and growth' },
  { them: 'Disappear after launch', us: 'Stay and scale', note: 'Long-term partners, not vendors' },
]

export const studioCapabilities = [
  'Photography',
  'Videography',
  'Reels & Short-Form',
  'Commercial Production',
  'Drone Footage',
  'Food Photography',
  'Brand Shoots',
  'Behind-the-Scenes',
]

export const studioGallery = [
  { src: '/img/studio-food.png', label: 'Beverage', caption: 'Smoked old fashioned — Nocturne Lounge' },
  { src: '/img/studio-portrait.png', label: 'Portrait', caption: 'Owner portrait — Trinità' },
  { src: '/img/studio-nightlife.png', label: 'Nightlife', caption: 'Saturday service — Halstead Social Club' },
  { src: '/img/studio-detail.png', label: 'Print', caption: 'Debossed collateral — Maison Ottava' },
  { src: '/img/hospitality.png', label: 'Food', caption: 'Hand-rolled cavatelli — Pasta Via' },
  { src: '/img/wellness.png', label: 'Wellness', caption: 'Treatment suite — Élan-V Medspa' },
]

export const digitalProducts = [
  { glyph: '⬡', title: 'Custom Websites', body: 'Bespoke design, engineered to convert.' },
  { glyph: '◈', title: 'E-Commerce', body: 'Storefronts that survive a sold-out drop.' },
  { glyph: '✦', title: 'Membership Portals', body: 'Gated content and VIP tiers.' },
  { glyph: '▲', title: 'Reservation Systems', body: 'Booking flows that fill the calendar.' },
  { glyph: '◎', title: 'Mobile Apps', body: 'iOS and Android, shipped and instrumented.' },
  { glyph: '⬟', title: 'CRM Integrations', body: 'One connected stack, no duplicate data.' },
]

export type CaseStudy = {
  slug: string
  client: string
  category: string
  year: string
  image: string
  headline: string
  summary: string
  scope: string[]
  results: { value: string; label: string }[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'trinita',
    client: 'Trinità',
    category: 'Fine Dining — Chicago',
    year: '2025',
    image: '/img/studio-portrait.png',
    headline: 'A 6-week book before the second service.',
    summary:
      'A chef-driven Italian room with no name recognition and a lease clock running. We built the identity, shot the full menu in a single production day, and ran a 5-week pre-open campaign against a reservation waitlist.',
    scope: ['Brand Identity', 'Menu & Print', 'Photography', 'Website & Reservations', 'Launch Campaign'],
    results: [
      { value: '+312%', label: 'Reservation requests' },
      { value: '41 days', label: 'Booked out at open' },
      { value: '2.8M', label: 'Organic views, 90 days' },
    ],
  },
  {
    slug: 'elan-v',
    client: 'Élan-V Medspa',
    category: 'Med Spa — Nationwide',
    year: '2025',
    image: '/img/wellness.png',
    headline: 'Premium pricing, defended by the brand.',
    summary:
      'Élan-V was competing on discounts in a crowded market. We rebuilt the brand around clinical authority, produced provider-led content, and moved acquisition from coupon traffic to consult bookings.',
    scope: ['Brand Strategy', 'Identity Refresh', 'Provider Content', 'Paid Ads', 'Website'],
    results: [
      { value: '148', label: 'Consults in 60 days' },
      { value: '−37%', label: 'Cost per booked consult' },
      { value: '+22%', label: 'Average treatment value' },
    ],
  },
  {
    slug: 'halstead-social-club',
    client: 'Halstead Social Club',
    category: 'Nightlife & Membership — Chicago',
    year: '2024',
    image: '/img/studio-nightlife.png',
    headline: 'A dormant venue turned membership engine.',
    summary:
      'A well-located room with a dead Instagram and no repeat business. We launched a tiered membership, built the portal that runs it, and gave the door a reason to have a list.',
    scope: ['Membership Platform', 'Identity', 'Content Studio Retainer', 'Campaigns'],
    results: [
      { value: '1,940', label: 'Founding members' },
      { value: '$61k', label: 'Recurring monthly dues' },
      { value: '4.1×', label: 'Weeknight covers' },
    ],
  },
  {
    slug: 'pasta-via',
    client: 'Pasta Via',
    category: 'Fast Casual — 4 Locations',
    year: '2024',
    image: '/img/hospitality.png',
    headline: 'One brand system across four rooms.',
    summary:
      'Four locations that looked like four businesses. We unified the identity, built an ordering site that actually holds up at the lunch peak, and documented it all so their team can open the fifth without us.',
    scope: ['Brand Guidelines', 'E-Commerce & Ordering', 'Photography', 'Store Rollout Kit'],
    results: [
      { value: '+58%', label: 'Direct online orders' },
      { value: '−19%', label: 'Third-party delivery share' },
      { value: '4', label: 'Locations unified' },
    ],
  },
  {
    slug: 'wren-and-bell',
    client: 'Wren & Bell Dental',
    category: 'Dental Practice — Chicago',
    year: '2025',
    image: '/img/studio-detail.png',
    headline: 'A practice that stopped looking like a clinic.',
    summary:
      'A two-chair practice competing with corporate groups on ad spend it could never match. We made the brand the differentiator and put the founders on camera.',
    scope: ['Identity', 'Photography & Video', 'Website', 'Local Paid Search'],
    results: [
      { value: '+71', label: 'New patients / month' },
      { value: '18 days', label: 'Average booking lead time' },
      { value: '4.9★', label: 'Review average, 260 reviews' },
    ],
  },
  {
    slug: 'maison-ottava',
    client: 'Maison Ottava',
    category: 'Luxury Retail — Nationwide',
    year: '2023',
    image: '/img/studio-food.png',
    headline: 'Built from nothing but a name.',
    summary:
      'No logo, no product photography, no site. We built the whole ecosystem in eleven weeks and launched into a sold-out first drop.',
    scope: ['Brand Identity', 'Packaging', 'E-Commerce', 'Launch Campaign', 'Creator Seeding'],
    results: [
      { value: '11 wks', label: 'Concept to launch' },
      { value: 'Sold out', label: 'First drop, 9 hours' },
      { value: '18.7k', label: 'Launch-week subscribers' },
    ],
  },
]

export type Package = {
  slug: string
  name: string
  positioning: string
  /** Full engagement value, for reference on the card. */
  price: number
  /** Amount charged by the PayPal button to reserve the start date. */
  deposit: number
  cadence: string
  featured?: boolean
  includes: string[]
  timeline: string
  bestFor: string
}

export const packages: Package[] = [
  {
    slug: 'foundation',
    name: 'Foundation',
    positioning: 'The identity system, done properly, once.',
    price: 6400,
    deposit: 1600,
    cadence: 'one-time project',
    timeline: '4–5 weeks',
    bestFor: 'Pre-opening concepts and rebrands that need a credible mark first.',
    includes: [
      'Positioning & messaging platform',
      'Primary logo, secondary marks & monogram',
      'Type, colour and layout system',
      'Brand guideline document',
      'Print collateral: menu, card, signage art',
      'One half-day brand photo shoot',
    ],
  },
  {
    slug: 'ecosystem',
    name: 'Ecosystem',
    positioning: 'Identity, website and a launch that lands.',
    price: 14800,
    deposit: 3700,
    cadence: 'one-time project',
    timeline: '8–10 weeks',
    featured: true,
    bestFor: 'Openings and relaunches that need everything live on the same day.',
    includes: [
      'Everything in Foundation',
      'Custom website with reservations or ordering',
      'Full-day photo and video production',
      '60-asset content library',
      'Multi-channel launch campaign',
      'Paid media build-out & first 30 days managed',
      'Team handover and training session',
    ],
  },
  {
    slug: 'growth-retainer',
    name: 'Growth Retainer',
    positioning: 'We stay on, month after month.',
    price: 4900,
    deposit: 4900,
    cadence: 'per month',
    timeline: 'rolling, 3-month minimum',
    bestFor: 'Brands already launched that need the calendar kept loud.',
    includes: [
      'Monthly production day (photo + video)',
      '16 finished posts & 8 short-form edits',
      'Paid media management up to $20k spend',
      'Creator sourcing and briefing',
      'Community and inbox management',
      'Monthly performance report & strategy call',
    ],
  },
  {
    slug: 'studio-day',
    name: 'Studio Day',
    positioning: 'One production day. A quarter of content.',
    price: 2400,
    deposit: 2400,
    cadence: 'per production day',
    timeline: 'booked 2+ weeks out',
    bestFor: 'Teams with a brand already in place and an empty content shelf.',
    includes: [
      'Pre-production shot list & styling direction',
      'Up to 8 hours on location',
      'Photographer, videographer and stylist',
      '40 retouched stills',
      '6 vertical short-form edits',
      'Licensed for paid media use',
    ],
  },
]

export const testimonials = [
  {
    quote:
      'Bicrisale gave us an identity people recognised before they had eaten anything. Our bookings doubled inside the first quarter.',
    name: 'Marco Reyes-Ferrante',
    role: 'Owner, Trinità',
    initial: 'M',
  },
  {
    quote:
      'Three agencies told us what to post. Bicrisale rebuilt what we were. The content converts because the positioning finally makes sense.',
    name: 'Dr. Priya Raghunathan',
    role: 'Medical Director, Élan-V Medspa',
    initial: 'P',
  },
  {
    quote:
      'Our Saturday was fine. Our Tuesday was empty. The membership they built is the reason Tuesday pays for itself now.',
    name: 'Desmond Achebe',
    role: 'Partner, Halstead Social Club',
    initial: 'D',
  },
  {
    quote:
      'They built the entire brand from a name in a text message — logo, packaging, site, launch. It reads as one thing, which is rare.',
    name: 'Ilse Van Doren',
    role: 'Founder, Maison Ottava',
    initial: 'I',
  },
  {
    quote:
      'The photography changed how patients see us before they walk in. New patient volume is the highest it has been in nine years.',
    name: 'Dr. Aubrey Lindqvist',
    role: 'Practice Owner, Wren & Bell Dental',
    initial: 'A',
  },
]

export const team = [
  {
    name: 'Sabine Okonkwo-Reyes',
    role: 'Founder & Creative Director',
    bio: 'Fifteen years across hospitality branding and editorial art direction. Runs positioning and identity, and still art-directs every shoot.',
  },
  {
    name: 'Annika Weiss',
    role: 'Partner, Growth',
    bio: 'Built media programmes for restaurant groups and multi-location wellness brands. Owns paid, reporting and the numbers we promise.',
  },
  {
    name: 'Teodor Balcescu',
    role: 'Director of Production',
    bio: 'Commercial photographer and DP. Turns a shot list into a quarter of content inside one production day.',
  },
  {
    name: 'June Hasegawa',
    role: 'Lead Engineer',
    bio: 'Builds the websites, portals and apps. Cares unreasonably about load time and booking-flow drop-off.',
  },
]

export const faqs = [
  {
    q: 'How do the packages and the deposit work?',
    a: 'Every package card shows the full engagement value and the deposit that reserves your start date. The deposit is paid through PayPal and credited in full against your first invoice. The balance is split across milestones — never all up front.',
  },
  {
    q: 'Do you work outside Chicago?',
    a: 'Roughly half our work is nationwide. Strategy and build run remotely; production days are travelled for, with travel quoted separately and at cost.',
  },
  {
    q: 'Can we start with one service instead of a package?',
    a: 'Yes. Packages exist because they are the combinations that work, but a single Studio Day or a standalone website is a normal way to start. Tell us the constraint in the inquiry form.',
  },
  {
    q: 'Who owns the work?',
    a: 'You do. Final files, source artwork and full licences transfer to you on final payment, including paid-media rights for everything we shoot.',
  },
  {
    q: 'How many brands do you take on at once?',
    a: 'Six active builds. It is the ceiling that lets the founders stay on every project, and it means start dates are genuinely limited rather than theatrically limited.',
  },
]

export const budgetOptions = [
  'Under $5,000',
  '$5,000 – $15,000',
  '$15,000 – $40,000',
  '$40,000+',
  'Not sure yet',
]

export const timelineOptions = [
  'Yesterday',
  'Within 30 days',
  '1–3 months out',
  'Exploring for later',
]

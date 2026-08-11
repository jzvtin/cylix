/**
 * Partner-program tier configuration and money helpers.
 *
 * This file is intentionally free of `server-only` so it can be imported by both
 * server components (the marketing landing) and client components (the
 * dashboard, share widgets). The commission percentages and thresholds here are
 * ILLUSTRATIVE defaults for the marketing page — the live rate applied to a
 * given partner is stored on their record and echoed back by the stats API.
 */

export type AffiliateTier = {
  id: string
  /** Ordinal shown in the numbered card. */
  index: string
  name: string
  /** Commission the partner earns, as a percentage of referred order value. */
  rate: number
  /** Discount the partner's code gives the customer, as a percentage. */
  customerDiscount: number
  /** Human-readable qualification threshold. */
  threshold: string
  blurb: string
  perks: string[]
  featured?: boolean
}

export const AFFILIATE_TIERS: AffiliateTier[] = [
  {
    id: "standard",
    index: "01",
    name: "Standard",
    rate: 10,
    customerDiscount: 10,
    threshold: "Everyone starts here",
    blurb:
      "Your partner code is live from day one. Earn on every qualified referral, no minimums.",
    perks: [
      "10% commission on referred orders",
      "10% welcome discount for your audience",
      "Real-time dashboard & payout tracking",
    ],
  },
  {
    id: "pro",
    index: "02",
    name: "Pro",
    rate: 15,
    customerDiscount: 12,
    threshold: "10+ referred orders / mo",
    blurb:
      "Consistent referrers move up automatically. Higher commission, priority support, early drops.",
    perks: [
      "15% commission on referred orders",
      "12% discount for your audience",
      "Priority partner support",
    ],
    featured: true,
  },
  {
    id: "elite",
    index: "03",
    name: "Elite",
    rate: 20,
    customerDiscount: 15,
    threshold: "By invitation",
    blurb:
      "Our top research partners. Custom terms, co-marketing, and the best rate we offer.",
    perks: [
      "20% commission on referred orders",
      "15% discount for your audience",
      "Dedicated manager & custom payouts",
    ],
  },
]

export const DEFAULT_TIER_ID = "standard"

export function tierById(id: string): AffiliateTier {
  return AFFILIATE_TIERS.find((t) => t.id === id) ?? AFFILIATE_TIERS[0]
}

/** Commission rate (percent) for a tier id, defaulting to the Standard rate. */
export function commissionRate(tierId: string): number {
  return tierById(tierId).rate
}

/** Medusa v2 stores order totals in major currency units (e.g. 49.99). */
export function formatMoney(amount: number, currency = "usd"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount || 0)
  } catch {
    return `$${(amount || 0).toFixed(2)}`
  }
}

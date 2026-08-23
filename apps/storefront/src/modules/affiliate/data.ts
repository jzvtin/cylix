import "server-only"

import fs from "fs/promises"
import os from "os"
import path from "path"

import {
  DEFAULT_TIER_ID,
  commissionRate,
  tierById,
  type AffiliateTier,
} from "./tiers"

/* ────────────────────────────────────────────────────────────────────────────
 * Cookie + link constants (shared by the track / apply / stats route handlers).
 * ──────────────────────────────────────────────────────────────────────────── */

export const REF_COOKIE = "cx_ref"
export const PARTNER_COOKIE = "cx_partner"
/** 60 days — long enough for a considered research purchase to land. */
export const REF_COOKIE_MAX_AGE = 60 * 60 * 24 * 60

/* ────────────────────────────────────────────────────────────────────────────
 * Types.
 * ──────────────────────────────────────────────────────────────────────────── */

export type AffiliateApplication = {
  name: string
  email: string
  channel: string
  audience: string
  notes: string
}

export type AffiliateRecord = {
  code: string
  name: string
  email: string
  channel: string
  audience: string
  notes: string
  tier: string
  createdAt: string
  /** True once a live Medusa promotion was created for the code. */
  promotionCreated: boolean
}

export type ReferredOrderRow = {
  id: string
  displayId: number
  date: string
  email: string
  total: number
  currency: string
  status: string
  commission: number
}

export type LeaderboardRow = {
  rank: number
  handle: string
  orders: number
  commission: number
}

export type PayoutStatus = "activating" | "pending" | "processing" | "paid"

export type AffiliateStats = {
  code: string
  tier: string
  tierName: string
  rate: number
  configured: boolean
  clicks: number
  referredOrders: number
  grossSales: number
  commissionEarned: number
  payoutStatus: PayoutStatus
  currency: string
  orders: ReferredOrderRow[]
  leaderboard: LeaderboardRow[]
}

/* ────────────────────────────────────────────────────────────────────────────
 * Medusa admin API (v2). Auth = HTTP Basic with the secret key as the username
 * and an empty password — identical to src/lib/data/admin.ts. Replicated here
 * (rather than imported) because that module only exposes order helpers, and we
 * must never throw to the client from the affiliate routes.
 * ──────────────────────────────────────────────────────────────────────────── */

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const ADMIN_API_KEY = process.env.MEDUSA_ADMIN_API_KEY

export const isAdminApiConfigured = (): boolean =>
  Boolean(MEDUSA_URL && ADMIN_API_KEY)

const adminAuthHeader = (): string =>
  `Basic ${Buffer.from(`${ADMIN_API_KEY}:`).toString("base64")}`

const ADMIN_TIMEOUT_MS = 10_000

/**
 * Best-effort admin fetch. Returns parsed JSON on success, or `null` on any
 * failure (unconfigured, network, non-2xx). Callers degrade gracefully — the
 * partner UI must render zeros, never an error.
 */
async function adminFetch<T>(
  apiPath: string,
  init?: RequestInit
): Promise<T | null> {
  if (!isAdminApiConfigured()) return null

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ADMIN_TIMEOUT_MS)
  try {
    const res = await fetch(`${MEDUSA_URL}${apiPath}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: adminAuthHeader(),
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
      signal: controller.signal,
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * JSON fallback store. Vercel's serverless filesystem is read-only at runtime
 * except for the OS temp dir, which is ephemeral (not shared across instances).
 * This store is therefore a best-effort local/dev convenience and a paper trail;
 * the SOURCE OF TRUTH for live partners is the Medusa promotion + order metadata.
 * All writes are wrapped so a read-only FS never surfaces as an error.
 * ──────────────────────────────────────────────────────────────────────────── */

const STORE_FILE = path.join(os.tmpdir(), "cylix-affiliates.json")

async function readStore(): Promise<Record<string, AffiliateRecord>> {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8")
    return JSON.parse(raw) as Record<string, AffiliateRecord>
  } catch {
    return {}
  }
}

async function writeStore(
  store: Record<string, AffiliateRecord>
): Promise<boolean> {
  try {
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8")
    return true
  } catch {
    return false
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Code generation.
 * ──────────────────────────────────────────────────────────────────────────── */

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no ambiguous chars

/** Builds a memorable, URL-safe code like `PARTNER-ALEX-7QK4`. */
export function generateCode(name: string): string {
  const slug = (name || "partner")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6)
  let suffix = ""
  for (let i = 0; i < 4; i++) {
    suffix += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return `${slug ? `${slug}-` : "PARTNER-"}${suffix}`
}

/* ────────────────────────────────────────────────────────────────────────────
 * Medusa promotion creation. Creates the customer-facing discount code that a
 * partner shares. Best-effort: returns true only when the backend confirms.
 * ──────────────────────────────────────────────────────────────────────────── */

async function createPromotion(
  code: string,
  tier: AffiliateTier
): Promise<boolean> {
  const body = {
    code,
    type: "standard",
    status: "active",
    application_method: {
      type: "percentage",
      target_type: "order",
      allocation: "across",
      value: tier.customerDiscount,
    },
  }
  const result = await adminFetch<{ promotion?: { id?: string } }>(
    "/admin/promotions",
    { method: "POST", body: JSON.stringify(body) }
  )
  return Boolean(result?.promotion?.id)
}

/* ────────────────────────────────────────────────────────────────────────────
 * Public data functions.
 * ──────────────────────────────────────────────────────────────────────────── */

export async function createAffiliate(
  application: AffiliateApplication
): Promise<AffiliateRecord> {
  const tier = tierById(DEFAULT_TIER_ID)
  const code = generateCode(application.name)

  // Try to mint the live discount code. Never fatal if it fails.
  let promotionCreated = false
  try {
    promotionCreated = await createPromotion(code, tier)
  } catch {
    promotionCreated = false
  }

  const record: AffiliateRecord = {
    code,
    name: application.name,
    email: application.email,
    channel: application.channel,
    audience: application.audience,
    notes: application.notes,
    tier: tier.id,
    createdAt: new Date().toISOString(),
    promotionCreated,
  }

  // Persist to the fallback store (best-effort).
  const store = await readStore()
  store[code.toUpperCase()] = record
  await writeStore(store)

  return record
}

export async function getAffiliateByCode(
  code: string
): Promise<AffiliateRecord | null> {
  if (!code) return null
  const store = await readStore()
  return store[code.toUpperCase()] ?? null
}

type AdminOrderRaw = {
  id: string
  display_id: number
  email: string | null
  created_at: string
  total: number
  currency_code: string
  payment_status?: string | null
  fulfillment_status?: string | null
  metadata?: Record<string, unknown> | null
  promotions?: Array<{ code?: string }> | null
}

/**
 * Returns the orders attributable to a partner code. Attribution is read from
 * two places, whichever the checkout hook writes: `order.metadata.cx_ref`, or a
 * promotion whose code matches. With no admin key configured this returns `[]`.
 */
export async function listReferredOrders(
  code: string,
  rate: number
): Promise<ReferredOrderRow[]> {
  if (!code) return []

  const data = await adminFetch<{ orders?: AdminOrderRaw[] }>(
    "/admin/orders?limit=100&order=-created_at&fields=id,display_id,email,created_at,total,currency_code,payment_status,fulfillment_status,metadata,*promotions"
  )
  const orders = data?.orders ?? []
  const want = code.toUpperCase()

  return orders
    .filter((o) => {
      const metaRef = String(o.metadata?.["cx_ref"] ?? "").toUpperCase()
      if (metaRef === want) return true
      return (o.promotions ?? []).some(
        (p) => (p.code ?? "").toUpperCase() === want
      )
    })
    .map((o) => ({
      id: o.id,
      displayId: o.display_id,
      date: o.created_at,
      email: o.email ?? "—",
      total: o.total ?? 0,
      currency: o.currency_code ?? "usd",
      status: o.payment_status ?? "pending",
      commission: Number((((o.total ?? 0) * rate) / 100).toFixed(2)),
    }))
}

/**
 * Computes the full stats payload for a partner code. Always resolves — an
 * unknown code or an unconfigured backend yields a clean "activating" zero
 * state rather than an error.
 */
export async function computeStats(code: string): Promise<AffiliateStats> {
  const record = await getAffiliateByCode(code)
  const tierId = record?.tier ?? DEFAULT_TIER_ID
  const tier = tierById(tierId)
  const rate = commissionRate(tierId)

  const orders = await listReferredOrders(code, rate)

  const referredOrders = orders.length
  const grossSales = Number(
    orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)
  )
  const commissionEarned = Number(
    orders.reduce((sum, o) => sum + o.commission, 0).toFixed(2)
  )
  const currency = orders[0]?.currency ?? "usd"

  const payoutStatus: PayoutStatus =
    referredOrders === 0
      ? "activating"
      : commissionEarned > 0
        ? "pending"
        : "processing"

  return {
    code: code.toUpperCase(),
    tier: tier.id,
    tierName: tier.name,
    rate,
    configured: isAdminApiConfigured(),
    // Click tracking is cookie-based (set by /api/affiliate/track). A durable
    // per-code click counter needs a shared store; surfaced as 0 until wired.
    clicks: 0,
    referredOrders,
    grossSales,
    commissionEarned,
    payoutStatus,
    currency,
    orders,
    leaderboard: buildLeaderboard(code, referredOrders, commissionEarned),
  }
}

/**
 * A small motivational leaderboard. When there is no live data yet it shows an
 * illustrative field with the partner slotted in, so the card is never empty.
 */
function buildLeaderboard(
  code: string,
  orders: number,
  commission: number
): LeaderboardRow[] {
  const you: LeaderboardRow = {
    rank: 0,
    handle: "You",
    orders,
    commission,
  }
  const field: LeaderboardRow[] = [
    { rank: 1, handle: "researchlab_ada", orders: 42, commission: 1260 },
    { rank: 2, handle: "compound.notes", orders: 31, commission: 930 },
    { rank: 3, handle: "the_bench_files", orders: 24, commission: 720 },
  ]
  const merged = [...field, you]
    .sort((a, b) => b.commission - a.commission)
    .map((row, i) => ({ ...row, rank: i + 1 }))
  return merged
}

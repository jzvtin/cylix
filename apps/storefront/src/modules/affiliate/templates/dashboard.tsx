"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import CopyLink from "@modules/affiliate/components/copy-link"
import ShareRow from "@modules/affiliate/components/share-row"
import { formatMoney } from "@modules/affiliate/tiers"

/* Mirror of the server AffiliateStats type (data.ts is server-only). */
type PayoutStatus = "activating" | "pending" | "processing" | "paid"

type ReferredOrderRow = {
  id: string
  displayId: number
  date: string
  email: string
  total: number
  currency: string
  status: string
  commission: number
}

type LeaderboardRow = {
  rank: number
  handle: string
  orders: number
  commission: number
}

type AffiliateStats = {
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

const PAYOUT_LABEL: Record<PayoutStatus, string> = {
  activating: "Activating",
  pending: "Pending",
  processing: "Processing",
  paid: "Paid",
}

export default function AffiliateDashboard() {
  const params = useSearchParams()
  const codeParam = params.get("code")?.trim() ?? ""

  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    const qs = codeParam ? `?code=${encodeURIComponent(codeParam)}` : ""
    fetch(`/api/affiliate/stats${qs}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: AffiliateStats) => {
        if (active) setStats(data)
      })
      .catch(() => {
        // Stats route never errors, but guard anyway with a zero state.
        if (active)
          setStats({
            code: codeParam.toUpperCase(),
            tier: "standard",
            tierName: "Standard",
            rate: 10,
            configured: false,
            clicks: 0,
            referredOrders: 0,
            grossSales: 0,
            commissionEarned: 0,
            payoutStatus: "activating",
            currency: "usd",
            orders: [],
            leaderboard: [],
          })
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [codeParam])

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (typeof window !== "undefined" ? window.location.origin : "")

  const referralLink = useMemo(() => {
    if (!stats?.code) return ""
    return `${baseUrl}/api/affiliate/track?ref=${stats.code}`
  }, [baseUrl, stats?.code])

  const hasData = Boolean(stats && stats.referredOrders > 0)
  const isActivating = !hasData

  return (
    <div className="mx-auto max-w-[1120px] px-[clamp(18px,5vw,32px)] py-[clamp(32px,6vw,64px)]">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="cx-eyebrow">Partner Dashboard</span>
          <h1 className="cx-h mt-4 text-[clamp(30px,5vw,52px)]">
            Your <em>earnings.</em>
          </h1>
          <p className="mt-3 text-[15px] text-ink/55">
            {stats?.code
              ? `Signed in as ${stats.code} · ${stats?.tierName ?? "Standard"} tier · ${stats?.rate ?? 10}% commission`
              : "Your live referral performance, in real time."}
          </p>
        </div>
        <LocalizedClientLink href="/affiliate">
          <span className="cx-btn cx-btn-ghost">← Program</span>
        </LocalizedClientLink>
      </div>

      {/* No-code prompt */}
      {!loading && !stats?.code && (
        <div className="cx-glass mt-8 rounded-[20px] p-6 text-[14px] leading-relaxed text-ink/60">
          You don&apos;t have a partner code loaded yet.{" "}
          <LocalizedClientLink
            href="/affiliate/join"
            className="font-bold text-gold-700 underline underline-offset-2"
          >
            Apply to become a partner
          </LocalizedClientLink>{" "}
          — your dashboard activates the moment your code is issued.
        </div>
      )}

      {/* Link + share */}
      {stats?.code && (
        <div className="cx-glass mt-8 rounded-[22px] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="flex flex-col gap-5">
              <CopyLink label="Your partner code" value={stats.code} compact />
              <CopyLink label="Your referral link" value={referralLink} />
            </div>
            <div>
              <div className="mb-2 font-display text-[11px] font-extrabold uppercase tracking-[1.4px] text-ink/45">
                Share it
              </div>
              <ShareRow url={referralLink} />
            </div>
          </div>
        </div>
      )}

      {/* Stat row — heavy gold numerals */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Clicks"
          value={loading ? "—" : String(stats?.clicks ?? 0)}
          hint="link visits"
        />
        <StatTile
          label="Referred orders"
          value={loading ? "—" : String(stats?.referredOrders ?? 0)}
          hint="all time"
        />
        <StatTile
          label="Commission earned"
          value={
            loading
              ? "—"
              : formatMoney(stats?.commissionEarned ?? 0, stats?.currency)
          }
          hint="qualified orders"
        />
        <StatTile
          label="Payout status"
          value={
            loading ? "—" : PAYOUT_LABEL[stats?.payoutStatus ?? "activating"]
          }
          hint={hasData ? "current cycle" : "no orders yet"}
          small
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* Orders / earnings table */}
        <div className="cx-glass rounded-[22px] p-6 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-[clamp(17px,2.2vw,22px)] font-black tracking-[-0.5px] text-ink">
              Referred orders
            </h2>
            {stats?.rate ? (
              <span className="rounded-full bg-gold-50 px-3 py-1 font-display text-[11px] font-bold text-gold-700 ring-1 ring-gold-500/25">
                {stats.rate}% rate
              </span>
            ) : null}
          </div>

          {isActivating ? (
            <ActivatingState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink/10 text-[11px] font-extrabold uppercase tracking-[1px] text-ink/40">
                    <th className="py-2.5 pr-3 font-display">Order</th>
                    <th className="py-2.5 pr-3 font-display">Date</th>
                    <th className="py-2.5 pr-3 font-display">Status</th>
                    <th className="py-2.5 pr-3 text-right font-display">
                      Order total
                    </th>
                    <th className="py-2.5 text-right font-display">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.orders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-ink/6 text-[13.5px] text-ink/70"
                    >
                      <td className="py-3 pr-3 font-mono font-semibold text-ink">
                        #{o.displayId}
                      </td>
                      <td className="py-3 pr-3">
                        {new Date(o.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-3 capitalize">{o.status}</td>
                      <td className="py-3 pr-3 text-right">
                        {formatMoney(o.total, o.currency)}
                      </td>
                      <td className="py-3 text-right font-display font-bold text-gold-700">
                        {formatMoney(o.commission, o.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column: payout + leaderboard */}
        <div className="flex flex-col gap-6">
          <div className="cx-glass rounded-[22px] p-6 sm:p-7">
            <h2 className="font-display text-[clamp(16px,2vw,20px)] font-black tracking-[-0.5px] text-ink">
              Payout
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  hasData ? "bg-emerald-500" : "bg-ink/25"
                }`}
              />
              <span className="font-display text-[15px] font-bold text-ink">
                {PAYOUT_LABEL[stats?.payoutStatus ?? "activating"]}
              </span>
            </div>
            <div className="mt-4 rounded-[14px] border border-ink/8 bg-white/60 p-4">
              <div className="font-display text-[10px] font-extrabold uppercase tracking-[1.2px] text-ink/45">
                Balance
              </div>
              <div className="mt-1 font-display text-[clamp(26px,4vw,34px)] font-black tracking-[-1px] text-ink">
                {formatMoney(stats?.commissionEarned ?? 0, stats?.currency)}
              </div>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-ink/45">
              {hasData
                ? "Commission is paid on a regular cycle once orders clear their return window."
                : "Your balance grows automatically as referred orders land."}
            </p>
          </div>

          {stats?.leaderboard && stats.leaderboard.length > 0 && (
            <div className="cx-glass rounded-[22px] p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[clamp(16px,2vw,20px)] font-black tracking-[-0.5px] text-ink">
                  Leaderboard
                </h2>
                <span className="font-display text-[10px] font-extrabold uppercase tracking-[1.2px] text-ink/40">
                  This season
                </span>
              </div>
              <ul className="mt-4 flex flex-col gap-2">
                {stats.leaderboard.map((row) => {
                  const isYou = row.handle === "You"
                  return (
                    <li
                      key={`${row.rank}-${row.handle}`}
                      className={`flex items-center justify-between rounded-[12px] px-3 py-2.5 ${
                        isYou
                          ? "bg-gold-50 ring-1 ring-gold-500/30"
                          : "bg-white/50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`grid h-6 w-6 place-items-center rounded-full font-display text-[11px] font-black ${
                            row.rank === 1
                              ? "bg-gold-500 text-ink"
                              : "bg-ink/8 text-ink/60"
                          }`}
                        >
                          {row.rank}
                        </span>
                        <span
                          className={`font-display text-[13px] font-bold ${
                            isYou ? "text-gold-800" : "text-ink/75"
                          }`}
                        >
                          {row.handle}
                        </span>
                      </span>
                      <span className="font-display text-[13px] font-bold text-ink/60">
                        {formatMoney(row.commission, stats.currency)}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-3 text-[11px] leading-relaxed text-ink/40">
                Illustrative field until live partner data populates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatTile({
  label,
  value,
  hint,
  small,
}: {
  label: string
  value: string
  hint: string
  small?: boolean
}) {
  return (
    <div className="cx-glass rounded-[18px] p-5">
      <div className="font-display text-[10px] font-extrabold uppercase tracking-[1.2px] text-ink/45">
        {label}
      </div>
      <div
        className={`mt-1.5 font-display font-black tracking-[-1.2px] text-gold-500 ${
          small
            ? "text-[clamp(20px,2.6vw,26px)]"
            : "text-[clamp(28px,4vw,40px)]"
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-ink/45">{hint}</div>
    </div>
  )
}

function ActivatingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-ink/15 bg-white/40 px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-50 ring-1 ring-gold-500/30">
        <span className="h-3 w-3 rounded-full bg-gold-500" />
      </span>
      <h3 className="mt-4 font-display text-[clamp(17px,2.4vw,22px)] font-black tracking-[-0.5px] text-ink">
        Your dashboard activates once your first referral lands.
      </h3>
      <p className="mt-2 max-w-[380px] text-[13.5px] leading-[1.6] text-ink/55">
        Share your referral link to start tracking clicks, orders, and
        commission here in real time.
      </p>
    </div>
  )
}

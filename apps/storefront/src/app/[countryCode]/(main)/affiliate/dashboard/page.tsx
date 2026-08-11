import { Metadata } from "next"
import { Suspense } from "react"

import AffiliateDashboard from "@modules/affiliate/templates/dashboard"

export const metadata: Metadata = {
  title: "Partner Dashboard | Cylix Research",
  description:
    "Track your referral link, clicks, referred orders, commission, and payout status.",
}

/**
 * The dashboard reads `?code=` via useSearchParams, so it must sit behind a
 * Suspense boundary (App Router requirement). The fallback mirrors the header
 * so the page never flashes empty.
 */
export default function AffiliateDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1120px] px-[clamp(18px,5vw,32px)] py-[clamp(32px,6vw,64px)]">
          <span className="cx-eyebrow">Partner Dashboard</span>
          <h1 className="cx-h mt-4 text-[clamp(30px,5vw,52px)]">
            Your <em>earnings.</em>
          </h1>
          <p className="mt-3 text-[15px] text-ink/50">Loading your dashboard…</p>
        </div>
      }
    >
      <AffiliateDashboard />
    </Suspense>
  )
}

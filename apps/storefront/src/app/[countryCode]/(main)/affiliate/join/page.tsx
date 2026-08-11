import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import JoinForm from "@modules/affiliate/templates/join-form"

export const metadata: Metadata = {
  title: "Become a Partner | Cylix Research",
  description:
    "Apply to the Cylix Research partner program. Free to join, real-time tracking, and commission on every qualified referral.",
}

export default function AffiliateJoinPage() {
  return (
    <div className="mx-auto max-w-[900px] px-[clamp(18px,5vw,32px)] py-[clamp(36px,7vw,72px)]">
      <div className="mb-9">
        <LocalizedClientLink
          href="/affiliate"
          className="font-display text-[13px] font-bold text-ink/50 transition-colors hover:text-gold-700"
        >
          ← Partner program
        </LocalizedClientLink>
        <span className="cx-eyebrow mt-5 flex w-fit">Apply</span>
        <h1 className="cx-h mt-5 text-[clamp(32px,5.4vw,56px)]">
          Become a <em>partner.</em>
        </h1>
        <p className="mt-4 max-w-[560px] text-[clamp(15px,1.5vw,17px)] leading-[1.6] text-ink/55">
          Tell us a little about your audience. Most applications are reviewed
          quickly — approved partners get a live referral link and code right
          away.
        </p>
      </div>

      <JoinForm />
    </div>
  )
}

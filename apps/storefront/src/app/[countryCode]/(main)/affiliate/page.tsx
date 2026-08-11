import { Metadata } from "next"

import AffiliateLanding from "@modules/affiliate/templates/landing"

export const metadata: Metadata = {
  title: "Partner Program | Cylix Research",
  description:
    "Earn commission on every referral. Partner with Cylix Research — a brand backed by third-party Certificates of Analysis — and turn your audience into recurring income.",
}

export default function AffiliatePage() {
  return <AffiliateLanding />
}

import { Metadata } from "next"
import { Suspense } from "react"

import VerifyAccount from "@modules/account/components/verify-account"

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Verify your email address to complete your registration.",
}

export default function VerifyAccountPage() {
  return (
    <div className="flex w-full justify-center px-[clamp(16px,4vw,32px)] py-[clamp(28px,5vw,56px)]">
      <Suspense
        fallback={
          <p className="text-[15px] leading-relaxed text-ink/60">
            Verifying your email...
          </p>
        }
      >
        <VerifyAccount />
      </Suspense>
    </div>
  )
}

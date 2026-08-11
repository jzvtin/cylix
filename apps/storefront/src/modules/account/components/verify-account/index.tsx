"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { confirmEmailVerification } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"

type VerificationState = "verifying" | "success" | "error"

const VerifyAccount = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [state, setState] = useState<VerificationState>("verifying")
  // Guard against the effect running twice in React Strict Mode, which would
  // consume the single-use token before the customer sees the result.
  const confirmed = useRef(false)

  useEffect(() => {
    if (confirmed.current) {
      return
    }
    confirmed.current = true

    if (!token) {
      setState("error")
      return
    }

    confirmEmailVerification(token).then(({ success }) =>
      setState(success ? "success" : "error")
    )
  }, [token])

  return (
    <div
      className="max-w-md w-full cx-glass rounded-[28px] p-10 flex flex-col items-center text-center gap-y-4 my-12"
      data-testid="verify-account-page"
    >
      <span className="cx-eyebrow mb-2">Cylix Research</span>
      <h1 className="cx-h text-3xl">Email verification</h1>

      {state === "verifying" && (
        <div className="flex flex-col items-center gap-y-3 text-ink/60">
          <Spinner size={28} />
          <p>Verifying your email…</p>
        </div>
      )}

      {state === "success" && (
        <>
          <span className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
            ✓
          </span>
          <p className="text-ink/60">
            Your email is verified. You can now sign in to your account.
          </p>
          <LocalizedClientLink
            href="/account"
            className="cx-btn cx-btn-primary mt-2"
          >
            Go to sign in
          </LocalizedClientLink>
        </>
      )}

      {state === "error" && (
        <>
          <span className="h-14 w-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-2xl">
            !
          </span>
          <p className="text-ink/60">
            This verification link is invalid or has expired. Sign in to receive
            a new verification email.
          </p>
          <LocalizedClientLink
            href="/account"
            className="cx-btn cx-btn-ghost mt-2"
          >
            Go to sign in
          </LocalizedClientLink>
        </>
      )}
    </div>
  )
}

export default VerifyAccount

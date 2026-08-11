"use client"

import { useState } from "react"

import { promoCode } from "@lib/marketing-config"

type Status = "idle" | "loading" | "success" | "error"

/**
 * Compact inline newsletter signup for footer / section reuse.
 * Posts to /api/marketing/subscribe and shows an inline success/error state.
 * Self-contained and safe: works even when no ESP is configured (route returns
 * success with the promo code).
 */
export default function Newsletter({
  className = "",
  heading = "Join the list",
  subheading = "Lot drops, Certificates of Analysis, and a one-time welcome code.",
}: {
  className?: string
  heading?: string
  subheading?: string
}) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [code, setCode] = useState(promoCode)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === "loading") return
    setStatus("loading")
    try {
      const res = await fetch("/api/marketing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; code?: string }
        | null
      if (res.ok && data?.ok) {
        if (data.code) setCode(data.code)
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className={className} aria-live="polite">
        <p
          className="text-ink font-semibold"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          You&rsquo;re in. Use{" "}
          <span className="text-gold-500 font-extrabold">{code}</span> at
          checkout.
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {heading ? (
        <p
          className="text-ink font-bold mb-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {heading}
        </p>
      ) : null}
      {subheading ? (
        <p className="text-sm text-ink/60 mb-3">{subheading}</p>
      ) : null}
      <form onSubmit={onSubmit} className="flex gap-2 flex-wrap sm:flex-nowrap">
        <label htmlFor="cx-newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="cx-newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@lab.com"
          className="flex-1 min-w-0 rounded-full border border-ink/15 bg-white/80 px-4 py-3 text-sm text-ink outline-none focus:border-gold-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="cx-btn cx-btn-primary shrink-0 disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </form>
      {status === "error" ? (
        <p className="mt-2 text-sm text-red-600" aria-live="polite">
          Please enter a valid email and try again.
        </p>
      ) : null}
    </div>
  )
}

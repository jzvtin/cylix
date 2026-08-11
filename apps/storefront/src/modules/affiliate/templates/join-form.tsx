"use client"

import { useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import CopyLink from "@modules/affiliate/components/copy-link"

type ApplyResponse = {
  ok: boolean
  code?: string | null
  status?: string
  message?: string
  error?: string
}

const CHANNELS = [
  "Newsletter / Email list",
  "YouTube",
  "Instagram / TikTok",
  "X / Twitter",
  "Podcast",
  "Community / Forum",
  "Blog / Website",
  "Other",
]

const inputClass =
  "w-full rounded-[14px] border border-ink/12 bg-white/70 px-4 py-3 font-sans text-[15px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/25"
const labelClass =
  "mb-1.5 block font-display text-[12px] font-extrabold uppercase tracking-[1.2px] text-ink/55"

/** The partner application form. POSTs to /api/affiliate/apply. */
export default function JoinForm() {
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<ApplyResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const body = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      channel: String(form.get("channel") ?? ""),
      audience: String(form.get("audience") ?? ""),
      notes: String(form.get("notes") ?? ""),
    }

    try {
      const res = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = (await res.json()) as ApplyResponse
      if (!res.ok || !data.ok) {
        setError(
          data.error === "invalid_input"
            ? "Please enter your name and a valid email address."
            : "Something went wrong. Please try again."
        )
      } else {
        setResult(data)
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (result?.ok) {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (typeof window !== "undefined" ? window.location.origin : "")
    const link = result.code
      ? `${baseUrl}/api/affiliate/track?ref=${result.code}`
      : ""

    return (
      <div className="cx-glass rounded-[24px] p-8 sm:p-10">
        <span className="cx-eyebrow">
          {result.status === "active" ? "You're in" : "Received"}
        </span>
        <h2 className="cx-h mt-5 text-[clamp(26px,4vw,40px)]">
          {result.status === "active" ? (
            <>
              Welcome, <em>partner.</em>
            </>
          ) : (
            <>
              Application <em>received.</em>
            </>
          )}
        </h2>
        <p className="mt-4 max-w-[540px] text-[15px] leading-[1.65] text-ink/60">
          {result.message}
        </p>

        {result.code && (
          <div className="mt-8 flex flex-col gap-5">
            <CopyLink label="Your partner code" value={result.code} compact />
            <CopyLink label="Your referral link" value={link} />
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <LocalizedClientLink href="/affiliate/dashboard">
            <span className="cx-btn cx-btn-primary">Go to dashboard →</span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/affiliate">
            <span className="cx-btn cx-btn-ghost">Back to program</span>
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="cx-glass rounded-[24px] p-8 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="af-name" className={labelClass}>
            Full name
          </label>
          <input
            id="af-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Ada Lovelace"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="af-email" className={labelClass}>
            Email
          </label>
          <input
            id="af-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@lab.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="af-channel" className={labelClass}>
            Primary channel
          </label>
          <select
            id="af-channel"
            name="channel"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Select a channel
            </option>
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="af-audience" className={labelClass}>
            Audience size
          </label>
          <input
            id="af-audience"
            name="audience"
            placeholder="e.g. 12k newsletter subscribers"
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="af-notes" className={labelClass}>
          How will you promote Cylix Research?
        </label>
        <textarea
          id="af-notes"
          name="notes"
          rows={4}
          placeholder="Tell us about your audience and how you plan to share your link. (Optional)"
          className={`${inputClass} resize-y`}
        />
      </div>

      {error && (
        <p className="mt-5 rounded-[12px] border border-red-300/60 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="cx-btn cx-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit application"}
        </button>
        <p className="max-w-[320px] text-[12px] leading-relaxed text-ink/45">
          By applying you agree to represent all products as for in-vitro
          laboratory research use only.
        </p>
      </div>
    </form>
  )
}

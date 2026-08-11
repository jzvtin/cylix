"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { popup, promoCode } from "@lib/marketing-config"

type Status = "idle" | "loading" | "success" | "error"

/**
 * Premium email-capture modal on the cream / glass aesthetic.
 *
 * Triggers after ~12s OR on exit-intent (mouse leaves the top of the viewport),
 * whichever comes first. Shows only ONCE per visitor (localStorage gate). Fully
 * dismissible, ESC to close, aria-modal, and never blocks the page — it mounts
 * client-side only and renders nothing until triggered.
 *
 * On submit it POSTs to /api/marketing/subscribe and shows a success state with
 * the welcome code.
 */
export default function EmailPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [code, setCode] = useState(promoCode)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const alreadySeen = useCallback(() => {
    try {
      return localStorage.getItem(popup.storageKey) !== null
    } catch {
      return false
    }
  }, [])

  const markSeen = useCallback((value: string) => {
    try {
      localStorage.setItem(popup.storageKey, value)
    } catch {
      /* private mode / storage disabled — fail open, just don't persist */
    }
  }, [])

  // Arm the timed + exit-intent triggers (only if not already seen).
  useEffect(() => {
    if (alreadySeen()) return

    let fired = false
    const fire = () => {
      if (fired) return
      fired = true
      setOpen(true)
    }

    const timer = window.setTimeout(fire, popup.delayMs)

    const onMouseOut = (e: MouseEvent) => {
      // Exit intent: cursor leaves through the top of the viewport.
      if (e.clientY <= 0 && !e.relatedTarget) fire()
    }
    document.addEventListener("mouseout", onMouseOut)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener("mouseout", onMouseOut)
    }
  }, [alreadySeen])

  // Focus + ESC handling while open.
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener("keydown", onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function dismiss() {
    setOpen(false)
    markSeen("dismissed")
  }

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
        markSeen("subscribed")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cx-popup-title"
      className="cx-popup-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div className="cx-glass cx-popup-card">
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="cx-popup-close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M2 2l12 12M14 2L2 14"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center">
            <span className="cx-eyebrow mb-4">You&rsquo;re in</span>
            <h2 id="cx-popup-title" className="cx-h text-2xl sm:text-3xl mb-3">
              Welcome to <em>Cylix</em>
            </h2>
            <p className="text-ink/70 mb-5">
              Use this code at checkout for 10% off your first order.
            </p>
            <div className="cx-popup-code">{code}</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cx-btn cx-btn-primary w-full mt-6"
            >
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <span className="cx-eyebrow mb-4">Welcome offer</span>
            <h2 id="cx-popup-title" className="cx-h text-2xl sm:text-3xl mb-3">
              {popup.headline.split("10%")[0]}
              <em>10%</em>
              {popup.headline.split("10%")[1] ?? " off your first order"}
            </h2>
            <p className="text-ink/70 mb-5">{popup.subhead}</p>
            <form onSubmit={onSubmit}>
              <label htmlFor="cx-popup-email" className="sr-only">
                Email address
              </label>
              <input
                ref={inputRef}
                id="cx-popup-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@lab.com"
                className="w-full rounded-full border border-ink/15 bg-white/90 px-5 py-3.5 text-ink outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="cx-btn cx-btn-primary w-full mt-3 disabled:opacity-60"
              >
                {status === "loading" ? "Joining…" : "Claim my code"}
              </button>
            </form>
            {status === "error" ? (
              <p className="mt-2 text-sm text-red-600" aria-live="polite">
                Please enter a valid email and try again.
              </p>
            ) : null}
            <p className="mt-4 text-center text-xs text-ink/50">
              {popup.microcopy}
            </p>
          </>
        )}
      </div>

      <style jsx>{`
        .cx-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 90;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(13, 13, 13, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: cx-fade 0.25s ease both;
        }
        .cx-popup-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          border-radius: 24px;
          padding: 34px 30px 30px;
          animation: cx-rise 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .cx-popup-close {
          position: absolute;
          top: 16px;
          right: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          color: #0d0d0d;
          background: rgba(13, 13, 13, 0.06);
          transition: background-color 0.2s ease;
        }
        .cx-popup-close:hover {
          background: rgba(13, 13, 13, 0.12);
        }
        .cx-popup-code {
          display: inline-block;
          font-family: "Poppins", sans-serif;
          font-weight: 800;
          letter-spacing: 3px;
          font-size: 22px;
          color: #0d0d0d;
          background: rgba(201, 150, 58, 0.14);
          border: 1px dashed rgba(201, 150, 58, 0.6);
          border-radius: 12px;
          padding: 12px 24px;
        }
        @keyframes cx-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes cx-rise {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cx-popup-overlay,
          .cx-popup-card {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

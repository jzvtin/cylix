"use client"

import { useEffect, useRef, useState } from "react"

import { announcements } from "@lib/marketing-config"

/**
 * Slim top announcement bar (ink background, gold separators).
 *
 * Rotates through the configured messages. Respects prefers-reduced-motion
 * (no crossfade — messages simply swap). Dismissible; the dismissed state is
 * remembered for the session so it does not nag on every navigation.
 *
 * Mount ABOVE <Nav/>. Renders nothing if there are no messages.
 */
const DISMISS_KEY = "cx_announcement_dismissed"
const ROTATE_MS = 4500

export default function AnnouncementBar({
  messages = announcements,
}: {
  messages?: readonly string[]
}) {
  const [visible, setVisible] = useState(true)
  const [index, setIndex] = useState(0)
  const reduced = useRef(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") setVisible(false)
    } catch {
      /* ignore */
    }
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  }, [])

  useEffect(() => {
    if (messages.length <= 1) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [messages.length])

  if (!visible || messages.length === 0) return null

  function dismiss() {
    setVisible(false)
    try {
      sessionStorage.setItem(DISMISS_KEY, "1")
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="cx-ann" role="region" aria-label="Announcements">
      <div className="cx-ann-track" aria-live="polite">
        {messages.map((msg, i) => (
          <span
            key={msg}
            className={`cx-ann-msg${i === index ? " is-active" : ""}`}
            aria-hidden={i !== index}
          >
            {msg}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="cx-ann-close"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M2 2l12 12M14 2L2 14"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <style jsx>{`
        .cx-ann {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 40px;
          background: #0d0d0d;
          color: #f9f7f4;
          overflow: hidden;
        }
        .cx-ann-track {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          max-width: 900px;
          min-height: 38px;
        }
        .cx-ann-msg {
          grid-area: 1 / 1;
          font-family: "Poppins", sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          text-align: center;
          color: #f4f0e9;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          pointer-events: none;
        }
        .cx-ann-msg.is-active {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }
        .cx-ann-close {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 999px;
          color: rgba(249, 247, 244, 0.7);
          transition: color 0.2s ease, background-color 0.2s ease;
        }
        .cx-ann-close:hover {
          color: #f9f7f4;
          background: rgba(255, 255, 255, 0.1);
        }
        @media (prefers-reduced-motion: reduce) {
          .cx-ann-msg {
            transition: none;
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}

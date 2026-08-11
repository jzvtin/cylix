"use client"

import { useState } from "react"

type CopyLinkProps = {
  value: string
  /** Optional label shown above the field (e.g. "Your referral link"). */
  label?: string
  /** Renders a compact inline variant (for the code chip). */
  compact?: boolean
}

/**
 * A read-only field with a one-tap copy button. Copies `value` to the clipboard
 * and shows a transient "Copied" confirmation. Accessible (aria-live) and
 * degrades gracefully if the Clipboard API is unavailable.
 */
export default function CopyLink({ value, label, compact }: CopyLinkProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div>
      {label && (
        <div className="mb-2 font-display text-[11px] font-extrabold uppercase tracking-[1.4px] text-ink/45">
          {label}
        </div>
      )}
      <div className="flex items-stretch gap-2">
        <div
          className={`min-w-0 flex-1 truncate rounded-[14px] border border-ink/10 bg-white/70 px-4 font-mono text-ink/80 ${
            compact
              ? "py-2 text-sm font-semibold tracking-[0.5px]"
              : "flex items-center py-3 text-[13px]"
          }`}
          title={value}
        >
          {value}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
          className="shrink-0 rounded-[14px] bg-ink px-4 py-3 font-display text-[13px] font-bold text-sand transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  )
}

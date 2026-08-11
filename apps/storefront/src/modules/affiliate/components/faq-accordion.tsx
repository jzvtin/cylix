"use client"

import { useState } from "react"

export type FaqItem = { q: string; a: string }

/**
 * Accessible single-open accordion. Uses button + aria-expanded and respects
 * prefers-reduced-motion (the grid-rows transition collapses to instant).
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={item.q}
            className="cx-glass overflow-hidden rounded-[18px]"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-display text-[clamp(15px,1.7vw,18px)] font-bold text-ink">
                {item.q}
              </span>
              <span
                aria-hidden
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold-500/40 bg-gold-50 font-display text-lg font-bold leading-none text-gold-700 transition-transform duration-300 motion-reduce:transition-none ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-[clamp(14px,1.4vw,15px)] leading-[1.7] text-ink/60">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import { addToCart } from "@lib/data/cart"
import { useParams } from "next/navigation"
import { useState } from "react"

/**
 * Origin-labs-style hover "Add to cart" on the product card. Adds the product's
 * default (first) variant. For single-variant Cylix products this is the whole
 * catalog; multi-variant products still route buyers to the PDP to pick.
 */
export default function QuickAdd({
  variantId,
  label = "Add to cart",
}: {
  variantId?: string
  label?: string
}) {
  const countryCode = (useParams().countryCode as string) || "us"
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!variantId || adding) return
    setAdding(true)
    await addToCart({ variantId, quantity: 1, countryCode }).catch(() => {})
    setAdding(false)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative z-[3] inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 font-display text-sm font-semibold text-white shadow-md transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-gold-600 active:scale-[0.98] motion-reduce:hover:translate-y-0"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" />
      </svg>
      {adding ? "Adding…" : added ? "Added ✓" : label}
    </button>
  )
}

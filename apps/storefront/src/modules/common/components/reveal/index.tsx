"use client"

import React, { useEffect, useRef, useState } from "react"
import { useIntersection } from "@lib/hooks/use-in-view"

type RevealProps = {
  children: React.ReactNode
  /** Stagger the reveal by this many milliseconds. */
  delay?: number
  /** Element/tag to render. Defaults to a <div>. */
  as?: keyof React.JSX.IntrinsicElements
  className?: string
}

/**
 * Fades + rises its children into view as they scroll into the viewport.
 *
 * - Uses the shared `useIntersection` hook (IntersectionObserver).
 * - Latches: once revealed it stays revealed (no re-hide on scroll out).
 * - Respects `prefers-reduced-motion: reduce` by showing content immediately
 *   with no transform (both here and via the CSS in globals.css).
 *
 * The visual transition itself is defined by the `.reveal-init` / `.reveal-in`
 * classes in `src/styles/globals.css`.
 */
const Reveal = ({ children, delay = 0, as = "div", className }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useIntersection(ref, "0px 0px -10% 0px")
  const [revealed, setRevealed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return
    }
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
  }, [])

  useEffect(() => {
    if (inView) {
      setRevealed(true)
    }
  }, [inView])

  // Fail-safe: never leave content permanently hidden if the observer doesn't
  // fire (above-the-fold content, or SSR→hydration timing). Reveal shortly
  // after mount so the entrance still animates but content can't get stuck.
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 120)
    return () => clearTimeout(t)
  }, [])

  const show = revealed || reducedMotion

  const classes = [
    "reveal-init",
    show ? "reveal-in" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ")

  return React.createElement(
    as,
    {
      ref,
      className: classes,
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    } as React.HTMLAttributes<HTMLElement> & {
      ref: React.Ref<HTMLDivElement>
    },
    children
  )
}

export default Reveal

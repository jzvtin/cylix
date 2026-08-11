"use client"

import { useEffect, useState } from "react"

/**
 * Sticky header shell. Adds a subtle shadow + tighter height once the user
 * scrolls past a small threshold. Reduced-motion safe (the transition is
 * disabled when the user prefers reduced motion; the styling still applies).
 */
const NavShell = ({ children }: { children: React.ReactNode }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      data-scrolled={scrolled ? "true" : "false"}
      className={[
        "sticky inset-x-0 top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300 motion-reduce:transition-none",
        scrolled
          ? "border-cream/80 bg-sand/85 shadow-[0_8px_30px_-12px_rgba(13,13,13,0.18)] backdrop-blur-md"
          : "border-transparent bg-sand/70 backdrop-blur-sm",
      ].join(" ")}
    >
      {children}
    </div>
  )
}

export default NavShell

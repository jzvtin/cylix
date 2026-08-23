import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-[clamp(16px,4vw,32px)] py-16 text-center">
      <p className="cx-eyebrow mb-4 text-gold-700">Error 404</p>
      <h1 className="cx-h text-[clamp(28px,5vw,44px)]">
        Page not <em>found.</em>
      </h1>
      <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-ink/55">
        The page you tried to access does not exist.
      </p>
      <LocalizedClientLink
        href="/"
        className="mt-7 inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-ink px-8 font-display text-[15px] font-bold text-sand shadow-[0_18px_36px_-16px_rgba(13,13,13,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1a1a1a] motion-reduce:hover:translate-y-0"
      >
        Go to frontpage
        <span aria-hidden>→</span>
      </LocalizedClientLink>
    </div>
  )
}

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="mx-auto flex max-w-[520px] flex-col items-center justify-center px-4 py-[clamp(48px,10vw,96px)] text-center"
      data-testid="empty-cart-message"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/30 bg-gold-50 text-[26px]">
        🧪
      </div>
      <h2 className="cx-h text-[clamp(24px,4vw,34px)]">
        Your cart is <em>empty.</em>
      </h2>
      <p className="mt-3 max-w-[38ch] text-[14px] leading-relaxed text-ink/55">
        No reference standards yet. Browse the catalog — every lot ships with a
        Certificate of Analysis and free U.S. shipping over $100.
      </p>
      <LocalizedClientLink
        href="/store"
        className="mt-7 inline-flex h-[50px] items-center justify-center gap-2 rounded-full bg-ink px-8 font-display text-[15px] font-bold text-sand shadow-[0_18px_36px_-16px_rgba(13,13,13,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1a1a1a] motion-reduce:hover:translate-y-0"
      >
        Explore the catalog
        <span aria-hidden>→</span>
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage

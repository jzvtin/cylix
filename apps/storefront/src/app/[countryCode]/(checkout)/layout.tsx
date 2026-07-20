import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import AgeGate from "@modules/layout/components/age-gate"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="w-full relative small:min-h-screen"
      style={{ background: "#F9F7F4", fontFamily: "'Outfit', sans-serif" }}
    >
      <AgeGate />
      <div className="h-16" style={{ background: "#111" }}>
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="flex items-center gap-x-2 uppercase flex-1 basis-0 text-xs tracking-wider"
            style={{ color: "#8A8A8A", fontWeight: 600 }}
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block">
              Back to shopping cart
            </span>
            <span className="mt-px block small:hidden">Back</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="uppercase text-base"
            style={{ color: "#C9963A", fontWeight: 800, letterSpacing: "1.5px" }}
            data-testid="store-link"
          >
            Cylix Research
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
      <div className="py-6 w-full flex items-center justify-center">
        <p
          className="text-xs text-center"
          style={{ color: "#B0AAA2", letterSpacing: "0.3px" }}
        >
          Secure checkout &middot; For in-vitro laboratory research use only
        </p>
      </div>
    </div>
  )
}

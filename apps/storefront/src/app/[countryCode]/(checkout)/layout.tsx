export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="w-full relative small:min-h-screen"
      style={{ background: "#F9F7F4", fontFamily: "var(--font-poppins), sans-serif" }}
    >
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

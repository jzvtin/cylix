"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import { convertToLocale } from "@lib/util/money"
import {
  updateCart,
  setShippingMethod,
  initiatePaymentSession,
  applyPromotions,
} from "@lib/data/cart"
import { getSquareCheckoutUrl } from "@lib/data/square-bridge"

// ─── Single-page Cylix checkout ───────────────────────────────────────────────
//
// A conversion-oriented one-page checkout, structured after the Vertex Labs
// single-page layout but rebuilt on Cylix's own backend and brand. There is no
// custom pricing/quote engine here: every figure comes straight from the Medusa
// cart (`cart.*_total`), and the amount actually charged is read server-side by
// the square-bridge route from the same cart — so the displayed and charged
// totals cannot drift.
//
// Flow on "Pay with card":
//   1. write email + shipping/billing address onto the cart  (updateCart)
//   2. ensure a shipping method is set                       (setShippingMethod)
//   3. initiate a pp_system_default payment session          (so the bridge
//      confirm webhook can complete the cart into an order)
//   4. mint a Square hosted link and redirect                (getSquareCheckoutUrl)
//
// Card is the only live rail (Square via the Dynara bridge). The section is kept
// isolated so additional rails can be added later without touching the layout.
// ──────────────────────────────────────────────────────────────────────────────

// Cylix brand palette (mirrors the cx-* design system in globals.css).
const INK = "#0D0D0D"
const CREAM = "#F9F7F4"
const GOLD = "#C9963A"
const GOLD_DARK = "#855F24"
const LINE = "#E7E2D9"
const MUTED = "#8A8279"
const FONT_DISPLAY =
  "'Anek Latin','Anek Latin Fallback',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
const FONT_UI = "'Poppins','Poppins Fallback',sans-serif"

// The manual/system provider. Square is taken off-site, so the Medusa order is
// completed by the bridge confirm webhook, which needs a session to complete.
const SYSTEM_PROVIDER = "pp_system_default"

type Props = {
  cart: HttpTypes.StoreCart
  shippingOptions: HttpTypes.StoreCartShippingOption[] | null
}

export default function CylixCheckout({ cart, shippingOptions }: Props) {
  const router = useRouter()

  const currency = cart.currency_code
  const money = (n: number | null | undefined) =>
    convertToLocale({ amount: Number(n) || 0, currency_code: currency })

  // ── Form ───────────────────────────────────────────────────────────────────
  const sa = cart.shipping_address
  const [email, setEmail] = useState(cart.email ?? "")
  const [phone, setPhone] = useState(sa?.phone ?? "")
  const [firstName, setFirstName] = useState(sa?.first_name ?? "")
  const [lastName, setLastName] = useState(sa?.last_name ?? "")
  const [address, setAddress] = useState(sa?.address_1 ?? "")
  const [city, setCity] = useState(sa?.city ?? "")
  const [state, setState] = useState(sa?.province ?? "")
  const [zip, setZip] = useState(sa?.postal_code ?? "")

  // Pre-checked to keep the funnel short; the hard compliance barrier is the
  // 21+/research-use age gate on site entry, which is not pre-satisfied.
  const [researchAck, setResearchAck] = useState(true)

  // ── Promo ────────────────────────────────────────────────────────────────
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoBusy, setPromoBusy] = useState(false)

  // ── Submit ───────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => setError(null), [cart.id])

  const items = cart.items ?? []
  const hasItems = items.length > 0

  const appliedPromo = cart.promotions?.find((p) => p.code)

  // Shipping: free on orders $100+, otherwise a flat paid option. Pick the $0
  // option once the subtotal clears the threshold; below it, the paid option.
  const FREE_SHIP_THRESHOLD = 10000 // $100.00 in minor units (item_subtotal)
  const qualifiesForFreeShip = (cart.item_subtotal ?? 0) >= FREE_SHIP_THRESHOLD
  const chosenOption = useMemo(() => {
    const opts = shippingOptions ?? []
    const free = opts.find((o) => (o.amount ?? 0) === 0)
    const paid = opts.find((o) => (o.amount ?? 0) > 0)
    return qualifiesForFreeShip
      ? free ?? opts[0] ?? null
      : paid ?? free ?? opts[0] ?? null
  }, [shippingOptions, qualifiesForFreeShip])
  const shippingIsFree = (cart.shipping_total ?? 0) === 0

  // Keep the cart's shipping method in sync with the chosen option BEFORE
  // payment, so the displayed shipping line + grand total are server-accurate
  // (not just applied at submit). Guarded on the current option id so the
  // router.refresh() re-pull cannot loop.
  useEffect(() => {
    if (!chosenOption) return
    const current = cart.shipping_methods?.[0]?.shipping_option_id
    if (current === chosenOption.id) return
    setShippingMethod({ cartId: cart.id, shippingMethodId: chosenOption.id })
      .then(() => router.refresh())
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenOption?.id, cart.shipping_methods?.[0]?.shipping_option_id])

  // ── Promo apply ──────────────────────────────────────────────────────────
  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase()
    if (!code || promoBusy) return
    setPromoBusy(true)
    setPromoError(null)
    const result = await applyPromotions([code])
    setPromoBusy(false)
    if (typeof result === "string") {
      setPromoError(result)
      return
    }
    setPromoCode("")
    router.refresh() // re-pull the cart so totals reflect the discount
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, boolean> = {}
    if (!email || !email.includes("@")) e.email = true
    if (!firstName.trim()) e.firstName = true
    if (!lastName.trim()) e.lastName = true
    if (!address.trim()) e.address = true
    if (!city.trim()) e.city = true
    if (!state.trim()) e.state = true
    if (!zip.trim()) e.zip = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const isFormValid =
    !!email &&
    !!firstName &&
    !!lastName &&
    !!address &&
    !!city &&
    !!state &&
    !!zip &&
    researchAck &&
    hasItems

  // ── Pay with card ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate() || !researchAck || isSubmitting || !hasItems) return
    setIsSubmitting(true)
    setError(null)

    try {
      const countryCode =
        cart.shipping_address?.country_code ||
        cart.region?.countries?.[0]?.iso_2 ||
        "us"

      const shippingAddress = {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        address_2: "",
        city,
        province: state,
        postal_code: zip,
        country_code: countryCode,
        phone,
      }

      // 1. Write contact + address onto the cart.
      await updateCart({
        email,
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
      } as HttpTypes.StoreUpdateCart)

      // 2. Ensure the correct shipping method is set (free at $100+, else paid).
      const currentOpt = cart.shipping_methods?.[0]?.shipping_option_id
      if (chosenOption && currentOpt !== chosenOption.id) {
        await setShippingMethod({
          cartId: cart.id,
          shippingMethodId: chosenOption.id,
        })
      }

      // 3. Initiate the system session so the bridge webhook can complete the
      //    cart into a paid order.
      try {
        await initiatePaymentSession(cart, {
          provider_id: SYSTEM_PROVIDER,
        } as HttpTypes.StoreInitializePaymentSession)
      } catch {
        // A session may already exist from a prior attempt; that is fine.
      }

      // 4. Mint the Square hosted link (amount is read from the cart server-side)
      //    and hand the buyer off.
      const res = await getSquareCheckoutUrl(cart.id)
      if (!res.success) {
        setError(res.error || "Could not start card payment. Please try again.")
        setIsSubmitting(false)
        return
      }
      window.location.href = res.checkout_url
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.")
      setIsSubmitting(false)
    }
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const eyebrow: React.CSSProperties = {
    fontFamily: FONT_UI,
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: MUTED,
    marginBottom: "10px",
  }
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: FONT_UI,
    fontSize: "11px",
    fontWeight: 700,
    color: "#5C554D",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "5px",
  }
  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    border: `1.5px solid ${errors[field] ? "#D9534F" : LINE}`,
    borderRadius: "8px",
    fontFamily: FONT_DISPLAY,
    fontSize: "16px",
    color: INK,
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  })
  const divider = <div style={{ height: 1, background: LINE, margin: "24px 0" }} />

  const payLabel = isSubmitting ? "PROCESSING…" : "Pay with card"

  return (
    <>
      {/* Scoped stylesheet — inline styles can't express media queries, focus
          rings or the mobile sticky bar. */}
      <style>{`
        .cxco-grid { display: grid; grid-template-columns: 1fr 400px; max-width: 1100px; margin: 0 auto; min-height: calc(100vh - 56px); }
        .cxco-left { padding: 36px 48px 60px 24px; border-right: 1px solid ${LINE}; }
        .cxco-right { background: ${CREAM}; padding: 36px 28px; border-left: 1px solid ${LINE}; }
        .cxco-root input:not([type=checkbox]) { transition: border-color .15s, box-shadow .15s; }
        .cxco-root input:not([type=checkbox]):focus { border-color: ${GOLD} !important; box-shadow: 0 0 0 3px rgba(201,150,58,0.15); }
        .cxco-card { box-shadow: 0 1px 2px rgba(13,13,13,0.04), 0 4px 12px rgba(13,13,13,0.05); }
        .cxco-press { transition: transform .12s ease, filter .15s; -webkit-tap-highlight-color: transparent; }
        .cxco-press:not(:disabled):active { transform: scale(0.985); }
        .cxco-press:not(:disabled):hover { filter: brightness(1.05); }
        .cxco-mobilebar { display: none; }
        @media (max-width: 860px) {
          .cxco-grid { grid-template-columns: 1fr; }
          .cxco-left { padding: 24px 18px 40px; border-right: none; order: 2; }
          .cxco-right { padding: 22px 18px 120px; border-left: none; border-top: 1px solid ${LINE}; order: 1; }
          .cxco-desktop-pay { display: none !important; }
          .cxco-mobilebar {
            display: flex; position: fixed; left: 0; right: 0; bottom: 0; z-index: 200;
            align-items: center; gap: 12px; padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
            background: #fff; border-top: 1px solid ${LINE};
            box-shadow: 0 -6px 24px rgba(13,13,13,0.10);
          }
        }
      `}</style>

      <div
        className="cxco-root"
        style={{
          minHeight: "100vh",
          background: "#fff",
          fontFamily: FONT_DISPLAY,
          color: INK,
        }}
      >
        {/* Nav */}
        <nav
          style={{
            background: "#fff",
            borderBottom: `1px solid ${LINE}`,
            padding: "0 24px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <Link href="/us" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: FONT_UI,
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: INK,
              }}
            >
              CYLIX<span style={{ color: GOLD }}> RESEARCH</span>
            </span>
          </Link>
          <span
            style={{
              fontFamily: FONT_UI,
              fontSize: "11px",
              fontWeight: 700,
              color: MUTED,
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            🔒 Secure Checkout
          </span>
        </nav>

        <div className="cxco-grid">
          {/* ── LEFT ── */}
          <div className="cxco-left">
            {/* CONTACT */}
            <div style={{ marginBottom: "24px" }}>
              <div style={eyebrow}>Contact</div>
              <div style={{ marginBottom: "12px" }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@email.com"
                  style={inputStyle("email")}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Phone{" "}
                  <span style={{ fontWeight: 400, color: MUTED, textTransform: "none" }}>
                    (optional)
                  </span>
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="(555) 000-0000"
                  style={inputStyle("phone")}
                />
              </div>
            </div>

            {divider}

            {/* SHIPPING */}
            <div style={{ marginBottom: "24px" }}>
              <div style={eyebrow}>Shipping</div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First"
                    style={inputStyle("firstName")}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last"
                    style={inputStyle("lastName")}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={labelStyle}>Street Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St"
                  style={inputStyle("address")}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={labelStyle}>City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  style={inputStyle("city")}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>State</label>
                  <input
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="CA"
                    maxLength={2}
                    style={inputStyle("state")}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label style={labelStyle}>ZIP Code</label>
                  <input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="12345"
                    style={inputStyle("zip")}
                  />
                </div>
              </div>
            </div>

            {divider}

            {/* PROMO */}
            <div style={{ marginBottom: "24px" }}>
              <div style={eyebrow}>Promo Code</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                  placeholder="ENTER CODE"
                  style={{
                    flex: 1,
                    padding: "11px 14px",
                    border: `1.5px solid ${LINE}`,
                    borderRadius: "8px",
                    fontSize: "16px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    background: CREAM,
                    color: INK,
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: FONT_DISPLAY,
                  }}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoBusy}
                  className="cxco-press"
                  style={{
                    padding: "0 18px",
                    background: CREAM,
                    border: `1.5px solid ${LINE}`,
                    borderRadius: "8px",
                    fontFamily: FONT_UI,
                    fontWeight: 700,
                    fontSize: "12px",
                    cursor: promoBusy ? "wait" : "pointer",
                    color: INK,
                    minHeight: "46px",
                  }}
                >
                  {promoBusy ? "…" : "APPLY"}
                </button>
              </div>
              {appliedPromo && (
                <div
                  style={{
                    fontFamily: FONT_UI,
                    fontSize: "12px",
                    fontWeight: 700,
                    marginTop: "6px",
                    color: "#2E7D46",
                  }}
                >
                  ✓ {appliedPromo.code} applied
                </div>
              )}
              {promoError && (
                <div
                  style={{
                    fontFamily: FONT_UI,
                    fontSize: "12px",
                    fontWeight: 700,
                    marginTop: "6px",
                    color: "#D9534F",
                  }}
                >
                  ✕ {promoError}
                </div>
              )}
            </div>

            {divider}

            {/* PAYMENT */}
            <div>
              <div style={eyebrow}>Payment</div>
              <div
                style={{
                  padding: "12px 14px",
                  background: CREAM,
                  border: `1.5px solid ${LINE}`,
                  borderRadius: "10px",
                  fontSize: "12px",
                  color: "#5C554D",
                  fontWeight: 600,
                  lineHeight: 1.6,
                  marginBottom: "14px",
                  fontFamily: FONT_UI,
                }}
              >
                💳 You’ll complete payment securely on Square (Visa, Mastercard,
                Amex). Your card details never touch our servers.
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="cxco-press cxco-desktop-pay"
                style={{
                  width: "100%",
                  padding: "16px",
                  border: "none",
                  borderRadius: "12px",
                  fontFamily: FONT_UI,
                  fontSize: "16px",
                  fontWeight: 800,
                  cursor: !isFormValid || isSubmitting ? "not-allowed" : "pointer",
                  opacity: !isFormValid || isSubmitting ? 0.5 : 1,
                  background: GOLD,
                  color: INK,
                  boxShadow: "0 14px 30px -12px rgba(201,150,58,0.7)",
                }}
              >
                {payLabel}
              </button>

              {error && (
                <div
                  style={{
                    fontFamily: FONT_UI,
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#D9534F",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              {!researchAck && hasItems && (
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: FONT_UI,
                    fontSize: "11px",
                    color: MUTED,
                    fontWeight: 600,
                    marginTop: "8px",
                  }}
                >
                  Check the confirmation box to enable payment
                </div>
              )}

              <p
                style={{
                  textAlign: "center",
                  fontFamily: FONT_UI,
                  fontSize: "11px",
                  color: MUTED,
                  marginTop: "16px",
                  fontWeight: 600,
                }}
              >
                Free shipping over $100 · Fast dispatch · COA-verified purity
              </p>
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="cxco-right">
            <div
              style={{
                fontFamily: FONT_UI,
                fontSize: "13px",
                fontWeight: 800,
                color: "#5C554D",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "16px",
              }}
            >
              Your Order
            </div>

            {!hasItems ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: MUTED }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🧪</div>
                <p style={{ fontSize: "14px", marginBottom: "14px" }}>Your cart is empty.</p>
                <Link
                  href="/us/store"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    background: INK,
                    color: "#fff",
                    borderRadius: "8px",
                    fontFamily: FONT_UI,
                    fontWeight: 700,
                    fontSize: "13px",
                    textDecoration: "none",
                  }}
                >
                  Browse Catalog →
                </Link>
              </div>
            ) : (
              <>
                {/* Free-shipping badge (Cylix ships free). */}
                {shippingIsFree && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      fontFamily: FONT_UI,
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#2E7D46",
                      background: "#F1F8F2",
                      border: "1px solid #CBE7CE",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      marginBottom: "16px",
                    }}
                  >
                    🚚 Free shipping included
                  </div>
                )}

                {/* Items */}
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "10px 0",
                      borderBottom: `1px solid ${LINE}`,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        background: "#fff",
                        border: `1px solid ${LINE}`,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        color: GOLD,
                        flexShrink: 0,
                        overflow: "hidden",
                      }}
                    >
                      {item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnail}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            padding: "3px",
                          }}
                        />
                      ) : (
                        "🧪"
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: FONT_UI,
                          fontSize: "13px",
                          fontWeight: 700,
                          color: INK,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.product_title ?? item.title}
                        {item.variant_title && (
                          <span
                            style={{
                              background: "rgba(201,150,58,0.14)",
                              color: GOLD_DARK,
                              fontSize: "10px",
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              marginLeft: "6px",
                            }}
                          >
                            {item.variant_title}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: MUTED, marginTop: "2px" }}>
                        Qty {item.quantity}
                        {item.quantity > 1 && ` · ${money(item.unit_price)} each`}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_UI,
                        fontSize: "14px",
                        fontWeight: 800,
                        color: INK,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {money(item.total)}
                    </div>
                  </div>
                ))}

                {/* Totals — straight from the Medusa cart. */}
                <div style={{ marginTop: "12px" }}>
                  <Row label="Subtotal" value={money(cart.item_subtotal)} />
                  {(cart.discount_total ?? 0) > 0 && (
                    <Row
                      label={appliedPromo?.code ? `Discount (${appliedPromo.code})` : "Discount"}
                      value={`-${money(cart.discount_total)}`}
                      accent
                    />
                  )}
                  <Row
                    label="Shipping"
                    value={shippingIsFree ? "FREE" : money(cart.shipping_total)}
                    accent={shippingIsFree}
                  />
                  {(cart.tax_total ?? 0) > 0 && (
                    <Row label="Tax" value={money(cart.tax_total)} />
                  )}
                </div>

                {/* Research disclaimer (compliance load-bearing). */}
                <p
                  style={{
                    fontSize: "10px",
                    color: MUTED,
                    fontWeight: 600,
                    textAlign: "center",
                    margin: "14px 0",
                    lineHeight: 1.6,
                  }}
                >
                  By completing your order you confirm these are for qualified
                  in-vitro research use only. Not for human or animal use.
                </p>

                {/* Research acknowledgement */}
                <label
                  onClick={() => setResearchAck((p) => !p)}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    border: `1.5px solid ${researchAck ? LINE : "#E0B44B"}`,
                    borderRadius: "10px",
                    padding: "14px 16px",
                    marginBottom: "14px",
                    background: researchAck ? "#fff" : "#FDF7E8",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={researchAck}
                    onChange={() => {}}
                    style={{
                      marginTop: "3px",
                      flexShrink: 0,
                      width: "20px",
                      height: "20px",
                      accentColor: GOLD,
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "#5C554D", lineHeight: 1.6, fontWeight: 600 }}>
                    I confirm I am purchasing these materials for qualified
                    laboratory research use only. I will not use them for human or
                    animal consumption. I am 21 or older.
                  </span>
                </label>

                {/* Total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: FONT_UI,
                    fontSize: "18px",
                    fontWeight: 800,
                    color: INK,
                    borderTop: `1.5px solid ${LINE}`,
                    marginTop: "8px",
                    paddingTop: "12px",
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: GOLD_DARK }}>{money(cart.total)}</span>
                </div>

                {/* Trust */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px 14px",
                    marginTop: "14px",
                    paddingTop: "14px",
                    borderTop: `1px solid ${LINE}`,
                  }}
                >
                  {[
                    "🧪 99%+ Purity — COA Verified",
                    "🚚 Free shipping over $100",
                    "↩️ Damaged-on-arrival reship",
                  ].map((t) => (
                    <div
                      key={t}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontFamily: FONT_UI,
                        fontSize: "11px",
                        fontWeight: 700,
                        color: MUTED,
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile sticky pay bar */}
        {hasItems && (
          <div className="cxco-mobilebar">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: FONT_UI,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Total
              </div>
              <div style={{ fontFamily: FONT_UI, fontSize: "20px", fontWeight: 800, color: INK }}>
                {money(cart.total)}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="cxco-press"
              style={{
                flex: "0 0 auto",
                padding: "15px 22px",
                border: "none",
                borderRadius: "12px",
                fontFamily: FONT_UI,
                fontSize: "15px",
                fontWeight: 800,
                cursor: !isFormValid || isSubmitting ? "not-allowed" : "pointer",
                opacity: !isFormValid || isSubmitting ? 0.5 : 1,
                background: GOLD,
                color: INK,
                whiteSpace: "nowrap",
              }}
            >
              {payLabel}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "13px",
        color: accent ? "#2E7D46" : "#5C554D",
        fontWeight: accent ? 700 : 400,
        padding: "4px 0",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

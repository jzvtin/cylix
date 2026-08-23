import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const count =
    cart?.items?.reduce((n, i) => n + i.quantity, 0) ?? 0

  return (
    <div className="px-[clamp(16px,4vw,32px)] py-[clamp(28px,5vw,56px)]">
      <div className="mx-auto max-w-[1160px]" data-testid="cart-container">
        {/* Page header */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h1
              className="cx-h text-[clamp(30px,4.5vw,44px)]"
              data-testid="cart-heading"
            >
              Your <em>cart.</em>
            </h1>
            {count > 0 && (
              <span className="font-display text-[13px] font-bold text-ink/45">
                {count} {count === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <LocalizedClientLink
            href="/store"
            className="group inline-flex items-center gap-1.5 font-display text-[13px] font-bold text-ink/55 transition-colors hover:text-gold-700"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            Continue shopping
          </LocalizedClientLink>
        </div>

        {cart?.items?.length ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
            {/* ITEMS */}
            <div className="flex flex-col gap-5">
              {!customer && <SignInPrompt />}
              <ItemsTemplate cart={cart} />

              {/* Trust row */}
              <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { icon: "🧪", label: "99%+ purity — COA verified" },
                  { icon: "🚚", label: "Free U.S. shipping over $100" },
                  { icon: "↩️", label: "Damaged-on-arrival reship" },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center gap-2 rounded-xl border border-ink/[0.06] bg-white/50 px-3 py-2.5 text-[12px] font-medium text-ink/60"
                  >
                    <span aria-hidden className="text-[14px]">
                      {t.icon}
                    </span>
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="relative">
              {cart && cart.region && (
                <div className="cx-glass sticky top-24 rounded-2xl p-6">
                  <Summary cart={cart} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyCartMessage />
        )}
      </div>
    </div>
  )
}

export default CartTemplate

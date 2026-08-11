import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="px-[clamp(16px,4vw,32px)] py-[clamp(28px,5vw,56px)]">
      <div className="mx-auto max-w-[1160px]" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
            {/* ITEMS */}
            <div className="flex flex-col gap-5">
              {!customer && <SignInPrompt />}
              <ItemsTemplate cart={cart} />
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

"use client"
import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import ErrorMessage from "@modules/checkout/components/error-message"
import { StripeCardContainer } from "@modules/checkout/components/payment-container"
import SellAbroadContainer from "@modules/checkout/components/sellabroad-container"
import SquareBridgeContainer from "@modules/checkout/components/square-bridge-container"
import Divider from "@modules/common/components/divider"
import {
  Button,
  Container,
  Heading,
  Text,
  clx,
} from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: { id: string }[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )
  // Square-via-bridge is Cylix's real, working processor. When it's enabled the
  // inline Stripe card element is a broken skeleton (no client_secret ever
  // reaches it), so Square is the default tab and the Stripe tab is hidden.
  const squareEnabled =
    process.env.NEXT_PUBLIC_SQUARE_BRIDGE_ENABLED === "true"
  const [tab, setTab] = useState<"sellabroad" | "stripe" | "square">(
    squareEnabled ? "square" : "stripe"
  )

  const stripeMethod = availablePaymentMethods?.find((m) => isStripeLike(m.id))
  const otherMethods =
    availablePaymentMethods?.filter((m) => !isStripeLike(m.id)) ?? []

  // Only surface the SellAbroad ("Other") option when a merchant ID is actually
  // configured. Without it the widget just renders a raw dev message telling the
  // customer to set NEXT_PUBLIC_SELLABROAD_MERCHANT_ID, so keep it hidden and let
  // Stripe be the sole, working default.
  const showSellAbroad = !!process.env.NEXT_PUBLIC_SELLABROAD_MERCHANT_ID

  // Square-via-bridge tab. Uses the system/manual session (like SellAbroad); the
  // order is completed by the bridge webhook once Square reports payment.
  const showSquare = squareEnabled

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    // Stripe needs a session for its card element; the system/manual provider
    // (used by the Square-bridge and SellAbroad tabs) needs one so the cart can
    // be completed once payment is confirmed off-site. Either way, initiate.
    if (method) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard = !!(
    (cart as unknown as Record<string, unknown>)?.gift_cards && ((cart as unknown as Record<string, unknown>)?.gift_cards as unknown[])?.length > 0 && cart?.total === 0
  )

  const paymentReady =
    (activeSession && (cart?.shipping_methods?.length ?? 0) !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  /* Initiate a Medusa payment session for whichever tab is active (Stripe by
     default). SellAbroad still needs a system session backing it so the cart
     can be completed once its widget confirms payment. */
  useEffect(() => {
    if (!isOpen || selectedPaymentMethod) return
    if (tab === "stripe" && stripeMethod) {
      setPaymentMethod(stripeMethod.id)
    } else if ((tab === "sellabroad" || tab === "square") && otherMethods[0]) {
      // Square + SellAbroad both ride on the system/manual session so the cart
      // can be completed once the off-site webhook confirms payment.
      setPaymentMethod(otherMethods[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tab])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-gold-600 hover:text-gold-700"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && (
            <>
              {/* Only show the method switcher when there's actually more than
                  one method to pick. A single card path (Square-only, no
                  SellAbroad) rendered a lone orphaned pill, so hide the bar. */}
              {showSellAbroad && (
              <div
                className="flex gap-x-1 mb-6 p-1 rounded-lg w-fit"
                style={{ background: "#F1EEE9" }}
                role="tablist"
              >
                {(
                  [
                    // When Square is live it's the working card path; the inline
                    // Stripe card element is broken, so hide its tab entirely.
                    ...(showSquare
                      ? [{ key: "square", label: "Pay by card" } as const]
                      : [{ key: "stripe", label: "Pay by card" } as const]),
                    ...(showSellAbroad
                      ? [{ key: "sellabroad", label: "Other (SellAbroad)" } as const]
                      : []),
                  ] as const
                ).map(({ key, label }) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => {
                      setTab(key)
                      setError(null)
                      if (key === "stripe" && stripeMethod) {
                        setPaymentMethod(stripeMethod.id)
                      }
                      /**
                       * SellAbroad collects the money in its own widget, but
                       * Medusa still needs a payment session to place the
                       * order. Fall back to the manual/system provider; the
                       * webhook captures it once SellAbroad confirms.
                       */
                      if (key === "sellabroad" && otherMethods[0]) {
                        setPaymentMethod(otherMethods[0].id)
                      }
                      // Square also rides on the system/manual session so the
                      // cart can be completed once the webhook confirms payment.
                      if (key === "square" && otherMethods[0]) {
                        setPaymentMethod(otherMethods[0].id)
                      }
                    }}
                    className="px-4 py-2 rounded-md text-sm transition-colors"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      background: tab === key ? "#111" : "transparent",
                      color: tab === key ? "#C9963A" : "#7A7370",
                    }}
                    data-testid={`payment-tab-${key}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              )}

              {/*
                SellAbroad takes the payment inside its own widget and the
                order is created by our webhook on payment.container.succeeded.
                So there is deliberately no "continue to review" step here — a
                Place Order button would let a customer create an unpaid order.
                The Medusa session is still initiated silently (see the effect
                above) because completing the cart requires one.
              */}
              {showSellAbroad && tab === "sellabroad" && (
                <div className="flex flex-col gap-y-4">
                  <SellAbroadContainer cart={cart} />
                  <p className="text-xs" style={{ color: "#8A8A8A" }}>
                    Your order is confirmed as soon as payment completes above.
                  </p>
                </div>
              )}

              {showSquare && tab === "square" && (
                <SquareBridgeContainer cart={cart} />
              )}

              {tab === "stripe" &&
                (stripeMethod ? (
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onChange={(value: string) => setPaymentMethod(value)}
                  >
                    <StripeCardContainer
                      paymentProviderId={stripeMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                      paymentInfoMap={paymentInfoMap}
                      setCardBrand={setCardBrand}
                      setError={setError}
                      setCardComplete={setCardComplete}
                    />
                  </RadioGroup>
                ) : (
                  <div
                    className="rounded-lg p-4 text-sm"
                    style={{
                      background: "#FDF6E9",
                      border: "1px solid #E8D5AE",
                      color: "#7A5B1E",
                    }}
                    data-testid="stripe-unavailable"
                  >
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>
                      Stripe is not enabled on the backend yet
                    </p>
                    <p style={{ lineHeight: 1.6 }}>
                      Add the Stripe provider to the Medusa config and attach it
                      to this region, then set live keys in the environment.
                    </p>
                  </div>
                ))}
            </>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ink mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ink/60"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          {/* Only the Stripe path advances to the review + Place Order step. */}
          {tab === "stripe" && (
            <Button
              size="large"
              className="mt-6"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={
                (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
                (!selectedPaymentMethod && !paidByGiftcard)
              }
              data-testid="submit-payment-button"
            >
              {!activeSession && isStripeLike(selectedPaymentMethod)
                ? " Enter card details"
                : "Continue to review"}
            </Button>
          )}
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ink mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ink/60"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ink mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ink/60 items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ink">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeLike(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ink mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ink/60"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment

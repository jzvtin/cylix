"use client"
import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import ErrorMessage from "@modules/checkout/components/error-message"
import { StripeCardContainer } from "@modules/checkout/components/payment-container"
import SellAbroadContainer from "@modules/checkout/components/sellabroad-container"
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
  const [tab, setTab] = useState<"sellabroad" | "stripe">("sellabroad")

  const stripeMethod = availablePaymentMethods?.find((m) => isStripeLike(m.id))
  const otherMethods =
    availablePaymentMethods?.filter((m) => !isStripeLike(m.id)) ?? []

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
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

  /* Default tab is SellAbroad — make sure it has a Medusa session backing it. */
  useEffect(() => {
    if (isOpen && tab === "sellabroad" && !selectedPaymentMethod) {
      const fallback = otherMethods[0]
      if (fallback) {
        setPaymentMethod(fallback.id)
      }
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
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
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
              <div
                className="flex gap-x-1 mb-6 p-1 rounded-lg w-fit"
                style={{ background: "#F1EEE9" }}
                role="tablist"
              >
                {(
                  [
                    { key: "sellabroad", label: "Pay by card" },
                    { key: "stripe", label: "Stripe" },
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
                    }}
                    className="px-4 py-2 rounded-md text-sm transition-colors"
                    style={{
                      fontFamily: "'Outfit', sans-serif",
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

              {/*
                SellAbroad takes the payment inside its own widget and the
                order is created by our webhook on payment.container.succeeded.
                So there is deliberately no "continue to review" step here — a
                Place Order button would let a customer create an unpaid order.
                The Medusa session is still initiated silently (see the effect
                above) because completing the cart requires one.
              */}
              {tab === "sellabroad" && (
                <div className="flex flex-col gap-y-4">
                  <SellAbroadContainer cart={cart} />
                  <p className="text-xs" style={{ color: "#8A8A8A" }}>
                    Your order is confirmed as soon as payment completes above.
                  </p>
                </div>
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
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
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
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
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
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
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

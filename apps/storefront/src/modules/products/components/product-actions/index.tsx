"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    if (varopt.option_id) acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const countryCode = useParams().countryCode as string

  const QTY_MAX = 10
  const clampQty = (n: number) => Math.max(1, Math.min(QTY_MAX, Math.round(n) || 1))

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    // Single-variant products (every Cylix product is one dose) are always the
    // one variant — select it directly rather than matching option keymaps,
    // which can fail if the variant's option values aren't fully populated.
    if (product.variants.length === 1) {
      return product.variants[0]
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    if (product.variants?.length === 1) {
      return true
    }
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })

    setIsAdding(false)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 2200)
  }

  const scrollToCoa = () => {
    document
      .getElementById("cx-coa")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const outOfStock = !inStock || !isValidVariant

  return (
    <>
      <div className="flex flex-col gap-5" ref={actionsRef}>
        {/* Price */}
        <div className="font-display text-[clamp(30px,4vw,40px)] font-black tracking-tight text-ink">
          <ProductPrice product={product} variant={selectedVariant} />
        </div>

        {/* Strength / variant pills (multi-variant only) */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-3">
            {(product.options || []).map((option) => (
              <OptionSelect
                key={option.id}
                option={option}
                current={options[option.id]}
                updateOption={setOptionValue}
                title={option.title ?? ""}
                data-testid="product-options"
                disabled={!!disabled || isAdding}
              />
            ))}
          </div>
        )}

        {/* New-customer note — real CYLIX code */}
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-500/35 bg-gold-50 px-4 py-2 text-[12.5px] font-semibold text-gold-800">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          New here? Use code <span className="font-extrabold">CYLIX</span> for 10% off your first order
        </div>

        {/* Quantity stepper */}
        <div className="flex flex-col gap-2">
          <span className="font-display text-[13px] font-bold text-ink">Quantity</span>
          <div className="inline-flex w-fit items-center rounded-full border border-ink/15 bg-white/70">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => clampQty(q - 1))}
              disabled={quantity <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[20px] leading-none text-ink/70 transition-colors hover:text-ink disabled:opacity-30"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={QTY_MAX}
              value={quantity}
              onChange={(e) => setQuantity(clampQty(Number(e.target.value)))}
              aria-label="Quantity"
              className="h-11 w-12 border-0 bg-transparent text-center font-display text-[16px] font-bold text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => clampQty(q + 1))}
              disabled={quantity >= QTY_MAX}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[20px] leading-none text-ink/70 transition-colors hover:text-ink disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions row: Add to cart + Certificate of Analysis */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.3fr_1fr]">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock || !selectedVariant || !!disabled || isAdding}
            data-testid="add-product-button"
            className="inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-ink px-6 font-display text-[15px] font-bold text-sand shadow-[0_18px_36px_-16px_rgba(13,13,13,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0"
          >
            {isAdding ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-sand/40 border-t-sand" />
            ) : (
              <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6h15l-1.5 9h-13z M6 6L5 3H2 M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
              </svg>
            )}
            {isAdding
              ? "Adding…"
              : justAdded
              ? "Added ✓"
              : outOfStock
              ? "Out of stock"
              : "Add to cart"}
          </button>
          <button
            type="button"
            onClick={scrollToCoa}
            className="inline-flex h-[54px] items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/70 px-5 font-display text-[14px] font-bold text-ink transition-colors duration-200 hover:border-gold-500 hover:text-gold-700"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M14 3v5h5 M9 13h6 M9 17h6" />
            </svg>
            Certificate of Analysis
          </button>
        </div>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}

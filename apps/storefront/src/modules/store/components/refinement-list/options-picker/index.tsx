"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { useEffect, useState } from "react"

import { ChevronDownMini } from "@medusajs/icons"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import clsx from "clsx"

type OptionsPickerProps = {
  selectedValueIds: string[]
  setOptionValueIds: (valueIds: string[]) => void
}

const OptionsPicker = ({
  selectedValueIds,
  setOptionValueIds,
}: OptionsPickerProps) => {
  const [options, setOptions] = useState<HttpTypes.StoreProductOption[]>([])
  const [openItems, setOpenItems] = useState<string[]>([])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await sdk.client.fetch<{
          product_options?: HttpTypes.StoreProductOption[]
        }>("/store/product-options", {
          method: "GET",
          query: {
            is_exclusive: false,
            fields: "*values",
          },
        })

        if (response?.product_options) {
          setOptions(response.product_options)
        }
      } catch (error) {
        console.error("Failed to fetch product options", error)
      }
    }

    fetchOptions()
  }, [])

  // Each product carries its own option (e.g. a "Size" option holding a single
  // dose like "10mg"), so the raw list has one entry per product. Merge them by
  // title into a single filter, de-duping values by label and collecting every
  // underlying value id so selecting "10mg" matches all products offering it.
  const mergedOptions = (() => {
    const byTitle = new Map<
      string,
      { title: string; values: Map<string, string[]> }
    >()

    for (const option of options) {
      const title = option.title || "Option"
      if (!byTitle.has(title)) {
        byTitle.set(title, { title, values: new Map() })
      }
      const group = byTitle.get(title)!
      for (const value of option.values ?? []) {
        if (!value.id || !value.value) continue
        const ids = group.values.get(value.value) ?? []
        ids.push(value.id)
        group.values.set(value.value, ids)
      }
    }

    return Array.from(byTitle.values()).map((group) => ({
      title: group.title,
      values: Array.from(group.values.entries())
        .map(([label, ids]) => ({ label, ids }))
        // Natural sort so "70mg" and "1000mg" order numerically, not lexically.
        .sort((a, b) =>
          a.label.localeCompare(b.label, undefined, { numeric: true })
        ),
    }))
  })()

  useEffect(() => {
    if (mergedOptions.length) {
      setOpenItems(mergedOptions.map((option) => option.title))
    }
  }, [options])

  if (!mergedOptions.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between px-1">
        <span className="txt-compact-small-plus text-ink/60">
          Options
        </span>
      </div>
      <Accordion.Root
        type="multiple"
        value={openItems}
        onValueChange={(values) => setOpenItems(values as string[])}
        className="flex flex-col gap-y-3 pr-6"
      >
        {mergedOptions.map((option) => {
          const values = option.values

          if (!values.length) {
            return null
          }

          // A dose label maps to one or more underlying value ids (one per
          // product). Toggling adds/removes them all together.
          const toggleValue = (ids: string[]) => {
            const isSelected = ids.some((id) => selectedValueIds.includes(id))
            const nextSelections = isSelected
              ? selectedValueIds.filter((id) => !ids.includes(id))
              : [...selectedValueIds, ...ids]

            setOptionValueIds(Array.from(new Set(nextSelections)))
          }

          const isOpen = openItems.includes(option.title)
          const selectedCount = values.filter((value) =>
            value.ids.some((id) => selectedValueIds.includes(id))
          ).length

          return (
            <Accordion.Item
              key={option.title}
              value={option.title}
              className="overflow-hidden"
            >
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="txt-compact-small-plus text-ink">
                      {option.title || "Option"}
                    </span>
                    <span className="txt-compact-small-plus text-ink/50">
                      ({selectedCount})
                    </span>
                  </div>
                  <span
                    className={clsx(
                      "flex h-7 w-7 items-center justify-center text-ink/50 transition-transform duration-150",
                      {
                        "rotate-180": isOpen,
                      }
                    )}
                  >
                    <ChevronDownMini />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pb-4 pt-1">
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => {
                    const isSelected = value.ids.some((id) =>
                      selectedValueIds.includes(id)
                    )

                    return (
                      <button
                        key={value.label}
                        onClick={() => toggleValue(value.ids)}
                        className={clsx(
                          "border-cream border text-small-regular h-10 rounded-lg px-3 flex items-center transition-colors duration-150",
                          {
                            "border-gold-500 text-ink":
                              isSelected,
                            "text-ink/50 hover:text-ink":
                              !isSelected,
                          }
                        )}
                        aria-pressed={isSelected}
                      >
                        {value.label}
                      </button>
                    )
                  })}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </div>
  )
}

export default OptionsPicker

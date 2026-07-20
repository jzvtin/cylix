"use client"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const meta = (product: HttpTypes.StoreProduct, key: string) => {
  const value = product.metadata?.[key]
  return value === undefined || value === null || value === "" ? null : String(value)
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Specifications",
      component: <SpecificationsTab product={product} />,
    },
    {
      label: "Handling & Storage",
      component: <HandlingTab product={product} />,
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="font-semibold">{label}</span>
    <p>{value}</p>
  </div>
)

const SpecificationsTab = ({ product }: ProductTabsProps) => {
  const weight = product.weight ? `${product.weight} g` : null

  const left = [
    { label: "Purity (HPLC)", value: meta(product, "purity") ?? "≥99% — see Certificate of Analysis" },
    { label: "Identity (MS)", value: meta(product, "identity") ?? "Confirmed by mass spectrometry" },
    { label: "CAS number", value: meta(product, "cas") ?? "—" },
    { label: "Molecular formula", value: meta(product, "molecular_formula") ?? "—" },
  ]

  const right = [
    { label: "Molecular weight", value: meta(product, "molecular_weight") ?? "—" },
    { label: "Form", value: meta(product, "form") ?? "Lyophilised powder" },
    { label: "Country of origin", value: product.origin_country ?? "United States" },
    { label: "Net weight", value: meta(product, "fill_weight") ?? weight ?? "—" },
  ]

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          {left.map((r) => (
            <Row key={r.label} {...r} />
          ))}
        </div>
        <div className="flex flex-col gap-y-4">
          {right.map((r) => (
            <Row key={r.label} {...r} />
          ))}
        </div>
      </div>
      <p className="mt-8 text-xs text-ui-fg-subtle max-w-xl">
        Every lot ships with a batch-specific Certificate of Analysis from an
        independent laboratory. Request the CoA for your lot at{" "}
        <a className="underline" href="mailto:support@cylixresearch.com">
          support@cylixresearch.com
        </a>
        .
      </p>
    </div>
  )
}

const HandlingTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="flex flex-col gap-y-6 max-w-xl">
        <div>
          <span className="font-semibold">Storage</span>
          <p>
            {meta(product, "storage") ??
              "Store lyophilised powder at -20°C, protected from light. Material is shipped at ambient temperature and remains stable in transit."}
          </p>
        </div>
        <div>
          <span className="font-semibold">Reconstitution</span>
          <p>
            {meta(product, "reconstitution") ??
              "Reconstitute with bacteriostatic or sterile water as appropriate for your protocol. Once in solution, store at 4°C for short-term use or -20°C for longer-term storage. Avoid repeated freeze-thaw cycles."}
          </p>
        </div>
        <div>
          <span className="font-semibold">Handling</span>
          <p>
            Handle in a suitably equipped laboratory using standard personal
            protective equipment. Not for use outside a controlled research
            setting.
          </p>
        </div>
        <div className="border-t pt-6">
          <span className="font-semibold">Research use only</span>
          <p>
            This material is supplied for in-vitro laboratory research and
            analytical method development only. It is not a drug, food, or
            cosmetic, and is not for human or animal consumption, injection,
            dosing, or administration of any kind. Purchaser must be 21 or older
            and assumes full responsibility for safe and lawful handling.
          </p>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="flex flex-col gap-y-6 max-w-xl">
        <div>
          <span className="font-semibold">Dispatch</span>
          <p>
            Orders placed before 2pm EST on a business day are dispatched the
            same day. Everything else goes out within 12–24 hours. Free shipping
            on all US orders, with tracking emailed once the label is created.
          </p>
        </div>
        <div>
          <span className="font-semibold">Damaged, incorrect, or lost orders</span>
          <p>
            If material arrives damaged, the wrong item was shipped due to our
            error, or an order is lost in transit, we will replace it or refund
            it in full. Contact us within 7 days of the expected delivery date
            and include your order number.
          </p>
        </div>
        <div>
          <span className="font-semibold">Returns</span>
          <p>
            Because these are laboratory reference materials, we cannot accept
            returns of opened or used product — chain of custody cannot be
            verified once a vial has left our control. Unopened material in its
            original packaging may be returned within 14 days of delivery.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs

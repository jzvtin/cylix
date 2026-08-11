"use client"

import { useState } from "react"
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
    { label: "Specifications", component: <SpecificationsTab product={product} /> },
    { label: "Handling & Storage", component: <HandlingTab product={product} /> },
    { label: "Shipping & Returns", component: <ShippingInfoTab /> },
  ]

  const [open, setOpen] = useState<number | null>(0)

  return (
    <div style={{ width: "100%", borderTop: "1px solid #E8E4DE" }}>
      {tabs.map((tab, i) => {
        const isOpen = open === i
        return (
          <div key={tab.label} style={{ borderBottom: "1px solid #E8E4DE" }}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "16px 2px",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "-0.1px",
                  color: isOpen ? "#C9963A" : "#0D0D0D",
                  transition: "color 0.15s",
                }}
              >
                {tab.label}
              </span>
              <span
                aria-hidden
                style={{
                  color: isOpen ? "#C9963A" : "#9a9a9a",
                  fontSize: "18px",
                  lineHeight: 1,
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease, color 0.15s",
                  display: "inline-block",
                }}
              >
                +
              </span>
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.25s ease",
              }}
            >
              <div style={{ overflow: "hidden" }}>{tab.component}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div
      style={{
        fontFamily: "'Poppins',sans-serif",
        fontSize: "10px",
        fontWeight: 800,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        color: "#999",
        marginBottom: "3px",
      }}
    >
      {label}
    </div>
    <p style={{ fontSize: "13px", color: "#333", margin: 0, lineHeight: 1.5 }}>{value}</p>
  </div>
)

const Block = ({ heading, children }: { heading: string; children: React.ReactNode }) => (
  <div>
    <div
      style={{
        fontFamily: "'Poppins',sans-serif",
        fontSize: "10px",
        fontWeight: 800,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        color: "#999",
        marginBottom: "4px",
      }}
    >
      {heading}
    </div>
    <p style={{ fontSize: "13px", color: "#444", margin: 0, lineHeight: 1.65 }}>{children}</p>
  </div>
)

const SpecificationsTab = ({ product }: ProductTabsProps) => {
  const weight = product.weight ? `${product.weight} g` : null

  const rows = [
    { label: "Purity (HPLC)", value: meta(product, "purity") ?? "≥99% — see Certificate of Analysis" },
    { label: "Identity (MS)", value: meta(product, "identity") ?? "Confirmed by mass spectrometry" },
    { label: "CAS number", value: meta(product, "cas") ?? "—" },
    { label: "Molecular formula", value: meta(product, "molecular_formula") ?? "—" },
    { label: "Molecular weight", value: meta(product, "molecular_weight") ?? "—" },
    { label: "Form", value: meta(product, "form") ?? "Lyophilised powder" },
    { label: "Country of origin", value: product.origin_country ?? "United States" },
    { label: "Net weight", value: meta(product, "fill_weight") ?? weight ?? "—" },
  ]

  return (
    <div style={{ paddingBottom: "22px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px 32px",
        }}
      >
        {rows.map((r) => (
          <Row key={r.label} {...r} />
        ))}
      </div>
      <p style={{ marginTop: "22px", fontSize: "11px", color: "#999", maxWidth: "36rem", lineHeight: 1.6 }}>
        Every lot ships with a batch-specific Certificate of Analysis from an
        independent laboratory. Request the CoA for your lot at{" "}
        <a style={{ textDecoration: "underline", color: "#0D0D0D" }} href="mailto:support@cylixlab.com">
          support@cylixlab.com
        </a>
        .
      </p>
    </div>
  )
}

const HandlingTab = ({ product }: ProductTabsProps) => (
  <div style={{ paddingBottom: "22px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "36rem" }}>
    <Block heading="Storage">
      {meta(product, "storage") ??
        "Store lyophilised powder at -20°C, protected from light. Material is shipped at ambient temperature and remains stable in transit."}
    </Block>
    <Block heading="Reconstitution">
      {meta(product, "reconstitution") ??
        "Reconstitute with bacteriostatic or sterile water as appropriate for your protocol. Once in solution, store at 4°C for short-term use or -20°C for longer-term storage. Avoid repeated freeze-thaw cycles."}
    </Block>
    <Block heading="Handling">
      Handle in a suitably equipped laboratory using standard personal protective
      equipment. Not for use outside a controlled research setting.
    </Block>
    <div style={{ borderTop: "1px solid #E8E4DE", paddingTop: "16px" }}>
      <Block heading="Research use only">
        This material is supplied for in-vitro laboratory research and analytical
        method development only. It is not a drug, food, or cosmetic, and is not for
        human or animal consumption, injection, dosing, or administration of any kind.
        Purchaser must be 21 or older and assumes full responsibility for safe and
        lawful handling.
      </Block>
    </div>
  </div>
)

const ShippingInfoTab = () => (
  <div style={{ paddingBottom: "22px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "36rem" }}>
    <Block heading="Dispatch">
      Orders placed before 2pm EST on a business day are dispatched the same day.
      Everything else goes out within 12–24 hours. Free shipping on all US orders,
      with tracking available in your account once the label is created.
    </Block>
    <Block heading="Damaged, incorrect, or lost orders">
      If material arrives damaged, the wrong item was shipped due to our error, or an
      order is lost in transit, we will replace it or refund it in full. Contact us
      within 7 days of the expected delivery date and include your order number.
    </Block>
    <Block heading="Returns">
      Because these are laboratory reference materials, we cannot accept returns of
      opened or used product — chain of custody cannot be verified once a vial has
      left our control. Unopened material in its original packaging may be returned
      within 14 days of delivery.
    </Block>
  </div>
)

export default ProductTabs

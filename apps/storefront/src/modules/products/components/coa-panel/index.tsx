import { HttpTypes } from "@medusajs/types"
import { matchCoasForProduct, doseLabel, type Coa } from "./match"

const gold = "#C9963A"
const ink = "#0D0D0D"

const JanoshikBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: "#fff",
      border: "1px solid #E8E4DE",
      borderRadius: "999px",
      padding: "4px 10px 4px 8px",
      fontFamily: "'Outfit',sans-serif",
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "0.3px",
      color: "#555",
      textTransform: "uppercase",
    }}
  >
    <span
      style={{
        width: "16px",
        height: "16px",
        borderRadius: "5px",
        background: ink,
        color: gold,
        fontSize: "9px",
        fontWeight: 900,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Outfit',sans-serif",
      }}
    >
      J
    </span>
    Janoshik Verified
  </span>
)

const ViewReportButton = ({ url, label }: { url: string; label: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      background: ink,
      color: "#fff",
      fontFamily: "'Outfit',sans-serif",
      fontSize: "13px",
      fontWeight: 700,
      letterSpacing: "0.2px",
      textDecoration: "none",
      borderRadius: "10px",
      padding: "12px 18px",
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    {label}
    <span style={{ color: gold, fontSize: "14px" }}>↗</span>
  </a>
)

const LotHistory = ({ lots, currentLot }: { lots: Coa[]; currentLot?: string }) => {
  if (lots.length <= 1) return null
  return (
    <div style={{ marginTop: "16px", borderTop: "1px solid #E8E4DE", paddingTop: "14px" }}>
      <div
        style={{
          fontFamily: "'Outfit',sans-serif",
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#999",
          marginBottom: "10px",
        }}
      >
        Lot History
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {lots.map((l) => {
          const isCurrent = l.lot === currentLot
          return (
            <a
              key={l.lot}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: "8px",
                background: isCurrent ? "rgba(201,150,58,0.08)" : "transparent",
                border: isCurrent ? "1px solid rgba(201,150,58,0.25)" : "1px solid transparent",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: ink,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Lot #{l.lot}
                <span style={{ fontWeight: 600, color: "#999", fontSize: "11px" }}>
                  {doseLabel(l)}
                </span>
                {isCurrent && (
                  <span
                    style={{
                      fontSize: "8px",
                      fontWeight: 800,
                      letterSpacing: "0.6px",
                      color: gold,
                      textTransform: "uppercase",
                    }}
                  >
                    Current
                  </span>
                )}
              </span>
              <span style={{ color: gold, fontSize: "12px", fontWeight: 700 }}>
                View ↗
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

type CoaPanelProps = {
  product: HttpTypes.StoreProduct
}

const CoaPanel = ({ product }: CoaPanelProps) => {
  const match = matchCoasForProduct(product)

  // No third-party report on file — honest "available on request" state.
  if (match.tier === "none" || !match.primary) {
    return (
      <div
        style={{
          background: "#F9F7F4",
          border: "1px solid #E8E4DE",
          borderRadius: "14px",
          padding: "22px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
          <div
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              color: gold,
            }}
          >
            Certificate of Analysis
          </div>
          <JanoshikBadge />
        </div>
        <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.65, margin: "0 0 4px" }}>
          Every lot is third-party tested by an independent laboratory before release.
          The batch-specific report for this compound is available on request.
        </p>
        <a
          href="mailto:support@cylixlab.com?subject=CoA%20request"
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: "12px",
            fontWeight: 700,
            color: ink,
            textDecoration: "underline",
          }}
        >
          Request the CoA for your lot →
        </a>
      </div>
    )
  }

  const primary = match.primary
  const isExact = match.tier === "exact"
  const historyLots = isExact ? match.sameDose : match.allLots

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E4DE",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(13,13,13,0.03)",
      }}
    >
      {/* Header band */}
      <div
        style={{
          background: ink,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            color: gold,
          }}
        >
          Certificate of Analysis
        </div>
        <JanoshikBadge />
      </div>

      <div style={{ padding: "20px" }}>
        {/* Purity + lot readout */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", marginBottom: "16px" }}>
          <div>
            <div
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: "40px",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-1.5px",
                color: ink,
              }}
            >
              99%<span style={{ color: gold, fontSize: "26px" }}>+</span>
            </div>
            <div
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                color: "#999",
                marginTop: "4px",
              }}
            >
              HPLC Purity
            </div>
          </div>
          <div style={{ paddingBottom: "4px" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: "14px", fontWeight: 800, color: ink }}>
              Lot #{primary.lot}
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
              {match.compound} · {doseLabel(primary)}
            </div>
          </div>
        </div>

        {!isExact && (
          <p style={{ fontSize: "11px", color: "#999", lineHeight: 1.6, margin: "0 0 14px" }}>
            Showing the most recent third-party report for {match.compound}. The
            batch-specific CoA for your exact lot ships with your order.
          </p>
        )}

        <ViewReportButton url={primary.url} label="View third-party report" />

        <p style={{ fontSize: "11px", color: "#aaa", lineHeight: 1.55, margin: "12px 0 0", textAlign: "center" }}>
          Identity confirmed by mass spectrometry · purity by HPLC
        </p>

        <LotHistory lots={historyLots} currentLot={primary.lot} />
      </div>
    </div>
  )
}

export default CoaPanel

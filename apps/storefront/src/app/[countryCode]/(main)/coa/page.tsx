import { Metadata } from "next"
import Reveal from "@modules/common/components/reveal"
import { coasByCompound, doseLabel, COA_LAB } from "@modules/products/components/coa-panel/match"

export const metadata: Metadata = {
  title: "Certificate of Analysis Library | Cylix Research",
  description:
    "Every Cylix Research lot is tested by Janoshik Analytical, an independent laboratory. Browse third-party HPLC purity and mass-spec identity reports by compound and lot.",
}

const gold = "#C9963A"
const ink = "#0D0D0D"

const JanoshikBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.16)",
      borderRadius: "999px",
      padding: "6px 14px 6px 10px",
      fontFamily: "'Poppins',sans-serif",
      fontSize: "11px",
      fontWeight: 800,
      letterSpacing: "0.4px",
      color: "rgba(255,255,255,0.85)",
      textTransform: "uppercase",
    }}
  >
    <span
      style={{
        width: "18px",
        height: "18px",
        borderRadius: "5px",
        background: gold,
        color: ink,
        fontSize: "10px",
        fontWeight: 900,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins',sans-serif",
      }}
    >
      J
    </span>
    Verified by {COA_LAB}
  </span>
)

const eyebrow = {
  fontFamily: "'Poppins',sans-serif",
  fontSize: "10px",
  fontWeight: 800,
  letterSpacing: "1.4px",
  textTransform: "uppercase" as const,
  color: gold,
}

export default function CoaPage() {
  const groups = coasByCompound()
  const totalLots = groups.reduce((n, g) => n + g.lots.length, 0)

  return (
    <>
      {/* HERO */}
      <div style={{ background: ink, padding: "56px 32px 48px", textAlign: "center" }}>
        <div style={{ ...eyebrow, marginBottom: "12px" }}>Documentation</div>
        <h1
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: "clamp(30px,5vw,48px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-1.4px",
            marginBottom: "14px",
          }}
        >
          Certificate of Analysis{" "}
          <em style={{ fontStyle: "normal", color: gold }}>Library</em>
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
            maxWidth: "560px",
            margin: "0 auto 22px",
            lineHeight: 1.7,
          }}
        >
          Every lot is tested before release by an independent laboratory we do not
          own or control. {totalLots} third-party reports across {groups.length}{" "}
          compounds — open any one.
        </p>
        <JanoshikBadge />
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 32px 40px" }}>
        {/* HOW TO READ */}
        <Reveal>
          <div
            style={{
              background: "#F9F7F4",
              border: "1px solid #E8E4DE",
              borderRadius: "16px",
              padding: "26px 28px",
              marginBottom: "44px",
            }}
          >
            <div style={{ ...eyebrow, marginBottom: "14px" }}>How to read a CoA</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "20px",
              }}
            >
              {[
                { t: "Lot / batch number", d: "Ties the report to the exact production run your vial came from. A CoA for a different lot tells you nothing about yours." },
                { t: "HPLC purity", d: "Chromatographic purity as a share of total peak area. Our release threshold is 99%." },
                { t: "MS identity", d: "The observed mass, which should match the theoretical molecular weight of the named compound." },
                { t: "Test date", d: "When the analysis was performed by the lab." },
              ].map((c) => (
                <div key={c.t}>
                  <div
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      fontSize: "13px",
                      fontWeight: 800,
                      color: ink,
                      marginBottom: "5px",
                    }}
                  >
                    {c.t}
                  </div>
                  <p style={{ fontSize: "12px", color: "#666", lineHeight: 1.6, margin: 0 }}>
                    {c.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* GROUPED LIBRARY */}
        {groups.map((group) => (
          <Reveal key={group.compound}>
            <section style={{ marginBottom: "40px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "12px",
                  marginBottom: "16px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #E8E4DE",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: "20px",
                    fontWeight: 800,
                    color: ink,
                    letterSpacing: "-0.4px",
                    margin: 0,
                  }}
                >
                  {group.compound}
                </h2>
                <span
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#aaa",
                  }}
                >
                  {group.lots.length} {group.lots.length === 1 ? "lot" : "lots"}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "14px",
                }}
              >
                {group.lots.map((lot, i) => (
                  <a
                    key={lot.lot}
                    href={lot.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      background: "#fff",
                      border: "1px solid #E8E4DE",
                      borderRadius: "14px",
                      padding: "18px",
                      textDecoration: "none",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "14px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Poppins',sans-serif",
                          fontSize: "10px",
                          fontWeight: 800,
                          letterSpacing: "0.6px",
                          textTransform: "uppercase",
                          color: gold,
                        }}
                      >
                        {i === 0 ? "Current lot" : "Lot history"}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Poppins',sans-serif",
                          fontSize: "10px",
                          fontWeight: 800,
                          color: "#666",
                          background: "#F9F7F4",
                          border: "1px solid #E8E4DE",
                          borderRadius: "6px",
                          padding: "3px 7px",
                        }}
                      >
                        {doseLabel(lot)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: "22px",
                        fontWeight: 900,
                        color: ink,
                        letterSpacing: "-0.5px",
                        marginBottom: "2px",
                      }}
                    >
                      Lot #{lot.lot}
                    </div>
                    <div style={{ fontSize: "12px", color: "#999", marginBottom: "16px" }}>
                      HPLC · MS · 99%+ purity
                    </div>
                    <div
                      style={{
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: ink,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      View report <span style={{ color: gold }}>↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </Reveal>
        ))}

        {/* FOOTNOTE */}
        <Reveal>
          <p style={{ fontSize: "12px", color: "#999", lineHeight: 1.7, marginTop: "8px", maxWidth: "640px" }}>
            A Certificate of Analysis describes the chemical identity and purity of a
            specific lot at the time it was tested. It is an analytical document and
            nothing more — not evidence of safety or efficacy in humans or animals.
            These materials are supplied for in-vitro laboratory research only. See our{" "}
            <a href="/disclaimer" style={{ textDecoration: "underline", color: ink }}>
              Research Use Only disclaimer
            </a>
            . To request the CoA for the exact lot you received, email{" "}
            <a href="mailto:support@cylixlab.com" style={{ textDecoration: "underline", color: ink }}>
              support@cylixlab.com
            </a>{" "}
            with your order and lot number.
          </p>
        </Reveal>
      </div>
    </>
  )
}

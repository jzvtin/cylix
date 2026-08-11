import type { Metadata } from "next"

import { ORG_TYPES } from "@lib/age-gate"

export const metadata: Metadata = {
  title: "Age Verification | Cylix Research",
  description:
    "Confirm you are 21 or older and a qualified researcher to enter Cylix Research.",
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ returnTo?: string; error?: string }>

export default async function AgeVerificationPage(props: {
  searchParams: SearchParams
}) {
  const { returnTo, error } = await props.searchParams
  const safeReturnTo =
    returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : "/"

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#0E0E0F",
        fontFamily: "'Poppins', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          padding: "44px 40px",
          maxWidth: "480px",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
            color: "#C9963A",
            marginBottom: "14px",
          }}
        >
          Age Verification
        </div>
        <h1
          style={{
            fontSize: "30px",
            fontWeight: 900,
            color: "#111",
            letterSpacing: "-0.9px",
            lineHeight: 1.1,
            margin: "0 0 12px",
          }}
        >
          You must be 21+ to enter
        </h1>
        <p
          style={{
            fontSize: "13.5px",
            color: "#888",
            lineHeight: 1.7,
            margin: "0 0 28px",
          }}
        >
          Cylix Research supplies analytical-grade biochemical reference
          standards to qualified researchers. All products are for in-vitro
          laboratory research only — not for human or animal consumption. Please
          confirm the following to continue.
        </p>

        {error && (
          <div
            role="alert"
            style={{
              background: "#FCECEC",
              border: "1px solid #E9C4C4",
              color: "#9A3B3B",
              borderRadius: "10px",
              padding: "12px 14px",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            Please tick the confirmation box and select a research category to
            enter.
          </div>
        )}

        <form action="/api/age-verification" method="POST">
          <input type="hidden" name="returnTo" value={safeReturnTo} />

          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              color: "#666",
              marginBottom: "8px",
            }}
          >
            I am purchasing as
          </label>
          <select
            name="org_type"
            defaultValue=""
            required
            style={{
              width: "100%",
              padding: "13px 14px",
              borderRadius: "10px",
              border: "1px solid #E2DED7",
              background: "#FBFAF8",
              fontSize: "14px",
              color: "#111",
              marginBottom: "22px",
              fontFamily: "inherit",
            }}
          >
            <option value="" disabled>
              Select research category…
            </option>
            {ORG_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label
            style={{
              display: "flex",
              gap: "11px",
              alignItems: "flex-start",
              cursor: "pointer",
              marginBottom: "26px",
            }}
          >
            <input
              type="checkbox"
              name="confirm"
              required
              style={{ marginTop: "3px", width: "17px", height: "17px", flexShrink: 0 }}
            />
            <span style={{ fontSize: "13px", color: "#333", lineHeight: 1.6 }}>
              I am at least <strong>21 years of age</strong> and confirm I am a
              qualified researcher purchasing solely for in-vitro / laboratory
              research use.
            </span>
          </label>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "15px",
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: "11px",
              fontFamily: "inherit",
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "0.3px",
              cursor: "pointer",
            }}
          >
            Enter Cylix Research →
          </button>
        </form>

        <a
          href="https://www.google.com"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "14px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#999",
            textDecoration: "none",
          }}
        >
          No, exit site
        </a>

        <p
          style={{
            fontSize: "10.5px",
            color: "#c4c4c4",
            marginTop: "24px",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          These statements have not been evaluated by the FDA. Products are not
          drugs and are not intended to diagnose, treat, cure, or prevent any
          disease.
        </p>
      </div>
    </div>
  )
}

import React from "react"

type LegalPageProps = {
  eyebrow: string
  title: string
  accent?: string
  intro: string
  updated: string
  children: React.ReactNode
}

export const Section = ({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) => (
  <section style={{ marginBottom: "34px" }}>
    <h2
      style={{
        fontFamily: "'Outfit',sans-serif",
        fontSize: "16px",
        fontWeight: 800,
        color: "#111",
        letterSpacing: "-0.3px",
        marginBottom: "10px",
      }}
    >
      {heading}
    </h2>
    <div
      style={{
        fontSize: "14px",
        color: "#4A4A4A",
        lineHeight: 1.8,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {children}
    </div>
  </section>
)

const LegalPage = ({
  eyebrow,
  title,
  accent,
  intro,
  updated,
  children,
}: LegalPageProps) => {
  return (
    <>
      <div
        style={{
          background: "#111",
          padding: "56px 32px 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: "10px",
            fontWeight: 800,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
            color: "#C9963A",
            marginBottom: "10px",
          }}
        >
          {eyebrow}
        </div>
        <h1
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: "clamp(28px,5vw,44px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-1.2px",
            marginBottom: "10px",
          }}
        >
          {title}
          {accent ? (
            <>
              {" "}
              <em style={{ fontStyle: "normal", color: "#C9963A" }}>{accent}</em>
            </>
          ) : null}
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.45)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.65,
          }}
        >
          {intro}
        </p>
      </div>

      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "52px 32px 80px",
        }}
      >
        <p
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.8px",
            textTransform: "uppercase",
            color: "#999",
            marginBottom: "32px",
          }}
        >
          Last updated {updated}
        </p>
        {children}
      </div>
    </>
  )
}

export default LegalPage

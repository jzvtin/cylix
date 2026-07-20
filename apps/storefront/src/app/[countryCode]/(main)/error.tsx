"use client"

import Link from "next/link"

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 32px",
      }}
    >
      <div style={{ maxWidth: "460px", textAlign: "center" }}>
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
          Error
        </div>
        <h1
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: "28px",
            fontWeight: 900,
            color: "#111",
            letterSpacing: "-1px",
            marginBottom: "12px",
          }}
        >
          This page didn&apos;t load
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            lineHeight: 1.7,
            marginBottom: "26px",
          }}
        >
          Something went wrong on our end. Your cart is safe.
          {error.digest ? ` Reference: ${error.digest}.` : ""}
        </p>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={reset}
            style={{
              padding: "12px 26px",
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              fontFamily: "'Outfit',sans-serif",
              fontSize: "13px",
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Try again
          </button>
          <Link
            href="/support"
            style={{
              padding: "12px 26px",
              background: "transparent",
              color: "#111",
              border: "1.5px solid #E8E4DE",
              borderRadius: "20px",
              fontFamily: "'Outfit',sans-serif",
              fontSize: "13px",
              fontWeight: 800,
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}

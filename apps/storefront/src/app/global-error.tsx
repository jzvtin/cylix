"use client"

/**
 * Last-resort boundary. This replaces the entire document, so it must render
 * its own <html>/<body> and cannot rely on the root layout's fonts or styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F9F7F4",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "32px",
        }}
      >
        <div style={{ maxWidth: "440px", textAlign: "center" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.4px",
              textTransform: "uppercase",
              color: "#C9963A",
              marginBottom: "12px",
            }}
          >
            Cylix Research
          </p>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 800,
              color: "#111",
              letterSpacing: "-0.8px",
              marginBottom: "12px",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            We hit an unexpected error. Your cart and any completed order are
            safe. Try again, and if it keeps happening email
            support@cylixlab.com
            {error.digest ? ` quoting reference ${error.digest}` : ""}.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 28px",
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

"use client"

import { useState } from "react"
import { COMPANY } from "@lib/company"

const labelStyle = {
  fontFamily: "'Outfit',sans-serif",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  color: "#999",
  display: "block",
  marginBottom: "5px",
}

const fieldStyle = {
  width: "100%",
  padding: "10px 13px",
  border: "1.5px solid #E8E4DE",
  borderRadius: "8px",
  fontFamily: "'Plus Jakarta Sans',sans-serif",
  fontSize: "13px",
  color: "#111",
  background: "#F9F7F4",
  outline: "none",
}

const SUBJECTS = [
  "Order Inquiry",
  "CoA Request",
  "Technical Question",
  "Institutional Pricing",
  "Other",
]

/**
 * Opens the visitor's mail client with the message pre-filled. This keeps the
 * form honest with zero backend: previously it POSTed to an unconfigured
 * Formspree endpoint and every submission was silently discarded.
 *
 * Swap this for a real POST handler once a transactional email provider is
 * wired up.
 */
const SupportForm = () => {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const name = [form.get("first_name"), form.get("last_name")]
      .filter(Boolean)
      .join(" ")
      .trim()

    const subject = String(form.get("subject") || "Support request")
    const body = [
      name ? `Name: ${name}` : null,
      `Email: ${form.get("email")}`,
      "",
      String(form.get("message") || ""),
    ]
      .filter((line) => line !== null)
      .join("\n")

    window.location.href = `mailto:${COMPANY.supportEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`

    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <div>
          <label style={labelStyle}>First Name</label>
          <input name="first_name" type="text" placeholder="Jane" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle}>Last Name</label>
          <input name="last_name" type="text" placeholder="Smith" style={fieldStyle} />
        </div>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>Email</label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          style={fieldStyle}
        />
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label style={labelStyle}>Subject</label>
        <select
          name="subject"
          style={{ ...fieldStyle, appearance: "none" }}
          defaultValue={SUBJECTS[0]}
        >
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Message</label>
        <textarea
          name="message"
          placeholder="Describe your inquiry…"
          required
          rows={5}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </div>
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "13px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "20px",
          fontFamily: "'Outfit',sans-serif",
          fontSize: "13px",
          fontWeight: 800,
          cursor: "pointer",
          letterSpacing: "0.3px",
          textTransform: "uppercase",
        }}
      >
        Send Message →
      </button>
      <p
        style={{
          fontSize: "11px",
          color: "#999",
          marginTop: "12px",
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        {sent
          ? `If your mail client didn't open, email us directly at ${COMPANY.supportEmail}.`
          : "CoA requests: include your order number and lot number."}
      </p>
    </form>
  )
}

export default SupportForm

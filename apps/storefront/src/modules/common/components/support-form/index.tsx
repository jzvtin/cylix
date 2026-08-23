"use client"

import { useState } from "react"
import { COMPANY } from "@lib/company"

const SUBJECTS = [
  "Order Inquiry",
  "CoA Request",
  "Technical Question",
  "Institutional Pricing",
  "Other",
]

const labelCls =
  "mb-1.5 block font-display text-[10px] font-bold uppercase tracking-[0.5px] text-ink/45"
const fieldCls =
  "w-full rounded-[10px] border border-cream bg-sand/70 px-3.5 py-2.5 font-sans text-[13.5px] text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold-500 focus:bg-white"

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
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="sf-first" className={labelCls}>First Name</label>
          <input
            id="sf-first"
            name="first_name"
            type="text"
            placeholder="Jane"
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor="sf-last" className={labelCls}>Last Name</label>
          <input
            id="sf-last"
            name="last_name"
            type="text"
            placeholder="Smith"
            className={fieldCls}
          />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="sf-email" className={labelCls}>Email</label>
        <input
          id="sf-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className={fieldCls}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="sf-subject" className={labelCls}>Subject</label>
        <select
          id="sf-subject"
          name="subject"
          className={`${fieldCls} appearance-none`}
          defaultValue={SUBJECTS[0]}
        >
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="sf-message" className={labelCls}>Message</label>
        <textarea
          id="sf-message"
          name="message"
          placeholder="Describe your inquiry…"
          required
          rows={5}
          className={`${fieldCls} resize-y`}
        />
      </div>
      <button type="submit" className="cx-btn cx-btn-primary w-full !text-[13px] uppercase tracking-[0.3px]">
        Send Message →
      </button>
      <p className="mt-3 text-center text-[11.5px] leading-relaxed text-ink/50">
        {sent
          ? `If your mail client didn't open, email us directly at ${COMPANY.supportEmail}.`
          : "CoA requests: include your order number and lot number."}
      </p>
    </form>
  )
}

export default SupportForm

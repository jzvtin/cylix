"use client"

type ShareRowProps = {
  url: string
  message?: string
}

type ShareTarget = {
  id: string
  label: string
  href: (url: string, msg: string) => string
}

const TARGETS: ShareTarget[] = [
  {
    id: "x",
    label: "X",
    href: (url, msg) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        msg
      )}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    href: (url, msg) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(msg)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: (url, msg) =>
      `https://wa.me/?text=${encodeURIComponent(`${msg} ${url}`)}`,
  },
  {
    id: "email",
    label: "Email",
    href: (url, msg) =>
      `mailto:?subject=${encodeURIComponent(
        "A research partner code for you"
      )}&body=${encodeURIComponent(`${msg} ${url}`)}`,
  },
]

/**
 * Share buttons for a partner's referral link. Opens each network's share
 * intent in a new tab. `navigator.share` (native sheet) is offered first on
 * supporting devices.
 */
export default function ShareRow({ url, message }: ShareRowProps) {
  const msg =
    message ?? "Research-grade compounds with a Certificate of Analysis on every batch."

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Cylix Research", text: msg, url })
      } catch {
        /* user dismissed — no-op */
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={nativeShare}
        className="rounded-full border border-gold-500/40 bg-gold-50 px-4 py-2 font-display text-[12px] font-bold text-gold-700 transition-colors hover:border-gold-500 hover:text-gold-800"
      >
        Share ↗
      </button>
      {TARGETS.map((t) => (
        <a
          key={t.id}
          href={t.href(url, msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink/10 bg-white/70 px-4 py-2 font-display text-[12px] font-bold text-ink/65 transition-colors hover:border-ink/25 hover:text-ink"
        >
          {t.label}
        </a>
      ))}
    </div>
  )
}

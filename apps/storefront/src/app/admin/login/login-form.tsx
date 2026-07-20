"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    setLoading(false)

    if (res.ok) {
      router.replace("/admin")
      router.refresh()
      return
    }

    setError(
      res.status === 503
        ? "Admin password is not set up yet. Contact your developer."
        : "That password is not right. Try again."
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white rounded-2xl p-8"
        style={{ border: "1px solid #E8E4DE" }}
      >
        <p
          className="text-xs uppercase mb-2"
          style={{ fontWeight: 800, letterSpacing: "1.2px", color: "#C9963A" }}
        >
          Cylix Research
        </p>
        <h1
          className="text-2xl mb-6"
          style={{ fontWeight: 800, color: "#111", letterSpacing: "-0.5px" }}
        >
          Store admin
        </h1>

        <label
          className="block text-sm mb-2"
          style={{ color: "#555", fontWeight: 600 }}
          htmlFor="admin-password"
        >
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg px-3 py-3 text-base mb-4 outline-none"
          style={{ border: "1px solid #E8E4DE", background: "#F9F7F4" }}
        />

        {error && (
          <p className="text-sm mb-4" style={{ color: "#B4342B" }} role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-lg py-3 text-sm disabled:opacity-50"
          style={{ background: "#111", color: "#C9963A", fontWeight: 800 }}
        >
          {loading ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  )
}

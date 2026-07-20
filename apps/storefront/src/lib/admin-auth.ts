import "server-only"

import crypto from "crypto"
import { cookies } from "next/headers"

export const ADMIN_COOKIE = "cx_admin_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

const password = () => process.env.ADMIN_PASSWORD

/**
 * Signing key for session tokens. Returns null when nothing is configured —
 * callers must fail closed rather than sign with a key an attacker can guess.
 * Falling back to ADMIN_PASSWORD is deliberately NOT done: a captured cookie
 * would otherwise let an attacker brute-force the password offline.
 */
const secret = () => process.env.ADMIN_SESSION_SECRET || null

const sign = (value: string, key: string) =>
  crypto.createHmac("sha256", key).update(value).digest("hex")

/**
 * Constant-time comparison. Both sides are hashed to a fixed 32-byte digest
 * first so the comparison never leaks the length of the expected value.
 */
const safeEqual = (a: string, b: string) => {
  const ha = new Uint8Array(crypto.createHash("sha256").update(a, "utf8").digest())
  const hb = new Uint8Array(crypto.createHash("sha256").update(b, "utf8").digest())
  return crypto.timingSafeEqual(ha, hb)
}

/** True when the admin panel has everything it needs to authenticate anyone. */
export const isAdminAuthConfigured = () => Boolean(password() && secret())

/** Constant-time password check against ADMIN_PASSWORD. */
export const isValidPassword = (input: string) => {
  const expected = password()
  if (!expected) return false
  return safeEqual(input, expected)
}

/** Session token is `<expiry>.<hmac(expiry)>` — stateless, no DB needed. */
export const createSessionToken = (now: number) => {
  const key = secret()
  if (!key) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set — refusing to issue an admin session."
    )
  }
  const expiry = String(now + SESSION_TTL_MS)
  return `${expiry}.${sign(expiry, key)}`
}

export const isValidSessionToken = (token: string | undefined, now: number) => {
  const key = secret()
  // Fail closed: with no configured secret every token is forgeable.
  if (!key || !token) return false

  const [expiry, signature] = token.split(".")
  if (!expiry || !signature) return false
  if (!safeEqual(signature, sign(expiry, key))) return false

  const expiresAt = Number(expiry)
  return Number.isFinite(expiresAt) && expiresAt > now
}

/** Read the session cookie and report whether the caller is logged in. */
export const isAdminAuthenticated = async () => {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value
  return isValidSessionToken(token, Date.now())
}

/**
 * Secure by default. This was previously keyed to NODE_ENV, which meant a stray
 * NODE_ENV=development in the deploy environment silently downgraded the
 * session cookie to travel over plaintext HTTP.
 *
 * Local development over http://localhost cannot send a Secure cookie, so it
 * must opt out explicitly by setting ADMIN_COOKIE_INSECURE=true. Anything that
 * forgets to set it gets the safe behaviour, not the unsafe one.
 */
export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.ADMIN_COOKIE_INSECURE !== "true",
  path: "/",
  maxAge: SESSION_TTL_MS / 1000,
}

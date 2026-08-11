#!/usr/bin/env node
/**
 * Creates the "CYLIX" 10%-off promotion via the Medusa Admin API over HTTPS.
 *
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD from the environment (inject them with
 * `railway run` so no secrets are ever printed). Base URL defaults to the live
 * Railway backend but honors MEDUSA_BACKEND_URL if set.
 *
 * Idempotent: if a CYLIX promotion already exists it does nothing.
 */
const BASE = (
  process.env.MEDUSA_BACKEND_URL ||
  "https://dynamic-liberation-production-c2cb.up.railway.app"
).replace(/\/$/, "");

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Missing ADMIN_EMAIL / ADMIN_PASSWORD in env.");
  process.exit(1);
}

const j = async (res) => {
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, body: JSON.parse(text) };
  } catch {
    return { ok: res.ok, status: res.status, body: text };
  }
};

// 1. Authenticate
const auth = await j(
  await fetch(`${BASE}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
);
if (!auth.ok || !auth.body?.token) {
  console.error("Auth failed:", auth.status, auth.body);
  process.exit(1);
}
const token = auth.body.token;
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

// 2. Check for an existing CYLIX promotion
const existing = await j(
  await fetch(`${BASE}/admin/promotions?code=CYLIX`, { headers: H })
);
const found = (existing.body?.promotions || []).find((p) => p.code === "CYLIX");
if (found) {
  console.log(`Promotion "CYLIX" already exists (${found.id}, status=${found.status}) — nothing to do.`);
  process.exit(0);
}

// 3. Create it: 10% off the whole order, active
const create = await j(
  await fetch(`${BASE}/admin/promotions`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({
      code: "CYLIX",
      type: "standard",
      status: "active",
      is_automatic: false,
      application_method: {
        type: "percentage",
        value: 10,
        target_type: "order",
        allocation: "across",
      },
    }),
  })
);
if (!create.ok) {
  console.error("Create failed:", create.status, JSON.stringify(create.body));
  process.exit(1);
}
const promo = create.body?.promotion;
console.log(`Created promotion "${promo?.code}" (${promo?.id}) — 10% off order, status=${promo?.status}.`);

# Cylix Labs — Square-via-Dynara payment bridge (clone of Vertex Labs) — PROCESSING NOTE

_Logged 2026-08-18. Fixes the broken cylixlab.com checkout (inline Stripe card element renders
only a skeleton — see below). Directive: clone the Vertex Labs → Dynaradigital Square bridge for
Cylix instead of debugging inline Stripe._

## Why the current checkout is broken
- Live cylixlab.com checkout shows the "Credit card" radio + an empty card box (a `SkeletonCardDetails`
  placeholder) + a disabled "ENTER CARD DETAILS" button. Customers cannot pay.
- Root cause: the inline Stripe path needs `StripeContext=true`, which only happens when
  `PaymentWrapper` mounts `<Elements>` — and that requires a pending **stripe-like** payment session
  *with a `client_secret`* reaching the wrapper. It isn't, so the card element never mounts.
  (Backend `pp_stripe_stripe` IS enabled on the US region and `NEXT_PUBLIC_STRIPE_KEY` IS set on
  Vercel, so it's a session/client_secret issue, not a missing key — but we are NOT debugging it.)
- The Square-bridge tab that WOULD work is hidden because `NEXT_PUBLIC_SQUARE_BRIDGE_ENABLED` is not
  `true`, so `showSquare` is false in `modules/checkout/components/payment/index.tsx`.

## What is ALREADY built (no new code needed)
Frontend (apps/storefront):
- `modules/checkout/components/square-bridge-container/index.tsx` — "Pay with card" → `getSquareCheckoutUrl(cart.id)` → `window.location = checkout_url`.
- `lib/data/square-bridge.ts` — POSTs `/store/square-bridge/checkout` on the Medusa backend.
- `app/[countryCode]/(main)/square-return/` — the success return page.
- `payment/index.tsx` — renders the Square tab when `NEXT_PUBLIC_SQUARE_BRIDGE_ENABLED === "true"`.

Backend (apps/backend):
- `src/api/store/square-bridge/checkout/route.ts` — reads cart total, rounds to WHOLE DOLLAR
  (141.89 → 142, same flat-charge rule as Vertex), calls `BRIDGE_URL` with `BRIDGE_SECRET`, passes
  Square `reference_id = Medusa cart id`.
- `src/api/square-bridge/confirm/route.ts` — dynara bridge → Cylix: on Square payment confirmed,
  completes the Medusa cart → creates the order (matched by cart id).

## PROCESSOR = STRIPE, ON DYNARA'S ACCOUNT (the mask). Same bridge workflow, different processor.
The flow (Justin): Cylix → "Dynara, make this payment" → Dynara → "Stripe, make a payment **with us,
Dynara**" → Stripe → "paid" (to Dynara) → Dynara → "Cylix, take a look" (`/confirm`) → order completes.

CRITICAL: the charge runs on **Dynaradigital's OWN Stripe account**, NOT Cylix's. That IS the mask —
the customer's card statement + Stripe processing show Dynaradigital, so Cylix is never the visible
merchant of record. Cylix's own Stripe keys (`NEXT_PUBLIC_STRIPE_KEY` / `STRIPE_API_KEY`, the broken
inline path) are irrelevant to the bridge and are NOT used by it.

The existing `square-bridge` code is processor-agnostic (it only ever receives a `checkout_url`), so
it is reused AS-IS; only the dynara side mints the Stripe session. (Rename square→bridge later = cosmetic.)

## What is MISSING — the actual clone work (dynara side + env)
1. **Dynara `bridge-config.php` — add a Cylix entry** (clone Vertex's, Stripe variant):
   - secret: `cylix-bridge-2026` (matches backend `BRIDGE_SECRET` default)
   - **Dynaradigital's Stripe secret key** (`sk_live_…` — DYNARA's account, the masking merchant;
     NOT Cylix's). Same Dynara Stripe account Vertex/other bridged stores charge through.
   - `payment-bridge.php`: for the Cylix entry, create a **Stripe Checkout Session** on Dynara's account
     (`mode=payment`, whole-dollar amount, `client_reference_id` = Medusa cart id,
     `success_url` = the storefront `/square-return`, `cancel_url` = back to checkout) and return
     `session.url` as `checkout_url`.
   - Stripe webhook (`checkout.session.completed`) → POST back to the Cylix Medusa backend
     `/square-bridge/confirm` with the shared secret the confirm route verifies (check `confirm/route.ts`).
2. **Env vars:**
   - Vercel (storefront): `NEXT_PUBLIC_SQUARE_BRIDGE_ENABLED=true`  ← this alone un-hides the working tab
   - Railway (backend): `BRIDGE_URL` (or leave default), `BRIDGE_SECRET=cylix-bridge-2026`, + the
     confirm-webhook shared secret the confirm route expects.
3. **Redeploy** storefront (Vercel) after the env change — `NEXT_PUBLIC_*` is build-time inlined.
4. Verify end-to-end: add to cart → checkout → "Pay with card" → **Stripe hosted checkout** (Cylix's
   own Stripe account, whole-dollar) → pay → land on `/square-return` → confirm webhook completes the
   Medusa order.

## Blockers on Justin
- Dynaradigital's Stripe `sk_live_…` wired into the dynara bridge (the masking account — likely already
  present for Vertex/other bridged stores; just add the Cylix config entry pointing at it).
- Confirm the dynara `bridge-config.php` Cylix entry (Stripe variant) + the confirm-webhook secret
  (clone from Vertex's bridge).

## Optional follow-up
- Once the bridge (hosted Stripe) is the live path, hide/remove the broken inline Stripe card tab so
  customers only see the working method (currently the inline Stripe tab is the sole visible default,
  and it's broken).

## Refs
- Vertex payment stack + Square-through-dynara mask (the thing being cloned): see PO memory
  `vertex-payment-mask`, `vertexlabs-payment-stack`, `vertexlabs-square-recovery-cron`.
- Repo source of truth: github.com/jzvtin/cylix (live = Vercel storefront + Railway Medusa backend
  `dynamic-liberation-production-c2cb.up.railway.app`).

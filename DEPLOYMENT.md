# Deployment checklist

Two separate deployments:

| Piece | Path | Hosted on |
|---|---|---|
| Medusa backend + admin | `apps/backend` | Medusa Cloud |
| Next.js storefront | `apps/storefront` | Vercel |

Deploy the backend **first** — the storefront needs its URL and a publishable
key before it can build meaningfully.

---

## 0. Before anything

**Rotate these. They exist, they are weak, and they have been shared.**

| Secret | Current state | Action |
|---|---|---|
| `ADMIN_PASSWORD` | `cylix2026` — guessable, sat in a file | Generate a new one |
| `JWT_SECRET` / `COOKIE_SECRET` | both `supersecret` | Generate 32-byte random values |
| SellAbroad API key `2264fb45…` | shared over chat | Regenerate in their dashboard |

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Push the repo to GitHub, then connect that repo to both Medusa Cloud and
Vercel.

---

## 1. Backend — `medusa-config.ts` needs work first

The config currently registers **no modules at all**. Before deploying it needs,
at minimum:

- **Redis** for cache, event bus, and workflow engine. The in-memory defaults do
  not survive multiple instances and will drop events on Medusa Cloud.
- **A file provider** (S3 or Medusa Cloud's bucket) — local file storage does
  not persist on ephemeral containers, so product images uploaded via admin will
  vanish on redeploy.
- **A payment provider.** `@medusajs/payment-stripe` is in `package.json` but is
  not registered and is not attached to the US region. Until it is, the Stripe
  tab at checkout shows a "not enabled" notice.
- **A notification provider** if you want order-confirmation emails. There is
  currently no email sending anywhere — the order-confirmation page tells the
  customer "a receipt is on its way", which today is not true.

### Backend environment variables

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Provided by Medusa Cloud. Currently points at localhost. |
| `REDIS_URL` | Provided by Medusa Cloud. |
| `JWT_SECRET` | **Rotate.** Currently `supersecret`. |
| `COOKIE_SECRET` | **Rotate.** Currently `supersecret`. |
| `AUTH_MFA_ENCRYPTION_KEY` | Already a real random value; keep it. |
| `STORE_CORS` | Your Vercel storefront URL. Currently localhost only. |
| `ADMIN_CORS` | Your Medusa Cloud admin URL. |
| `AUTH_CORS` | Both of the above. |

After the first deploy, in Medusa admin:

1. **Settings → API Keys** — create a publishable key for the storefront and a
   secret key for `MEDUSA_ADMIN_API_KEY`.
2. **Settings → Regions** — confirm the US region exists, is USD, and has the
   payment provider attached.
3. **Delete the demo catalog.** The database still contains Medusa's seeded
   apparel categories — `shirts`, `sweatshirts`, `pants` — which currently
   render as real storefront routes alongside the peptide products.

---

## 2. Storefront — Vercel

Root directory: `apps/storefront`. Build command `npm run build` is fine.

| Variable | Value | Blocking? |
|---|---|---|
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | Medusa Cloud URL | **Yes** — currently `http://localhost:9000` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | From step 1 | **Yes** |
| `NEXT_PUBLIC_BASE_URL` | Your production domain | **Yes** — otherwise every canonical URL, OpenGraph tag and the sitemap point at localhost |
| `NEXT_PUBLIC_DEFAULT_REGION` | `us` | No |
| `ADMIN_PASSWORD` | New rotated value | **Yes** — admin panel is unusable without it |
| `ADMIN_SESSION_SECRET` | New 32-byte hex | **Yes** — login now refuses to issue a session without it, by design |
| `MEDUSA_ADMIN_API_KEY` | From step 1 | **Yes** — admin panel shows no orders without it |
| `SELLABROAD_WEBHOOK_SECRET` | From SellAbroad → Settings → Integration | **Yes** — see below |
| `NEXT_PUBLIC_SELLABROAD_MERCHANT_ID` | Already set, real | No |
| `NEXT_PUBLIC_STRIPE_KEY` / `STRIPE_SECRET_KEY` | Live keys, if using Stripe | Only if Stripe is enabled |
| `MEDUSA_CLOUD_S3_HOSTNAME` / `_PATHNAME` | If serving images from S3 | No |

Do **not** set `NODE_ENV=development` in Vercel.

---

## 3. Payments — the part most likely to bite

### Change the webhook URL

The SellAbroad dashboard currently points at
`vertexlabs.shop/checkout-processor.php`. **This app receives nothing until that
is changed** to:

```
https://YOUR-DOMAIN/api/sellabroad/webhook
```

### Verify the integration against a real payload

Two things in `apps/storefront/src/app/api/sellabroad/webhook/route.ts` were
written against undocumented behaviour and are **guesses**:

1. **The signature header name.** The code accepts four common variants
   (`x-sellabroad-signature`, `sellabroad-signature`, `x-signature`,
   `x-webhook-signature`). If SellAbroad uses a different name, every genuine
   delivery is rejected as unsigned.
2. **The amount field name.** The new server-side amount check reads
   `total_cents`, `amount_cents`, `amount`, `total`, or a nested `payment.*`
   equivalent. If none matches, the handler **refuses to create the order** and
   logs `amount_missing`. That is deliberate — creating an order without
   verifying what was paid is the exact hole this closes — but it means an
   unmapped field name blocks all orders.

**Run one real test transaction and read the logs before going live.** Look for
`[sellabroad]` entries. If you see `amount_missing`, the logged key list tells
you which field to map.

### Known remaining gaps

- **No replay protection.** No timestamp check, no event-ID dedupe. The amount
  check limits the damage, but a captured delivery can still be resent.
- **Duplicate-delivery detection is a regex against an error string**
  (`/already completed|completed cart|not found/i`). If Medusa changes that
  wording, repeat deliveries become 500s and retry forever.

---

## 4. Fill in the legal details

`apps/storefront/src/lib/company.ts` has three `TODO_` placeholders that render
verbatim on the Terms, Privacy, Shipping and Returns pages:

- `legalName` — registered entity
- `address` — registered address for legal notices
- `governingState` — the state whose law governs the Terms

**Have a lawyer review the policy pages before launch.** They were drafted to
match what the application actually does, but they are drafts, not legal advice.
The Privacy Policy in particular describes data practices that must stay
accurate as the system changes.

---

## 5. Still outstanding

Not blocking a first deploy, but real:

- **No error monitoring.** No Sentry, no analytics. Production exceptions go to
  Vercel function logs with no alerting.
- **`middleware.ts` has no try/catch** — a Medusa outage throws on every request,
  so every route fails, including the homepage.
- **No order-confirmation emails.** Nothing sends mail; the confirmation page
  claims otherwise.
- **Account password and email changes are silently no-ops**
  (`profile-password/index.tsx`, `profile-email/index.tsx`).
- **No CoA delivery surface.** CoAs are the central trust claim across the hero,
  homepage and every product page, but fulfilment is email-only. A public
  batch-ID → CoA lookup is the biggest competitive gap.
- **Age gate is a single click** stored in `localStorage` with no expiry, no
  date of birth, and no server-side record — so there is no auditable proof of
  age verification for a 21+ category.
- **Cart quantities are not bounded by inventory**
  (`modules/cart/components/item/index.tsx`).
- **Fonts load via a render-blocking `<link>`.** Moving to `next/font` requires
  renaming the families referenced in inline styles across the site.

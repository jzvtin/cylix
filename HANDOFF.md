# Cylix Research — Store Owner's Guide

This guide is written for you, the store owner. No technical knowledge needed.
If something here doesn't match what you see on screen, contact your developer
(see [Who to contact](#who-to-contact) at the bottom).

---

## 1. Logging into your admin panel

Your admin panel is where you see orders and mark them shipped.

1. Go to **https://YOUR-STORE-ADDRESS.com/admin**
   *(Your developer will give you the exact address.)*
2. Type your password and click **Log in**.
3. That's it — you'll land on your dashboard.

**Your password:** set by your developer at handoff. Ask them for it, and ask
them to change it if you ever think someone else has seen it.

You stay logged in for 12 hours, then you'll need to type the password again.
Click **Log out** (top right) when you're done on a shared computer.

---

## 2. Seeing new orders

Log in and you'll land on the dashboard. At the top you'll see three boxes:

| Box | What it means |
|---|---|
| **Revenue** | Total money from paid orders |
| **Orders** | How many orders you've received |
| **Not shipped** | Orders still waiting to go out — this is your to-do list |

Below the boxes is your **Orders** table, newest first. For each order you see
the order number, the customer's email, what they bought, the total, and whether
it's been shipped.

This page works on your phone too.

---

## 3. Marking an order as shipped

1. Find the order in the table (look for the orange **Not shipped** label).
2. Click the black **Mark shipped** button on the right.
3. The label turns green and says **Shipped**.

That's the whole process. Do this once you've actually put the package in the
mail.

> **Note:** Marking an order shipped does *not* automatically email a tracking
> number to the customer. If you want to send tracking, email the customer
> directly for now. Ask your developer if you'd like this automated later.

---

## 4. Adding a product

Products live in the **Medusa admin**, which is a separate, more powerful admin
tool from the simple panel above.

1. Go to **https://YOUR-BACKEND-ADDRESS.com/app**
   *(Your developer will give you this address.)*
2. Log in with your Medusa email and password.
3. Click **Products** in the left sidebar, then **Add product** (top right).
4. Fill in:
   - **Title** — the product name customers see
   - **Description** — what it is
   - **Thumbnail / Media** — upload a photo (see note below)
   - **Variants** — the sizes/quantities you sell
   - **Pricing** — set a price in **USD**
5. Under **Sales channels**, make sure **Default Sales Channel** is ticked, or
   the product won't show up on your website.
6. Click **Publish**.

The product appears on your storefront within about a minute.

> **About photos:** if you don't upload a photo, the product still works — the
> website shows a soft blue box with the product name in it instead of a broken
> image. It looks clean, so you can add photos later without rushing.

---

## 5. Things to know

- **Age gate.** Every visitor is asked to confirm they're 21+ before they can
  browse. This is intentional.
- **Shipping.** US orders get free shipping automatically. Customers still pick
  it at checkout — it just costs $0.
- **Prices** are set in the Medusa admin (step 4 above), not the simple panel.

---

## Who to contact

**Your developer:**
Name: _______________________
Email: _______________________
Phone: _______________________

**Good things to include when you ask for help:**
- What you were trying to do
- The order number, if it's about a specific order
- A screenshot if something looks wrong

---

## For your developer — outstanding items

These are not finished and are documented in full in the project notes:

1. **SellAbroad payment widget** — built to the dashboard's container spec
   (`data-platform="api"`, minor-unit amounts, `external_cart_id` = Medusa cart
   id). Amounts are verified to satisfy their reconciliation rule. Two things
   remain:
   - Set `SELLABROAD_WEBHOOK_SECRET` to the shared secret from
     SellAbroad → Settings → Integration. The webhook rejects everything until
     then, by design.
   - **Change the Webhook URL in the SellAbroad dashboard** to
     `https://YOUR-VERCEL-DOMAIN/api/sellabroad/webhook`. It currently points
     at `vertexlabs.shop/checkout-processor.php`, so this app receives nothing.
   - The API key `2264fb45…` was shared over chat and should be regenerated.
2. **Stripe** — placeholder keys only. Needs live keys *and* the Stripe provider
   enabled in `medusa-config.ts` and attached to the US region. Until then the
   Stripe tab shows a "not enabled" notice.
3. **`MEDUSA_ADMIN_API_KEY`** — the simple admin panel needs this to read
   orders. Create one in the Medusa admin under Settings → API Keys.
4. **`ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET`** — change both from their
   defaults before going live.
5. **Deployment** — backend to Railway, then set
   `NEXT_PUBLIC_MEDUSA_BACKEND_URL` in Vercel to the Railway URL.

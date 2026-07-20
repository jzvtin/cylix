import { Metadata } from "next"
import LegalPage, { Section } from "@modules/common/components/legal-page"
import { COMPANY } from "@lib/company"

export const metadata: Metadata = {
  title: "Returns Policy | Cylix Research",
  description:
    "What can and cannot be returned, and how refunds for damaged, incorrect, or lost orders work.",
}

export default function ReturnsPage() {
  return (
    <LegalPage
      eyebrow="Orders"
      title="Returns"
      accent="Policy"
      intro="Laboratory reference materials have different return rules than ordinary goods. Here is exactly where we stand."
      updated="20 July 2026"
    >
      <Section heading="Opened or used material cannot be returned">
        <p>
          Once a vial has left our control we cannot verify how it was stored or
          handled, so its chain of custody is broken and it can no longer be sold
          as a reference standard. For that reason we do not accept returns of
          opened or used material under any circumstances.
        </p>
      </Section>

      <Section heading="Unopened material">
        <p>
          Unopened material in its original, undamaged packaging may be returned
          within <strong>14 days</strong> of delivery. Contact{" "}
          {COMPANY.supportEmail} first for a return authorisation — returns sent
          without one cannot be processed.
        </p>
        <p>
          Return shipping is at your cost unless the return is our error. Once we
          receive and inspect the material we refund the purchase price to your
          original payment method, normally within 5–10 business days.
        </p>
      </Section>

      <Section heading="Damaged, incorrect, or lost orders">
        <p>
          These are always covered, and there is nothing to return. If material
          arrives damaged, the wrong item was shipped because of our error, or an
          order is lost in transit, we will replace it or refund it in full.
        </p>
        <p>
          Contact {COMPANY.supportEmail} within <strong>7 days</strong> of the
          expected delivery date with your order number, and include photographs
          if the issue is damage.
        </p>
      </Section>

      <Section heading="Cancelling an order">
        <p>
          If your order has not yet been dispatched we can cancel it and refund
          it in full. Because we dispatch quickly, contact us as soon as possible
          — once a parcel is with the carrier the return rules above apply
          instead.
        </p>
      </Section>

      <Section heading="Refunds">
        <p>
          Refunds are issued to the original payment method. How quickly the
          money appears depends on your bank or card issuer, and is outside our
          control once we have released it.
        </p>
      </Section>

      <Section heading="Related">
        <p>
          See also our{" "}
          <a href="/shipping" style={{ textDecoration: "underline" }}>
            Shipping Policy
          </a>{" "}
          and{" "}
          <a href="/terms" style={{ textDecoration: "underline" }}>
            Terms of Service
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  )
}

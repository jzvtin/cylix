import { Metadata } from "next"
import LegalPage, { Section } from "@modules/common/components/legal-page"
import { COMPANY } from "@lib/company"

export const metadata: Metadata = {
  title: "Shipping Policy | Cylix Research",
  description:
    "Dispatch times, carriers, tracking, and what happens if an order is damaged or lost in transit.",
}

export default function ShippingPage() {
  return (
    <LegalPage
      eyebrow="Orders"
      title="Shipping"
      accent="Policy"
      intro="How and when your order ships, and what we do if something goes wrong in transit."
      updated="20 July 2026"
    >
      <Section heading="Where we ship">
        <p>
          We ship within the United States only. We do not ship internationally,
          and we cannot ship to freight forwarders.
        </p>
      </Section>

      <Section heading="Dispatch time">
        <p>
          Orders placed before 2pm EST on a business day are dispatched the same
          day. Orders placed after that, or at a weekend, are dispatched within
          12–24 hours of the next business day.
        </p>
        <p>
          Dispatch is when the parcel leaves us. Transit time is additional and
          depends on the carrier and destination — typically 2–5 business days.
        </p>
      </Section>

      <Section heading="Cost">
        <p>
          Shipping is free on all US orders. It still appears as a selectable
          option at checkout; it is simply priced at $0.00.
        </p>
      </Section>

      <Section heading="Tracking">
        <p>
          A tracking number is emailed to you once the label is created. If you
          have not received tracking within two business days of ordering, check
          your spam folder and then contact {COMPANY.supportEmail} with your
          order number.
        </p>
      </Section>

      <Section heading="Packaging">
        <p>
          Material ships in discreet outer packaging with no indication of
          contents on the exterior. Lyophilised powders are stable at ambient
          temperature for the duration of normal transit.
        </p>
      </Section>

      <Section heading="Damaged, incorrect, or lost orders">
        <p>
          If your order arrives damaged, contains the wrong item due to our
          error, or does not arrive at all, we will replace it or refund it in
          full.
        </p>
        <p>
          Contact {COMPANY.supportEmail} within <strong>7 days</strong> of the
          expected delivery date with your order number and, for damage, a photo
          of the packaging and contents as received.
        </p>
        <p>
          Claims raised after 7 days may not be recoverable from the carrier, and
          we may not be able to honour them.
        </p>
      </Section>

      <Section heading="Incorrect addresses">
        <p>
          We ship to the address you enter at checkout. Please check it. If a
          parcel is returned to us as undeliverable because of an incorrect or
          incomplete address, we can reship it once you cover the reshipment
          cost, or refund the order less any shipping cost we incurred.
        </p>
      </Section>

      <Section heading="Related">
        <p>
          See also our{" "}
          <a href="/returns" style={{ textDecoration: "underline" }}>
            Returns Policy
          </a>{" "}
          and{" "}
          <a href="/terms" style={{ textDecoration: "underline" }}>
            Terms of Service
          </a>
          . Support hours are {COMPANY.supportHours}.
        </p>
      </Section>
    </LegalPage>
  )
}

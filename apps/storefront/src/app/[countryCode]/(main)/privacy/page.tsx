import { Metadata } from "next"
import LegalPage, { Section } from "@modules/common/components/legal-page"
import { COMPANY } from "@lib/company"

export const metadata: Metadata = {
  title: "Privacy Policy | Cylix Research",
  description:
    "How Cylix Research collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy"
      accent="Policy"
      intro="What we collect, why we collect it, and what you can ask us to do with it."
      updated="20 July 2026"
    >
      <Section heading="1. Who controls your data">
        <p>
          {COMPANY.legalName}, of {COMPANY.address}, is the controller of the
          personal information described here. For any privacy question or
          request, contact {COMPANY.privacyEmail}.
        </p>
      </Section>

      <Section heading="2. What we collect">
        <p>
          <strong>Information you give us.</strong> Your name, email address,
          shipping and billing address, and phone number when you create an
          account or place an order. Anything you write to us through the support
          form or by email.
        </p>
        <p>
          <strong>Order information.</strong> What you ordered, when, the amount,
          and the delivery status.
        </p>
        <p>
          <strong>Age confirmation.</strong> The fact that you confirmed you are
          21 or older, stored in your browser.
        </p>
        <p>
          <strong>Technical information.</strong> IP address, browser type, and
          pages visited, collected in server logs for security and
          troubleshooting.
        </p>
        <p>
          <strong>What we do not collect.</strong> We never receive or store your
          full payment card number. Card details are entered directly with our
          payment processor.
        </p>
      </Section>

      <Section heading="3. Why we use it">
        <p>
          To take and fulfil your order, take payment, and deliver it — this is
          necessary to perform our contract with you.
        </p>
        <p>
          To provide customer support and respond to documentation requests.
        </p>
        <p>
          To meet our legal obligations, including tax and accounting records and
          age-restriction requirements.
        </p>
        <p>
          To protect the site against fraud and abuse, which is our legitimate
          interest in running a secure service.
        </p>
        <p>
          We do not sell your personal information, and we do not share it with
          third parties for their own marketing.
        </p>
      </Section>

      <Section heading="4. Who we share it with">
        <p>
          <strong>Payment processor</strong> — to take and settle payment.
        </p>
        <p>
          <strong>Shipping carriers</strong> — your name and delivery address, so
          the parcel reaches you.
        </p>
        <p>
          <strong>Hosting and infrastructure providers</strong> — who store data
          on our behalf under contract, and may not use it for anything else.
        </p>
        <p>
          <strong>Authorities</strong> — where we are legally required to
          disclose, or where disclosure is necessary to establish or defend legal
          claims.
        </p>
      </Section>

      <Section heading="5. How long we keep it">
        <p>
          Order and transaction records are kept for as long as tax and
          accounting law requires — generally seven years. Account details are
          kept until you ask us to close your account. Support correspondence is
          kept for two years. Server logs are kept for a short operational
          period.
        </p>
      </Section>

      <Section heading="6. Cookies and local storage">
        <p>
          We use cookies and browser storage that are strictly necessary for the
          site to work: keeping you signed in, remembering your cart and selected
          region, and recording your age confirmation. These cannot be switched
          off without breaking core functionality.
        </p>
        <p>
          You can clear or block this storage in your browser settings, but parts
          of the site — including checkout — will stop working.
        </p>
      </Section>

      <Section heading="7. Your rights">
        <p>
          You can ask us to give you a copy of the personal information we hold
          about you, correct it if it is wrong, or delete it where we are not
          required to keep it. You can also object to or ask us to restrict
          certain uses, and ask for your data in a portable format.
        </p>
        <p>
          If you are a California resident, you have the rights described under
          the CCPA/CPRA, including the right to know, the right to delete, and
          the right not to be discriminated against for exercising them. We do
          not sell or share personal information as those terms are defined
          there.
        </p>
        <p>
          To exercise any of these, email {COMPANY.privacyEmail}. We will respond
          within the timeframe the applicable law requires. We may need to verify
          your identity first.
        </p>
      </Section>

      <Section heading="8. Security">
        <p>
          Traffic to this site is encrypted in transit. Access to order and
          customer data is restricted to people who need it to run the business.
          No system is perfectly secure, but we take reasonable measures
          appropriate to the sensitivity of the data we hold.
        </p>
      </Section>

      <Section heading="9. Children">
        <p>
          This site is not directed at anyone under 21, and we do not knowingly
          collect information from anyone under that age. If you believe a minor
          has given us personal information, contact us and we will delete it.
        </p>
      </Section>

      <Section heading="10. Changes">
        <p>
          If we change this policy we will update the date at the top of this
          page. Material changes will be announced on the site.
        </p>
      </Section>
    </LegalPage>
  )
}

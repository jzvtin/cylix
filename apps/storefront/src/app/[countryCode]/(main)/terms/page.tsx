import { Metadata } from "next"
import LegalPage, { Section } from "@modules/common/components/legal-page"
import { COMPANY } from "@lib/company"

export const metadata: Metadata = {
  title: "Terms of Service | Cylix Research",
  description:
    "The terms governing your use of the Cylix Research website and your purchase of laboratory reference materials.",
}

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of"
      accent="Service"
      intro="These terms govern your use of this site and any order you place with us. Please read them before purchasing."
      updated="20 July 2026"
    >
      <Section heading="1. Who we are">
        <p>
          This site is operated by {COMPANY.legalName} (&ldquo;
          {COMPANY.brand}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), registered
          at {COMPANY.address}. You can reach us at {COMPANY.supportEmail}.
        </p>
        <p>
          By accessing this site or placing an order you agree to these terms. If
          you do not agree with them, do not use the site.
        </p>
      </Section>

      <Section heading="2. Eligibility">
        <p>
          You must be at least 21 years old to use this site or place an order.
          By doing either you represent that you are 21 or older, that you are
          acting on behalf of a qualified research end user, and that you are
          legally permitted to receive the materials you order in your
          jurisdiction.
        </p>
        <p>
          We may refuse, limit, or cancel any order at our discretion, including
          where we have reason to believe the materials are intended for a use
          prohibited under these terms.
        </p>
      </Section>

      <Section heading="3. Research use only">
        <p>
          All materials sold by {COMPANY.brand} are supplied strictly as
          analytical reference standards for in-vitro laboratory research and
          analytical method development.
        </p>
        <p>
          They are <strong>not</strong> drugs, food, cosmetics, dietary
          supplements, or medical devices. They have not been evaluated or
          approved by the US Food and Drug Administration. They are{" "}
          <strong>
            not for human or animal consumption, injection, dosing, topical
            application, or administration of any kind
          </strong>
          , and not for any diagnostic or therapeutic purpose.
        </p>
        <p>
          You agree that you will not resell, relabel, or supply these materials
          for any of the prohibited uses above, and that you accept full
          responsibility for their safe, lawful handling, storage, and disposal
          once they are delivered to you.
        </p>
        <p>
          Nothing on this site is medical advice. We do not provide dosing
          guidance, protocols for administration to humans or animals, or any
          advice on therapeutic use, and we will not do so on request.
        </p>
      </Section>

      <Section heading="4. Orders, pricing, and payment">
        <p>
          Your order is an offer to buy. A contract forms only when we accept it
          by dispatching the material. Prices are in US dollars and may change
          without notice, though changes never affect an order we have already
          accepted.
        </p>
        <p>
          We try to keep product information accurate, but obvious errors in
          price or description do not bind us. If we discover such an error after
          you order, we will contact you and give you the choice of confirming at
          the corrected price or cancelling for a full refund.
        </p>
        <p>
          Payment is taken at checkout through our payment processor. We do not
          store your full card details.
        </p>
      </Section>

      <Section heading="5. Shipping, title, and risk">
        <p>
          Shipping timescales and costs are set out on our{" "}
          <a href="/shipping" style={{ textDecoration: "underline" }}>
            Shipping Policy
          </a>{" "}
          page. Delivery estimates are estimates, not guarantees.
        </p>
        <p>
          Title and risk in the material pass to you on delivery to the address
          you provided. We ship within the United States only unless we have
          agreed otherwise in writing.
        </p>
      </Section>

      <Section heading="6. Returns">
        <p>
          Our returns terms are set out in full on our{" "}
          <a href="/returns" style={{ textDecoration: "underline" }}>
            Returns Policy
          </a>{" "}
          page and form part of these terms.
        </p>
      </Section>

      <Section heading="7. Your account">
        <p>
          You are responsible for keeping your account credentials confidential
          and for everything done under your account. Tell us promptly if you
          believe your account has been compromised. We may suspend or close an
          account that we reasonably believe is being used in breach of these
          terms.
        </p>
      </Section>

      <Section heading="8. Intellectual property">
        <p>
          The content of this site — text, layout, graphics, and branding — is
          owned by us or our licensors and may not be copied or reused
          commercially without our written permission.
        </p>
      </Section>

      <Section heading="9. Disclaimers and limitation of liability">
        <p>
          Certificates of Analysis describe the specific lot they reference. Aside
          from the specifications stated on the applicable Certificate of
          Analysis, the materials are supplied &ldquo;as is&rdquo; and we
          disclaim all other warranties to the fullest extent the law allows,
          including any implied warranty of merchantability or fitness for a
          particular purpose.
        </p>
        <p>
          To the fullest extent permitted by law, our total liability arising out
          of or in connection with an order will not exceed the amount you paid
          for that order, and we are not liable for indirect or consequential
          loss, loss of profit, or loss of data.
        </p>
        <p>
          Nothing in these terms limits liability that cannot lawfully be limited
          — including liability for death or personal injury caused by
          negligence, or for fraud.
        </p>
        <p>
          Because we cannot supervise how materials are handled after delivery,
          we accept no liability for any loss or injury arising from use of the
          materials in breach of section 3.
        </p>
      </Section>

      <Section heading="10. Indemnity">
        <p>
          You agree to indemnify us against claims, losses, and reasonable legal
          costs arising from your breach of these terms or your handling, use, or
          onward supply of materials you purchase from us.
        </p>
      </Section>

      <Section heading="11. Changes to these terms">
        <p>
          We may update these terms from time to time. The version in force when
          you place an order is the version that governs that order. The date at
          the top of this page shows when it was last changed.
        </p>
      </Section>

      <Section heading="12. Governing law">
        <p>
          These terms are governed by the laws of the State of{" "}
          {COMPANY.governingState} and the federal laws of the United States, and
          the courts of {COMPANY.governingState} have exclusive jurisdiction over
          any dispute.
        </p>
      </Section>

      <Section heading="13. Contact">
        <p>
          Questions about these terms: {COMPANY.supportEmail}, or write to us at{" "}
          {COMPANY.address}.
        </p>
      </Section>
    </LegalPage>
  )
}

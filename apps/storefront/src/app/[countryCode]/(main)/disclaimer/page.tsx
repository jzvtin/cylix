import { Metadata } from "next"
import LegalPage, { Section } from "@modules/common/components/legal-page"
import { COMPANY } from "@lib/company"

export const metadata: Metadata = {
  title: "Research Use Only Disclaimer | Cylix Research",
  description:
    "All materials sold by Cylix Research are for in-vitro laboratory research only. Not for human or animal consumption.",
}

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Important"
      title="Research Use"
      accent="Only"
      intro="Read this before ordering. It defines what these materials are, and what they are not."
      updated="20 July 2026"
    >
      <div className="mb-9 flex gap-4 rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-50 to-[#FDF6E9] px-5 py-5 sm:px-6">
        <div
          aria-hidden
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gold-100 text-[18px]"
        >
          ⚠️
        </div>
        <div>
          <div className="mb-1 font-display text-[10px] font-extrabold uppercase tracking-[1.2px] text-gold-700">
            For research use only
          </div>
          <p className="m-0 font-display text-[14px] font-bold leading-[1.7] text-gold-800">
            Every material sold by {COMPANY.brand} is an analytical reference
            standard for in-vitro laboratory research only. Nothing we sell is
            for human or animal consumption, injection, dosing, topical
            application, or administration of any kind.
          </p>
        </div>
      </div>

      <Section heading="Not a drug, not a supplement">
        <p>
          These materials are not drugs, food, cosmetics, dietary supplements, or
          medical devices. They have not been evaluated or approved by the US
          Food and Drug Administration for safety or efficacy in humans or
          animals.
        </p>
        <p>
          No statement anywhere on this site should be read as a claim that any
          material diagnoses, treats, mitigates, or prevents any disease or
          condition.
        </p>
      </Section>

      <Section heading="No medical advice, no dosing guidance">
        <p>
          Nothing on this site is medical, veterinary, or clinical advice. We do
          not publish dosing tables, administration protocols, cycle guidance, or
          any instruction for use in humans or animals — and we will not provide
          them if asked.
        </p>
        <p>
          Our technical support covers reconstitution, solubility, and storage as
          they relate to laboratory handling of a reference standard. It does not
          extend to anything involving administration to a living subject.
        </p>
      </Section>

      <Section heading="Who may purchase">
        <p>
          You must be 21 or older. By ordering, you confirm you are purchasing on
          behalf of a qualified research end user, that you have the facilities
          and training to handle laboratory chemicals safely, and that receiving
          and possessing the material is lawful where you are.
        </p>
        <p>
          We may refuse or cancel any order at our discretion, including where we
          believe the material is intended for a prohibited use.
        </p>
      </Section>

      <Section heading="Your responsibility after delivery">
        <p>
          Once material is delivered, you are solely responsible for storing,
          handling, using, and disposing of it safely and lawfully, and for
          complying with every regulation that applies to you — federal, state,
          and institutional.
        </p>
        <p>
          You agree not to resell, relabel, or supply these materials to anyone
          for a use prohibited by this disclaimer or by our{" "}
          <a href="/terms" style={{ textDecoration: "underline" }}>
            Terms of Service
          </a>
          .
        </p>
      </Section>

      <Section heading="Questions">
        <p>
          If anything here is unclear, ask before you order:{" "}
          {COMPANY.supportEmail}.
        </p>
      </Section>
    </LegalPage>
  )
}

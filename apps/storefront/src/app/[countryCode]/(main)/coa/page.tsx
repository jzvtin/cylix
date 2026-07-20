import { Metadata } from "next"
import LegalPage, { Section } from "@modules/common/components/legal-page"
import { COMPANY } from "@lib/company"

export const metadata: Metadata = {
  title: "Certificates of Analysis | Cylix Research",
  description:
    "Every lot is tested by an independent laboratory. How to read a Cylix Research Certificate of Analysis and request the one for your lot.",
}

export default function CoaPage() {
  return (
    <LegalPage
      eyebrow="Documentation"
      title="Certificates of"
      accent="Analysis"
      intro="Every lot we sell is tested by an independent laboratory before it is released. Here is what we test, and how to get the report for your vial."
      updated="20 July 2026"
    >
      <Section heading="What we test">
        <p>
          <strong>Identity — mass spectrometry.</strong> Confirms the material is
          the compound named on the label, by matching the observed mass against
          the theoretical mass.
        </p>
        <p>
          <strong>Purity — HPLC.</strong> Reports chromatographic purity as a
          percentage of total peak area. Our release threshold is 99%.
        </p>
        <p>
          Testing is carried out by Janoshik Analytical, an independent
          laboratory we do not own or control.
        </p>
      </Section>

      <Section heading="How to read a CoA">
        <p>
          <strong>Lot / batch number</strong> — ties the report to the specific
          production run your vial came from. A CoA for a different lot tells you
          nothing about yours.
        </p>
        <p>
          <strong>Test date</strong> — when the analysis was performed.
        </p>
        <p>
          <strong>HPLC chromatogram</strong> — the trace itself, with the main
          peak and any impurity peaks. The reported purity is the main peak as a
          share of total area.
        </p>
        <p>
          <strong>MS spectrum</strong> — the observed mass, which should match
          the theoretical molecular weight of the named compound.
        </p>
      </Section>

      <Section heading="Getting the CoA for your lot">
        <p>
          Email {COMPANY.supportEmail} with your <strong>order number</strong>{" "}
          and the <strong>lot number printed on the vial</strong>, and we will
          send the report for that specific lot. We aim to respond within 12–24
          hours during {COMPANY.supportHours}.
        </p>
        <p>
          You can also request the CoA for a lot before ordering — tell us which
          compound you are looking at and we will send the report for the lot
          currently in stock.
        </p>
      </Section>

      <Section heading="A note on what a CoA does and does not tell you">
        <p>
          A Certificate of Analysis describes the chemical identity and purity of
          a specific lot at the time it was tested. It is an analytical document
          and nothing more.
        </p>
        <p>
          It is not evidence of safety or efficacy in humans or animals, and it
          does not change the fact that these materials are supplied for in-vitro
          laboratory research only. See our{" "}
          <a href="/disclaimer" style={{ textDecoration: "underline" }}>
            Research Use Only disclaimer
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  )
}

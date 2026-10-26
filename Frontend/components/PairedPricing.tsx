import pricing from "../data/pricing.json";
import SectionHeading from "./SectionHeading";
import PricingBundleCard from "./PricingBundleCard";
import Reveal from "./Reveal";
export default function PairedPricing() {
  const c = pricing.page;
  return (
    <section className="section paired-pricing" id="website-plans">
      <SectionHeading content={c} />
      <div className="pricing-bundle-grid">
        {c.tiers.map((tier) => (
          <PricingBundleCard key={tier.name} tier={tier} />
        ))}
      </div>
      <Reveal>
        <p className="pricing-note">{c.note}</p>
        <p className="pricing-note">{pricing.website.note}</p>
      </Reveal>
    </section>
  );
}

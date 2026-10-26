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
          <PricingBundleCard
            key={tier.name}
            bundle={{
              name: tier.name,
              development: pricing.website.plans.find(
                (plan) => plan.id === tier.websiteId,
              )!,
              maintenance: pricing.maintenance.plans.find(
                (plan) => plan.id === tier.maintenanceId,
              )!,
              developmentLabel: c.websiteLabel,
              maintenanceLabel: c.maintenanceLabel,
              developmentButton: pricing.website.button,
              maintenanceButton: pricing.maintenance.button,
            }}
          />
        ))}
      </div>
      <Reveal>
        <p className="pricing-note">{c.note}</p>
        <p className="pricing-note">{pricing.website.note}</p>
      </Reveal>
    </section>
  );
}

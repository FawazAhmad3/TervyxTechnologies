import pricing from "../data/pricing.json";
import SectionHeading from "./SectionHeading";
import PricingBundleCard from "./PricingBundleCard";
import Reveal from "./Reveal";
export default function AndroidPricing() {
  const c = pricing.android.section;
  return (
    <section className="section android-pricing" id="android-plans">
      <SectionHeading content={c} />
      <div className="pricing-bundle-grid">
        {c.tiers.map((tier) => (
          <PricingBundleCard
            key={tier.name}
            bundle={{
              name: tier.name,
              development: pricing.android.development.find(
                (plan) => plan.id === tier.developmentId,
              )!,
              maintenance: pricing.android.maintenance.find(
                (plan) => plan.id === tier.maintenanceId,
              )!,
              developmentLabel: c.developmentLabel,
              maintenanceLabel: c.maintenanceLabel,
              developmentButton: c.developmentButton,
              maintenanceButton: c.maintenanceButton,
            }}
          />
        ))}
      </div>
      <Reveal>
        <p className="pricing-note">{c.note}</p>
        <p className="pricing-note">{c.scopeNote}</p>
      </Reveal>
    </section>
  );
}

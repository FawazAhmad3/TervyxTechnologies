import pricing from "../data/pricing.json";
import PlanDetails from "./PlanDetails";
import Reveal from "./Reveal";
type Tier = (typeof pricing.page.tiers)[number];
export default function PricingBundleCard({ tier }: { tier: Tier }) {
  const website = pricing.website.plans.find(
    (plan) => plan.id === tier.websiteId,
  )!;
  const maintenance = pricing.maintenance.plans.find(
    (plan) => plan.id === tier.maintenanceId,
  )!;
  return (
    <Reveal className="pricing-bundle-shell">
      <article
        className="pricing-bundle-card"
        aria-label={`${tier.name} website and maintenance plans`}
      >
        <div className="bundle-title">
          <h2>{tier.name}</h2>
          <span aria-hidden="true">✳</span>
        </div>
        <div className="bundle-website">
          <PlanDetails
            plan={website}
            button={pricing.website.button}
            label={pricing.page.websiteLabel}
          />
        </div>
        <div className="bundle-maintenance">
          <PlanDetails
            plan={maintenance}
            button={pricing.maintenance.button}
            label={pricing.page.maintenanceLabel}
          />
        </div>
      </article>
    </Reveal>
  );
}

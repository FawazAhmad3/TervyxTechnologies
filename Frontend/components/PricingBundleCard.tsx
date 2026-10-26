import PlanDetails, { type Plan } from "./PlanDetails";
import Reveal from "./Reveal";
export type BundleContent = {
  name: string;
  development: Plan;
  maintenance: Plan;
  developmentLabel: string;
  maintenanceLabel: string;
  developmentButton: string;
  maintenanceButton: string;
};
export default function PricingBundleCard({
  bundle,
}: {
  bundle: BundleContent;
}) {
  return (
    <Reveal className="pricing-bundle-shell">
      <article
        className="pricing-bundle-card"
        aria-label={`${bundle.name}: ${bundle.development.name} + ${bundle.maintenance.name}`}
      >
        <div className="bundle-title">
          <h2>{bundle.name}</h2>
          <span aria-hidden="true">✳</span>
        </div>
        <div className="bundle-website">
          <PlanDetails
            plan={bundle.development}
            button={bundle.developmentButton}
            label={bundle.developmentLabel}
          />
        </div>
        <div className="bundle-maintenance">
          <PlanDetails
            plan={bundle.maintenance}
            button={bundle.maintenanceButton}
            label={bundle.maintenanceLabel}
          />
        </div>
      </article>
    </Reveal>
  );
}

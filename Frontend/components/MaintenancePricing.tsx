import pricing from "../data/pricing.json";
import PricingSection from "./PricingSection";
export default function MaintenancePricing() {
  return (
    <PricingSection id="maintenance-plans" content={pricing.maintenance} />
  );
}

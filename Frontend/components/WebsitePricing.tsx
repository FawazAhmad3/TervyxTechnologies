import pricing from "../data/pricing.json";
import PricingSection from "./PricingSection";
export default function WebsitePricing() {
  return <PricingSection id="website-plans" content={pricing.website} />;
}

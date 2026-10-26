import pricing from "../data/pricing.json";
import MonthlyPricing from "./MonthlyPricing";
export default function SeoPricing() {
  return <MonthlyPricing id="seo-plans" content={pricing.seo} />;
}

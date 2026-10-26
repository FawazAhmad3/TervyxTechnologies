import pricing from "../data/pricing.json";
import MonthlyPricing from "./MonthlyPricing";
export default function SmmPricing() {
  return <MonthlyPricing id="smm-plans" content={pricing.smm} />;
}

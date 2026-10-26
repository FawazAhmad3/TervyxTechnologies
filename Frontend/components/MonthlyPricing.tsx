import type { Plan } from "./PlanDetails";
import SectionHeading from "./SectionHeading";
import MarketingPlanCard from "./MarketingPlanCard";
type Content = {
  label: string;
  heading: string;
  muted: string;
  description: string[];
  button: string;
  plans: Plan[];
};
export default function MonthlyPricing({
  content,
  id,
}: {
  content: Content;
  id: string;
}) {
  return (
    <section className="section monthly-pricing" id={id}>
      <SectionHeading content={content} />
      <div className="pricing-grid">
        {content.plans.map((plan) => (
          <MarketingPlanCard
            key={plan.id}
            plan={plan}
            label={content.label}
            button={content.button}
          />
        ))}
      </div>
    </section>
  );
}

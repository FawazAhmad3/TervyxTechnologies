import PlanDetails, { type Plan } from "./PlanDetails";
import Reveal from "./Reveal";
export default function MarketingPlanCard({
  plan,
  label,
  button,
}: {
  plan: Plan;
  label: string;
  button: string;
}) {
  return (
    <Reveal className="pricing-card-shell">
      <article className="pricing-card marketing-plan-card">
        <PlanDetails plan={plan} label={label} button={button} />
      </article>
    </Reveal>
  );
}

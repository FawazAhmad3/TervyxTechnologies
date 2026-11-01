import pricing from "../data/pricing.json";
export type Plan = Omit<
  (typeof pricing.website.plans)[number],
  "originalPrice"
> & {
  originalPrice?: string;
};
export default function PlanDetails({
  plan,
  button,
  label,
}: {
  plan: Plan;
  button: string;
  label: string;
}) {
  return (
    <section className="plan-details">
      <div className="plan-kind">{label}</div>
      <div className="pricing-card-top">
        <h3>{plan.name}</h3>
        {plan.audience && <p className="pricing-audience">{plan.audience}</p>}
        <div className="plan-price-stack">
          {plan.originalPrice && (
            <div className="plan-original-price">
              <span className="sr-only">{pricing.priceLabels.original}: </span>
              <del>{plan.originalPrice}</del>
            </div>
          )}
          <div className="plan-price">
            {plan.originalPrice && (
              <span className="sr-only">{pricing.priceLabels.current}: </span>
            )}
            {plan.price}
          </div>
        </div>
        <p className="plan-billing">{plan.billing}</p>
      </div>
      <ul className="plan-features">
        {plan.features.map((feature) => (
          <li key={feature}>
            <span aria-hidden="true">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        className="plan-button"
        href={`/contact?service=${encodeURIComponent(plan.serviceSlug)}&plan=${encodeURIComponent(plan.id)}`}
      >
        {button}
        <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}

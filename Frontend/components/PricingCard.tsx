import pricing from "../data/pricing.json";
import Reveal from "./Reveal";
export type Plan = Omit<
  (typeof pricing.website.plans)[number],
  "originalPrice"
> & { originalPrice?: string };
export default function PricingCard({
  plan,
  button,
}: {
  plan: Plan;
  button: string;
}) {
  const href = `/contact.html?service=web-development&plan=${encodeURIComponent(plan.id)}`;
  return (
    <Reveal className="pricing-card-shell">
      <article className="pricing-card">
        <div className="pricing-card-top">
          <h3>{plan.name}</h3>
          {plan.audience && <p className="pricing-audience">{plan.audience}</p>}
          <div className="plan-price-stack">
            {plan.originalPrice && (
              <div className="plan-original-price">
                <span className="sr-only">
                  {pricing.priceLabels.original}:{" "}
                </span>
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
        <a className="plan-button" href={href}>
          {button}
          <span aria-hidden="true">↗</span>
        </a>
      </article>
    </Reveal>
  );
}

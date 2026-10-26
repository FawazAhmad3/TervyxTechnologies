import pricing from "../data/pricing.json";
import SectionHeading from "./SectionHeading";
import PricingCard from "./PricingCard";
import Reveal from "./Reveal";
type Content = typeof pricing.website;
export default function PricingSection({
  content,
  id,
}: {
  content: Content;
  id: string;
}) {
  return (
    <section className="section pricing-section" id={id}>
      <SectionHeading content={content} />
      <div className="pricing-grid">
        {content.plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} button={content.button} />
        ))}
      </div>
      {content.note && (
        <Reveal>
          <p className="pricing-note">{content.note}</p>
        </Reveal>
      )}
    </section>
  );
}

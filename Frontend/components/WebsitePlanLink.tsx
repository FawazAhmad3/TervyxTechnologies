import pricing from "../data/pricing.json";
import Reveal from "./Reveal";
export default function WebsitePlanLink() {
  const c = pricing.teaser;
  return (
    <Reveal className="website-plan-link">
      <div>
        <div className="section-label">{c.label}</div>
        <h3>{c.heading}</h3>
        <p>{c.description}</p>
      </div>
      <a className="text-link" href={c.link.href}>
        {c.link.label}
        <span aria-hidden="true">↗</span>
      </a>
    </Reveal>
  );
}

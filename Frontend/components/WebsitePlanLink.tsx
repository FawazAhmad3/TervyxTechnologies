import quote from "../data/quote.json";
import Reveal from "./Reveal";
export default function WebsitePlanLink() {
  const c = { ...quote, link: { href: quote.href, label: quote.button } };
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

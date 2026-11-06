import { useContent } from "../i18n/content";
import Icon from "./Icon";
import quoteSource from "../data/quote.json";
import Reveal from "./Reveal";
export default function WebsitePlanLink() {
  const quote = useContent(quoteSource);

  const c = { ...quote, link: { href: quote.href, label: quote.button } };
  return (
    <Reveal className="website-plan-link">
      <div>
        <div className="section-label">{c.label}</div>
        <h2>{c.heading}</h2>
        <p>{c.description}</p>
      </div>
      <a className="text-link" href={c.link.href}>
        {c.link.label}
        <span aria-hidden="true">
          <Icon name="arrow-up-right" />
        </span>
      </a>
    </Reveal>
  );
}

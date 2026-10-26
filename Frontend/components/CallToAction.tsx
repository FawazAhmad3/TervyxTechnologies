import Reveal from "./Reveal";
import Button from "./Button";
import site from "../data/site.json";
export default function CallToAction() {
  const c = site.cta;
  return (
    <Reveal as="section" className="page-cta section">
      <div>
        <div className="section-label">{c.label}</div>
        <h2>
          {c.heading}
          <br />
          <em>{c.accent}</em>
        </h2>
      </div>
      <Button href={c.button.href}>{c.button.label}</Button>
    </Reveal>
  );
}

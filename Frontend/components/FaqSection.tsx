import home from "../data/home.json";
import Reveal from "./Reveal";
import FaqItem from "./FaqItem";
export default function FaqSection() {
  const c = home.faq;
  return (
    <section className="section home-faq">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[.85fr_1.4fr] lg:gap-20">
        <Reveal>
          <div className="section-label">{c.label}</div>
          <h2 className="mt-7">
            {c.heading}
            <br />
            <span>{c.muted}</span>
          </h2>
          <p className="mt-6 text-sm">{c.description}</p>
          <a className="text-link mt-7 text-brand-lime" href={c.link.href}>
            {c.link.label}
            <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
        <Reveal>
          {c.items.map((item, index) => (
            <FaqItem key={item.question} {...item} index={index} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}

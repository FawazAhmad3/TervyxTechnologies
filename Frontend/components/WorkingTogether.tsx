import home from "../data/home.json";
import Reveal from "./Reveal";
import CollaborationVisual from "./CollaborationVisual";
export default function WorkingTogether() {
  const c = home.collaboration;
  return (
    <section className="section">
      <Reveal className="section-label">{c.label}</Reveal>
      <div className="mt-7 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal as="h2">
            {c.heading}
            <br />
            <span>{c.muted}</span>
          </Reveal>
          <Reveal as="p" className="mt-6 max-w-xl text-sm">
            {c.description}
          </Reveal>
          <div className="mt-8 space-y-7">
            {c.items.map((item) => (
              <Reveal key={item.title} className="flex gap-4">
                <span className="mt-1 text-brand-lime" aria-hidden="true">
                  ✳
                </span>
                <div>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-2 max-w-lg text-sm">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-9">
            <a className="text-link text-brand-lime" href={c.link.href}>
              {c.link.label}
              <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>
        <CollaborationVisual />
      </div>
    </section>
  );
}

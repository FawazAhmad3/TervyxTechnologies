import about from "../data/about.json";
import Reveal from "./Reveal";
import ValueCard from "./ValueCard";
export default function ValuesSection() {
  return (
    <section className="section values">
      <Reveal className="section-label">{about.values.label}</Reveal>
      <div className="steps">
        {about.values.items.map((item) => (
          <ValueCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

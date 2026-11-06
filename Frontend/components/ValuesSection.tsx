import { useContent } from "../i18n/content";
import aboutSource from "../data/about.json";
import Reveal from "./Reveal";
import ValueCard from "./ValueCard";
export default function ValuesSection() {
  const about = useContent(aboutSource);

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

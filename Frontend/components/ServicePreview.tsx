import { useContent } from "../i18n/content";
import { IconText } from "./Icon";
import homeSource from "../data/home.json";
import servicesSource from "../data/services.json";
import Reveal from "./Reveal";
import ServiceCard from "./ServiceCard";
export default function ServicePreview() {
  const home = useContent(homeSource);
  const services = useContent(servicesSource);

  const c = home.services;
  return (
    <section className="section home-services">
      <Reveal className="section-label">{c.label}</Reveal>
      <Reveal className="section-top">
        <h2>
          {c.heading}
          <br />
          <span>{c.muted}</span>
        </h2>
        <div className="home-service-links">
          <a className="text-link" href={c.link.href}>
            <IconText text={c.link.label} />
          </a>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {services.items.map((service, index) => (
          <ServiceCard key={service.slug} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}

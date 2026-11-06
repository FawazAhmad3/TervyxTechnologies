import { useContent } from "../i18n/content";
import servicesSource from "../data/services.json";
import Reveal from "./Reveal";
import ServiceIllustration from "./ServiceIllustration";
import type { Service } from "./ServiceCard";
export default function ServiceRow({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const services = useContent(servicesSource);

  return (
    <Reveal>
      <article className="service service-summary-row">
        <div className="service-number">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="service-main min-w-0">
          <h3>
            <a className="service-title-link" href={service.href}>
              {service.title}
            </a>
          </h3>
          <p className="max-w-[430px]">{service.short}</p>
          <div className="tags">
            {service.tags.map((tag) => (
              <a
                className="service-tag-link"
                key={tag}
                href={
                  services.tagLinks[tag as keyof typeof services.tagLinks] ??
                  service.href
                }
              >
                <span>{tag}</span>
              </a>
            ))}
          </div>
        </div>
        <ServiceIllustration service={service} />
      </article>
    </Reveal>
  );
}

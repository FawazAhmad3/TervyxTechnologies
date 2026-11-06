import { useContent } from "../i18n/content";
import { IconText } from "./Icon";
import servicesSource from "../data/services.json";
import Reveal from "./Reveal";
export type Service = (typeof servicesSource.items)[number];
export default function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const services = useContent(servicesSource);

  return (
    <Reveal className="service-card-shell">
      <article className="preview-card service-summary-card">
        <span className="section-label">
          {String(index + 1).padStart(2, "0")} / {services.cardLabel}
        </span>
        <div className="service-icon-frame" aria-hidden="true">
          <div className="card-icon">
            <IconText text={service.icon} />
          </div>
        </div>
        <h3>
          <a className="service-title-link" href={service.href}>
            {service.title}
          </a>
        </h3>
        <p>{service.short}</p>
        <div className="tags service-card-tags">
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
      </article>
    </Reveal>
  );
}

import services from "../data/services.json";
import Reveal from "./Reveal";
export type Service = (typeof services.items)[number];
export default function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  return (
    <Reveal className="service-card-shell">
      <article className="preview-card service-summary-card">
        <span className="section-label">
          {String(index + 1).padStart(2, "0")} / {services.cardLabel}
        </span>
        <div className="service-icon-frame" aria-hidden="true">
          <div className="card-icon">{service.icon}</div>
        </div>
        <h3>{service.title}</h3>
        <p>{service.short}</p>
        <div className="tags service-card-tags">
          {service.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

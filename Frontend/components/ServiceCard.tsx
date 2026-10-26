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
    <Reveal className="preview-card-link">
      <a className="preview-card block h-full" href={service.href}>
        <span className="section-label">
          {String(index + 1).padStart(2, "0")} / {services.cardLabel}
        </span>
        <div className="card-icon" aria-hidden="true">
          {service.icon}
        </div>
        <h3>{service.title}</h3>
        <p>{service.short}</p>
        <span className="text-link">{services.cardLink}</span>
      </a>
    </Reveal>
  );
}

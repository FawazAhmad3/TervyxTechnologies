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
  return (
    <Reveal>
      <a className="service" href={service.href}>
        <div className="service-number">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="service-main min-w-0">
          <h3>{service.title}</h3>
          <p className="max-w-[430px]">{service.short}</p>
          <div className="tags">
            {service.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <ServiceIllustration service={service} />
        <span className="service-arrow" aria-hidden="true">
          ↗
        </span>
      </a>
    </Reveal>
  );
}

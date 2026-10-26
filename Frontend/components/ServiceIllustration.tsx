import type { Service } from "./ServiceCard";
export default function ServiceIllustration({ service }: { service: Service }) {
  if (service.image.src)
    return (
      <img
        className="service-art object-contain"
        src={service.image.src}
        alt={service.image.alt}
      />
    );
  if (service.slug === "web-development")
    return (
      <div className="service-art web-art" aria-hidden="true">
        <div>
          <b>↗</b>
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  if (service.slug === "app-development")
    return (
      <div className="service-art phone-art" aria-hidden="true">
        <div>
          <span>✳</span>
          <b />
          <b />
        </div>
        <div>
          <span>↗</span>
          <b />
        </div>
      </div>
    );
  return (
    <div className="service-art chart-art" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <b>↗</b>
    </div>
  );
}

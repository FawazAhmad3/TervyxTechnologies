import Icon from "./Icon";
import type { Service } from "./ServiceCard";
export default function ServiceIllustration({ service }: { service: Service }) {
  if (service.image.src)
    return (
      <img
        className="service-art object-contain"
        src={service.image.src}
        alt={service.image.alt}
        width={service.image.width}
        height={service.image.height}
        loading="lazy"
        decoding="async"
      />
    );
  if (service.slug === "web-development")
    return (
      <div className="service-art web-art" aria-hidden="true">
        <div>
          <b>
            <Icon name="arrow-up-right" />
          </b>
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  if (service.slug === "ui-ux-design")
    return (
      <div className="service-art web-art" aria-hidden="true">
        <div>
          <b>
            <Icon name="asterisk" />
          </b>
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
          <span>
            <Icon name="asterisk" />
          </span>
          <b />
          <b />
        </div>
        <div>
          <span>
            <Icon name="arrow-up-right" />
          </span>
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
      <b>
        <Icon name="arrow-up-right" />
      </b>
    </div>
  );
}

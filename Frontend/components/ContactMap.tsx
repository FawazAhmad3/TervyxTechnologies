import contact from "../data/contact.json";
import Icon from "./Icon";

export default function ContactMap() {
  const map = contact.map;
  return (
    <section className="section contact-map" aria-labelledby="contact-map-title">
      <div className="contact-map-heading">
        <div>
          <p className="section-label">{map.label}</p>
          <h2 id="contact-map-title">{map.title}</h2>
        </div>
        <a href={map.linkUrl} target="_blank" rel="noopener noreferrer">
          {map.linkLabel} <Icon name="arrow-up-right" />
        </a>
      </div>
      <iframe
        src={map.embedUrl}
        title={map.frameTitle}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </section>
  );
}

import services from "../data/services.json";
import type { Service } from "./ServiceCard";
import SectionHeading from "./SectionHeading";
import DetailCard from "./DetailCard";
import Reveal from "./Reveal";
import Button from "./Button";
export default function ServiceDetails({ service }: { service: Service }) {
  const c = services.detail;
  return (
    <>
      <section className="section">
        <SectionHeading content={c} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {service.offers.map((offer, index) => (
            <DetailCard key={offer.title} {...offer} index={index} />
          ))}
        </div>
      </section>
      <section className="section detail-planning">
        <Reveal className="section-label">{c.planningLabel}</Reveal>
        <Reveal as="h2">
          {c.planningHeading}
          <br />
          <span>{c.planningMuted}</span>
        </Reveal>
        <Reveal as="p">{service.planning}</Reveal>
        <Button href={service.contactHref}>{c.button}</Button>
      </section>
    </>
  );
}

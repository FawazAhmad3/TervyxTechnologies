import ServiceDirectory from "./ServiceDirectory";
import services from "../data/services.json";
import WebsitePlanLink from "./WebsitePlanLink";
import ServiceRow from "./ServiceRow";
export default function ServiceList() {
  return (
    <section className="services section" id="services">
      <h2 className="sr-only">
        Website, app development and digital marketing services
      </h2>
      {services.items.map((service, index) => (
        <ServiceRow key={service.slug} service={service} index={index} />
      ))}
      <ServiceDirectory />
      <WebsitePlanLink />
    </section>
  );
}

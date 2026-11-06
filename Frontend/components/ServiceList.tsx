import { useContent } from "../i18n/content";
import servicesSource from "../data/services.json";
import WebsitePlanLink from "./WebsitePlanLink";
import ServiceRow from "./ServiceRow";
export default function ServiceList() {
  const services = useContent(servicesSource);

  return (
    <section className="services section" id="services">
      <h2 className="sr-only">{services.summaryHeading}</h2>
      {services.items.map((service, index) => (
        <ServiceRow key={service.slug} service={service} index={index} />
      ))}
      <WebsitePlanLink />
    </section>
  );
}

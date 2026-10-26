import services from "../data/services.json";
import ServiceRow from "./ServiceRow";
export default function ServiceList() {
  return (
    <section className="services section" id="services">
      {services.items.map((service, index) => (
        <ServiceRow key={service.slug} service={service} index={index} />
      ))}
    </section>
  );
}

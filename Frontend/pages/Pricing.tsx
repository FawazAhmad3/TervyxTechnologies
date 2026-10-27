import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import WebsitePlanLink from "../components/WebsitePlanLink";
import ServiceDetails from "../components/ServiceDetails";
import quote from "../data/quote.json";
import services from "../data/services.json";
export default function Pricing() {
  return (
    <Layout title={quote.title}>
      <PageIntro content={quote.intro} />
      <section className="section">
        <WebsitePlanLink />
      </section>
      {services.items.map((service) => (
        <ServiceDetails key={service.slug} service={service} />
      ))}
    </Layout>
  );
}

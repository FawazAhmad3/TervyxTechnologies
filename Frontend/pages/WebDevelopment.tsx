import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import ServiceDetails from "../components/ServiceDetails";
import CallToAction from "../components/CallToAction";
import WebsitePlanLink from "../components/WebsitePlanLink";
import services from "../data/services.json";
const service = services.items.find((item) => item.slug === "web-development")!;
export default function WebDevelopment() {
  return (
    <Layout title={service.title}>
      <PageIntro content={service.intro} />
      <section className="section web-pricing-link" id="website-plans">
        <WebsitePlanLink />
      </section>
      <ServiceDetails service={service} />
      <CallToAction />
    </Layout>
  );
}

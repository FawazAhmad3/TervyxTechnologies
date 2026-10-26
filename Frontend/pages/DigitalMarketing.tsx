import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import ServiceDetails from "../components/ServiceDetails";
import CallToAction from "../components/CallToAction";
import services from "../data/services.json";
const service = services.items.find(
  (item) => item.slug === "digital-marketing",
)!;
export default function DigitalMarketing() {
  return (
    <Layout title={service.title}>
      <PageIntro content={service.intro} />
      <ServiceDetails service={service} />
      <CallToAction />
    </Layout>
  );
}

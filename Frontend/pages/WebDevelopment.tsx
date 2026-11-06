import { useContent } from "../i18n/content";
import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import ServiceDetails from "../components/ServiceDetails";
import CallToAction from "../components/CallToAction";
import servicesSource from "../data/services.json";

export default function WebDevelopment() {
  const services = useContent(servicesSource);
  const service = services.items.find(
    (item) => item.slug === "web-development",
  )!;

  return (
    <Layout title={service.title}>
      <PageIntro content={service.intro} />
      <ServiceDetails service={service} />
      <CallToAction />
    </Layout>
  );
}

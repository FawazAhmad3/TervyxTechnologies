import { useContent } from "../i18n/content";
import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import ServiceList from "../components/ServiceList";
import CallToAction from "../components/CallToAction";
import servicesSource from "../data/services.json";
export default function Services() {
  const services = useContent(servicesSource);

  return (
    <Layout title={services.title}>
      <PageIntro content={services.intro} />
      <ServiceList />
      <CallToAction />
    </Layout>
  );
}

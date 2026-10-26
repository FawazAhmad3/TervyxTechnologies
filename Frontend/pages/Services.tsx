import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import ServiceList from "../components/ServiceList";
import CallToAction from "../components/CallToAction";
import services from "../data/services.json";
export default function Services() {
  return (
    <Layout title={services.title}>
      <PageIntro content={services.intro} />
      <ServiceList />
      <CallToAction />
    </Layout>
  );
}

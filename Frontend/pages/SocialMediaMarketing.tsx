import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import ServiceDetails from "../components/ServiceDetails";
import CallToAction from "../components/CallToAction";
import marketing from "../data/marketing-services.json";
const service = marketing.items.find(
  (item) => item.slug === "social-media-marketing",
)!;
export default function SocialMediaMarketing() {
  return (
    <Layout title={service.title}>
      <PageIntro content={service.intro} />
      <ServiceDetails service={service} />
      <CallToAction />
    </Layout>
  );
}

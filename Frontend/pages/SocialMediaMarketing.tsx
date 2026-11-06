import { useContent } from "../i18n/content";
import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import ServiceDetails from "../components/ServiceDetails";
import CallToAction from "../components/CallToAction";
import marketingSource from "../data/marketing-services.json";

export default function SocialMediaMarketing() {
  const marketing = useContent(marketingSource);
  const service = marketing.items.find(
    (item) => item.slug === "social-media-marketing",
  )!;

  return (
    <Layout title={service.title}>
      <PageIntro content={service.intro} />
      <ServiceDetails service={service} />
      <CallToAction />
    </Layout>
  );
}

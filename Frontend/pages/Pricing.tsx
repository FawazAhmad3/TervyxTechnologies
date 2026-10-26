import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import PairedPricing from "../components/PairedPricing";
import CallToAction from "../components/CallToAction";
import pricing from "../data/pricing.json";
export default function Pricing() {
  return (
    <Layout title={pricing.page.title}>
      <PageIntro content={pricing.page.intro} />
      <PairedPricing />
      <CallToAction />
    </Layout>
  );
}

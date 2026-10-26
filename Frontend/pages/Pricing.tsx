import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import PricingScopeNote from "../components/PricingScopeNote";
import PricingTabs from "../components/PricingTabs";
import CallToAction from "../components/CallToAction";
import pricing from "../data/pricing.json";
export default function Pricing() {
  return (
    <Layout title={pricing.page.title}>
      <PageIntro content={pricing.page.intro} />
      <PricingScopeNote />
      <PricingTabs />
      <CallToAction />
    </Layout>
  );
}

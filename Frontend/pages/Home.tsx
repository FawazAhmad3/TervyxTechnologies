import Layout from "../components/Layout";
import Hero from "../components/Hero";
import AnimatedRibbon from "../components/AnimatedRibbon";
import ServicePreview from "../components/ServicePreview";
import CallToAction from "../components/CallToAction";
import home from "../data/home.json";
export default function Home() {
  return (
    <Layout title={home.title}>
      <Hero />
      <AnimatedRibbon />
      <ServicePreview />
      <CallToAction />
    </Layout>
  );
}

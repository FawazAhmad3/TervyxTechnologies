import { useContent } from "../i18n/content";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import AnimatedRibbon from "../components/AnimatedRibbon";
import ServicePreview from "../components/ServicePreview";
import CallToAction from "../components/CallToAction";
import HomeIntroduction from "../components/HomeIntroduction";
import ProjectExplorer from "../components/ProjectExplorer";
import WorkingTogether from "../components/WorkingTogether";
import ProcessSteps from "../components/ProcessSteps";
import FaqSection from "../components/FaqSection";
import homeSource from "../data/home.json";
export default function Home() {
  const home = useContent(homeSource);

  return (
    <Layout title={home.title}>
      <Hero />
      <AnimatedRibbon />
      <ServicePreview />
      <HomeIntroduction />
      <ProjectExplorer />
      <WorkingTogether />
      <ProcessSteps summary />
      <FaqSection />
      <CallToAction />
    </Layout>
  );
}

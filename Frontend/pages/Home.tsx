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
import home from "../data/home.json";
export default function Home() {
  return (
    <Layout title={home.title}>
      <Hero />
      <AnimatedRibbon />
      <ServicePreview />
      <HomeIntroduction />
      <ProjectExplorer />
      <WorkingTogether />
      <ProcessSteps />
      <FaqSection />
      <CallToAction />
    </Layout>
  );
}

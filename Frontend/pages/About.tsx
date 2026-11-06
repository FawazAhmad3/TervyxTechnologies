import { useContent } from "../i18n/content";
import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import AboutStory from "../components/AboutStory";
import ValuesSection from "../components/ValuesSection";
import CallToAction from "../components/CallToAction";
import aboutSource from "../data/about.json";
export default function About() {
  const about = useContent(aboutSource);

  return (
    <Layout title={about.title}>
      <PageIntro content={about.intro} />
      <AboutStory />
      <ValuesSection />
      <CallToAction />
    </Layout>
  );
}

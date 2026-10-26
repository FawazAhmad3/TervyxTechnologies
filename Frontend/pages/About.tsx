import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import AboutStory from "../components/AboutStory";
import ValuesSection from "../components/ValuesSection";
import CallToAction from "../components/CallToAction";
import about from "../data/about.json";
export default function About() {
  return (
    <Layout title={about.title}>
      <PageIntro content={about.intro} />
      <AboutStory />
      <ValuesSection />
      <CallToAction />
    </Layout>
  );
}

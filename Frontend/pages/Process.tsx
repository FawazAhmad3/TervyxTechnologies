import { useContent } from "../i18n/content";
import Layout from "../components/Layout";
import PageIntro from "../components/PageIntro";
import ProcessSteps from "../components/ProcessSteps";
import Statement from "../components/Statement";
import CallToAction from "../components/CallToAction";
import processSource from "../data/process.json";
export default function Process() {
  const process = useContent(processSource);

  return (
    <Layout title={process.title}>
      <PageIntro content={process.intro} />
      <ProcessSteps />
      <Statement />
      <CallToAction />
    </Layout>
  );
}

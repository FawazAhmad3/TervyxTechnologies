import { useContent } from "../i18n/content";
import Layout from "../components/Layout";
import ContactIntro from "../components/ContactIntro";
import ProjectForm from "../components/ProjectForm";
import ContactMap from "../components/ContactMap";
import contactSource from "../data/contact.json";
export default function Contact() {
  const contact = useContent(contactSource);

  return (
    <Layout title={contact.title}>
      <section className="contact section" id="contact">
        <ContactIntro />
        <ProjectForm />
      </section>
      <ContactMap />
    </Layout>
  );
}

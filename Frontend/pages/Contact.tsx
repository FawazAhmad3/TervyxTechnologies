import Layout from "../components/Layout";
import ContactIntro from "../components/ContactIntro";
import ProjectForm from "../components/ProjectForm";
import ContactMap from "../components/ContactMap";
import contact from "../data/contact.json";
export default function Contact() {
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

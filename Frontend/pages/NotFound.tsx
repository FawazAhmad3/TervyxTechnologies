import Layout from "../components/Layout";
import Button from "../components/Button";
import site from "../data/site.json";
export default function NotFound() {
  const c = site.notFound;
  return (
    <Layout title={c.title}>
      <section className="section min-h-[55vh]">
        <h1>{c.title}</h1>
        <p className="mb-8">{c.description}</p>
        <Button href={c.href}>{c.label}</Button>
      </section>
    </Layout>
  );
}

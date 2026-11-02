import { useEffect, type ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";
import {
  canonicalFor,
  metadataTags,
  pageForPath,
  structuredData,
} from "../seo/config";
import { usePagePath } from "../context/PagePathContext";
export default function Layout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const path = usePagePath();
  useEffect(() => {
    // Production pages already contain the correct head tags; only dev needs runtime updates.
    if (import.meta.env.DEV) {
      const page = pageForPath(path);
      document.title = page.title;
      for (const [name, content] of Object.entries(metadataTags(page))) {
        const property = name.startsWith("og:") ? "property" : "name";
        let element = document.querySelector<HTMLMetaElement>(
          `meta[${property}="${name}"]`,
        );
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute(property, name);
          document.head.append(element);
        }
        element.content = content;
      }
      const canonical = canonicalFor(page);
      let link = document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]',
      );
      if (canonical) {
        if (!link) {
          link = document.createElement("link");
          link.rel = "canonical";
          document.head.append(link);
        }
        link.href = canonical;
      } else link?.remove();
      const graph = structuredData(page);
      let schema = document.querySelector<HTMLScriptElement>(
        "script[data-seo-schema]",
      );
      if (graph) {
        if (!schema) {
          schema = document.createElement("script");
          schema.type = "application/ld+json";
          schema.dataset.seoSchema = "";
          document.head.append(schema);
        }
        schema.textContent = JSON.stringify(graph);
      } else schema?.remove();
    }
    const id = location.hash.slice(1);
    const frame = id
      ? requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView({ behavior: "instant" }),
        )
      : 0;
    return () => cancelAnimationFrame(frame);
  }, [title, path]);
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

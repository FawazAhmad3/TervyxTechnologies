import { normalizePath } from "./paths";
import seo from "../data/seo.json";
export type SeoPage = {
  path: string;
  title: string;
  description: string;
  label: string;
  canonical?: string;
  noindex?: boolean;
  service?: string;
  parent?: string;
};
export const seoConfig = seo;
export const seoPages = seo.pages as Record<string, SeoPage>;
export function pageForPath(path: string): SeoPage {
  return (
    Object.values(seoPages).find((page) => page.path === normalizePath(path)) ??
    seoPages["404"]
  );
}
export function canonicalFor(page: SeoPage) {
  return page.path === "/404"
    ? null
    : seo.origin + (page.canonical ?? page.path);
}
export function structuredData(page: SeoPage) {
  if (page.noindex) return null;
  const origin = seo.origin;
  const organization = {
    "@type": "Organization",
    "@id": origin + "/#organization",
    name: seo.organization.name,
    url: origin + "/",
    logo: { "@type": "ImageObject", url: origin + seo.organization.logo },
    email: seo.organization.email,
  };
  const website = {
    "@type": "WebSite",
    "@id": origin + "/#website",
    url: origin + "/",
    name: seo.organization.name,
    inLanguage: seo.language,
    publisher: { "@id": organization["@id"] },
  };
  const canonical = canonicalFor(page)!;
  const webpage = {
    "@type":
      page.path === "/contact"
        ? "ContactPage"
        : page.path === "/about"
          ? "AboutPage"
          : "WebPage",
    "@id": canonical + "#webpage",
    url: canonical,
    name: page.title,
    description: page.description,
    inLanguage: seo.language,
    isPartOf: { "@id": website["@id"] },
    about: { "@id": organization["@id"] },
  };
  const graph: object[] = [organization, website, webpage];
  if (page.path !== "/") {
    const crumbs = [
      { "@type": "ListItem", position: 1, name: "Home", item: origin + "/" },
    ];
    if (page.parent) {
      const parent = pageForPath(page.parent);
      crumbs.push({
        "@type": "ListItem",
        position: 2,
        name: parent.label,
        item: origin + parent.path,
      });
    }
    crumbs.push({
      "@type": "ListItem",
      position: crumbs.length + 1,
      name: page.label,
      item: canonical,
    });
    graph.push({
      "@type": "BreadcrumbList",
      "@id": canonical + "#breadcrumbs",
      itemListElement: crumbs,
    });
  }
  if (page.service)
    graph.push({
      "@type": "Service",
      "@id": canonical + "#service",
      name: page.service,
      serviceType: page.service,
      url: canonical,
      description: page.description,
      provider: { "@id": organization["@id"] },
      areaServed: { "@type": "Place", name: "Worldwide" },
    });
  return { "@context": "https://schema.org", "@graph": graph };
}
export function metadataTags(page: SeoPage) {
  const canonical = canonicalFor(page);
  const meta: Record<string, string> = {
    description: page.description,
    robots: page.noindex
      ? "noindex, follow"
      : "index, follow, max-image-preview:large",
    "og:type": "website",
    "og:site_name": seo.organization.name,
    "og:title": page.title,
    "og:description": page.description,
    "og:image": seo.origin + seo.socialImage,
    "og:image:alt":
      "TERVYX Technologies — website development, apps, social media marketing and SEO",
    "og:image:width": "1200",
    "og:image:height": "630",
    "twitter:card": "summary_large_image",
    "twitter:title": page.title,
    "twitter:description": page.description,
    "twitter:image": seo.origin + seo.socialImage,
    "twitter:image:alt": "TERVYX Technologies — Code the Future",
  };
  if (canonical) meta["og:url"] = canonical;
  if (seo.searchConsoleVerification)
    meta["google-site-verification"] = seo.searchConsoleVerification;
  return meta;
}

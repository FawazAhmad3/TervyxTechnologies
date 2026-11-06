import { localeFromPath, basePath } from "../i18n/locale";
import { localize } from "../i18n/localize";
import { normalizePath } from "./paths";
import seo from "../data/seo.json";
export type SeoPage = {
  path: string;
  locale?: "en" | "it";
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
  const locale = localeFromPath(path);
  const plain = basePath(normalizePath(path));
  const page =
    Object.values(seoPages).find((page) => page.path === plain) ??
    seoPages["404"];
  return { ...localize(page, locale), locale };
}
export function canonicalFor(page: SeoPage) {
  return basePath(page.path) === "/404"
    ? null
    : seo.origin + (page.canonical ?? page.path);
}
export function structuredData(page: SeoPage) {
  if (page.noindex) return null;
  const origin = seo.origin;
  const language = page.locale ?? "en";
  const home = language === "it" ? "/it/" : "/";
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
    "@id": origin + home + "#website",
    url: origin + home,
    name: seo.organization.name,
    inLanguage: language,
    publisher: { "@id": organization["@id"] },
  };
  const canonical = canonicalFor(page)!;
  const webpage = {
    "@type":
      basePath(page.path) === "/contact"
        ? "ContactPage"
        : basePath(page.path) === "/about"
          ? "AboutPage"
          : "WebPage",
    "@id": canonical + "#webpage",
    url: canonical,
    name: page.title,
    description: page.description,
    inLanguage: language,
    isPartOf: { "@id": website["@id"] },
    about: { "@id": organization["@id"] },
    publisher: { "@id": organization["@id"] },
    ...(basePath(page.path) !== "/"
      ? { breadcrumb: { "@id": canonical + "#breadcrumbs" } }
      : {}),
    ...(page.service ? { mainEntity: { "@id": canonical + "#service" } } : {}),
  };
  const graph: object[] = [organization, website, webpage];
  if (basePath(page.path) !== "/") {
    const crumbs = [
      { "@type": "ListItem", position: 1, name: "Home", item: origin + home },
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
      areaServed: {
        "@type": "Place",
        name: language === "it" ? "Tutto il mondo" : "Worldwide",
      },
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
    "og:locale": page.locale === "it" ? "it_IT" : "en_US",
    "og:site_name": seo.organization.name,
    "og:title": page.title,
    "og:description": page.description,
    "og:image": seo.origin + seo.socialImage,
    "og:image:alt":
      page.locale === "it"
        ? "TERVYX Technologies — sviluppo web e app, social media marketing e SEO"
        : "TERVYX Technologies — website development, apps, social media marketing and SEO",
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

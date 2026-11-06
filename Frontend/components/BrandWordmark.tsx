import { useContent } from "../i18n/content";
import siteSource from "../data/site.json";
export default function BrandWordmark({ large = false }: { large?: boolean }) {
  const site = useContent(siteSource);

  return (
    <span className={`brand-wordmark${large ? " brand-wordmark-large" : ""}`}>
      <span className="wordmark-name">{site.brand.name}</span>
      <span className="wordmark-descriptor">{site.brand.descriptor}</span>
      <span className="wordmark-tagline">{site.brand.tagline}</span>
    </span>
  );
}

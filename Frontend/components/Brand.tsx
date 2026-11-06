import { useContent } from "../i18n/content";
import siteSource from "../data/site.json";
import BrandSymbol from "./BrandSymbol";
import BrandWordmark from "./BrandWordmark";
export default function Brand({
  variant = "primary",
}: {
  variant?: "primary" | "stacked";
}) {
  const site = useContent(siteSource);

  return (
    <a
      className={`brand brand-vector brand-${variant}`}
      href={site.brand.home}
      aria-label={`${site.brand.fullName} — Home`}
    >
      <BrandSymbol className="brand-header-symbol" />
      <BrandWordmark />
    </a>
  );
}

import site from "../data/site.json";
import BrandSymbol from "./BrandSymbol";
import BrandWordmark from "./BrandWordmark";
export default function Brand({
  variant = "primary",
}: {
  variant?: "primary" | "stacked";
}) {
  return (
    <a
      className={`brand brand-vector brand-${variant}`}
      href={site.brand.home}
      aria-label={`${site.brand.fullName} home`}
    >
      <BrandSymbol className="brand-header-symbol" />
      <BrandWordmark />
    </a>
  );
}

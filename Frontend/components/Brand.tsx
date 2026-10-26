import site from "../data/site.json";
import BrandArtwork, { type BrandVariant } from "./BrandArtwork";
export default function Brand({
  variant = "primary",
}: {
  variant?: BrandVariant;
}) {
  return (
    <a
      className={`brand brand-artwork brand-${variant}`}
      href={site.brand.home}
      aria-label={`${site.brand.fullName} home`}
    >
      <BrandArtwork variant={variant} className="brand-logo" decorative />
    </a>
  );
}

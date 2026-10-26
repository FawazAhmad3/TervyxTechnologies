import BrandArtwork from "./BrandArtwork";
/** The same original symbol used by the header and footer, without a redrawn silhouette. */
export default function OrbitalGraphic() {
  return (
    <div className="original-orbit-motion">
      <BrandArtwork variant="symbol" className="exact-hero-symbol" decorative />
    </div>
  );
}

import { useId } from "react";
import brand from "../data/brand.json";
export type BrandVariant = keyof typeof brand.views;
export default function BrandArtwork({
  variant = "primary",
  className = "",
  decorative = false,
}: {
  variant?: BrandVariant;
  className?: string;
  decorative?: boolean;
}) {
  const [x, y, width, height] = brand.views[variant];
  const clipId = useId();
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${x} ${y} ${width} ${height}`}
      width={width}
      height={height}
      role={decorative ? undefined : "img"}
      aria-label={
        decorative
          ? undefined
          : variant === "symbol"
            ? brand.symbolAlt
            : brand.logoAlt
      }
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={y} width={width} height={height} />
        </clipPath>
      </defs>
      <image
        clipPath={`url(#${clipId})`}
        href={brand.source}
        x="0"
        y="0"
        width={brand.sourceWidth}
        height={brand.sourceHeight}
      />
    </svg>
  );
}

import { useId } from "react";
import { useTheme } from "../context/ThemeContext";
import heroVector from "../data/hero-vector.json";
import masks from "../data/brand-masks.json";
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
  const maskId = useId();
  const { theme } = useTheme();
  const maskPath = masks[variant as keyof typeof masks];
  return (
    <svg
      className={`brand-source-art ${className}`}
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
        {maskPath && (
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x={x}
            y={y}
            width={width}
            height={height}
          >
            <path d={maskPath} fill="white" />
            {(variant === "symbol" || variant === "primary") && (
              <path
                d={heroVector.silhouette}
                transform="translate(404 106)"
                fill="white"
                fillRule="evenodd"
              />
            )}
            {variant === "stacked" && (
              <path
                d={heroVector.silhouette}
                transform="translate(568 684) scale(.43)"
                fill="white"
                fillRule="evenodd"
              />
            )}
          </mask>
        )}
      </defs>
      <image
        mask={theme === "light" && maskPath ? `url(#${maskId})` : undefined}
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

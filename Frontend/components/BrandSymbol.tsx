import { useId, type CSSProperties } from "react";
import { useTheme } from "../context/ThemeContext";
import brand from "../data/brand.json";
import symbol from "../data/brand-symbol.json";
export default function BrandSymbol({
  className = "",
  decorative = true,
}: {
  className?: string;
  decorative?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const { theme } = useTheme();
  return (
    <svg
      className={`brand-vector-symbol ${className}`}
      viewBox={symbol.viewBox}
      style={
        theme === "light"
          ? (brand.lightSymbolPalette as CSSProperties)
          : (brand.darkSymbolPalette as CSSProperties)
      }
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "TERVYX orbital symbol"}
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-metal`}
          x1="105"
          y1="10"
          x2="210"
          y2="84"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--logo-metal-1, #8197b8)" />
          <stop offset=".48" stopColor="var(--logo-metal-2, #3b5680)" />
          <stop offset="1" stopColor="var(--logo-metal-3, #162e53)" />
        </linearGradient>
        <linearGradient
          id={`${id}-green`}
          x1="73"
          y1="17"
          x2="132"
          y2="114"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--logo-green-1, #557db6)" />
          <stop offset=".45" stopColor="var(--logo-green-2, #1B3A6B)" />
          <stop offset="1" stopColor="var(--logo-green-3, #122b50)" />
        </linearGradient>
        <linearGradient
          id={`${id}-lower`}
          x1="117"
          y1="166"
          x2="272"
          y2="260"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--logo-lower-1, #567eb7)" />
          <stop offset=".35" stopColor="var(--logo-lower-2, #2d5289)" />
          <stop offset=".7" stopColor="var(--logo-lower-3, #2a4264)" />
          <stop offset="1" stopColor="var(--logo-lower-4, #4f6484)" />
        </linearGradient>
        <linearGradient
          id={`${id}-rear`}
          x1="253"
          y1="110"
          x2="280"
          y2="268"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--logo-rear-1, #9aacc6)" />
          <stop offset=".28" stopColor="var(--logo-rear-2, #607898)" />
          <stop offset=".75" stopColor="var(--logo-rear-3, #152e53)" />
          <stop offset="1" stopColor="var(--logo-rear-4, #536b8c)" />
        </linearGradient>
        <linearGradient
          id={`${id}-orbit`}
          x1="7"
          y1="220"
          x2="249"
          y2="72"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--logo-orbit-1, #1B3A6B)" />
          <stop offset=".45" stopColor="var(--logo-orbit-2, #345e99)" />
          <stop offset="1" stopColor="var(--logo-orbit-3, #6c91c4)" />
        </linearGradient>
        <radialGradient id={`${id}-sphere`} cx=".3" cy=".25" r=".8">
          <stop stopColor="var(--logo-sphere-1, #a4bde0)" />
          <stop offset=".52" stopColor="var(--logo-sphere-2, #527db8)" />
          <stop offset="1" stopColor="var(--logo-sphere-3, #1B3A6B)" />
        </radialGradient>
      </defs>
      <path d={symbol.topBand} fill={`url(#${id}-metal)`} />
      <path d={symbol.topLime} fill={`url(#${id}-green)`} />
      <path d={symbol.lowerBand} fill={`url(#${id}-lower)`} />
      <path d={symbol.rearFace} fill={`url(#${id}-rear)`} />
      <path
        d="M250 110C280 165 300 247 263 270C218 301 142 243 103 181"
        fill="none"
        stroke="var(--logo-edge, #718db4)"
        strokeWidth=".7"
        strokeOpacity=".6"
      />
      <path d={symbol.swoosh} fill={`url(#${id}-orbit)`} />
      <path
        d={symbol.swooshHighlight}
        fill="var(--logo-highlight, #dbe7f7)"
        opacity=".35"
      />
      <circle {...symbol.sphere} fill={`url(#${id}-sphere)`} />
    </svg>
  );
}

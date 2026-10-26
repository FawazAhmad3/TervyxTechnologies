import { useId } from "react";
import symbol from "../data/brand-symbol.json";
export default function BrandSymbol({
  className = "",
  decorative = true,
}: {
  className?: string;
  decorative?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`brand-vector-symbol ${className}`}
      viewBox={symbol.viewBox}
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
          <stop stopColor="#7d8b78" />
          <stop offset=".48" stopColor="#46534a" />
          <stop offset="1" stopColor="#202c25" />
        </linearGradient>
        <linearGradient
          id={`${id}-green`}
          x1="73"
          y1="17"
          x2="132"
          y2="114"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e1ff9c" />
          <stop offset=".45" stopColor="#c8fa73" />
          <stop offset="1" stopColor="#a0dc45" />
        </linearGradient>
        <linearGradient
          id={`${id}-lower`}
          x1="117"
          y1="166"
          x2="272"
          y2="260"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d6ff85" />
          <stop offset=".35" stopColor="#b8f35c" />
          <stop offset=".7" stopColor="#71885f" />
          <stop offset="1" stopColor="#667363" />
        </linearGradient>
        <linearGradient
          id={`${id}-rear`}
          x1="253"
          y1="110"
          x2="280"
          y2="268"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#98a28f" />
          <stop offset=".28" stopColor="#5d6c60" />
          <stop offset=".75" stopColor="#202d25" />
          <stop offset="1" stopColor="#6a7866" />
        </linearGradient>
        <linearGradient
          id={`${id}-orbit`}
          x1="7"
          y1="220"
          x2="249"
          y2="72"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#b3ee49" />
          <stop offset=".45" stopColor="#ceff78" />
          <stop offset="1" stopColor="#e2ff9d" />
        </linearGradient>
        <radialGradient id={`${id}-sphere`} cx=".3" cy=".25" r=".8">
          <stop stopColor="#e7ffa8" />
          <stop offset=".52" stopColor="#c8fa73" />
          <stop offset="1" stopColor="#8ccd37" />
        </radialGradient>
      </defs>
      <path d={symbol.topBand} fill={`url(#${id}-metal)`} />
      <path d={symbol.topLime} fill={`url(#${id}-green)`} />
      <path d={symbol.lowerBand} fill={`url(#${id}-lower)`} />
      <path d={symbol.rearFace} fill={`url(#${id}-rear)`} />
      <path
        d="M250 110C280 165 300 247 263 270C218 301 142 243 103 181"
        fill="none"
        stroke="#9ead95"
        strokeWidth=".7"
        strokeOpacity=".6"
      />
      <path d={symbol.swoosh} fill={`url(#${id}-orbit)`} />
      <path d={symbol.swooshHighlight} fill="#edffb5" opacity=".35" />
      <circle {...symbol.sphere} fill={`url(#${id}-sphere)`} />
    </svg>
  );
}

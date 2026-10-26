import { useId } from "react";
import vector from "../data/hero-vector.json";
/** Native SVG contours traced from the supplied logo, not a bitmap or a replacement silhouette. */
export default function OrbitalGraphic() {
  const id = useId().replace(/:/g, "");
  return (
    <div className="original-orbit-motion">
      <svg
        className="traced-hero-symbol"
        viewBox={vector.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id={`${id}-metal`}
            x1="100"
            y1="5"
            x2="250"
            y2="278"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#87927e" />
            <stop offset=".24" stopColor="#46534a" />
            <stop offset=".48" stopColor="#19231e" />
            <stop offset=".73" stopColor="#687767" />
            <stop offset="1" stopColor="#829078" />
          </linearGradient>
          <linearGradient
            id={`${id}-lime`}
            x1="60"
            y1="30"
            x2="241"
            y2="254"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#e6ffa7" />
            <stop offset=".35" stopColor="#d4ff80" />
            <stop offset=".65" stopColor="#b6f25d" />
            <stop offset="1" stopColor="#809b69" />
          </linearGradient>
          <radialGradient id={`${id}-sphere`} cx=".3" cy=".25" r=".85">
            <stop stopColor="#e5ffa0" />
            <stop offset=".55" stopColor="#c8fa73" />
            <stop offset="1" stopColor="#8acb35" />
          </radialGradient>
          <filter
            id={`${id}-blend`}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
          <clipPath id={`${id}-outline`}>
            <path d={vector.silhouette} clipRule="evenodd" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-outline)`}>
          <path
            d={vector.silhouette}
            fill={`url(#${id}-metal)`}
            fillRule="evenodd"
          />
          <path
            d={vector.lime}
            fill={`url(#${id}-lime)`}
            fillRule="evenodd"
            filter={`url(#${id}-blend)`}
          />
          <circle cx="268" cy="72" r="24" fill={`url(#${id}-sphere)`} />
        </g>
      </svg>
    </div>
  );
}

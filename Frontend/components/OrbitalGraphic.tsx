import { useId } from "react";
/** Scalable hero illustration inspired by the supplied mark. Brand logos retain the original artwork. */
export default function OrbitalGraphic() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="orbital-graphic"
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={`${id}-lime`}
          x1="120"
          y1="100"
          x2="430"
          y2="480"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#edffb9" />
          <stop offset=".28" stopColor="#c8fa73" />
          <stop offset=".6" stopColor="#9bdc3f" />
          <stop offset="1" stopColor="#42553c" />
        </linearGradient>
        <linearGradient
          id={`${id}-metal`}
          x1="236"
          y1="74"
          x2="474"
          y2="504"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7c8b78" />
          <stop offset=".28" stopColor="#38423c" />
          <stop offset=".55" stopColor="#111815" />
          <stop offset=".83" stopColor="#62705f" />
          <stop offset="1" stopColor="#9aa78d" />
        </linearGradient>
        <linearGradient
          id={`${id}-swoosh`}
          x1="130"
          y1="329"
          x2="486"
          y2="156"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#b3ef49" />
          <stop offset=".32" stopColor="#d9ff87" />
          <stop offset=".65" stopColor="#c8fa73" />
          <stop offset="1" stopColor="#e7ffa9" />
        </linearGradient>
        <linearGradient
          id={`${id}-edge`}
          x1="250"
          y1="300"
          x2="494"
          y2="535"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d7ff8e" />
          <stop offset=".5" stopColor="#73886a" />
          <stop offset="1" stopColor="#29352c" />
        </linearGradient>
        <radialGradient id={`${id}-sphere`} cx=".3" cy=".25" r=".85">
          <stop stopColor="#e9ffb2" />
          <stop offset=".45" stopColor="#c8fa73" />
          <stop offset="1" stopColor="#84c52b" />
        </radialGradient>
        <radialGradient id={`${id}-halo`}>
          <stop stopColor="#c8fa73" stopOpacity=".13" />
          <stop offset="1" stopColor="#c8fa73" stopOpacity="0" />
        </radialGradient>
        <filter
          id={`${id}-shadow`}
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
        >
          <feDropShadow
            dx="0"
            dy="16"
            stdDeviation="13"
            floodColor="#000"
            floodOpacity=".3"
          />
        </filter>
      </defs>
      <ellipse
        className="orbital-halo"
        cx="300"
        cy="310"
        rx="275"
        ry="265"
        fill={`url(#${id}-halo)`}
      />
      <g className="orbital-motion" filter={`url(#${id}-shadow)`}>
        <path
          d="M220 77C272 35 351 82 407 159L345 177C301 122 253 88 220 103Z"
          fill={`url(#${id}-metal)`}
          stroke="#a4b497"
          strokeOpacity=".3"
        />
        <path
          d="M220 77C168 98 161 180 197 278L259 245C224 169 206 105 240 77Z"
          fill={`url(#${id}-lime)`}
        />
        <path
          d="M220 78C183 112 191 180 213 226"
          fill="none"
          stroke="#e5ffb0"
          strokeWidth="1.2"
          strokeOpacity=".5"
        />
        <path
          d="M455 224C514 323 548 474 489 525C419 587 311 482 250 370L310 328C355 418 421 496 467 493C515 490 496 347 455 224Z"
          fill={`url(#${id}-edge)`}
        />
        <path
          d="M455 224C514 324 529 453 490 499C449 537 374 469 310 328L296 338C354 470 434 554 489 525C548 474 514 323 455 224Z"
          fill={`url(#${id}-metal)`}
        />
        <path
          d="M456 226C508 324 541 467 489 517C433 569 331 471 273 369"
          fill="none"
          stroke="#c3d3b5"
          strokeOpacity=".38"
          strokeWidth="1.5"
        />
        <path
          d="M486 155C348 179 145 261 107 326C68 393 159 417 262 377C185 393 134 367 170 328C232 259 385 187 486 155Z"
          fill={`url(#${id}-swoosh)`}
        />
        <path
          d="M486 155C356 190 190 274 139 333C105 374 145 395 194 395C142 399 84 380 107 339C144 274 348 179 486 155Z"
          fill="#e5ff9e"
          fillOpacity=".45"
        />
        <path
          d="M482 157C340 195 156 286 120 341"
          fill="none"
          stroke="#efffc5"
          strokeWidth="1.3"
          strokeOpacity=".7"
        />
        <circle
          className="orbital-sphere"
          cx="491"
          cy="154"
          r="28"
          fill={`url(#${id}-sphere)`}
          stroke="#e8ffbb"
          strokeWidth="1"
          strokeOpacity=".55"
        />
        <circle className="orbit-tracer" r="2.5" fill="#efffd0">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M482 157C340 195 156 286 120 341"
          />
        </circle>
      </g>
    </svg>
  );
}

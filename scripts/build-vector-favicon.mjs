import { readFileSync, writeFileSync } from "node:fs";
const s = JSON.parse(
  readFileSync(
    new URL("../Frontend/data/brand-symbol.json", import.meta.url),
    "utf8",
  ),
);
const brand = JSON.parse(
  readFileSync(new URL("../Frontend/data/brand.json", import.meta.url), "utf8"),
);
const css = (palette) =>
  Object.entries(palette)
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
const gradient = (id, coordinates, stops) =>
  `<linearGradient id="${id}" ${coordinates} gradientUnits="userSpaceOnUse">${stops.map(([offset, key]) => `<stop offset="${offset}" stop-color="var(--logo-${key})"/>`).join("")}</linearGradient>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 312 290"><style>:root{${css(brand.lightSymbolPalette)}}@media(prefers-color-scheme:dark){:root{${css(brand.darkSymbolPalette)}}}</style><defs>
${gradient("metal", 'x1="105" y1="10" x2="210" y2="84"', [
  [0, "metal-1"],
  [0.48, "metal-2"],
  [1, "metal-3"],
])}
${gradient("blue", 'x1="73" y1="17" x2="132" y2="114"', [
  [0, "green-1"],
  [0.45, "green-2"],
  [1, "green-3"],
])}
${gradient("lower", 'x1="117" y1="166" x2="272" y2="260"', [
  [0, "lower-1"],
  [0.35, "lower-2"],
  [0.7, "lower-3"],
  [1, "lower-4"],
])}
${gradient("rear", 'x1="253" y1="110" x2="280" y2="268"', [
  [0, "rear-1"],
  [0.28, "rear-2"],
  [0.75, "rear-3"],
  [1, "rear-4"],
])}
${gradient("orbit", 'x1="7" y1="220" x2="249" y2="72"', [
  [0, "orbit-1"],
  [0.45, "orbit-2"],
  [1, "orbit-3"],
])}
<radialGradient id="sphere" cx=".3" cy=".25" r=".8"><stop stop-color="var(--logo-sphere-1)"/><stop offset=".52" stop-color="var(--logo-sphere-2)"/><stop offset="1" stop-color="var(--logo-sphere-3)"/></radialGradient></defs>
<path d="${s.topBand}" fill="url(#metal)"/><path d="${s.topLime}" fill="url(#blue)"/><path d="${s.lowerBand}" fill="url(#lower)"/><path d="${s.rearFace}" fill="url(#rear)"/><path d="${s.swoosh}" fill="url(#orbit)"/><path d="${s.swooshHighlight}" fill="var(--logo-highlight)" opacity=".35"/><circle cx="${s.sphere.cx}" cy="${s.sphere.cy}" r="${s.sphere.r}" fill="url(#sphere)"/></svg>`;
// Keep the old URL valid for existing bookmarks; pages use the new URL to refresh caches.
for (const name of ["tervyx-navy.svg", "favicon-vector.svg"])
  writeFileSync(
    new URL(`../Frontend/public/brand/${name}`, import.meta.url),
    svg,
  );
const path = new URL(
  "../Frontend/public/brand/site.webmanifest",
  import.meta.url,
);
const manifest = JSON.parse(readFileSync(path, "utf8"));
manifest.icons = [
  {
    src: "/brand/tervyx-navy.svg",
    sizes: "any",
    type: "image/svg+xml",
    purpose: "any",
  },
];
writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n");
console.log("Built theme-aware navy favicon from the shared vector logo.");

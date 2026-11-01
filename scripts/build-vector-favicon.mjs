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
const palette = Object.entries(brand.lightSymbolPalette)
  .map(([key, value]) => `${key}:${value}`)
  .join(";");
const darkPalette = Object.entries(brand.darkSymbolPalette)
  .map(([key, value]) => `${key}:${value}`)
  .join(";");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 320 300"><style>:root{${palette}}@media(prefers-color-scheme:dark){:root{${darkPalette}}}</style><defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--logo-metal-1)"/><stop offset="1" stop-color="var(--logo-metal-3)"/></linearGradient><linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop stop-color="var(--logo-green-1)"/><stop offset=".55" stop-color="var(--logo-green-2)"/><stop offset="1" stop-color="var(--logo-green-3)"/></linearGradient></defs><path d="${s.topBand}" fill="url(#m)"/><path d="${s.topLime}" fill="url(#l)"/><path d="${s.lowerBand}" fill="url(#l)"/><path d="${s.rearFace}" fill="url(#m)"/><path d="${s.swoosh}" fill="url(#l)"/><circle cx="${s.sphere.cx}" cy="${s.sphere.cy}" r="${s.sphere.r}" fill="var(--logo-green-2)"/></svg>`;
writeFileSync(
  new URL("../Frontend/public/brand/favicon-vector.svg", import.meta.url),
  svg,
);
const path = new URL(
  "../Frontend/public/brand/site.webmanifest",
  import.meta.url,
);
const manifest = JSON.parse(readFileSync(path, "utf8"));
manifest.icons = [
  {
    src: "/brand/favicon-vector.svg",
    sizes: "any",
    type: "image/svg+xml",
    purpose: "any",
  },
];
writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n");
console.log("Built native SVG favicon without embedded images.");

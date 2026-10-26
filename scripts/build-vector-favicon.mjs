import { readFileSync, writeFileSync } from "node:fs";
const s = JSON.parse(
  readFileSync(
    new URL("../Frontend/data/brand-symbol.json", import.meta.url),
    "utf8",
  ),
);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 320 300"><defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#87947d"/><stop offset="1" stop-color="#26382b"/></linearGradient><linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e5ffa6"/><stop offset=".55" stop-color="#c8fa73"/><stop offset="1" stop-color="#86b84a"/></linearGradient></defs><path d="${s.topBand}" fill="url(#m)"/><path d="${s.topLime}" fill="url(#l)"/><path d="${s.lowerBand}" fill="url(#l)"/><path d="${s.rearFace}" fill="url(#m)"/><path d="${s.swoosh}" fill="url(#l)"/><circle cx="${s.sphere.cx}" cy="${s.sphere.cy}" r="${s.sphere.r}" fill="#c8fa73"/></svg>`;
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

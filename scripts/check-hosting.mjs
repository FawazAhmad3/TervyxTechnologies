// Configuration contract checks, not a simulation of Netlify's complete CDN.
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
const config = await readFile(
  new URL("../netlify.toml", import.meta.url),
  "utf8",
);
const redirectBlocks = [
  ...config.matchAll(/\[\[redirects\]\]([\s\S]*?)(?=\n\[|$)/g),
].map((match) => match[1]);
const value = (block, key) =>
  block.match(new RegExp(`^\\s*${key}\\s*=\\s*"([^"]+)"`, "m"))?.[1];
const redirects = redirectBlocks.map((block) => ({
  from: value(block, "from"),
  to: value(block, "to"),
  status: Number(block.match(/^\s*status\s*=\s*(\d+)/m)?.[1]),
  force: /^\s*force\s*=\s*true/m.test(block),
}));
const routes = [
  "about",
  "services",
  "process",
  "contact",
  "web-development",
  "app-development",
  "digital-marketing",
  "seo-services",
  "social-media-marketing",
  "ui-ux-design",
];
let tested = 0;
for (const route of routes) {
  const rule = redirects.find((rule) => rule.from === `/${route}.html`);
  assert.ok(rule, `${route}: missing legacy redirect`);
  assert.equal(
    rule.to,
    `/${route}`,
    `${route}: redirect must go directly to preferred URL`,
  );
  assert.equal(rule.status, 301);
  assert.ok(rule.force);
  assert.notEqual(rule.from, rule.to);
  assert.ok(
    !redirects.some((next) => next.from === rule.to),
    `${route}: redirect chain`,
  );
  await stat(new URL(`../dist/${route}.html`, import.meta.url));
  // Rules have no query conditions/replacements: Netlify passes the incoming query through.
  const target = new URL(rule.to, "https://www.tervyx.tech");
  target.search = "?utm_source=legacy&service=web-development";
  assert.equal(target.pathname, `/${route}`);
  assert.equal(target.searchParams.get("service"), "web-development");
  tested++;
}
const api = redirects.find((rule) => rule.from === "/api/quotation");
assert.deepEqual(api, {
  from: "/api/quotation",
  to: "/.netlify/functions/quotation",
  status: 200,
  force: true,
});
assert.ok(
  !redirects.some((rule) => rule.from === "/*"),
  "Catch-all may hide true 404s",
);
assert.ok(
  !redirectBlocks.some((block) =>
    /^\s*(query|\[redirects\.query\])/m.test(block),
  ),
  "Recheck query pass-through assumptions",
);
assert.match(
  config,
  /\[\[headers\]\]\s+for = "\/brand\/site\.webmanifest"\s+\[headers.values\]\s+Content-Type = "application\/manifest\+json"/,
);
const manifest = JSON.parse(
  await readFile(
    new URL("../dist/brand/site.webmanifest", import.meta.url),
    "utf8",
  ),
);
assert.equal(manifest.name, "TERVYX Technologies");
for (const icon of manifest.icons)
  await stat(new URL(`../dist${icon.src}`, import.meta.url));
console.log(
  `Passed hosting configuration contracts: ${tested} direct legacy aliases, query pass-through configuration, manifest header and API rewrite. Netlify edge behavior still requires an approved deployment.`,
);

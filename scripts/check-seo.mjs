import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { parse } from "parse5";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const config = JSON.parse(
  await readFile(resolve(root, "Frontend/data/seo.json"), "utf8"),
);
const pages = Object.entries(config.pages);
const preview = process.env.CONTEXT && process.env.CONTEXT !== "production";
const attr = (node, key) => node.attrs?.find((a) => a.name === key)?.value;
const text = (node) =>
  node.nodeName === "#text"
    ? node.value
    : (node.childNodes ?? []).map(text).join("");
function nodes(tree, predicate) {
  const result = [];
  function walk(node, hidden = false) {
    hidden = hidden || attr(node, "aria-hidden") === "true";
    if (predicate(node, hidden)) result.push(node);
    for (const child of node.childNodes ?? []) walk(child, hidden);
  }
  walk(tree);
  return result;
}
const documents = new Map();
for (const [name, page] of pages)
  documents.set(
    page.path,
    parse(await readFile(resolve(dist, name + ".html"), "utf8")),
  );
// Language-switch destinations are also fully prerendered public documents.
for (const [name, page] of pages) {
  const path = "/it" + (page.path === "/" ? "" : page.path);
  documents.set(
    path,
    parse(await readFile(resolve(dist, "it", name + ".html"), "utf8")),
  );
}
const indexed = pages.filter(([, page]) => !page.noindex);
assert.equal(
  new Set(indexed.map(([, page]) => page.title)).size,
  indexed.length,
  "Duplicate indexable titles",
);
assert.equal(
  new Set(indexed.map(([, page]) => page.description)).size,
  indexed.length,
  "Duplicate indexable descriptions",
);
let checkedLinks = 0,
  checkedAssets = 0;
for (const [name, page] of pages) {
  const document = documents.get(page.path),
    all = nodes(document, () => true);
  const metas = new Map(
    all
      .filter((n) => n.tagName === "meta")
      .map((n) => [attr(n, "name") ?? attr(n, "property"), attr(n, "content")]),
  );
  assert.equal(
    text(all.find((n) => n.tagName === "title")),
    page.title,
    `${name}: title`,
  );
  assert.equal(
    metas.get("description"),
    page.description,
    `${name}: description`,
  );
  assert.ok(
    page.description.length >= 90 && page.description.length <= 175,
    `${name}: description length`,
  );
  assert.equal(
    metas.get("robots"),
    page.noindex || preview
      ? "noindex, follow"
      : "index, follow, max-image-preview:large",
    `${name}: robots`,
  );
  const canonical = all.filter(
    (n) => n.tagName === "link" && attr(n, "rel") === "canonical",
  );
  if (name === "404") assert.equal(canonical.length, 0);
  else {
    assert.equal(canonical.length, 1);
    assert.equal(
      attr(canonical[0], "href"),
      config.origin + (page.canonical ?? page.path),
    );
  }
  const main = all.find((n) => n.tagName === "main");
  assert.ok(main, `${name}: prerendered main`);
  const headings = nodes(
    main,
    (n, hidden) => !hidden && /^h[1-6]$/.test(n.tagName ?? ""),
  );
  assert.equal(
    headings.filter((n) => n.tagName === "h1").length,
    1,
    `${name}: one H1`,
  );
  let previous = 0;
  for (const h of headings) {
    const level = Number(h.tagName[1]);
    assert.ok(
      level <= previous + 1,
      `${name}: skipped heading level ${previous} -> ${level}`,
    );
    assert.ok(text(h).trim(), `${name}: empty heading`);
    previous = level;
  }
  assert.ok(
    text(main).trim().length > (name === "404" ? 30 : 80),
    `${name}: content missing without JavaScript`,
  );
  const ids = all.map((n) => attr(n, "id")).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, `${name}: duplicate IDs`);
  const scripts = all.filter(
    (n) => n.tagName === "script" && attr(n, "type") === "application/ld+json",
  );
  assert.equal(scripts.length, page.noindex ? 0 : 1, `${name}: schema count`);
  if (scripts.length) {
    const graph = JSON.parse(text(scripts[0]));
    assert.equal(graph["@context"], "https://schema.org");
    const entities = graph["@graph"];
    const entityIds = entities.map((entity) => entity["@id"]);
    assert.equal(
      new Set(entityIds).size,
      entityIds.length,
      `${name}: duplicate schema IDs`,
    );
    const organizationId = config.origin + "/#organization";
    const website = entities.find((entity) => entity["@type"] === "WebSite");
    const webpage = entities.find(
      (entity) => entity["@id"] === config.origin + page.path + "#webpage",
    );
    assert.equal(website.inLanguage, "en");
    assert.equal(website.publisher["@id"], organizationId);
    assert.equal(webpage.inLanguage, "en");
    assert.equal(webpage.publisher["@id"], organizationId);
    assert.equal(webpage.isPartOf["@id"], website["@id"]);
    if (page.path !== "/") {
      assert.equal(
        webpage.breadcrumb["@id"],
        config.origin + page.path + "#breadcrumbs",
      );
      assert.ok(entityIds.includes(webpage.breadcrumb["@id"]));
    }
    if (page.service) {
      assert.equal(
        webpage.mainEntity["@id"],
        config.origin + page.path + "#service",
      );
      assert.ok(entityIds.includes(webpage.mainEntity["@id"]));
    }
    assert.ok(graph["@graph"].some((n) => n["@type"] === "Organization"));
    if (page.service)
      assert.ok(
        graph["@graph"].some(
          (n) => n["@type"] === "Service" && n.name === page.service,
        ),
      );
    for (const forbidden of [
      '"aggregateRating"',
      '"review"',
      '"address"',
      '"price"',
    ])
      assert.ok(
        !JSON.stringify(graph).includes(forbidden),
        `${name}: unsupported schema claim`,
      );
  }
  for (const image of all.filter((n) => n.tagName === "img")) {
    assert.notEqual(attr(image, "alt"), undefined, `${name}: missing alt`);
    assert.ok(
      Number(attr(image, "width")) > 0 && Number(attr(image, "height")) > 0,
      `${name}: image dimensions`,
    );
  }
  for (const link of all.filter((n) => n.tagName === "a" && attr(n, "href"))) {
    const href = attr(link, "href");
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const url = new URL(href, config.origin + page.path);
    const path = url.pathname.replace(/\/$/, "") || "/";
    assert.ok(
      documents.has(path) || path.startsWith("/api/"),
      `${name}: broken internal route ${href}`,
    );
    if (url.hash && documents.has(path)) {
      const id = decodeURIComponent(url.hash.slice(1));
      assert.ok(
        nodes(documents.get(path), (n) => attr(n, "id") === id).length,
        `${name}: missing anchor ${href}`,
      );
    }
    assert.ok(
      !url.pathname.endsWith(".html"),
      `${name}: legacy internal link ${href}`,
    );
    checkedLinks++;
  }
  for (const node of all) {
    const asset =
      node.tagName === "script"
        ? attr(node, "src")
        : node.tagName === "img"
          ? attr(node, "src")
          : node.tagName === "link"
            ? attr(node, "href")
            : null;
    if (!asset?.startsWith("/")) continue;
    await stat(resolve(dist, asset.slice(1).split("?")[0]));
    checkedAssets++;
  }
  assert.equal(metas.get("og:title"), page.title);
  assert.equal(metas.get("twitter:card"), "summary_large_image");
  await stat(resolve(dist, config.socialImage.slice(1)));
}
// Important destinations must be discoverable without selecting a JavaScript tab.
for (const source of ["/", "/services"]) {
  assert.ok(
    nodes(
      documents.get(source),
      (node) =>
        node.tagName === "a" && attr(node, "href") === "/digital-marketing",
    ).length,
    `${source}: missing permanent Digital Marketing link`,
  );
}
const homeText = text(documents.get("/"));
assert.ok(
  !homeText.includes("does not send an enquiry automatically"),
  "Outdated enquiry FAQ",
);
assert.ok(
  homeText.includes("Send quote request"),
  "FAQ must explain quote submission",
);
const processText = text(documents.get("/process"));
assert.ok(
  processText.includes("acceptance checks") && processText.includes("handover"),
  "Detailed process information missing",
);
const sitemap = await readFile(resolve(dist, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);
assert.deepEqual(locations, [
  ...indexed.map(([, page]) => config.origin + page.path),
  ...indexed.map(
    ([, page]) => config.origin + "/it" + (page.path === "/" ? "/" : page.path),
  ),
]);
assert.ok(
  !locations.some(
    (u) => u.includes("pricing") || u.includes(".html") || u.includes("404"),
  ),
);
const robots = await readFile(resolve(dist, "robots.txt"), "utf8");
assert.match(robots, /User-agent: \*/);
if (preview) assert.match(robots, /Disallow: \/\n/);
else {
  assert.match(robots, /Allow: \/\n/);
  assert.match(
    robots,
    new RegExp(`Sitemap: ${config.origin.replaceAll(".", "\\.")}/sitemap.xml`),
  );
  assert.doesNotMatch(robots, /Disallow: \/(?:assets|fonts)/);
}
const redirectConfig = await readFile(resolve(root, "netlify.toml"), "utf8");
assert.match(
  redirectConfig,
  /from = "\/pricing"\s+to = "\/contact"\s+status = 301/,
);
assert.ok(
  !redirectConfig.includes('from = "/*"'),
  "Catch-all redirect may hide true 404s",
);
const assets = await readdir(resolve(dist, "assets"));
let scriptGzip = 0,
  cssGzip = 0;
for (const file of assets) {
  const content = await readFile(resolve(dist, "assets", file));
  if (file.endsWith(".js")) {
    scriptGzip += gzipSync(content).length;
    assert.ok(
      !content.includes(Buffer.from("appPassword")),
      "Private email configuration reached client bundle",
    );
  }
  if (file.endsWith(".css")) cssGzip += gzipSync(content).length;
}
assert.ok(scriptGzip < 110000, "JS transfer budget exceeded (110KB gzip)");
let fonts = 0;
for (const file of ["dm-sans-latin.woff2", "space-grotesk-latin.woff2"])
  fonts += (await stat(resolve(dist, "fonts", file))).size;
assert.ok(fonts < 100000, "Font budget exceeded (100KB)");
console.log(
  JSON.stringify(
    {
      pages: pages.length,
      indexablePages: indexed.length,
      checkedLinks,
      checkedAssets,
      scriptGzipBytes: scriptGzip,
      cssGzipBytes: cssGzip,
      fontBytes: fonts,
      previewNoindex: !!preview,
      result: "passed",
    },
    null,
    2,
  ),
);

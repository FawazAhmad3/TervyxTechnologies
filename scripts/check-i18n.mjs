import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { parse } from "parse5";
const root = resolve(import.meta.dirname, "..");
const load = (file) => readFile(resolve(root, file), "utf8");
const seo = JSON.parse(await load("Frontend/data/seo.json"));
const dictionary = JSON.parse(await load("Frontend/data/it/translations.json"));
const attr = (n, key) => n.attrs?.find((a) => a.name === key)?.value;
function nodes(n, test) {
  return [
    ...(test(n) ? [n] : []),
    ...(n.childNodes ?? []).flatMap((c) => nodes(c, test)),
  ];
}
const text = (n) =>
  n.nodeName === "#text" ? n.value : (n.childNodes ?? []).map(text).join("");
const translate = (s) => dictionary[s] ?? s;
const itPath = (path) => "/it" + (path === "/" ? "/" : path);
const preview = process.env.CONTEXT && process.env.CONTEXT !== "production";
let links = 0;
for (const [name, page] of Object.entries(seo.pages)) {
  const file = `dist/it/${name}.html`;
  const html = await load(file),
    tree = parse(html),
    all = nodes(tree, () => true);
  const english = parse(await load(`dist/${name}.html`));
  assert.equal(
    attr(
      all.find((n) => n.tagName === "html"),
      "lang",
    ),
    "it",
  );
  assert.equal(
    text(all.find((n) => n.tagName === "title")),
    translate(page.title),
  );
  assert.notEqual(
    translate(page.title),
    page.title,
    `${name}: untranslated title`,
  );
  const metas = all.filter((n) => n.tagName === "meta");
  for (const key of [
    "description",
    "robots",
    "og:title",
    "og:description",
    "og:url",
    "og:locale",
  ]) {
    const found = metas.filter(
      (n) => (attr(n, "name") ?? attr(n, "property")) === key,
    );
    if (key === "og:url" && name === "404") {
      assert.equal(found.length, 0);
      continue;
    }
    assert.equal(found.length, 1, `${name}: unique ${key}`);
    if (key === "description")
      assert.equal(attr(found[0], "content"), translate(page.description));
    if (key === "og:locale") assert.equal(attr(found[0], "content"), "it_IT");
    if (key === "robots")
      assert.equal(
        attr(found[0], "content").startsWith("noindex"),
        !!page.noindex || !!preview,
      );
  }
  const canonical = all.filter(
    (n) => n.tagName === "link" && attr(n, "rel") === "canonical",
  );
  assert.equal(canonical.length, name === "404" ? 0 : 1);
  if (canonical.length)
    assert.equal(
      attr(canonical[0], "href"),
      seo.origin + itPath(page.canonical ?? page.path),
    );
  const main = all.find((n) => n.tagName === "main");
  assert.equal(nodes(main, (n) => n.tagName === "h1").length, 1);
  assert.equal(
    nodes(main, (n) => /^h[1-6]$/.test(n.tagName)).length,
    nodes(english, (n) => n.tagName === "main").flatMap((n) =>
      nodes(n, (c) => /^h[1-6]$/.test(c.tagName)),
    ).length,
    `${name}: heading structure preserved`,
  );
  for (const link of all.filter((n) => n.tagName === "a")) {
    const href = attr(link, "href");
    if (!href?.startsWith("/")) continue;
    const url = new URL(href, seo.origin);
    const path = url.pathname.replace(/\/$/, "") || "/";
    // The language selector intentionally returns to the equivalent English page.
    if (attr(link, "class")?.includes("language-switch")) {
      assert.equal(path, page.path === "/" ? "/" : page.path);
      assert.equal(attr(link, "hreflang"), "en");
    } else assert.ok(path.startsWith("/it"), `${name}: language leak ${href}`);
    const plain = path.replace(/^\/it(?=\/|$)/, "") || "/";
    assert.ok(
      Object.values(seo.pages).some((p) => p.path === plain),
      `${name}: broken ${href}`,
    );
    links++;
  }
  if (!page.noindex) {
    const alternate = all.filter(
      (n) => n.tagName === "link" && attr(n, "rel") === "alternate",
    );
    for (const lang of ["en", "it", "x-default"]) {
      const tag = alternate.filter((n) => attr(n, "hreflang") === lang);
      assert.equal(tag.length, 1);
      assert.equal(
        attr(tag[0], "href"),
        seo.origin + (lang === "it" ? itPath(page.path) : page.path),
      );
    }
    const schema = JSON.parse(
      text(
        all.find(
          (n) =>
            n.tagName === "script" && attr(n, "data-seo-schema") !== undefined,
        ),
      ),
    );
    const webpage = schema["@graph"].find((n) =>
      ["WebPage", "AboutPage", "ContactPage"].includes(n["@type"]),
    );
    assert.equal(webpage.inLanguage, "it");
    assert.equal(webpage.url, seo.origin + itPath(page.path));
    for (const entity of schema["@graph"].filter(
      (n) => n["@type"] === "BreadcrumbList",
    ))
      for (const item of entity.itemListElement)
        assert.ok(item.item.startsWith(seo.origin + "/it"));
  }
  if (["contact", "pricing"].includes(name)) {
    assert.ok(text(main).includes("Invia richiesta di preventivo"));
    const choices = all.filter(
      (n) => n.tagName === "input" && attr(n, "name") === "service",
    );
    assert.deepEqual(
      choices.map((n) => attr(n, "value")),
      [
        "web-development",
        "app-development",
        "digital-marketing",
        "ui-ux-design",
      ],
    );
  }
}
// Coverage: every editorial string in active content JSON needs a translation.
const unchanged = new Set([
  "TERVYX",
  "Technologies",
  "TERVYX Technologies",
  "TERVYX Technologies.",
  "Technologies.",
  "Code the Future",
  "CODE THE FUTURE.",
  "UI / UX",
  "SEO",
  "FIGMA",
  "Alex Morgan",
  "alex@company.com",
  "info@tervyx.tech",
]);
const skip = new Set([
  "href",
  "src",
  "srcSet",
  "sizes",
  "slug",
  "id",
  "kind",
  "icon",
  "contactHref",
  "embedUrl",
  "linkUrl",
  "downloadName",
  "storageKey",
  "lightColor",
  "themeColor",
  "home",
]);
function coverage(value, key = "") {
  if (skip.has(key)) return;
  if (Array.isArray(value)) return value.forEach((item) => coverage(item, key));
  if (value && typeof value === "object")
    return Object.entries(value).forEach(([k, item]) => coverage(item, k));
  if (
    typeof value === "string" &&
    /[a-zA-Z]/.test(value) &&
    !unchanged.has(value) &&
    !value.startsWith("/")
  )
    assert.ok(Object.hasOwn(dictionary, value), `Missing Italian: ${value}`);
}
for (const name of [
  "site",
  "home",
  "about",
  "services",
  "marketing-services",
  "process",
  "contact",
  "quote",
])
  coverage(JSON.parse(await load(`Frontend/data/${name}.json`)));
console.log(
  `Italian checks passed: 13 prerendered routes, ${links} links, metadata, canonicals, hreflang, schema, form identifiers and translation coverage.`,
);

const hosting = await load("netlify.toml");
assert.ok(!hosting.includes(":page.html"), "Netlify placeholders must occupy complete path segments");
for (const [name, page] of Object.entries(seo.pages)) {
  if (page.noindex || name === "index") continue;
  assert.ok(hosting.includes(`from = "/it/${name}.html"\n  to = "/it/${name}"`), `Missing Italian HTML alias: ${name}`);
}

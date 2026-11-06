import test from "node:test";
import assert from "node:assert/strict";
import { basePath, localeFromPath, localizedHref } from "./locale";
import { localize } from "./localize";
import { pageForPath, canonicalFor, structuredData } from "../seo/config";
import services from "../data/services.json";

test("language prefixes do not match unrelated page names", () => {
  assert.equal(localeFromPath("/it/contact"), "it");
  assert.equal(localeFromPath("/it/"), "it");
  assert.equal(localeFromPath("/items"), "en");
  assert.equal(basePath("/items"), "/items");
});
test("equivalent links preserve service queries and anchors without double prefixes", () => {
  assert.equal(
    localizedHref("/contact?service=ui-ux-design#contact", "it"),
    "/it/contact?service=ui-ux-design#contact",
  );
  assert.equal(localizedHref("/it/contact", "it"), "/it/contact");
  assert.equal(localizedHref("/it/contact", "en"), "/contact");
  assert.equal(localizedHref("/", "it"), "/it/");
  assert.equal(localizedHref("/it/", "en"), "/");
});
test("localization leaves assets, APIs and external destinations intact", () => {
  for (const path of [
    "/api/quotation",
    "/brand/tervyx-navy.svg",
    "/fonts/font.woff2",
    "/assets/main.js",
    "https://example.com/",
    "mailto:info@tervyx.tech",
    "#top",
    "//example.com/",
  ])
    assert.equal(localizedHref(path, "it"), path);
});
test("Italian content translates copy without mutating service identifiers or English data", () => {
  const copy = localize(services, "it");
  assert.equal(copy.items[0].title, "Sviluppo web");
  assert.equal(copy.items[0].slug, "web-development");
  assert.equal(
    copy.items[0].contactHref,
    "/it/contact?service=web-development",
  );
  assert.equal(services.items[0].title, "Web Development");
  assert.equal(localize(services, "en"), services);
});
test("Italian canonical URLs and schema use the same localized public route", () => {
  const page = pageForPath("/it/web-development/");
  assert.equal(
    canonicalFor(page),
    "https://www.tervyx.tech/it/web-development",
  );
  assert.equal(
    page.title,
    "Servizi di sviluppo siti web | TERVYX Technologies",
  );
  const schema = structuredData(page)!;
  const webpage = schema["@graph"].find(
    (item: any) => item["@type"] === "WebPage",
  ) as any;
  assert.equal(webpage.inLanguage, "it");
  assert.equal(webpage.url, canonicalFor(page));
  assert.equal(canonicalFor(pageForPath("/it/not-a-page")), null);
});

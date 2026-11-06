import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { build } from "vite";
import react from "@vitejs/plugin-react";
const root = fileURLToPath(new URL("../", import.meta.url));
const temporary = resolve(root, ".seo-prerender");
await build({
  root: resolve(root, "Frontend"),
  configFile: false,
  plugins: [react()],
  logLevel: "warn",
  build: {
    ssr: resolve(root, "Frontend/entry-server.tsx"),
    outDir: temporary,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
  },
});
try {
  const {
    renderPage,
    seoConfig,
    seoPages,
    pageForPath,
    canonicalFor,
    metadataTags,
    structuredData,
  } = await import(pathToFileURL(resolve(temporary, "entry-server.mjs")).href);
  const templates = {};
  const escape = (text) =>
    text.replace(
      /[&<>"\']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "\'": "&#39;",
        })[char],
    );
  const alternates = (page) =>
    page.noindex
      ? ""
      : `<link rel="alternate" hreflang="en" href="${seoConfig.origin}${page.path}"><link rel="alternate" hreflang="it" href="${seoConfig.origin}/it${page.path === "/" ? "/" : page.path}"><link rel="alternate" hreflang="x-default" href="${seoConfig.origin}${page.path}">`;
  for (const [name, page] of Object.entries(seoPages)) {
    const file = resolve(root, "dist", name + ".html");
    const html = await readFile(file, "utf8");
    templates[name] = html;
    const markup = renderPage(page.path);
    if (!markup.includes("<h1"))
      throw new Error(`Missing prerendered heading for ${name}`);
    await writeFile(
      file,
      html
        .replace("</head>", alternates(page) + "</head>")
        .replace(
          '<div id="root"></div>',
          () => `<div id="root">${markup}</div>`,
        ),
    );
  }
  const preview = process.env.CONTEXT && process.env.CONTEXT !== "production";
  for (const [name, english] of Object.entries(seoPages)) {
    const path = "/it" + (english.path === "/" ? "/" : english.path);
    const page = pageForPath(path);
    const metadata = metadataTags(page);
    if (preview) metadata.robots = "noindex, follow";
    const canonical = canonicalFor(page),
      graph = structuredData(page);
    let html = templates[name]
      .replace('<html lang="en"', '<html lang="it"')
      .replace(
        /<title>[\s\S]*?<\/title>/,
        `<title>${escape(page.title)}</title>`,
      )
      .replace(/<meta\b[^>]*>/gi, (tag) =>
        /(?:name|property)=["'](?:description|robots|og:[^"']+|twitter:[^"']+|google-site-verification)["']/.test(
          tag,
        )
          ? ""
          : tag,
      )
      .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, "")
      .replace(/<script[^>]*data-seo-schema[^>]*>[\s\S]*?<\/script>/gi, "");
    const head =
      Object.entries(metadata)
        .map(
          ([key, content]) =>
            `<meta ${key.startsWith("og:") ? "property" : "name"}="${key}" content="${escape(content)}">`,
        )
        .join("") +
      (canonical ? `<link rel="canonical" href="${canonical}">` : "") +
      alternates(english) +
      (graph
        ? `<script type="application/ld+json" data-seo-schema>${JSON.stringify(graph).replace(/</g, "\\u003c")}</script>`
        : "");
    html = html
      .replace("</head>", head + "</head>")
      .replace(
        '<div id="root"></div>',
        () => `<div id="root">${renderPage(path)}</div>`,
      );
    const folder = resolve(root, "dist/it");
    await mkdir(folder, { recursive: true });
    await writeFile(resolve(folder, name + ".html"), html);
  }
  const indexed = Object.values(seoPages).filter((page) => !page.noindex);
  const allIndexed = [
    ...indexed,
    ...indexed.map((page) =>
      pageForPath("/it" + (page.path === "/" ? "/" : page.path)),
    ),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allIndexed.map((page) => `  <url><loc>${seoConfig.origin}${page.path}</loc></url>`).join("\n")}\n</urlset>\n`;
  const robots = preview
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /.netlify/functions/\n\nSitemap: ${seoConfig.origin}/sitemap.xml\n`;
  await writeFile(resolve(root, "dist/sitemap.xml"), sitemap);
  await writeFile(resolve(root, "dist/robots.txt"), robots);
  console.log(
    `Prerendered ${Object.keys(seoPages).length * 2} pages; generated sitemap with ${allIndexed.length} canonical URLs.`,
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}

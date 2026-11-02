import { readFile, writeFile, rm } from "node:fs/promises";
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
  const { renderPage, seoConfig, seoPages } = await import(
    pathToFileURL(resolve(temporary, "entry-server.mjs")).href
  );
  for (const [name, page] of Object.entries(seoPages)) {
    const file = resolve(root, "dist", name + ".html");
    const html = await readFile(file, "utf8");
    const markup = renderPage(page.path);
    if (!markup.includes("<h1"))
      throw new Error(`Missing prerendered heading for ${name}`);
    await writeFile(
      file,
      html.replace(
        '<div id="root"></div>',
        () => `<div id="root">${markup}</div>`,
      ),
    );
  }
  const indexed = Object.values(seoPages).filter((page) => !page.noindex);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed.map((page) => `  <url><loc>${seoConfig.origin}${page.path}</loc></url>`).join("\n")}\n</urlset>\n`;
  const preview = process.env.CONTEXT && process.env.CONTEXT !== "production";
  const robots = preview
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /.netlify/functions/\n\nSitemap: ${seoConfig.origin}/sitemap.xml\n`;
  await writeFile(resolve(root, "dist/sitemap.xml"), sitemap);
  await writeFile(resolve(root, "dist/robots.txt"), robots);
  console.log(
    `Prerendered ${Object.keys(seoPages).length} pages; generated sitemap with ${indexed.length} canonical URLs.`,
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}

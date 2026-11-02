import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve, basename } from "node:path";
import site from "./data/site.json";
import {
  canonicalFor,
  metadataTags,
  seoPages,
  structuredData,
} from "./seo/config";
const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "tervyx-page-metadata",
      transformIndexHtml(html, context) {
        const page =
          seoPages[basename(context.filename, ".html")] ?? seoPages["404"];
        const metadata = metadataTags(page);
        if (process.env.CONTEXT && process.env.CONTEXT !== "production")
          metadata.robots = "noindex, follow";
        const canonical = canonicalFor(page),
          graph = structuredData(page);
        const tags = Object.entries(metadata)
          .filter(([key]) => key !== "description")
          .map(([key, content]) => ({
            tag: "meta",
            attrs: {
              [key.startsWith("og:") ? "property" : "name"]: key,
              content,
            },
            injectTo: "head" as const,
          }));
        const extra =
          (canonical
            ? `<link rel="canonical" href="${escapeHtml(canonical)}">`
            : "") +
          (graph
            ? `<script type="application/ld+json" data-seo-schema>${JSON.stringify(graph).replace(/</g, "\\u003c")}</script>`
            : "");
        return {
          html: html
            .replace(
              /<title>.*?<\/title>/,
              `<title>${escapeHtml(page.title)}</title>`,
            )
            .replace(
              /(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/,
              `$1${escapeHtml(page.description)}$2`,
            )
            .replace(
              /(<meta\s+name="theme-color"\s+content=")[^"]*("\s*\/?>)/,
              `$1${site.metadata.themeColor}$2`,
            )
            .replace("</head>", extra + "</head>"),
          tags,
        };
      },
    },
  ],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        Object.keys(seoPages).map((page) => [
          page,
          resolve(import.meta.dirname, `${page}.html`),
        ]),
      ),
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/scheduler")
          )
            return "react-vendor";
        },
      },
    },
  },
  server: {
    proxy: { "/api": { target: "http://127.0.0.1:4000", changeOrigin: false } },
  },
});

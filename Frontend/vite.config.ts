import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve, basename } from "node:path";
import site from "./data/site.json";
import home from "./data/home.json";
import about from "./data/about.json";
import services from "./data/services.json";
import processPage from "./data/process.json";
import pricing from "./data/pricing.json";
import contact from "./data/contact.json";
const titles: Record<string, string> = {
  index: home.title,
  about: about.title,
  services: services.title,
  process: processPage.title,
  contact: contact.title,
  pricing: pricing.page.title,
  ...Object.fromEntries(
    services.items.map((service) => [service.slug, service.title]),
  ),
};
const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
const pages = [
  "index",
  "about",
  "services",
  "process",
  "contact",
  "pricing",
  "web-development",
  "app-development",
  "digital-marketing",
];
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "tervyx-json-metadata",
      transformIndexHtml(html, context) {
        const title =
          titles[basename(context.filename, ".html")] ?? site.brand.tagline;
        return html
          .replace(
            /<title>.*?<\/title>/,
            `<title>${escapeHtml(title)} — ${escapeHtml(site.brand.fullName)}</title>`,
          )
          .replace(
            /(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/,
            `$1${escapeHtml(site.metadata.description)}$2`,
          )
          .replace(
            /(<meta\s+name="theme-color"\s+content=")[^"]*("\s*\/?>)/,
            `$1${site.metadata.themeColor}$2`,
          );
      },
    },
  ],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [
          page,
          resolve(import.meta.dirname, `${page}.html`),
        ]),
      ),
    },
  },
  server: { proxy: { "/api": "http://127.0.0.1:4000" } },
});

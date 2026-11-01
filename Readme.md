# TERVYX Technologies — Code the Future

A responsive, nine-page software house website built with React, TypeScript (TSX), Tailwind CSS, and Vite. Includes the original charcoal/lime design and the homepage ribbon animation linked to normal page scrolling.

## Folder structure

```text
Frontend/
  components/     One reusable block or component per TSX file
  pages/          One TSX file per page; composed from components
  data/           Editable JSON: site, home, about, services, process, contact
  styles/         Tailwind entry, theme tokens, decorative design CSS
  public/images/  Local images referenced by JSON
  App.tsx         Page selection for both .html and extensionless paths
  main.tsx        React entry
  *.html          Physical entrypoints for all nine pages
  vite.config.ts  Tailwind + React build and local API proxy
Backend/
  controllers/    Health and services handlers
  routes/         API routing and integration test
  data/           Reserved for future backend-owned data
  config.ts       Host and port settings
  server.ts       Small Node.js / TypeScript HTTP server
Readme.md
LICENSE
package.json      npm workspace commands
```

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm install
npm run dev
```

Frontend: http://127.0.0.1:4173

Start the optional API in a second terminal:

```sh
npm run dev:backend
```

Backend: http://127.0.0.1:4000. `GET /api/health` returns status; `GET /api/services` returns the services from the same JSON used by the frontend. Vite proxies `/api` requests locally. The frontend can run without the API.

## Edit the content

Edit `Frontend/data/*.json`. All website headings, paragraphs, button labels, navigation links, service information, and form copy live there. JSON must remain valid: double quotes and no trailing commas. Changes appear during development; run a new build and deploy to update a hosted site.

- `site.json`: branding, navigation, footer, shared call to action, metadata.
- `home.json`: hero, animated ribbon, service headings, introduction, project explorer, collaboration section, and FAQs.
- `about.json`: About intro, story, values.
- `services.json`: all three services, offerings, links, detail-page copy, and images.
- `process.json`: process intro, steps, statement.
- `contact.json`: contact intro, form labels, validation and download messages.
- `pricing.json`: website plans, monthly maintenance, pricing notes, paired Basic/Standard/Premium containers for website and Android plans, monthly SMM and SEO packages, and plan-selection labels.

To use a custom image, place it in `Frontend/public/images/`, then set its JSON `image.src` to `/images/your-file.webp` and update `image.alt`. Empty image sources use the existing code-based illustrations. Image URLs may also be HTTPS URLs.

Each page in `Frontend/pages/` contains only its own TSX entry and composes the blocks in `Frontend/components/`. To add a new reusable block, create a separate TSX file in `components/`. For a new page, add its TSX, register it in `App.tsx`, create an HTML entry, and add that entry to `vite.config.ts`.

## Build and check

```sh
npm run format
npm run typecheck
npm test
npm run build
npm run preview --workspace Frontend
```

The frontend builds into root `dist/`; the backend builds into `Backend/build/`. Run the compiled backend with `npm start --workspace Backend`. Set `PORT` and `HOST` in your environment to override defaults. `.env.example` documents the variables; this small server does not automatically load `.env` files.

## Deployment and current scope

The existing private Sites deployment hosts the compiled frontend from `dist/`, with the Site ID retained in `.openai/hosting.json`. The standalone backend supports local development. Netlify runs quotation delivery using the included serverless function, with SMTP credentials supplied as a backend environment secret. All nine physical HTML pages are built; existing `.html` links continue to work.

The contact form sends quotation notifications through `/api/quotation`. Netlify runs this endpoint as a serverless function; local development uses the standalone backend. Configure the private email settings before using delivery; see `Backend/config/Readme.md`. No enquiries are stored in a database.

Layouts adapt for small phones, tablets, laptops, and wide displays. Motion respects reduced-motion preferences. Keyboard navigation, labelled fields, visible focus states, and mobile navigation are included.

The root `LICENSE` reserves the project for TERVYX Technologies. Dependency licenses remain with their respective authors.

## Vector branding

All rendered logo placements use `BrandSymbol.tsx`, a shared native SVG with smooth, hand-authored Bézier paths in `Frontend/data/brand-symbol.json`. `BrandWordmark.tsx` renders TERVYX and Technologies as live Space Grotesk text, with DM Sans for the tagline, matching the website fonts. No cropped logo wordmarks, embedded raster images, pixel masks, or automatic contour traces are used in the header, hero, footer, or favicon.

The supplied brand board is retained only in `design-references/brand-board.png` for design reference and is not served by the website. Branding copy remains in `Frontend/data/site.json`; brand palette and font documentation are in `Frontend/data/brand.json`.

The homepage and footer animate the same shared vector symbol. The light theme has a naturally transparent logo background and theme-aware live text; dark mode retains the original lime/metallic palette, while light mode uses deeper botanical greens and charcoal-metal tones for contrast. The light-only palette is editable in `Frontend/data/brand.json` under `lightSymbolPalette`; the geometry is shared and unchanged. Charcoal `#101413`, deep charcoal `#151A18`, electric lime `#C8FA73`, and sage gray `#929C94` follow the brand direction.

The favicon at `Frontend/public/brand/tervyx-navy.svg` is also native SVG. Run `node scripts/build-vector-favicon.mjs` after editing the symbol geometry to update it.

## Themes and footer animation

Use the header’s sun/moon button to switch between dark and light mode. `ThemeProvider` applies the theme across all pages and stores explicit preferences under `tervyx-theme-preference`. Each HTML entry applies the saved preference before rendering to avoid a theme flash. The system color scheme is the default and follows system changes until a visitor explicitly selects a theme. Explicit choices are remembered under `tervyx-theme-preference`. This new key replaces the old auto-saved preference so first visits use the system theme. Storage failures are handled gracefully. Labels live in `Frontend/data/site.json`; light-mode semantic colors and surface overrides live in `Frontend/styles/tailwind.css`.

`FooterArtwork.tsx` composes the shared SVG symbol and live website-font wordmark separately. The symbol has a gentle idle float and scroll-linked rotation; the wordmark stays steady. Reduced-motion preferences disable the animation.

## Email configuration

Edit `Backend/config/email.json` for the sender email, email app password, receiving inbox, and SMTP settings. See `Backend/config/Readme.md`. The private JSON is ignored by Git; `email.example.json` is the blank template. The local backend reads this file; Netlify requires the same JSON in the secret `EMAIL_CONFIG_JSON` environment variable with Functions scope.

## Netlify deployment

The root `netlify.toml` sets the base directory to the repository root, runs `npm --workspace @tervyx/frontend run build`, and publishes `dist`. Vite deliberately outputs to root `dist`, not `Frontend/dist`. Node 22 is selected for Vite 7. Repository configuration overrides matching Netlify UI settings.

Connect the repository’s `main` branch and retry the deployment after pulling these settings. Netlify deploys the frontend and the quotation function. The standalone Node server is only needed for local development or separate Node hosting.

## Navy UI theme (UI branch)

The `UI` branch introduces navy `#1B3A6B` headings, borders, selected controls, and white-on-navy bars; white `#FFFFFF` page backgrounds; `#F2F4F8` highlighted panels; and `#555555` supporting text. A matching navy dark mode retains system-theme detection and manual overrides. The logo now uses navy and blue-gray gradients in both themes; its shape, typography, responsive layout, and animations remain intact.

`Frontend/styles/navy-theme.css` defines the semantic roles, including table headers, alternating rows, and total bars for future tables. The quotation email uses the same navy/white palette. Work on this branch must not be merged into `main` without the owner’s explicit instruction.

## Clean page URLs

Navigation uses extensionless URLs such as `/process`. Netlify Pretty URLs serves the matching HTML entrypoint and normalizes the URL. Explicit permanent redirects preserve old `.html` bookmarks and inbound links, including query parameters. Physical HTML entrypoints remain unchanged for the Vite multi-page build.

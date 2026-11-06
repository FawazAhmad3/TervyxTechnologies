# English and Italian website

The `italian` branch adds a complete Italian version without replacing the English pages. It is not approved for merge or deployment yet.

## Using the site

- Select **Italiano** in the main navigation to open the equivalent Italian page; select **English** to return. On mobile, open the navigation menu first.
- English routes stay at `/`, `/about`, `/services`, etc. Italian equivalents use `/it/`, `/it/about`, `/it/services`, etc.
- Internal links stay in the chosen language. The switch preserves the URL's service query and section anchor. Form text entered manually is not retained across a full-page language change.
- Both themes and the existing brand identity are retained. Company names, product names, technical terms and the registered brand tagline remain unchanged.
- The quote form uses translated labels, instructions and status messages. Its API payload retains the existing English service identifiers. No backend configuration or email credentials have changed.

## Editing translations

English content remains in `Frontend/data/*.json`. Italian translations are in `Frontend/data/it/translations.json`, keyed by the original English text. Update the translation key if the English source changes. `npm run test:i18n` checks coverage for active public content; it flags new copy without an Italian translation. Unused legacy fixed-price components are not part of either public version.

`Frontend/i18n/locale.ts` handles language routes; `localize.ts` translates the data without mutating the English source. Components read localized JSON through `useContent`.

## Build and SEO

`npm run build` generates 26 prerendered HTML files: 13 entries in each language, including noindex pricing and 404 entries. Each language has 11 indexable pages. Italian pages are real HTML files under `dist/it`, not client-only translated views.

The sitemap includes all 22 indexable URLs. Each indexable page has reciprocal English/Italian `hreflang` links, an English `x-default`, a self-referencing canonical and localized metadata. Italian pages use `lang="it"`, `og:locale="it_IT"` and localized structured data.

The Netlify configuration retains API handling and English redirects. It adds Italian HTML aliases, redirects retired Italian pricing URLs to the Italian contact page, and serves an Italian 404 for unknown Italian URLs. Netlify edge behavior should be checked after an explicitly approved deployment; local Vite preview does not simulate Netlify redirect rules.

## Verification

- `npm run build`
- `npm run typecheck`
- `npm test` (14 tests, mock email delivery only)
- `npm run test:seo`
- `npm run test:i18n`
- `npm run test:hosting`

Browser review covers all 11 Italian public routes at 1280, 393 and 320 pixels in both themes (66 checks), with no horizontal overflow. The English/Italian switch preserves the selected service query. No real quote email was sent during validation.

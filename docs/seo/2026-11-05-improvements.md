# SEO audit improvements — 5 November 2026

Implemented on local branch SEO, based on main c69c246. No push, merge, deployment, DNS, hosting-account or Search Console changes. No live forms submitted. No dependencies added.

## Results

| Finding | Status | Files changed | Verification |
| --- | --- | --- | --- |
| Outdated homepage FAQ | Fixed locally | home.json | Native FAQ expanded in browser; initial HTML mentions Send quote request and email alternative; regression assertion rejects old text. |
| Permanent Digital Marketing incoming links | Fixed locally | home.json, services.json, ServicePreview.tsx, navy-theme.css | Links on Home and Services are present in initial HTML; all ten indexable pages reachable, maximum two page-link clicks. Homepage tabs still switch among all three services. |
| Tiny About-page utility link | Fixed locally | home.json, navy-theme.css | Destination remains /about, wording ABOUT TERVYX; computed mobile font 12px and hit area 44px. |
| Shallow text-link hit areas | Fixed locally | navy-theme.css | Adjusted main text links and map link measure at least 44px high at 320px and 393px; no overflow. |
| Mobile form readability | Fixed locally; physical-iOS check pending | navy-theme.css | 16px mobile inputs/textarea, 44px single-line minimum height; 13px desktop styling preserved. Labels, validation, autocomplete and endpoint source unchanged. Browser focus and service selection work. |
| Descriptive About/Process H1s | Fixed locally | about.json, process.json | Rendered on desktop/mobile with existing heading styles and sections. |
| Company and service specificity | Safe copy improvements complete | about.json, services.json, marketing-services.json, ServiceDetails.tsx | Eight requested content pages reviewed. No invented staff/history/projects/results. Ownership, handover and publishing responsibilities are to be agreed, not unconditional promises. |
| Process repetition | Fixed locally | process.json, ProcessSteps.tsx, Home.tsx | Home retains its existing short summary; Process has separate detailed stages, review points and conditional handover responsibilities. Same four-card structure. |
| Generic service planning text | Fixed locally | services.json, marketing-services.json, ServiceDetails.tsx | Five services now have their own descriptions and planning headings. Existing cards, CTA and section components retained. |
| Milan office implication | Fixed locally | contact.json | Map retained; wording now Milan, Italy / City overview. No customer-facing office or street address asserted. Worldwide availability retained where verified. |
| Legacy redirect chains | Configuration corrected; live-edge verification pending approval | netlify.toml | All nine .html aliases point directly to slashless routes; local contract checks cover status, force, target existence and unchanged API rewrite. No query conditions/replacement configured. |
| Manifest MIME type | Configured; live-edge verification pending approval | netlify.toml | Header rule application/manifest+json; local Vite preview returns 200 with application/manifest+json. Vite does not prove Netlify CDN header handling. |
| Schema relationships | Fixed locally | seo/config.ts | JSON-LD syntax, unique entity IDs, en language, publisher, breadcrumb and mainEntity targets validated across all indexable pages. No new schema types or unsupported claims. |
| Duplicate favicon | Deliberately retained | None | build-vector-favicon.mjs explicitly preserves the older URL for bookmarks. External dependencies cannot be ruled out, so removal was not safe. |
| Inactive hero raster branch | Hardened; remains inactive | OrbitSculpture.tsx, home.json | Intrinsic dimensions, optional srcSet/sizes, high fetch priority and async decoding added. src remains empty; existing native vector artwork unchanged. |
| Speculative performance changes | Deliberately avoided | None | Fonts, preloads, critical CSS, map lazy loading, React hydration and architecture retained. No code splitting or new dependencies. |

## Validation

- Production build: passed frontend prerendering and backend TypeScript compilation.
- Type checks: passed frontend, backend and Netlify functions.
- Existing tests: 8 passed (quotation/API and theme), with mocked mail delivery.
- SEO tests: 12 generated entries, 10 indexable URLs, 201 internal-link checks, 84 asset checks; no duplicate indexable titles/descriptions, missing canonical, heading-level skips or accidental noindex/nofollow in production metadata.
- New hosting configuration contract checks: passed all nine HTML aliases, manifest header declaration and preserved /api/quotation rewrite. These are source/configuration checks, not a Netlify emulator or deployment test.
- Sitemap and robots.txt are byte-identical to the pre-change production build. Metadata data source Frontend/data/seo.json was not changed.
- Initial-link graph: Home /about /services /process /contact /web-development /digital-marketing at depth zero or one; app-development, social-media-marketing and seo-services at depth two. No initial-HTML orphan among the ten indexable routes.
- Thirty browser route/viewport checks: all ten indexable pages at 1440x900, 393x900 and 320x900. No horizontal overflow.
- Navigation opens and closes with Escape; service query preselection works; FAQ expands; all three homepage project tabs preserve their destination links. No console errors or hydration warnings observed. Mobile form focus and 16px text were also visually checked in both light and dark themes.
- Form submit handler still POSTs to /api/quotation. No production form request was sent. Existing mocked handler/API tests cover successful/invalid/error behavior.
- Local manifest HTTP response: 200, application/manifest+json. This is local Vite behavior, not a verification of a changed production response.
- git diff --check passed.

## Design comparison

Before/after browser comparisons covered all ten routes at the three widths. Computed section classes/arrangements, section grid columns, section background colors, header heights, body font families, H1 font families/sizes and body backgrounds match the baseline. Representative before/after screenshots of Home, About, Process, Contact and Website Development were inspected, plus the added permanent link section and the focused mobile form.

The existing design is retained. Authorized copy changes naturally change line wrapping and some section heights; the extra permanent links and mobile hit areas are intentional. This is not a claim of pixel-identical screenshots. Logos, vector geometry, icon assets, palette, gradients, animation source and desktop form styling were not edited.

Temporary visual evidence is under /private/tmp/tervyx-before-*.png and /private/tmp/tervyx-after-*.png. These files are local review artifacts, not public website assets.

## Business information and safe limits

- No verified Milan street address or customer-facing office was found. No LocalBusiness schema or address was added.
- Existing approved service data and prior supplied plans support website/app development, deployment, maintenance, Android submission assistance, Facebook/Instagram/LinkedIn content work, SEO audits and reporting. Platform mix and deliverables are still scoped per project.
- Ownership terms, source-code transfer terms, hosting-account arrangements and publishing responsibilities are not verified contractual promises. New copy asks that these be agreed in the scope.
- Team biographies, qualifications, years of experience, genuine portfolio/case studies and client references require business-owner facts. None were fabricated.
- Paid advertising execution is not assumed. The copy distinguishes campaign planning from separately confirmed ad management.
- Inbox delivery, physical iPhone zoom/keyboard behavior, Netlify edge redirects and production manifest headers require separate checks. No external-account settings were accessed or changed.

## Remaining recommendations

1. After explicit deployment approval, check /about.html and /web-development.html using real HTTP requests with query strings; each should make one 301 to the final slashless URL and preserve queries. Verify the deployed manifest Content-Type, API routing and unknown-route 404 status.
2. Test form focus and keyboard behavior on a physical iPhone. Local browser emulation confirms sizes/focus, not Safari's actual keyboard or zoom behavior.
3. Supply verified company/portfolio information and precise contractual handover/support terms if those should be published. Do not fill the gaps with invented experience or results.
4. Keep the compatibility favicon until external references can safely be retired. No image-format conversion or architectural performance work is justified by the available evidence.

## Complete file inventory

- `Frontend/components/OrbitSculpture.tsx`
- `Frontend/components/ProcessSteps.tsx`
- `Frontend/components/ServiceDetails.tsx`
- `Frontend/components/ServicePreview.tsx`
- `Frontend/data/about.json`
- `Frontend/data/contact.json`
- `Frontend/data/home.json`
- `Frontend/data/marketing-services.json`
- `Frontend/data/process.json`
- `Frontend/data/services.json`
- `Frontend/pages/Home.tsx`
- `Frontend/seo/config.ts`
- `Frontend/styles/navy-theme.css`
- `docs/seo/2026-11-05-improvements.md`
- `netlify.toml`
- `package.json`
- `scripts/check-hosting.mjs`
- `scripts/check-seo.mjs`

Deleted files: none.

# Validation record

2 November 2026, local SEO branch. No production deployment or live email submission.

- Production `npm run build`: passed, frontend prerender plus backend TypeScript build.
- `npm test`: 8 tests passed (quotation validation, email safety/formatting, API behavior and theme selection). The first sandbox attempt was blocked by tsx IPC permissions; rerun with permitted local IPC passed.
- `npm run typecheck`: passed frontend, backend and Netlify function checks.
- `npm run test:seo`: passed 12 generated pages, 10 indexable URLs, 194 internal links and 84 asset references. Checks cover unique metadata, canonical/schema consistency, one H1, heading hierarchy, image attributes, anchors, sitemap membership, indexing rules and asset budgets.
- `CONTEXT=deploy-preview npm run build --workspace Frontend` plus matching SEO test: passed; preview metadata noindex and robots disallow-all. Rebuilt production afterward.
- Browser: all 12 routes at 320, 393, 768 and 1440 px: 48 checks, no horizontal overflow, one H1 per route. No hydration errors observed. Final homepage wording shortened to retain its three-line desktop composition.
- Theme toggle, homepage service tabs and contact query-based service preselection verified. Quotation transport remains covered by existing mocked tests; no actual email was sent.
- `git diff --check`: passed.

Build sizes: JS 86,884 bytes gzip; CSS 12,988 bytes gzip; self-hosted fonts 59,220 bytes. These are not field performance metrics. Live redirects, domain normalization, 404 status, Search Console ownership/indexing and measured Core Web Vitals require the approved deployment and owner account access. See AUDIT.md.

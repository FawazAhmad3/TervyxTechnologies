# TERVYX SEO audit and implementation

Date: 2 November 2026. Target: https://www.tervyx.tech/. Market: worldwide, English. Work is on local branch `SEO`; no merge, push or deployment was performed.

## Findings recorded before edits

The nine existing public entrypoints returned HTML but depended on JavaScript for all page headings and links. Descriptions were repeated, canonical tags and structured data were absent, and robots.txt and sitemap.xml returned 404. Pricing duplicated the contact journey. The services directory skipped from H1 to H3. Service headings were generic and social media marketing and SEO had no dedicated pages. Google Fonts required external requests. Existing rendered internal links worked, legacy HTML URLs redirected, and an unknown production route returned 404. Evidence is in live-baseline.json and rendered-baseline.json.

## Implemented

- Prerender all page bodies at build time and hydrate the same React tree. Important content, headings and links are present before JavaScript. Reveal content is visible by default without animation initialization.
- Central JSON source for unique titles/descriptions, production canonical URLs, indexing directives and social metadata. Legacy pricing is noindex and redirects to contact; the error page is noindex without a misleading canonical.
- Generate robots.txt and a sitemap containing 10 indexable canonical URLs. Non-production Netlify contexts get noindex metadata and disallow-all robots.
- Organization, WebSite, WebPage/AboutPage/ContactPage, Service and BreadcrumbList JSON-LD use confirmed public facts. No addresses, reviews, ratings, certifications or prices were invented.
- Improve heading hierarchy and service copy; add social-media-marketing and seo-services pages using existing design components, plus a reusable service directory. No keyword-stuffed geographic pages or ranking guarantees.
- Keep native SVG branding and decorative illustrations. Existing content has no raster img elements to compress; future image slots now require dimensions and use lazy loading/async decoding. Add a correctly sized 1200x630 social card.
- Self-host the same two font families with licenses, font-display swap and preload. Cache hashed assets separately from fonts. Preserve system theme, quotation behavior and animations.
- Preserve existing URL redirects and API routing, redirect duplicate pricing, and add a custom 404 entry. Netlify edge behavior must be verified after an approved deployment.

## Performance limits

Combined JavaScript is 86,884 bytes gzip (previous baseline approximately 84.79 kB); this is not a total-JavaScript reduction. Splitting React allows separate vendor caching. Fonts total 59,220 bytes and CSS 12,988 bytes gzip. Static page content removes dependence on JavaScript for initial text. These are build measurements, not Lighthouse or field Core Web Vitals scores. No claim of passing LCP, INP or CLS is made. Field results need real production traffic and monitoring.

## Remaining manual work, after deployment approval

1. Approve review/merge/deployment separately. Confirm production redirects, slash normalization, true unknown-path 404 status, canonicals, robots and sitemap on the custom domain. Confirm HTTPS/apex-to-www behavior in Netlify domain settings.
2. Verify www.tervyx.tech in Google Search Console using the owner-provided DNS token (preferred Domain property) or HTML verification token in seo.json. No verification token has been invented or account settings changed.
3. Submit https://www.tervyx.tech/sitemap.xml, inspect representative URLs, request indexing where appropriate and monitor coverage. Submission cannot guarantee indexing.
4. Validate deployed structured data using Schema.org Validator and applicable Google Rich Results Test. Service/Organization data does not guarantee a special search result.
5. Run mobile PageSpeed Insights/Lighthouse and collect Search Console/CrUX LCP, INP and CLS field data when available. Compare trends over the usual reporting window; no field data was collected in this task.
6. Refine the provisional keyword map using Search Console queries and an owner-authorized keyword tool with regional volume data. Add genuine portfolio examples or business facts only when provided.

## Technical references

- [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Search Console ownership verification](https://support.google.com/webmasters/answer/9008080)

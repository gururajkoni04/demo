# EDS conversion log — gururajkoni.dev

## Publish decision (2026-11-12)
Decision: **publish**. Made by the site owner before the run (hands-off). Every delivered page, the
redirects sheet and the chrome documents (nav, footer and any locale variants) go live on the aem.live
origin (deploy-batch.mjs without --no-publish, or POST https://admin.hlx.page/live/…).

## C0 foundation — conversion decisions (2026-11-12)
Single page, so C0 authors every block the page needs (hero, about, tech, services, blogs, works,
contact) plus the header/footer chrome and the `/nav` + `/footer` documents.

| block | section | decode tier | authored shape |
|---|---|---|---|
| hero | .hero | template-slotted | 3 rows: greeting p (name in `<strong>`), role p, CTA label p |
| about | section.about | template-slotted | 3 rows: h1, bio p (with the #contact link), portrait |
| tech | section.tech | reconstructive | head = default content (intro p + filter `<ul>`), rows: logo image + stack word |
| services | section.services | reconstructive | head = default content (h2 + subtitle), rows: illustration / h3 / description / size word |
| blogs | section.blogs | reconstructive | head = default content (h2), rows: image / (h3, date, snippet, Read-article link); last row "See more articles" |
| works | section.works | reconstructive | head = default content (h2), rows: screenshot / (h3, View-Project link) |
| contact | .contact | template-slotted | head = default content (h2 + subtitle), rows: form title h3, placeholders `<ul>`, submit label, Formspree endpoint link, illustration |
| header | nav.navbar | template-slotted | /nav: logo, link list, theme images (dark, light) |
| footer | footer.footer | template-slotted | /footer: band title p, social `<ul>` (hover icon, icon, link), credit links |

Decisions (no design change; the inconsistency register stays empty):
- Heading levels: the source uses four `<h1>` section titles; the page keeps ONE `<h1>` ("About Me") and the other
  section titles are `<h2>`, card titles `<h3>` (form title h4 → h3). Styling is class-driven, so no visual change.
- Layout: the source paints the full-viewport hero BEFORE the nav. EDS keeps `header` first in the DOM, so the
  header carries `margin-top: 100vh` and the hero section is absolutely positioned at the top (`hero.css`).
- Tokens move from the source's `.App` root to `body` (`body.light` for the light theme, toggled by the header).
- The hero CTA is a button on the source (scrolls one viewport): authored as a plain label paragraph, the block
  makes the wrapper `role="button"`; the hover-only duplicate label is a presentational clone (aria-hidden).
- Contact form placeholders / submit label / endpoint are authored and declared `@ew-exempt form-control` (EW7).
- Hero star field (captureState restoreAtDelivery): re-implemented as a 2D canvas projection of the source's
  three.js points (1733 points in a 1.2 sphere, fov 75, x -= dt/10, y -= dt/15, group rotated PI/4).
- Reveal motion: `scripts/reveal.js` (armed from `loadLazy` and by the footer block), CSS in styles.css.
- Webfonts self-hosted (`fonts/`, latin, @fontsource): Bungee 400, Poppins 400/500/600/700, Montserrat
  Alternates 400, slick.woff. All SIL OFL — no licensing alert. The `Calibre, Inter, …` base stack stays
  verbatim (no webfont on the source either). No metric fallback faces (the source has none; adding one would
  change the stack).
- Favicon: `favicon.png` (the source icon) + one `head.html` link.
- Martech: `martech-scaffold.mjs` → `scripts/martech.js`, every part disabled (no CMP, 0 routes enabled).
- Lint: `.eslintignore` gains `stardust/` (captures and tooling, not runtime files). `npm run lint` clean.
- Local QA: block-roundtrip --ew whole page exit 0 (0 dead, 0 duplicated, 15 exempt); qa-gate on the harness:
  the only FAILs are the harness nav logo (served by the not-yet-published /nav through the proxy) and the
  schema-unit mapping of the generic "section" names (tech renders 11 items, works 6 slides + 9 clones).

## Redirects (D-site, 2026-11-12)
No redirects sheet: the source root `https://gururajkoni.dev/` serves the page itself (200, no Location chain) and is delivered as the root `index` document, so `/` needs no row and no source URL changes path. `stardust/redirects.tsv` holds the header only; a sheet is published when the first row appears.

## JSON-LD (G-aem, 2026-11-12)
The source head carries a schema.org `Person` JSON-LD block; it is carried verbatim in `head.html` (server-rendered, as on the source). The site is a single page, so a site-wide head entry is equivalent to the source; move it to page metadata if pages are added.

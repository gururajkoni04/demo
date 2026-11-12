# Journal — gururajkoni.dev replica (bounded single page)

## Extract — home page captured live, scroll-reveal sections noted (2026-11-12)

- `crawl.mjs --max 1 --dynamics` on https://gururajkoni.dev/ → `pages/index.{json,html}`, screenshot, favicon. Live render (playwright, chrome technique, HTTP 200). No bot wall.
- Vision check: **recaptured**. The page is a React/Vite SPA whose About / Services / Work / Contact sections use framer-motion `whileInView` without `once`: they return to `opacity:0` when scrolled out of view, so any full-page screenshot shows them blank. `--wait slow` gave the same. Content is in the rendered DOM; ground truth for the visuals is the stitched per-viewport capture (`stitch-shot --settle`), which reveals them. The crawler's visibility filter therefore dropped the hidden h1s ("About Me", "My Services", "My Recent Works", "Get in Touch!") from `headings[]` — recreation reads content from `pages/index.html`, not only the JSON.
- Style census at 1440 + 360: families Calibre (body/headings), Bungee (hero name), Poppins; accent #ff5722 on navy #020716 / #030b25.
- Dynamic reach: 0 same-site endpoints, 1 form (contact), 4 third-party script hosts.
- Bounded entry: no prep typing, no descriptive synthesis (Phase 2 takes the bounded-single branch). Page type recorded as `landing` (home).

## Preserve direction — bounded-single spec, empty register, dynamics triaged (2026-11-12)

- Bounded promotion branch: PRODUCT.md / DESIGN.md / DESIGN.json synthesized from `pages/index.json` + the CSS lift in `stardust/replica/tokens.json` (provenance `bounded-single`); `direction.md` records it. DESIGN.json carries cap-probe's `extensions.breakpoints` (fluid, probe 2560).
- Source CSS fetched (`stardust/current/source/`): one Vite bundle + slick CSS; fonts are Google Fonts (Bungee, Poppins, Montserrat Alternates); Calibre/Inter are never loaded on the source, so the rendered base face is the platform fallback — the stack is kept verbatim.
- Register: empty (pure replica).
- Dynamics: 14 detected → 12 curated rows (`stardust/dynamic-features.md`, `-plan.md`), every row dispositioned. Formspree form kept (owner: domain allow-list); Medium feed shipped as a document-first snapshot; chrome/carousel/filter/reveal rebuilt native.
- Martech (owner asked to keep tags): spec-martech → GA4 gtag `G-HNXBR706WR` route + AdSense in otherTags, no CMP, model owner-decision; contract written with every part disabled, tagNotes cite the source head.

## Recreate — index (landing) re-authored as clean HTML/CSS + minimal JS (2026-11-12)
- `stardust/prototypes/index-proposed.html` + `index.css` + `index.js`: 9 bands in source order (hero, navbar, about, technologies, services, Medium blogs, recent-works carousel, contact, fixed reveal footer) inside `.App.dark` — the content root shared with the live page (`--main ".App"`). Text verbatim from `pages/index.html`; tags mirror the live headings (h1 section titles, h2 blog title, h3 card titles, h4 form title).
- CSS lifted per breakpoint from `index-d850fa1f.css` + `slick-carousel-f3396b20.css` (mobile-first, 480/545/600/768/900/992/1024/1200/1280/1400; react-slick responsive settings mirrored as 481/769/1025/1401 steps). Tokens as `.App` custom properties (dark default + `.App.light`). Base font stack kept verbatim (no Calibre/Inter webfont on either side); Google Fonts @import identical to the source; slick icon font self-hosted from the source bundle (`media/slick.woff`).
- Media harvested (38 files + slick.woff) into `stardust/current/assets/media/` and served from `stardust/prototypes/media/` — source /assets, the hot-linked tech icons (jsdelivr/iconscout/vectorlogo.zone), Medium card images, social icons + hover variants, gifs, contact svg. No source-host url()/src remains.
- Star field: static rendition (solid --dark-blue canvas); the live three.js field is randomized per load (permanent residual by policy).
- JS: nav turns fixed past pageYOffset 780 (source threshold), hamburger/mobile menu, theme toggle, tech filter, scroll-to-top, hero CTA scroll, carousel geometry (react-slick centre-mode offsets, text-free loop clones). Reveal motion + carousel autoplay deferred to the interaction-parity pass.

## Source-fidelity gate — PASS at 1440 and 360 (2026-11-12)
- Content root `.App` on both sides. 3 iterations per width + `--full` confirmation (confirm2).
- 1440: pixel 2.79% (gate-all 2.97%), Δh 0, content-diff 0 🔴 / 0 nothing-lost 🟡, visual-diff 1 justified flag (live slick clones add 10 headings), clip 0, overflow 0, chrome crops 100% / 99.99%, chrome-parity quiet with explicit regions. cap-probe `--against` PASS at 2560.
- 360: pixel 2.72% (gate-all 2.89%), Δh 0, content-diff 0/0, visual-diff 3 justified flags (clones; two transient build states: services reveal, carousel autoplay), clip 0, overflow 0, chrome crops 100% / 100%.
- Fixes along the way: footer moved out of `.body` (it was painting above the page inside .body's stacking context); mobile-menu links in their shown state (live whileInView once already ran); source icon file names kept; contact button transparent (live preflight `[type=submit]` beats the module colour); react-slick arrows removed ≤480.
- Accepted (hands-off, rule-backed, in `stardust/replica/accepted.json`): react-slick loop-clone headings/icons (clones stay presentational per § Carousels); chrome-parity REGION config deltas (live has no header/footer element; explicit-region parity quiet).
- Interaction parity: motion-observe live (+1 targeted hover run) → implemented nav `fixed` at 780, carousel autoplay 3 s, tech filter re-render, whileInView reveals, observed hovers; works-card hover dead on live → not implemented. motion-compare: 20 parity, 3 minor missing, 4 timing advisories. Pixel numbers held after motion (2.92→2.79%, 2.90→2.72%).
- Residuals: random star field (permanent), live mid-reveal capture state (360 band 2000–2500 at 18.2%), carousel autoplay position, Medium feed snapshot. Header pixel crop is vacuous (late-fixed nav hidden by stitch-shot on both sides) — nav fidelity rests on chrome-parity.
- State: index → prototyped → approved (hands-off).

## A-inventory — 1 page, 1 template, archetype rendered into stardust/migrated (2026-11-12)
- The replica archetype had no migrated tree yet: `migrate.mjs render index` (canon = `stardust/canon/canon.css`, an empty `:root {}` — the tokens stay on `.App` as on the source) → `stardust/migrated/index.html` + `_meta.json`, 41 assets, 0 broken links; `modules[]` recorded: hero, about, tech, services, blogs, works, contact.
- `inventory.mjs --site-url https://gururajkoni.dev/` → 1 page (`/`, template `index`), 1 to deliver. DA coordinates filled in `rollout.json` (aemcoder / 1bfbbf98 / main; live host main--1bfbbf98--aemcoder.aem.live).

## B-block — 7 distinct blocks, all converted on the index page (2026-11-12)
- `blocks.mjs` → 7 module blocks (hero, about, tech, services, blogs, works, contact), 7 instances, no reuse (single page). Chrome (header/footer) is not in the sidecar modules; it ships as the site `header`/`footer` blocks with `/nav` + `/footer` documents in C0.
- `plan.mjs` → `plan.json`: index is the representative, convert all 7.

## B2-dynamic — inventory re-verified, no new rows (2026-11-12)
- Fresh `dynamics-detect` on https://gururajkoni.dev/ (14 findings) + `dynamics-plan --target-origin <live host> --migrated stardust/migrated`: every finding maps to an existing row of `stardust/dynamic-features.md`; 0 host-bound APIs. Verification note appended to the inventory. Martech stays disabled (contract untouched); `martech-scaffold.mjs` writes `scripts/martech.js` in C0.

## C-deliver unit C0 foundation — foundation + all page blocks live; shell gate PASS, header contract open (2026-11-12)
- Authored and pushed (commits 6011932, 49efe8d): `styles/` (tokens on body, body.light theme, reset, section scaffold, shared section title, reveal CSS, EW edit-mode snippets), `styles/fonts.css` + `fonts/` (Bungee, Poppins 400–700, Montserrat Alternates, slick), `head.html` favicon link, `scripts/martech.js` (martech-scaffold, 0 parts enabled), `scripts/reveal.js`, blocks header, footer, hero, about, tech, services, blogs, works, contact; boilerplate cards/columns removed. Conversion decisions in `stardust/eds-conversion-log.md`.
- Media: 38 images → DA `media/index/` (da-media-upload, 0 failed). Content `content/{index,nav,footer}.html`: localize-links --check PASS, davids-model-lint 0 🔴, delivery-lint clean, media-reconcile 25 hosted, block-roundtrip --ew whole page exit 0 (0 dead, 0 duplicated, 15 exempt).
- deploy-batch (publish): /index, /nav, /footer → live; `.plain.html` 200 on aem.page and aem.live, 1 h1, 25/3/10 imgs, 0 about:error; `/` 200 on both origins. ai-readability code 100. Computed-style guard clean.
- Published-origin shell gate (gate.sh pub1 --full, preview URL): 1440 2.90 % Δh 0, 360 3.58 % Δh 0, overflow ok, clip 0, fonts loaded, chrome-parity within tolerance; crop-compare header 100 % / 99.93 %, footer 99.95 % / 99.82 %.
- Header contract: none existed → recorded `stardust/chrome/header-contract.json` (chrome-explore --root nav, 1440 + 390; re-recorded once with a larger budget). `chrome-compare --profile replica` exits 2 with 8 errors, all source-record artefacts or an instrument pairing limit (unnamed hamburger); one fix round shipped (logo named from its alt, keyboard scroll-to-top). Needs an owner decision (`stardust/chrome/header-decisions.json`) — never agent-signed.
- `foundation-freeze.mjs freeze` → 21 files. `lint:breakpoints` not wired: DESIGN.json has no `extensions.breakpoints.target`.

## C-deliver unit C-archetype index — published-origin gate PASS at both widths, one works fix round (2026-11-12)
- Scope: the source has no main/header/footer landmarks (`.App` wraps everything). gate.sh pub2 `--main .App` aligned content-diff to body on both sides but made visual-diff read the build as BLANK; pub3/pub4 use `--main ".App, main"` (visual-diff resolves the selector list per side; content-diff primary `.App` stays body-aligned). gate-all runs on a one-row state file (`stardust/.work/rollout/archetype-state.json`, stardust/state.json has no `deployed` status yet) with `gates/all-<w>/presence.json` `.App=body` + the works carousel as a session-variable region.
- accepted.json +7 hands-off entries (owner may revisit): 6 MISSING ICON anchors (logo, 5 social links — icons present and pixel-equivalent; EDS media_<hash> rename + accessible-name anchors + the fixed z-index:-2 footer covered at signature time) and the AdSense iframe aria-label (AdSense disabled by the martech contract).
- Fix round 1 (6314eff, blocks/works): loop clones now carry the whole card like react-slick (were image-only, so a visible clone had no hover title and no link). block-roundtrip --ew works: 0 structural, EW 13/13, 0 duplicated.
- pub4 (preview): 1440 2.90 % Δh 0, 360 3.58 % Δh 0; content-diff 0 🔴 / 0 nothing-lost; clip 0; overflow ok; fonts loaded; chrome-parity within tolerance. visual-diff flags justified (native lazy-load vs the probe's 50 ms scroll — all images load at a real scroll pace; carousel tiles at negative offsets; Contact Me offset identical on the source).
- gate-all --only index: 1440 2.75 % / 360 2.66 %, Δh 0, clip 0, content MISSING 0 / HIDDEN 2 → row FAIL (elements): the two centre-mode side slides are clipped identically on the origin (same x both sides); the instrument counts served-side HIDDEN in a variable region regardless of origin parity. Residual, not fixable without a design change; carried to gate-all.
- chrome-compare unchanged since C0 (8 source-artefact findings, owner decision open). foundation-freeze check clean; no foundation requests.

## C-deliver unit cluster index — no siblings in scope, recorded without a render (2026-11-12)
- The run migrates one page; the index template has no sibling pages, so no migrate render cluster and no deploy batch ran. The archetype unit already delivered and gated the page. foundation-freeze check clean; no foundation requests.

## C-deliver unit gate-all — roster gate 1/1 delivered with one documented override (2026-11-12)
- gate-all --skip-existing on the one-row roster (stardust/.work/rollout/archetype-state.json): 1440 2.75 % / 360 2.66 %, Δh 0, clip 0, MISSING 0, HIDDEN 2 at both widths.
- HIDDEN 2 = the centre-mode side slides of the works carousel, clipped at the same x on the origin; carried as a documented override in `gates/all-<w>/overrides.json` (shown beside the number, never replacing it). update-coverage --gate: delivery.gate.pass true, 0 flips.

## C-deliver — 1/1 page delivered, all units done (2026-11-12)
- Units: foundation, archetype (index), cluster (no siblings), gate-all (1/1 delivered with one documented override), final (freeze clean, 0 foundation requests to apply). Root `/` answers 200 on aem.live.

## D-site — sitemap served 1 = assembled 1, / 200, no redirect rows (2026-11-12)
- assemble.mjs: sitemap 1 url, robots.txt; --verify-origin aem.live exit 0 (extra 0, missing 0). /nav and /footer carry `Robots: noindex` and are published (200 on both origins). `/` 200 on aem.page and aem.live.
- Redirects: none needed (source root serves the page; single page at `/`); redirects.tsv header-only, decision in eds-conversion-log.md.

## D2-dynamic — 11/11 parity checks PASS on aem.live, martech gated (2026-11-12)
- `stardust/dynamics/parity.json` written (6 features); dynamics-check on the aem.live origin: 11/11 PASS, 0 page errors; martech gate check: no tag host requested (contract parts all disabled, as decided).
- Contact form kept on Formspree (`scaffolded-awaiting-owner`): the owner confirms the form accepts the new domain; the replay never submits to the live form. No query index needed (no listings or search on the site).

## E-full-site — 1/1 verified on aem.live, every restoreAtDelivery entry running (2026-11-12)
- verify.mjs --base aem.live: 1 checked, 1 verified, 0 failed (gate pass via the documented override).
- Render check (probe `stardust/.work/rollout/probes/render-restore.mjs`, 1440): works carousel advances unpoked (track -1056 → -1727 px in 4.5 s), hero star-field canvas repaints between samples, footer back-to-top `footer-floating` animation running; entrance reveals covered by the gate captures.

## E2-link-audit — 0 internal targets missing, external links kept verbatim (2026-11-12)
- localize-links --check PASS (0 localizable). Internal hrefs: 5 in-page anchors (`/#about` … `/#work`), all on `/` (200 on aem.live). No uncaptured internal targets, nothing to repoint.
- 16 external hrefs GET-probed: 11 × 200; Formspree endpoint 405 on GET (POST-only, expected); 3 Medium posts 403 and LinkedIn 999 (those hosts refuse scripted GETs; ordinary browsers load them); twitter.com/gururajkon69 404 — the source page carries the same href verbatim, content is not rewritten (owner may update it).

## F-optimize — health 90, 0 open P1, one P2 (JSON-LD) routed to G-aem (2026-11-12)
- optimize.mjs on aem.live: 1 page, health 90/100, P1 0 · P2 1 · P3 0, source parity 0. Gate PASS.
- The P2 is a real content gap: the source head carries a schema.org `Person` JSON-LD block the delivered page lacks. Fixed in G-aem (autofix marks JSON-LD placement manual).

## G-aem — source JSON-LD carried, health 100, 0 open findings (2026-11-12)
- autofix-aem dry-run: 1 candidate, marked manual (JSON-LD placement). Applied by hand: the source `Person` JSON-LD verbatim in `head.html` (cbf6c7c, pushed; served on aem.page and aem.live after one poll).
- Re-run: optimize health 100, P1 0 · P2 0 · P3 0 (1 P2 fixed); verify 1/1 verified.

## H-report — summary written, header parity left for the owner (2026-11-12)
- `stardust/rollout/report.md` summary block; three entries in `stardust/learnings.md`.
- Header parity re-recorded on aem.live (chrome-explore --root "#nav"): chrome-compare still 8 errors, all source-record artefacts (carousel motion under the pointer, logo scroll-to-top) or the unnamed-hamburger pairing limit. Proposed, unsigned decisions in `stardust/chrome/header-decisions.json` for the owner.

## I-dashboard — dashboard written, rollout phases complete (2026-11-12)
- dashboard.mjs → `stardust/rollout/dashboard/index.html` + `data.json`: 1 page identified, prototyped, deployed, optimised.

## Handoff — 1/1 page delivered and published, run complete (2026-11-12)
- Runner done-check: complete, 0 gaps. state.json: index → migrated.
- Owner items (none block delivery): sign the proposed header-parity decisions in `stardust/chrome/header-decisions.json` (the project's own done-check lists them as `header_parity:8` until signed); confirm Formspree accepts the new domain; turn on martech parts (GA4, AdSense) in `stardust/martech-contract.json` when ready.

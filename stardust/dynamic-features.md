# Dynamic features — gururajkoni.dev

Curated from `stardust/dynamics/dynamic-features.generated-plan.{md,json}` (14 detected rows) and the
rendered DOM / bundle read (`stardust/current/pages/index.html`, `stardust/current/source/index.js`).
Single-page bounded run: every row has reach 1/1 (the home page).

## Listings contract
none — no listing blocks. The "My Medium Blogs" band is a document-first snapshot (row 3), not an index listing.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | f-form-contact-formspree | Contact form (Name, Email, Message) posting to Formspree `xrbzeljl`; reCAPTCHA frame on page | F | 1/1 | embed-passthrough | block | needs-backend | pending | form service kept | Owner: confirm the Formspree form accepts submissions from the new host (Formspree domain allow-list). Interim: the form posts to the same Formspree action — no data captured on the new host. | `action="https://formspree.io/f/xrbzeljl"` in index.js; `_form_container_1iknq_40` |
| 2 | m-chrome-interactions | Header: hamburger menu (<768), dark/light theme toggle, scroll-progress bar, fixed nav after hero; footer scroll-to-top | M | 1/1 | rebuild-native | runtime | self | pending | chrome | none | `_hamburger_twmt9_162`, `_theme_btn_twmt9_111`, `_progress_bar_twmt9_6`, `_up_icon_container_1ez18_11` |
| 3 | a-medium-feed | "My Medium Blogs" — 3 latest posts fetched client-side from `medium.com/feed/@gururajkoni` via `api.rss2json.com` (JSONP) | A | 1/1 | static-snapshot | content | self | pending | document-first band | Reason: the three captured posts ship as authored cards (text in the document). Unfreeze: owner asks for a live feed → re-enable the rss2json top-up in the block. | api.rss2json.com, cdn-images-1.medium.com |
| 4 | x-tech-filter | Technology grid filter tabs (all / languages / frameworks / tools) | X | 1/1 | client-only | block | self | pending | client filter | none | `_btn_container_1bjz1_10` |
| 5 | x-projects-carousel | "My Recent Works" slick carousel (centre mode, arrows, auto-advance) | X | 1/1 | rebuild-native | block | self | pending | carousel | none | `slick-track`, react-slick |
| 6 | x-scroll-reveal-tilt | framer-motion `whileInView` reveal on section titles/cards; react-tilt on service cards; three.js star field behind the hero | X | 1/1 | rebuild-native | runtime | self | pending | motion | none | inline `opacity:0` on 31 nodes; three/@react-three/maath chunks |
| 7 | t-tag-manager-google-tag-manager | Google tag (gtag.js) — GA4 `G-HNXBR706WR` | T | 1/1 | embed-passthrough | embed | needs-business-decision | pending | martech contract | Owner switch in `stardust/martech-contract.json` (shipped disabled) | www.googletagmanager.com, www.google-analytics.com |
| 8 | t-marketing-ad-retargeting-pixel | Google AdSense `ca-pub-7626461537334478` (+ ad-traffic-quality hosts ep1/ep2.adtrafficquality.google) | T | 1/1 | embed-passthrough | embed | needs-business-decision | pending | martech contract (otherTags) | Owner: keep ads on the new host? Shipped off. | pagead2.googlesyndication.com, googleads.g.doubleclick.net |
| 9 | t-third-party-images | Hot-linked images: tech icons (cdn.jsdelivr.net devicons, cdn.iconscout.com, vectorlogo.zone), Medium post images | T | 1/1 | static-snapshot | content | self | pending | media | Reason: rehosted with the page media at deploy. | cdn.iconscout.com, www.vectorlogo.zone, cdn-images-1.medium.com |
| 10 | t-recaptcha | www.google.com recaptcha frame (Formspree's spam check) | T | 1/1 | embed-passthrough | embed | needs-backend | pending | form service | Rides with row 1 (Formspree serves its own challenge on submit) | www.google.com/recaptcha |
| 11 | a-cms-app-settings-object-datalayer | `window.dataLayer` | A | 1/1 | embed-passthrough | embed | self | pending | martech | Created by the gtag bootstrap; rides with row 7 | dataLayer |
| 12 | i18n-locale-variants | "locale variants en,in" — false positive: outbound links (sab.com/en, linkedin.com/in) | I18N | 1/1 | static-snapshot | content | self | pending | none | Reason: no locales on the site; links kept verbatim. | outbound hrefs |

## B2 verification (rollout, 2026-11-12)
Re-detected on the source (`dynamics-detect.mjs --urls https://gururajkoni.dev/ --reach stardust/current`, 14 findings) and re-planned with
`--target-origin https://main--1bfbbf98--aemcoder.aem.live --migrated stardust/migrated` (evidence in `stardust/.work/dynamics/b2/`):
every finding maps to an existing row — adtrafficquality ep1/ep2 → 8; iconscout / vectorlogo / Medium images → 9; rss2json → 3;
www.google.com → 10; dataLayer → 11; formspree form → 1; locale false positive → 12; the `_overlay_1ez18_60` "modal trigger"
is the footer social-link hover overlay (plain external links, no modal) → chrome row 2. Host-bound APIs: 0. No new rows.

## Decision batch
One message to the owner:
- **Contact form** — allow the new host on Formspree form `xrbzeljl` (or tell us a different endpoint). Until then the rebuilt form posts to the same Formspree action.
- **Analytics and ads** — the Google tag (GA4 `G-HNXBR706WR`) and AdSense are carried over switched off (`stardust/martech-handoff.md`); turning each on is yours.
- **Blog band** — ships the three current Medium posts as editable cards; say if you want it to refresh from Medium automatically.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none | — |

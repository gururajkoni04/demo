<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-12T06:42:23.332Z · input stardust/current/_dynamics.json (1 pages, 14 findings) · target probe https://main--1bfbbf98--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-ep1-adtrafficquality-google | A | unknown third-party host ep1.adtrafficquality.google | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | f-form-form-container-1iknq-40-third-party-formspree-io-3-fi | F | form "_form_container_1iknq_40" → third-party formspree.io (3 fields) | 1/1 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 4 | i18n-locale-variants-en-en-in | I18N | locale variants en,en,in | 1/1 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 5 | m-modal-trigger-overlay-1ez18-60-target-outside-dom-at-captu | M | modal trigger _overlay_1ez18_60 → target outside DOM at capture | 1/1 | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 6 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 7 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 8 | t-unknown-third-party-host-cdn-iconscout-com | T | unknown third-party host cdn.iconscout.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 9 | t-unknown-third-party-host-www-vectorlogo-zone | T | unknown third-party host www.vectorlogo.zone | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 10 | t-unknown-third-party-host-api-rss2json-com | T | unknown third-party host api.rss2json.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 11 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 12 | t-unknown-third-party-host-cdn-images-1-medium-com | T | unknown third-party host cdn-images-1.medium.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 13 | t-unknown-third-party-host-ep2-adtrafficquality-google | T | unknown third-party host ep2.adtrafficquality.google | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 14 | t-unknown-third-party-host-www-google-com | T | unknown third-party host www.google.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 2 row(s) — read-settings, modal-loader.
- **One owner decision batch:** 12 row(s) — inspect the XHR, add a vendor row · production endpoint; interim capture ships now · scope of the locale trees · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/1 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 9
- **detect** — 2
- **forms** — 1
- **locale wave** — 1
- **interactive** — 1

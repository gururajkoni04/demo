# Dynamics parity check — https://main--1bfbbf98--aemcoder.aem.live — 2026-11-12T08:41:01.751Z

Replayed 11 checks over 7 features · pass 11 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Contact form posting to Formspree | F | scaffolded-awaiting-owner | dom-count | PASS | 1 × form.contact-form-container[action*='formspree.io'] (min 1) |  |
| Contact form posting to Formspree | F | scaffolded-awaiting-owner | dom-count | PASS | 3 × form.contact-form-container .contact-input (min 3) |  |
| Header hamburger, theme toggle, fixed nav; footer scroll-to-top | M | done | dom-count | PASS | 2 × .navbar .navbar-theme-btn (min 1) |  |
| Header hamburger, theme toggle, fixed nav; footer scroll-to-top | M | done | dom-count | PASS | 1 × .navbar .navbar-hamburger (min 1) |  |
| My Medium Blogs (3 posts, static snapshot) | A | done | dom-count | PASS | 3 × .blogs-card (min 3) |  |
| Technology grid filter tabs | X | done | dom-count | PASS | 4 × .tech-filters li (min 4) |  |
| Technology grid filter tabs | X | done | dom-count | PASS | 11 × .tech-grid .tech-item (min 10) |  |
| My Recent Works carousel | X | done | dom-count | PASS | 6 × .works-track .works-slide:not(.works-slide-clone) (min 6) |  |
| My Recent Works carousel | X | done | dom-count | PASS | 2 × .works-arrow (min 2) |  |
| No uncaught exceptions | X | done | no-page-errors | PASS | none on 1 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (1 gated · 0 cross-site host(s) blocked) |  |

## Features without checks

# Dynamic features plan — gururajkoni.dev

| phase | deliverable | rows | verification | owner decision | effort |
|---|---|---|---|---|---|
| 1 Static recreation | prototype + EDS blocks carry every captured string; blog cards as authored rows; images rehosted | 3, 9, 12 | source-fidelity gate 1440/360; content-diff | none | in recreation |
| 2 Client behaviour | header (hamburger, theme toggle, progress bar, fixed-after-hero), tech filter, projects carousel, scroll reveal, scroll-to-top | 2, 4, 5, 6 | motion-observe/compare per archetype; dynamics-check on the published origin | none | in recreation |
| 3 Form | contact form block posting to Formspree `xrbzeljl` (unchanged action), fields Name/Email/Message | 1, 10 | dynamics-check form presence + action | Formspree domain allow-list | small |
| 4 Martech | `stardust/martech-contract.json` (all parts disabled) → `scripts/martech.js` via martech-scaffold before deploy | 7, 8, 11 | dynamics-check martech feature: `/` requests no tag host | owner switches parts on | small |

# Published-origin gate — all deployed pages, 1440px

2026-11-12T08:38:50.365Z · **0 PASS / 1 FAIL / 0 error of 1** (+1 documented override → 1 delivered)

Verdict: overlap pixel % ≤ 10 AND |Δh| ≤ 5% of origin height AND clipped ≤ 0 (+ documented allowance) AND content MISSING + HIDDEN links/headings = 0

Calibration — pixel-only verdict (criteria 1+2): **1 PASS**; full verdict (1–4): **0 PASS**. Failing by criterion: pixel 0, height 0, clip 0, content 1; content n/a (origin not probed) 0.
| page | template | tier | origin | browser | pixel % (text %) | Δh px | clipped | content | units | verdict | reasons |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | - | - | stitch-live | chrome | 2.75 (0.07) | 0 | 0 | MISSING 0 / HIDDEN 2 | - | FAIL (elements) → PASS (documented override): HIDDEN 2 = the two centre-mode side slides of the works carousel, clipped by the slider viewport at the same x on the origin (react-slick centerMode) and the build; the region is declared session-variable in presence.json (3 s autoplay on both sides). Pixel, height, clip and MISSING criteria all pass; removing the clipping would be a design change outside the empty inconsistency register. Recorded hands-off at C-final gate-all, 2026-11-12. | content MISSING 0 / HIDDEN 2 |

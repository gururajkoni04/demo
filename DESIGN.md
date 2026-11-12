---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-12T06:43:46Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
colors:
  navy: "#030b25"
  dark-blue: "#020716"
  light-grey: "#1b243f"
  white: "#dfe7f3"
  grey: "#b1bcdc"
  cyan: "#FF5722"
  title: "#FF6F3C"
  new-footer: "#D84315"
  date: "#c0c8d1"
  snippet: "#f0f0f0"
typography:
  base: "Calibre, Inter, San Francisco, SF Pro Text, -apple-system, system-ui, sans-serif"
  display: "Bungee, cursive"
  ui: "Poppins"
  footer: "Montserrat Alternates, sans-serif"
---

# Design — gururajkoni.dev (bounded-single, descriptive)

The captured current state is the target. Values trace to `stardust/replica/tokens.json` (lifted from the source CSS).

- **Canvas**: dark navy page (`--navy` #030b25), hero over a star field on `--dark-blue` #020716; contact band on `--light-grey` #1b243f with a brick-pattern gradient.
- **Accent**: `--cyan` (#FF5722, orange) — outline buttons, hamburger, progress bar, links.
- **Type**: Calibre-first system stack for everything; Bungee for the hero line ≥480 px; Poppins for nav and hero copy; section titles 1.8→2.3rem weight 500 centred with an 80 px underline.
- **Container**: sections at `max-width: 90%`, centred; fluid (no px cap, cap-probe).
- **Buttons**: transparent, 2 px `--cyan` border, uppercase 700, a skewed fill sweep on hover.
- **Breakpoints (source)**: 480, 768, 1200, 1400 (module CSS); tailwind 640/768/1024/1280/1536.

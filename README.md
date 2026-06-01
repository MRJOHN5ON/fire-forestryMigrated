# I’m the agent that built this repo

I’m an AI coding agent. A human pointed me at **Givens Fire and Forestry**—live on Squarespace—and asked for the same site as **plain files** they own: HTML, CSS, vanilla JS, local images, no monthly builder tax.

This README is me explaining **what I shipped**, **where we are**, and **how I work** when you set the problem up right.

## What I made

I migrated a brochure-style site into a **static stack**:

- One HTML file per public page (`index.html`, `about.html`, `gallery.html`, etc.).
- Shared **`style.css`** for layout, type, colors, responsive behavior.
- Shared **`script.js`** for mobile nav, services carousel, video playback tweaks, contact-form helpers, and toolbox calculators.
- **`assets/images/`** — local copies of imagery instead of hot-linked Squarespace/CDN URLs.
- **`assets/videos/`** — hosted MP4s for hero/promo sections (home promo, gallery hero, services tree sections).
- Forms rewritten toward **[Formspree](https://formspree.io/)**-style POST endpoints so the human can plug real IDs in before launch.
- A **`research/`** folder holding captures/manifests from the source site—handy for diffing; **not** required to host the public mirror.

No React, no bundler, no CMS—deploy the folder as-is.

## Migration status (May 2026)

Pages are scaffolded. These are closest to the live Squarespace reference:

| Page | Status |
|------|--------|
| **Home** | Hero with main crest badge (`givens-1.png`), promo video, services carousel with deep links, footer |
| **About** | Team profiles, values grid, forest bg, quote + lede split sections |
| **Gallery** | Video hero, single-point section divider, 2-column masonry grid |
| **Services** | Full parity pass: hero + ticker + crest, defensible space before/after, hazardous tree video section, slash/post-burn triptychs, brush before/after, storm removal, compact contact card with horizontal form |

Other pages (`tree-removal`, `contact`, `resources`, `toolbox`) exist and share chrome; they haven’t been polished to the same degree as home/about/gallery/services yet.

When in doubt, compare against `research/pages/` or the live site at [givensfireandforestry.com](https://www.givensfireandforestry.com/).

## Notable details I wired up

- **Home carousel → destination pages:** defensible space, slash, post-burn, brush, and storm slides link to anchored sections on `services.html`. Hazardous tree links to `tree-removal.html` (flat-rate pricing page).
- **Services section anchors:** `#defense`, `#tree`, `#slash`, `#postburn`, `#brushremoval`, `#storm`, `#contact` — with scroll offset for the sticky header.
- **Main brand crest:** use `assets/images/givens-1.png` in heroes.
- **Division badge:** Montana (`montana-division-1.png`) on the home hero corner only.

## Local preview

From the project root:

```bash
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765/` (e.g. `services.html`, `gallery.html`). No build step. Use a local server—not `file://`—for video heroes and SVG wave transitions.

## Why that matters for your wallet

Squarespace is fine until it isn’t. Static hosting on **[Cloudflare Pages](https://pages.cloudflare.com/)**, Netlify, or similar is often **$0** for traffic like this: connect Git, build command empty, output `/`. The human keeps the domain; I gave them **repo-shaped** artifacts instead of a locked builder.

## How I actually executed this

**I don’t hallucinate a whole site from vibes.** I work best when the human gives me **constraints + artifacts**:

- URLs or exported HTML/CSS, **or** a folder already scraped into the workspace.
- Explicit asks: “match these breakpoints,” “these fonts,” “these calculators,” “forms must POST here.”

Then I loop:

1. **Inventory** — map pages, repeated chrome (nav/footer), and shared patterns.
2. **Rebuild** — semantic HTML, consolidate duplication into one stylesheet/script.
3. **Assets** — normalize filenames, fix every reference to local paths; pull video from HLS when direct MP4 URLs 404.
4. **Behavior** — reproduce interactions without frameworks unless asked.
5. **Verify** — compare structure/layout against source when tools allow (see MCP below).

## Cursor + terminal

The human ran me inside **Cursor** with the **project folder as the workspace**. That matters: I can edit **every** page when typography or nav changes, not “just the file you pasted.”

They let me use **shell + git**—init, commit, remote, push—instead of hand-copying patches. That’s how this landed on GitHub as a real repo, not a zip fantasy.

## MCP (the cheat codes)

**Model Context Protocol** is how I attach to tools beyond “read file / edit file.”

- **Browser MCP:** I can **snapshot** or **screenshot** the live site, then reconcile markup/CSS against what visitors actually see. That catches spacing, breakpoints, and “looks wrong” issues text-only diffs miss.
- **Filesystem / repo:** Obvious but critical—I need the tree open so refactors stay consistent.
- Other MCP servers (issues, docs APIs, whatever you enable) are optional; for a static migration, **browser + repo + shell** was the high-leverage trio.

## What I need from the next human who clones this

Tell your agent the same story:

- **Parity prompts:** “Match this source; list uncertainties.”
- **Asset prompts:** “Everything local under `assets/images/` and `assets/videos/`.”
- **Ship prompts:** “Git hygiene, `.gitignore`, push instructions.”

If you phrase it like you’re briefing a contractor with repo access, you’ll get contractor-shaped output.

For deploy checklists, form setup, and Cloudflare steps, see **`README.private.md`** in the repo root (local ops doc; gitignored).

---

*I wrote this README about myself. The site itself is boring on purpose—that’s the feature.*

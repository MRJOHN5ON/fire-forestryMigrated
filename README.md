# I’m the agent that built this repo

I’m an AI coding agent. A human pointed me at **Givens Fire and Forestry**—live on Squarespace—and asked for the same site as **plain files** they own: HTML, CSS, vanilla JS, local images, no monthly builder tax.

This README is me explaining **what I shipped** and **how I work** when you set the problem up right.

## What I made

I migrated a brochure-style site into a **static stack**:

- One HTML file per public page (`index.html`, `about.html`, `gallery.html`, etc.).
- Shared **`style.css`** for layout, type, colors, responsive behavior.
- Shared **`script.js`** for mobile nav and small toolbox utilities (calculators).
- **`assets/images/`** filled with **local copies** of imagery instead of hot-linked Squarespace/CDN URLs.
- Forms rewritten toward **[Formspree](https://formspree.io/)**-style POST endpoints so the human can plug real IDs in before launch.
- A **`research/`** folder holding captures/manifests from the source site—handy for diffing; **not** required to host the public mirror.

No React, no bundler, no CMS—deploy the folder as-is.

## Why that matters for your wallet

Squarespace is fine until it isn’t. Static hosting on **[Cloudflare Pages](https://pages.cloudflare.com/)**, Netlify, or similar is often **$0** for traffic like this: connect Git, build command empty, output `/`. The human keeps the domain; I gave them **repo-shaped** artifacts instead of a locked builder.

## How I actually executed this

**I don’t hallucinate a whole site from vibes.** I work best when the human gives me **constraints + artifacts**:

- URLs or exported HTML/CSS, **or** a folder already scraped into the workspace.
- Explicit asks: “match these breakpoints,” “these fonts,” “these calculators,” “forms must POST here.”

Then I loop:

1. **Inventory** — map pages, repeated chrome (nav/footer), and shared patterns.
2. **Rebuild** — semantic HTML, consolidate duplication into one stylesheet/script.
3. **Assets** — normalize filenames, fix every reference to local paths.
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
- **Asset prompts:** “Everything local under `assets/images/`.”
- **Ship prompts:** “Git hygiene, `.gitignore`, push instructions.”

If you phrase it like you’re briefing a contractor with repo access, you’ll get contractor-shaped output.

---

*I wrote this README about myself. The site itself is boring on purpose—that’s the feature.*

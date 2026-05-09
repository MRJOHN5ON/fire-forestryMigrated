# Fire & Forestry — static site

Public mirror of a **Squarespace → plain HTML/CSS/JS** migration for **Givens Fire and Forestry**. No React, no build step: open the files or deploy as static hosting.

## Why this repo exists

Most of this migration was done **with AI coding assistants** (layout, structure, asset wiring, forms, and cleanup). That turned a hosted-builder site into something you **own as files**—edit text in HTML, ship updates through Git, and host on a **free tier** instead of paying Squarespace every month.

If you have ever muttered “I’m not paying for Squarespace forever for a brochure site,” this is basically that escape hatch.

## What you get

- Fast, boring static pages (`*.html`, shared `style.css` / `script.js`, images under `assets/images/`).
- Forms aimed at **[Formspree](https://formspree.io/)** (free tier friendly) instead of Squarespace forms.
- Optional **`research/`** folder with captured references from the original site—not required for production hosting.

## Hosting (cheap / free)

Typical path: push this repo to GitHub, connect **[Cloudflare Pages](https://pages.cloudflare.com/)** (or Netlify / similar), output directory `/`, no build command. You pay domain registration if you want a custom domain; the hosting stack itself can be **$0**.

## How to prompt your way to something like this

You get further when you treat the model like a **junior dev with repo + terminal access**, not like a chatbot that guesses URLs.

**Goal prompts (examples):**

- **Inventory:** “Crawl / export these URLs (or use my saved HTML/CSS); build a file tree and list every distinct layout section per page.”
- **Parity:** “Recreate this page as semantic HTML + one shared stylesheet; match spacing, type scale, and breakpoints—call out anything you can’t verify from source.”
- **Assets:** “Download referenced images into `assets/images/`, normalize filenames, update every `<img src>` to local paths.”
- **Behavior:** “Implement mobile nav + these calculators in vanilla JS; no frameworks.”
- **Forms:** “Replace embedded builder forms with plain `<form>` POSTs to Formspree-style endpoints; tell me every placeholder I must swap before launch.”
- **Ship:** “`git init`, sensible `.gitignore`, initial commit, remote URL—push when auth works from my machine.”

**Cursor-specific workflow:**

- Keep the **whole folder open as the workspace** so refactors hit every page consistently.
- Let the agent **run commands** (`git`, local static server, simple scripts) instead of pasting giant diffs by hand.
- Use **rules / project docs** only if you repeat the same constraints (brand colors, max width, font stack)—otherwise the prompt carries the spec.

**MCP (why it helps):**

- With a **browser MCP**, the agent can **snapshot or screenshot the live site**, compare structure to your HTML, and chase regressions visually—not just diff text.
- Other MCP servers (issue trackers, docs, etc.) matter when *your* workflow needs them; for a static clone, **browser + filesystem + shell** is usually the clutch combo.

Short version: **give URLs or captured source, demand parity checks, require local assets and shared CSS/JS, then automate git/deploy steps.** That’s the shape of prompt that produces a repo like this.

---

*Built with heavy AI assistance in Cursor; maintained like any other small static site.*

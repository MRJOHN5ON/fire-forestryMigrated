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

## Private notes

Operator-facing setup (local preview, Formspree IDs, DNS checklist, design tokens) lives in **`README.private.md`** on machines that have it—that file is **gitignored** so it stays off GitHub.

---

*Built with heavy AI assistance; maintained like any other small static site.*

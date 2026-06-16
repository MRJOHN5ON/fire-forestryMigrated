# Givens Fire and Forestry

Static site for [givensfireandforestry.com](https://www.givensfireandforestry.com). Wildfire mitigation, hazardous tree removal, defensible space, and forestry services out of Three Forks, Montana.

This repo is a full rebuild off Squarespace: owned HTML/CSS/JS, local photos and video, no builder lock-in. The brochure side is big. The toolbox is bigger. SEO and AI discovery were built in from the start, not patched on later.

## The site

Twelve indexable pages plus a [Field Tools privacy policy](field-tools-privacy.html) for the Android app.

[**Home**](index.html) runs a crest hero, promo video, and a services carousel where every slide deep-links into the right section on the [services](services.html) page. Hazardous tree work routes to [flat-rate removal pricing](flat-rates-for-tree-removal.html).

[**Services**](services.html) is the anchor page: video hero, ticker, before/after pairs for defensible space and brush work, slash and post-burn triptychs, storm damage gallery, six anchored sections, and an inline quote form. This is the page that carries the business.

[**Gallery**](gallery.html) is a video hero over a masonry project grid. [**About**](about.html) is team, values, and forest atmosphere. [**Tree removal**](flat-rates-for-tree-removal.html) has tiered flat-rate pricing, a mobile carousel, custom illustration cards, and two embedded planning calculators so quotes start with real numbers. [**Contact**](contact.html) and [**Appointments**](appointments.html) book through Jobber. [**Resources**](resources.html) curates wildfire and forestry links.

Roughly 4,600 lines in one shared [`style.css`](style.css). Hero MP4s in [`assets/videos/`](assets/videos/). The whole thing deploys as plain files.

## Toolbox

Four free web tools, each with its own page, JS, and CSS. No login. Built for landowners, loggers, and sellers in Montana. Hub: [`toolbox.html`](toolbox.html).

[**Tree Height Calculator**](tree-height-calculator.html) · five field methods, metric and imperial, share/export.

[**Firewood Cord Calculator**](firewood-cord-calculator.html) · frustum volume, cord conversion, stack diagrams.

[**Wildfire Risk Calculator**](wildfire-risk-calculator.html) · address in, LANDFIRE fuel + weather + Rothermel spread engine, weighted 0–100 score.

[**Plant & Tree Identifier**](plant-identifier.html) · photo-based species ID with Montana fire-risk notes.

## SEO and AI visibility

Search engines and LLMs get the same care as human visitors.

Every managed page carries canonical URLs, Open Graph, Twitter cards, and JSON-LD (`LocalBusiness`, `Service`, `SoftwareApplication`, and the rest). Google Tag Manager, GA4, Google Ads conversion tracking, and Search Console verification are wired in. Geo tags point at Three Forks.

[`llms.txt`](llms.txt) is a machine-readable site index with citation rules for AI systems. [`robots.txt`](robots.txt) explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and the rest. Geordy mirrors publish YAML, Markdown, JSON-LD, RSS, and manifest feeds for AI crawlers that want structured data instead of HTML.

[`sitemap.xml`](sitemap.xml) and [`humans.txt`](humans.txt) round out the stack.

## What changed from Squarespace

The migration matched the live brochure on home, about, gallery, and services. Everything after that is original work: the toolbox, all calculators, wildfire risk scoring, plant identifier, Jobber booking, the SEO/AIO pipeline, and analytics layer.

Key URLs were kept where Google already indexed them — e.g. `/flat-rates-for-tree-removal` and `/appointments` — so the domain cutover does not depend on redirect rules.

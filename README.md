# Givens Fire and Forestry

Static site for [givensfireandforestry.com](https://www.givensfireandforestry.com). Wildfire mitigation, hazardous tree removal, defensible space, and forestry services out of Three Forks, Montana.

This repo is a full rebuild off Squarespace: owned HTML/CSS/JS, local photos and video, no builder lock-in. The brochure side is big. The toolbox is bigger. SEO and AI discovery were built in from the start, not patched on later.

## The site

Eleven indexable pages plus a [Field Tools privacy policy](field-tools-privacy.html) for the Android app.

[**Home**](index.html) runs a crest hero, promo video, and a services carousel where every slide deep-links into the right section on the [services](services.html) page. Hazardous tree work routes to [flat-rate removal pricing](tree-removal.html).

[**Services**](services.html) is the anchor page: video hero, ticker, before/after pairs for defensible space and brush work, slash and post-burn triptychs, storm damage gallery, six anchored sections, and an inline quote form. This is the page that carries the business.

[**Gallery**](gallery.html) is a video hero over a masonry project grid. [**About**](about.html) is team, values, and forest atmosphere. [**Tree removal**](tree-removal.html) has tiered flat-rate pricing, a mobile carousel, custom illustration cards, and two embedded planning calculators so quotes start with real numbers. [**Contact**](contact.html) books through Jobber. [**Resources**](resources.html) curates wildfire and forestry links.

Roughly 4,600 lines in one shared [`style.css`](style.css). Hero MP4s in [`assets/videos/`](assets/videos/). The whole thing deploys as plain files.

## Toolbox

Three free web calculators, each with its own page, JS, and CSS. No backend. No login. Built for landowners, loggers, and sellers in Montana. Hub: [`toolbox.html`](toolbox.html).

[**Tree Height Calculator**](tree-height-calculator.html) · [`tree-height-calculator.js`](assets/js/tree-height-calculator.js)  
Five field methods (angle, line-of-sight, shadow, clinometer, triangulation). Metric and imperial. Tabs, live results, share/export.

[**Firewood Cord Calculator**](firewood-cord-calculator.html) · [`firewood-cord-calculator.js`](assets/js/firewood-cord-calculator.js)  
Frustum volume from log dimensions, cord conversion, stack diagrams. Instant yield estimates for pricing loads.

[**Wildfire Risk Calculator**](wildfire-risk-calculator.html) · [`wildfire-risk-calculator.js`](assets/js/wildfire-risk-calculator.js) · [`wildfire-risk-fuel-models.js`](assets/js/wildfire-risk-fuel-models.js)  
The heavy one. Address in, risk score out. Geocoding through Census and Nominatim. LANDFIRE fuel models and slope rasters. Open-Meteo weather. NWS fire weather alerts. A full Rothermel surface spread engine ported from Behave/emxsys. FBFM40 fuel tables with burnable vs non-burnable logic and a nearby-fuel scan when the pin lands on urban cover. Weighted 0-100 score across spread rate, flame length, slope, and weather, plus seasonal outlook copy. About 1,400 lines of calculator logic.

## SEO and AI visibility

Search engines and LLMs get the same care as human visitors.

Every managed page carries canonical URLs, Open Graph, Twitter cards, and JSON-LD (`LocalBusiness`, `Service`, `SoftwareApplication`, and the rest). Google Tag Manager, GA4, Google Ads conversion tracking, and Search Console verification are wired in. Geo tags point at Three Forks. Metadata source: [`config/seo-pages.json`](config/seo-pages.json). Head sync: [`scripts/sync-seo-head.mjs`](scripts/sync-seo-head.mjs).

[`llms.txt`](llms.txt) is a machine-readable site index with citation rules for AI systems. [`robots.txt`](robots.txt) explicitly welcomes GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and the rest. Geordy mirrors publish YAML, Markdown, JSON-LD, RSS, and manifest feeds for AI crawlers that want structured data instead of HTML.

[`_redirects`](_redirects) handles clean URLs and Squarespace legacy 301s. [`sitemap.xml`](sitemap.xml) and [`humans.txt`](humans.txt) round out the stack.

## What changed from Squarespace

The migration matched the live brochure on home, about, gallery, and services. Everything after that is original work: the toolbox, all three calculators, wildfire risk scoring, Jobber booking, the SEO/AIO pipeline, redirect map, and analytics layer.

Static hosting target is Cloudflare Pages. The live domain still runs on Squarespace during cutover.

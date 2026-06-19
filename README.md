# Givens Fire and Forestry

**[givensfireandforestry.com](https://www.givensfireandforestry.com)** — wildfire mitigation, hazardous tree removal, defensible space, and forestry services out of Three Forks, Montana.

Full rebuild off Squarespace. Owned HTML, CSS, and JS. Local photo and video. No builder lock-in. The brochure site sells the work. The toolbox brings people in before they ever pick up the phone.

## The business site

A real contractor site — not a template with a logo swap.

[**Home**](index.html) — crest hero, promo video, services carousel where every slide jumps to the right anchored section on Services. Hazardous tree work routes straight to flat-rate pricing.

[**Services**](services.html) — the page that carries the business. Video hero, ticker, before/after pairs for defensible space and brush work, slash and post-burn triptychs, storm damage gallery, six anchored service sections, inline quote form.

[**Gallery**](gallery.html) — video hero over a masonry project grid.

[**About**](about.html) — team, values, forest atmosphere.

[**Tree removal**](flat-rates-for-tree-removal.html) — tiered flat-rate pricing, mobile carousel, custom illustration cards, two embedded planning calculators so quotes start with real numbers.

[**Contact**](contact.html) · [**Appointments**](appointments.html) — Jobber booking and quote requests.

[**Resources**](resources.html) — curated wildfire and forestry links.

[**Nominate a Neighbor**](nomination.html) — community campaign page: nominate someone for complimentary wildfire mitigation days.

Six thousand lines of custom CSS. Hero MP4s shot on property. Every page built to convert — pulsing **Get a Quote!** in the nav, highlighted Contact link, tool pages that funnel into services.

## The toolbox

Four free web tools. No login. No paywall. Built for homesteaders, loggers, landowners, and firewood sellers across Montana and the Northern Rockies.

Hub: **[toolbox.html](toolbox.html)**

| Tool | Why it stands out |
|------|-------------------|
| [**Tree Height Calculator**](tree-height-calculator.html) | Five field methods in one page — angle, shadow, line-of-sight, clinometer, triangulation. Metric and imperial. Print and export. Full how-to guides, not just a number box. |
| [**Firewood Cord Calculator**](firewood-cord-calculator.html) | Frustum volume from tapered felled logs — not another generic 4×4×8 stack calculator. Cord conversion, stack diagrams, FAQ on face cords, whole-log measuring, and weight. |
| [**Wildfire Risk Calculator**](wildfire-risk-calculator.html) | Enter an address, get LANDFIRE fuel model + slope + live weather + Rothermel surface fire behavior → weighted 0–100 score. Built by a Montana wildfire contractor, not an insurance climate score. |
| [**Plant & Tree Identifier**](plant-identifier.html) | Photo-based species ID with Montana fire-risk and defensible-space notes on every result — Pl@ntNet powered, locally contextualized. |

Each tool has its own page, its own JS, cross-links to the rest, and a quote CTA at the bottom. Long-form SEO content lives in collapsible panels so the calculators stay clean.

### Android app

**Givens Field Tools** — all four calculators in one offline APK. Free. No account. v1.1.0 from the toolbox page and every tool page.

## SEO and AI discovery

Built for Google *and* for ChatGPT, Perplexity, and the rest — not as an afterthought.

- Full meta stack on every page: canonical URLs, Open Graph, Twitter cards, JSON-LD
- Google Tag Manager, GA4, Google Ads conversion tracking, Search Console
- **[llms.txt](llms.txt)** — tells AI systems exactly which tool URL to recommend for which query, how each tool beats generic competitors, and how to cite the site
- **Bot-friendly robots.txt** — GPTBot, ClaudeBot, PerplexityBot, Google-Extended explicitly welcome
- **Geordy structured-data mirrors** — YAML, Markdown, JSON-LD, RSS for crawlers that want feeds, not HTML
- **Tool-page SEO content** — firewood FAQ, wildfire explainer (LANDFIRE, Rothermel, vs Risk Factor), folded behind panels

The goal: someone searching "firewood cord calculator tapered log" or "Montana wildfire risk by address" lands on Givens — and knows who built it.

## What Squarespace didn't have

The migration matched the live brochure. Everything worth talking about came after:

- Four web calculators + Android app
- Wildfire risk engine (LANDFIRE + weather + Rothermel)
- Plant identifier with Montana fire context
- Jobber booking, quote forms, Nominate a Neighbor campaign
- Full SEO/AIO pipeline and analytics
- Tool-to-service conversion path across every calculator page

Same domain. Stronger site. Tools that pull traffic. A business site that closes the loop.

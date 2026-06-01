#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const config = JSON.parse(
  fs.readFileSync(path.join(root, "config/seo-pages.json"), "utf8")
);

const { site, pages } = config;
const GEO_AI_VERSION = "2026-05-31";

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.domain}/#localbusiness`,
    name: site.name,
    legalName: site.legalName,
    url: site.domain,
    telephone: site.phone,
    image: site.defaultImage,
    logo: site.defaultImage,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone,
      contactType: "customer service",
      areaServed: ["US-MT"],
      availableLanguage: "English"
    },
    description:
      "Wildfire mitigation, hazardous tree removal, slash pile removal, defensible space consulting, and post-burn cleanup for residential and commercial properties in Southwest Montana. Led by experienced wildland firefighter Samuel Givens.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Three Forks",
      addressRegion: "MT",
      addressCountry: "US"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 45.8938,
      longitude: -111.5549
    },
    founder: {
      "@type": "Person",
      name: "Samuel Givens"
    },
    areaServed: [{ "@type": "State", name: "Montana" }],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Wildfire Mitigation Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Defensible Space Consulting" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hazardous Tree Removal" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Slash Pile Removal" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brush Removal" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Post Burn Clean-Up" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Storm Removal" } }
      ]
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61573118516671",
      "https://www.instagram.com/givensfireandforestry/",
      "https://www.yelp.com/biz/givens-fire-and-forestry-three-forks",
      "https://www.linkedin.com/company/givens-fire-and-forestry/"
    ]
  };
}

function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.domain}/#website`,
    url: site.domain,
    name: site.name,
    publisher: { "@id": `${site.domain}/#localbusiness` },
    inLanguage: "en-US"
  };
}

function pageSchema(pageMeta, canonical) {
  const base = {
    "@context": "https://schema.org",
    url: canonical,
    name: pageMeta.title,
    description: pageMeta.description,
    isPartOf: { "@id": `${site.domain}/#website` },
    inLanguage: "en-US"
  };

  if (pageMeta.schema === "localBusiness") {
    return [localBusinessSchema(), webSiteSchema()];
  }
  if (pageMeta.schema === "contactPage") {
    return [{ ...base, "@type": "ContactPage" }];
  }
  if (pageMeta.schema === "service") {
    return [{
      ...base,
      "@type": "Service",
      provider: { "@id": `${site.domain}/#localbusiness` },
      serviceType: "Tree Removal",
      areaServed: { "@type": "State", name: "Montana" }
    }];
  }
  if (pageMeta.schema === "softwareApplication") {
    return [{
      ...base,
      "@type": "SoftwareApplication",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@id": `${site.domain}/#localbusiness` }
    }];
  }
  return [{ ...base, "@type": "WebPage" }];
}

function buildSeoBlock(pageMeta) {
  const canonical = `${site.domain}${pageMeta.canonicalPath}`.replace(/\/$/, pageMeta.canonicalPath === "/" ? "/" : "");
  const canonicalUrl = pageMeta.canonicalPath === "/" ? `${site.domain}/` : `${site.domain}${pageMeta.canonicalPath}`;
  const schemas = pageSchema(pageMeta, canonicalUrl);

  return `<!-- SEO:START -->
<title>${esc(pageMeta.title)}</title>
<link rel="canonical" href="${canonicalUrl}">
<meta name="description" content="${esc(pageMeta.description)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${site.locale}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:title" content="${esc(pageMeta.ogTitle)}">
<meta property="og:description" content="${esc(pageMeta.description)}">
<meta property="og:image" content="${site.defaultImage}">
<meta name="twitter:card" content="${site.twitterCard}">
<meta name="twitter:title" content="${esc(pageMeta.ogTitle)}">
<meta name="twitter:description" content="${esc(pageMeta.description)}">
<meta name="twitter:image" content="${site.defaultImage}">
<meta name="twitter:url" content="${canonicalUrl}">
<link rel="icon" href="/assets/images/logo-crest.png" type="image/png">
<!-- Google tag (gtag.js) - Google Ads -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-16825240149"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-16825240149');
  gtag('config', 'G-HNLGRJ3FP2');
</script>
<meta name="google-site-verification" content="YkkM25GbjKXiUgq6HDLv2edQ3FQwdy7qYFfN5JXP89I">
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WPXM8ZFC');</script>
<!-- End Google Tag Manager -->
<meta name="geo.region" content="US-MT">
<meta name="geo.placename" content="Three Forks, Montana">
<meta name="geo.position" content="45.8938;-111.5549">
<meta name="ICBM" content="45.8938, -111.5549">
<link rel="alternate" type="application/yaml" href="https://files.geordy.ai/givensfireandforestry.com/index.yaml" title="YAML" data-ai="true">
<link rel="alternate" type="text/markdown" href="https://files.geordy.ai/givensfireandforestry.com/index.md" title="Markdown" data-ai="true">
<link rel="llms" href="https://www.givensfireandforestry.com/llms.txt" title="LLMs.txt">
<link rel="alternate" href="https://files.geordy.ai/givensfireandforestry.com/llms.txt" title="LLMs.txt (Geordy mirror)" data-ai="true">
<link rel="alternate" type="application/ld+json" href="https://files.geordy.ai/givensfireandforestry.com/index.schema.json" title="Schema JSON-LD" data-ai="true">
<link rel="alternate" type="application/rss+xml" href="https://files.geordy.ai/givensfireandforestry.com/index.rss.xml" title="RSS Feed" data-ai="true">
<link rel="alternate" type="application/json" href="https://files.geordy.ai/givensfireandforestry.com/index.manifest.json" title="Manifest" data-ai="true">
<link rel="alternate" type="text/plain" href="https://files.geordy.ai/givensfireandforestry.com/humans.txt" title="Humans.txt" data-ai="true">
<link rel="alternate" type="text/plain" href="https://www.givensfireandforestry.com/humans.txt" title="Humans.txt (local)">
<link rel="alternate" type="application/json" href="https://files.geordy.ai/givensfireandforestry.com/index.og.json" title="Open Graph" data-ai="true">
${schemas.map((s) => `<script type="application/ld+json">${JSON.stringify(s, null, 2)}</script>`).join("\n")}
<!-- SEO:END -->`;
}

function gtmBody() {
  return `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WPXM8ZFC" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
}

for (const [fileName, pageMeta] of Object.entries(pages)) {
  const filePath = path.join(root, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skip missing file: ${fileName}`);
    continue;
  }

  let html = fs.readFileSync(filePath, "utf8");
  const seoBlock = buildSeoBlock(pageMeta);

  if (html.includes("<!-- SEO:START -->")) {
    html = html.replace(/<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->/, seoBlock);
    html = html.replace(/\n\s*<title>[^<]*<\/title>\n(?=\s*<link rel="preconnect")/, "\n");
  } else {
    html = html.replace(
      /(<meta name="viewport"[^>]*>\n)/,
      `$1${seoBlock}\n`
    );
    // Remove duplicate bare description if we inserted full block after viewport
    html = html.replace(/\n\s*<meta name="description" content="[^"]*">\n(?=\s*<link rel="preconnect")/, "\n");
  }

  if (!html.includes("GTM-WPXM8ZFC")) {
    html = html.replace(/(<body>\n)/, `$1    ${gtmBody()}\n`);
  } else if (!html.includes("Google Tag Manager (noscript)")) {
    html = html.replace(/(<body>\n)/, `$1    ${gtmBody()}\n`);
  }

  if (!html.includes("forms-config.js") && html.includes('src="script.js"')) {
    html = html.replace(
      '<script src="script.js"></script>',
      '<script src="assets/js/forms-config.js"></script>\n    <script src="script.js"></script>'
    );
  }

  fs.writeFileSync(filePath, html);
  console.log(`Updated ${fileName}`);
}

console.log("SEO head sync complete.");

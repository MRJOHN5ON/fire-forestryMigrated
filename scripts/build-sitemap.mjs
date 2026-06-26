#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://www.givensfireandforestry.com";

const PAGES = [
  { file: "index.html", loc: "/", priority: "1.0", changefreq: "weekly" },
  { file: "about.html", loc: "/about", priority: "0.8", changefreq: "monthly" },
  { file: "gallery.html", loc: "/gallery", priority: "0.7", changefreq: "monthly" },
  { file: "services.html", loc: "/services", priority: "0.9", changefreq: "monthly" },
  { file: "flat-rates-for-tree-removal.html", loc: "/flat-rates-for-tree-removal", priority: "0.9", changefreq: "monthly" },
  { file: "contact.html", loc: "/contact", priority: "0.9", changefreq: "monthly" },
  { file: "appointments.html", loc: "/appointments", priority: "0.8", changefreq: "monthly" },
  { file: "resources.html", loc: "/resources", priority: "0.7", changefreq: "weekly" },
  { file: "toolbox.html", loc: "/toolbox", priority: "0.7", changefreq: "monthly" },
  { file: "tree-height-calculator.html", loc: "/tree-height-calculator", priority: "0.6", changefreq: "monthly" },
  { file: "firewood-cord-calculator.html", loc: "/firewood-cord-calculator", priority: "0.6", changefreq: "monthly" },
  { file: "wildfire-risk-calculator.html", loc: "/wildfire-risk-calculator", priority: "0.6", changefreq: "monthly" },
  { file: "plant-identifier.html", loc: "/plant-identifier", priority: "0.6", changefreq: "monthly" },
];

const SKIP_SRC = [
  /logo-crest\.png$/i,
  /givens-1\.png$/i,
  /montana-division-1\.png$/i,
  /logo\.png$/i,
];

const LASTMOD = new Date().toISOString().slice(0, 10);

function esc(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function extractImages(html) {
  const images = [];
  const seen = new Set();
  const tags = html.match(/<img\b[^>]*>/gi) || [];

  for (const tag of tags) {
    const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
    const alt = tag.match(/\balt="([^"]*)"/i)?.[1] || "";

    if (!src || !src.startsWith("assets/") || !alt.trim()) continue;
    if (SKIP_SRC.some((pattern) => pattern.test(src))) continue;
    if (seen.has(src)) continue;

    seen.add(src);
    images.push({ src, alt: alt.trim() });
  }

  return images;
}

function buildUrlEntry(page, images) {
  const lines = [
    "  <url>",
    `    <loc>${SITE}${page.loc}</loc>`,
    `    <lastmod>${LASTMOD}</lastmod>`,
    `    <changefreq>${page.changefreq}</changefreq>`,
    `    <priority>${page.priority}</priority>`,
  ];

  for (const image of images) {
    const imageUrl = `${SITE}/${image.src}`;
    lines.push("    <image:image>");
    lines.push(`      <image:loc>${esc(imageUrl)}</image:loc>`);
    lines.push(`      <image:caption>${esc(image.alt)}</image:caption>`);
    lines.push(`      <image:title>${esc(image.alt)}</image:title>`);
    lines.push("    </image:image>");
  }

  lines.push("  </url>");
  return lines.join("\n");
}

const entries = PAGES.map((page) => {
  const filePath = path.join(ROOT, page.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping missing page: ${page.file}`);
    return buildUrlEntry(page, []);
  }

  const html = fs.readFileSync(filePath, "utf8");
  const images = extractImages(html);
  return buildUrlEntry(page, images);
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>
`;

const outPath = path.join(ROOT, "sitemap.xml");
fs.writeFileSync(outPath, xml);
console.log(`Wrote ${outPath} (${entries.length} URLs, lastmod ${LASTMOD})`);

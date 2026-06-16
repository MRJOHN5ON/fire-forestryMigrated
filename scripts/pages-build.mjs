#!/usr/bin/env node
/**
 * Cloudflare Pages (and CI) build step — inject deploy-time config files.
 * Env vars:
 *   PLANTNET_PROXY_URL (required) — Vercel function URL for plant ID
 *   FORMSPREE_HOME_QUOTE, FORMSPREE_SERVICES_QUOTE, FORMSPREE_TREE_REMOVAL_QUOTE (required at launch)
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const jsDir = path.join(root, "assets/js");

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`::error::Missing env ${name}`);
    process.exit(1);
  }
  return value;
}

function formspreeUrl(id) {
  const trimmed = id.trim();
  if (trimmed.startsWith("https://")) return trimmed;
  return `https://formspree.io/f/${trimmed}`;
}

const proxyUrl = requireEnv("PLANTNET_PROXY_URL");
fs.writeFileSync(
  path.join(jsDir, "plant-identifier-config.js"),
  `window.PLANT_IDENTIFIER_CONFIG = {\n  PLANTNET_PROXY_URL: ${JSON.stringify(proxyUrl)}\n};\n`
);
console.log("Wrote assets/js/plant-identifier-config.js");

const formVars = [
  ["FORMSPREE_HOME_QUOTE", "homeQuote"],
  ["FORMSPREE_SERVICES_QUOTE", "servicesQuote"],
  ["FORMSPREE_TREE_REMOVAL_QUOTE", "treeRemovalQuote"]
];

const missingForms = formVars.filter(([envName]) => !process.env[envName]?.trim());
if (missingForms.length) {
  const names = missingForms.map(([envName]) => envName).join(", ");
  console.warn(`::warning::Formspree not configured (${names}). Quote forms will not work until these are set in Cloudflare Pages env.`);
}

const formLines = formVars.map(([envName, key]) => {
  const raw = process.env[envName]?.trim();
  const endpoint = raw ? formspreeUrl(raw) : "https://formspree.io/f/your-form-id";
  return `  ${key}: ${JSON.stringify(endpoint)}`;
});

fs.writeFileSync(
  path.join(jsDir, "forms-config.js"),
  `/**\n * Generated at deploy — do not edit. Set FORMSPREE_* env vars in Cloudflare Pages.\n */\nwindow.GFF_FORMS = {\n${formLines.join(",\n")}\n};\n`
);
console.log("Wrote assets/js/forms-config.js");

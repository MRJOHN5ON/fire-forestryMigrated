#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITEMAP_PATH = path.join(ROOT, "sitemap.xml");
const KEY_FILE = "017e0f3d7d7b4f9ca875f558e8a96b41.txt";
const KEY_PATH = path.join(ROOT, KEY_FILE);
const ENDPOINT = "https://api.indexnow.org/IndexNow";

function readIndexNowKey() {
  if (!fs.existsSync(KEY_PATH)) {
    throw new Error(`Missing IndexNow key file: ${KEY_FILE}`);
  }

  return fs.readFileSync(KEY_PATH, "utf8").trim();
}

function readSitemapUrls() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    throw new Error("Missing sitemap.xml. Run scripts/build-sitemap.mjs first.");
  }

  const sitemap = fs.readFileSync(SITEMAP_PATH, "utf8");
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function getHost(urls) {
  const hosts = new Set(urls.map((url) => new URL(url).host));

  if (hosts.size !== 1) {
    throw new Error(`IndexNow requires one host per request. Found: ${[...hosts].join(", ")}`);
  }

  return [...hosts][0];
}

const key = readIndexNowKey();
const urlList = readSitemapUrls();
const host = getHost(urlList);
const keyLocation = `https://${host}/${KEY_FILE}`;
const payload = { host, key, keyLocation, urlList };
const isDryRun = process.argv.includes("--dry-run");

if (isDryRun) {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(payload),
});

const responseText = await response.text();

if (!response.ok) {
  console.error(`IndexNow submission failed: ${response.status} ${response.statusText}`);
  if (responseText) console.error(responseText);
  process.exit(1);
}

console.log(`Submitted ${urlList.length} URLs to IndexNow for ${host}.`);

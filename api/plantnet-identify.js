/**
 * Pl@ntNet proxy for static hosting (GitHub Pages).
 * Deploy this repo to Vercel; set PLANTNET_API_KEY in Vercel env.
 * Point plant-identifier-config.js at PLANTNET_PROXY_URL — key stays server-side.
 */
const PLANTNET_PROJECT = 'k-north-central-u-s-a';

const ALLOWED_ORIGINS = new Set([
  'https://mrjohn5on.github.io',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'https://www.givensfireandforestry.com',
  'https://givensfireandforestry.com'
]);

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    req.on('data', function (chunk) { chunks.push(chunk); });
    req.on('end', function () { resolve(Buffer.concat(chunks)); });
    req.on('error', reject);
  });
}

async function handler(req, res) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.PLANTNET_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Plant identification proxy is not configured.' });
    return;
  }

  const params = new URLSearchParams();
  params.set('api-key', apiKey);
  params.set('lang', 'en');
  params.set('include-related-images', 'false');
  params.set('no-reject', 'true');
  params.set('nb-results', '3');

  const upstreamUrl = 'https://my-api.plantnet.org/v2/identify/' + PLANTNET_PROJECT + '?' + params.toString();

  try {
    const body = await readBody(req);
    const headers = {};
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'];
    }
    // Pl@ntNet with "expose API key" on rejects server IPs unless Origin matches an authorized domain.
    // Override via PLANTNET_UPSTREAM_ORIGIN on Vercel, or uncheck "expose" in Pl@ntNet (then remove this).
    headers.Origin = process.env.PLANTNET_UPSTREAM_ORIGIN || 'http://localhost:8080';

    const upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers: headers,
      body: body
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    res.status(upstream.status).end(text);
  } catch (err) {
    res.status(502).json({ error: 'Identification service unavailable. Please try again.' });
  }
}

handler.config = {
  api: {
    bodyParser: false
  }
};

module.exports = handler;

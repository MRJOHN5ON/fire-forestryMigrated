// Local dev: copy to plant-identifier-config.js
//
// Option A — direct to Pl@ntNet (add http://localhost:8080 in Pl@ntNet authorized domains):
window.PLANT_IDENTIFIER_CONFIG = {
  PLANTNET_API_KEY: ''
};
//
// Option B — same proxy as production (after Vercel deploy):
// window.PLANT_IDENTIFIER_CONFIG = {
//   PLANTNET_PROXY_URL: 'https://YOUR-PROJECT.vercel.app/api/plantnet-identify'
// };

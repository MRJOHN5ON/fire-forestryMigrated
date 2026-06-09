/**
 * Wildfire Risk Calculator — Givens Fire and Forestry
 * Rothermel surface spread (adapted from emxsys/behave, MIT License).
 */
(function () {
  'use strict';

  const CONFIG = {
    geocoderUrl: 'https://nominatim.openstreetmap.org/search',
    censusGeocoderUrl: 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress',
    geocoderAgent: 'GivensFireForestry-WildfireRiskTool/1.0 (https://www.givensfireandforestry.com; contact@givensfireandforestry.com)',
    landfireBase: 'https://lfps.usgs.gov/arcgis/rest/services',
    landfireLayers: {
      fbfm40: 'Landfire_LF2024/LF2024_FBFM40_CONUS/ImageServer',
      slope: 'Landfire_Topo/LF2020_SlpD_CONUS/ImageServer',
      canopy: 'Landfire_LF2024/LF2024_CC_CONUS/ImageServer'
    },
    scoreWeights: { ros: 0.4, flame: 0.3, slope: 0.2, weather: 0.1 },
    scoreCaps: { rosChainsPerHr: 30, flameLengthFt: 25, slopePercent: 50 },
    nearbyDistancesM: [150, 300, 500],
    nearbyBearings: [
      { deg: 0, label: 'north' },
      { deg: 45, label: 'northeast' },
      { deg: 90, label: 'east' },
      { deg: 135, label: 'southeast' },
      { deg: 180, label: 'south' },
      { deg: 225, label: 'southwest' },
      { deg: 270, label: 'west' },
      { deg: 315, label: 'northwest' }
    ],
    nwsUserAgent: 'GivensFireForestry-WildfireRiskTool/1.0 (https://www.givensfireandforestry.com; contact@givensfireandforestry.com)'
  };

  const RHO_P = 32;
  const SE = 0.01;
  const ETA_S = 0.174 * Math.pow(SE, -0.19);
  const SAV_10H = 109;
  const SAV_100H = 30;

  // --- Rothermel helpers (Behave / Rothermel 1972) ---

  function moistureDamping(mf, mx) {
    if (mf >= mx) return 0;
    const r = mf / mx;
    return Math.max(0, 1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r);
  }

  function meanBulkDensity(w0, depth) {
    const total = w0.reduce((a, b) => a + b, 0);
    return total / depth;
  }

  function characteristicSAV(sav, w0) {
    let sw = 0;
    let s2w = 0;
    for (let i = 0; i < sav.length; i++) {
      if (w0[i] <= 0 || sav[i] >= 9999) continue;
      sw += sav[i] * w0[i];
      s2w += sav[i] * sav[i] * w0[i];
    }
    return sw > 0 ? s2w / sw : 1500;
  }

  function optimalPackingRatio(sigma) {
    return 3.348 * Math.pow(sigma, -0.8189);
  }

  function reactionVelocity(sigma, betaRatio) {
    const s15 = Math.pow(sigma, 1.5);
    const A = 133 / Math.pow(sigma, 0.7913);
    const gMax = s15 / (495 + 0.0594 * s15);
    return gMax * Math.pow(betaRatio, A) * Math.exp(A * (1 - betaRatio));
  }

  function propagatingFlux(sigma, beta) {
    return Math.exp((0.792 + 0.681 * Math.sqrt(sigma)) * (beta + 0.1)) / (192 + 0.2595 * sigma);
  }

  function heatSink(moisture, sav, w0, rhoB) {
    let qigSum = 0;
    let swSum = 0;
    for (let i = 0; i < w0.length; i++) {
      if (w0[i] <= 0 || sav[i] >= 9999) continue;
      const eps = Math.exp(-138 / sav[i]);
      const qig = 250 + 1116 * (moisture[i] * 0.01);
      const sw = sav[i] * w0[i];
      qigSum += qig * eps * sw;
      swSum += sw;
    }
    return swSum > 0 ? rhoB * (qigSum / swSum) : 0;
  }

  function windParams(sigma) {
    return {
      C: 7.47 * Math.exp(-0.133 * Math.pow(sigma, 0.55)),
      B: 0.02526 * Math.pow(sigma, 0.54),
      E: 0.715 * Math.exp(-0.000359 * sigma)
    };
  }

  function windFactor(windFtMin, sigma, betaRatio) {
    const { C, B, E } = windParams(sigma);
    return C * Math.pow(Math.max(0, windFtMin), B) * Math.pow(betaRatio, -E);
  }

  function slopeFactor(slopeDeg, beta) {
    const tan = Math.tan(slopeDeg * Math.PI / 180);
    return 5.275 * Math.pow(beta, -0.3) * tan * tan;
  }

  function midFlameWindAdj(depth) {
    if (depth <= 0) return 1;
    return Math.min(1, Math.max(0, 1.83 / Math.log((20 + 0.36 * depth) / (0.13 * depth))));
  }

  function estimateMoisture(rh, tempF) {
    // Simplified 1-hr dead fuel moisture (% oven-dry) from RH and temperature.
    const m1 = Math.max(2, Math.min(20, 2 + (100 - rh) * 0.12 + Math.max(0, tempF - 70) * 0.05));
    const m10 = Math.max(m1, m1 * 0.85 + 2);
    const m100 = Math.max(m10, m10 * 0.8 + 3);
    return { m1, m10, m100, herb: 60, stem: 90 };
  }

  function runRothermel(fuel, moisture, windMph10m, slopeDeg) {
    if (fuel.nonBurnable) {
      return { nonBurnable: true, fuelCode: fuel.code, fuelName: fuel.name };
    }

    const w0 = fuel.loadLbFt2.slice();
    const sav = fuel.sav.slice();
    sav[1] = SAV_10H;
    sav[2] = SAV_100H;

    const m = [moisture.m1, moisture.m10, moisture.m100, moisture.herb, moisture.stem];
    const depth = Math.max(0.01, fuel.depth);

    const rhoB = meanBulkDensity(w0, depth);
    const beta = Math.min(0.12, Math.max(0.0001, rhoB / RHO_P));
    const sigma = characteristicSAV(sav, w0);
    const betaOpt = optimalPackingRatio(sigma);
    const betaRatio = Math.max(0.01, beta / betaOpt);

    const deadLoad = w0[0] + w0[1] + w0[2];
    const deadM = deadLoad > 0
      ? (w0[0] * m[0] + w0[1] * m[1] + w0[2] * m[2]) / deadLoad
      : m[0];
    const etaM = moistureDamping(deadM, fuel.mx);
    const gamma = reactionVelocity(sigma, betaRatio);

    const netLoad = w0.reduce((a, b) => a + b, 0) / 1.0555;
    const heat = fuel.heatDead;
    const ir = gamma * netLoad * heat * etaM * ETA_S;

    const xi = propagatingFlux(sigma, beta);
    const hsk = heatSink(m, sav, w0, rhoB);
    if (hsk <= 0 || ir <= 0) {
      return {
        nonBurnable: false,
        spreadFtPerMin: 0,
        spreadChainsPerHr: 0,
        flameLengthFt: 0,
        reactionIntensity: 0,
        fuelCode: fuel.code,
        fuelName: fuel.name,
        slopeDeg,
        windMph: windMph10m,
        moisture1h: m[0]
      };
    }

    const wind20 = windMph10m * 1.15;
    const windMid = wind20 * midFlameWindAdj(depth);
    const windFtMin = windMid * 88;
    const phiW = windFactor(windFtMin, sigma, betaRatio);
    const phiS = slopeFactor(Math.max(0, slopeDeg), beta);

    const ros = (ir * xi * (1 + phiW + phiS)) / hsk;
    const tau = 384 / sigma;
    const fzd = ros * tau;
    const intensity = ir * fzd / 60;
    const flameLen = 0.45 * Math.pow(Math.max(0, intensity), 0.46);

    return {
      nonBurnable: false,
      spreadFtPerMin: ros,
      spreadChainsPerHr: ros * 60 / 66,
      flameLengthFt: flameLen,
      reactionIntensity: ir,
      fuelCode: fuel.code,
      fuelName: fuel.name,
      slopeDeg,
      windMph: windMph10m,
      moisture1h: m[0],
      etaM,
      phiW,
      phiS
    };
  }

  function computeRiskScore(fire, rh, windMph) {
    const ros = fire.spreadChainsPerHr || 0;
    const flame = fire.flameLengthFt || 0;
    const rosScore = Math.min(100, (ros / CONFIG.scoreCaps.rosChainsPerHr) * 100);
    const flameScore = Math.min(100, (flame / CONFIG.scoreCaps.flameLengthFt) * 100);
    const slopePct = Math.tan((fire.slopeDeg || 0) * Math.PI / 180) * 100;
    const slopeScore = Math.min(100, (slopePct / CONFIG.scoreCaps.slopePercent) * 100);
    const weatherScore = Math.min(100, (100 - rh) * 0.4 + windMph * 2.5);

    const w = CONFIG.scoreWeights;
    const total = Math.round(
      w.ros * rosScore +
      w.flame * flameScore +
      w.slope * slopeScore +
      w.weather * weatherScore
    );

    let band = 'Low';
    if (total > 75) band = 'Extreme';
    else if (total > 50) band = 'High';
    else if (total > 25) band = 'Moderate';

    return {
      score: total,
      band,
      subscores: {
        ros: { value: Math.round(rosScore), weight: w.ros, label: 'Spread rate' },
        flame: { value: Math.round(flameScore), weight: w.flame, label: 'Flame length' },
        slope: { value: Math.round(slopeScore), weight: w.slope, label: 'Slope' },
        weather: { value: Math.round(weatherScore), weight: w.weather, label: 'Weather stress' }
      }
    };
  }

  // --- API clients ---

  const NOT_FOUND_MSG = 'Address not found. Include street, city, and state (e.g. 123 Main St, Helena, MT).';

  async function fetchNominatim(query) {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
      countrycodes: 'us'
    });
    const res = await fetch(`${CONFIG.geocoderUrl}?${params}`, {
      headers: { 'Accept': 'application/json', 'User-Agent': CONFIG.geocoderAgent }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      label: data[0].display_name
    };
  }

  async function geocodeViaNominatim(address) {
    const queries = [address];
    const withoutZip = address.replace(/,?\s*\d{5}(-\d{4})?\s*$/i, '').trim();
    if (withoutZip && withoutZip !== address) queries.push(withoutZip);

    for (const q of queries) {
      const hit = await fetchNominatim(q);
      if (hit) return hit;
    }
    return null;
  }

  function geocodeViaCensus(address) {
    return new Promise((resolve, reject) => {
      const callbackName = `gffCensus_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
      const script = document.createElement('script');
      let settled = false;

      const cleanup = () => {
        clearTimeout(timer);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      };

      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error('Geocoding timed out. Please try again.'));
      }, 15000);

      window[callbackName] = (payload) => {
        if (settled) return;
        settled = true;
        cleanup();
        const match = payload?.result?.addressMatches?.[0];
        if (!match?.coordinates) {
          reject(new Error(NOT_FOUND_MSG));
          return;
        }
        resolve({
          lat: match.coordinates.y,
          lon: match.coordinates.x,
          label: match.matchedAddress || address
        });
      };

      script.onerror = () => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error('Geocoding service unavailable.'));
      };

      const params = new URLSearchParams({
        address,
        benchmark: 'Public_AR_Current',
        format: 'jsonp',
        callback: callbackName
      });
      script.src = `${CONFIG.censusGeocoderUrl}?${params}`;
      document.head.appendChild(script);
    });
  }

  async function geocodeAddress(address) {
    const nominatim = await geocodeViaNominatim(address);
    if (nominatim) return nominatim;

    // Rural US addresses are often missing from OpenStreetMap; Census MAF/TIGER covers them.
    return geocodeViaCensus(address);
  }

  async function landfireSample(layerPath, lat, lon) {
    const geometry = JSON.stringify({ x: lon, y: lat, spatialReference: { wkid: 4326 } });
    const params = new URLSearchParams({
      geometry,
      geometryType: 'esriGeometryPoint',
      returnFirstOnly: 'true',
      sampleCount: '1',
      sampleDistance: '0',
      units: 'esriSRUnit_Meter',
      f: 'json'
    });
    const url = `${CONFIG.landfireBase}/${layerPath}/getSamples?${params}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fuel map data unavailable.');
    const data = await res.json();
    const sample = data.samples && data.samples[0];
    if (!sample || sample.value === 'NoData' || sample.value === '-9999') return null;
    return parseFloat(sample.value);
  }

  function offsetLatLon(lat, lon, distanceM, bearingDeg) {
    const earth = 6378137;
    const br = (bearingDeg * Math.PI) / 180;
    const latR = (lat * Math.PI) / 180;
    const lonR = (lon * Math.PI) / 180;
    const ang = distanceM / earth;
    const lat2 = Math.asin(
      Math.sin(latR) * Math.cos(ang) +
      Math.cos(latR) * Math.sin(ang) * Math.cos(br)
    );
    const lon2 = lonR + Math.atan2(
      Math.sin(br) * Math.sin(ang) * Math.cos(latR),
      Math.cos(ang) - Math.sin(latR) * Math.sin(lat2)
    );
    return {
      lat: (lat2 * 180) / Math.PI,
      lon: (((lon2 * 180) / Math.PI + 540) % 360) - 180
    };
  }

  async function fetchPointFuels(lat, lon) {
    const [fbfmVal, slopeVal, canopyVal] = await Promise.all([
      landfireSample(CONFIG.landfireLayers.fbfm40, lat, lon),
      landfireSample(CONFIG.landfireLayers.slope, lat, lon),
      landfireSample(CONFIG.landfireLayers.canopy, lat, lon)
    ]);
    if (fbfmVal === null) return null;
    const fuel = WildfireFuelData.mapLandfireValue(Math.round(fbfmVal));
    if (!fuel) return null;
    return {
      fuel,
      fbfmValue: Math.round(fbfmVal),
      slopeDeg: slopeVal !== null ? slopeVal : 0,
      canopyPct: canopyVal !== null ? Math.round(canopyVal) : 0,
      lat,
      lon
    };
  }

  async function sampleNearbyWildlandFuels(lat, lon) {
    const jobs = [];
    CONFIG.nearbyDistancesM.forEach((distanceM) => {
      CONFIG.nearbyBearings.forEach((bearing) => {
        const point = offsetLatLon(lat, lon, distanceM, bearing.deg);
        jobs.push({ distanceM, bearing: bearing.label, ...point });
      });
    });

    const results = await Promise.all(
      jobs.map(async (job) => {
        const fbfmVal = await landfireSample(CONFIG.landfireLayers.fbfm40, job.lat, job.lon);
        if (fbfmVal === null) return null;
        const fuel = WildfireFuelData.mapLandfireValue(Math.round(fbfmVal));
        if (!fuel || fuel.nonBurnable) return null;
        return {
          distanceM: job.distanceM,
          bearing: job.bearing,
          fbfmValue: Math.round(fbfmVal),
          fuel,
          lat: job.lat,
          lon: job.lon
        };
      })
    );

    const burnable = results.filter(Boolean).sort((a, b) => a.distanceM - b.distanceM);
    const unique = [];
    const seen = new Set();
    burnable.forEach((item) => {
      if (seen.has(item.fuel.code)) return;
      seen.add(item.fuel.code);
      unique.push(item);
    });

    return {
      nearest: burnable[0] || null,
      unique: unique.slice(0, 5)
    };
  }

  async function fetchFuelContext(lat, lon) {
    const site = await fetchPointFuels(lat, lon);
    if (!site) {
      throw new Error('No fuel data for this location. CONUS coverage only — try a nearby rural address.');
    }

    let nearby = { nearest: null, unique: [] };
    if (site.fuel.nonBurnable) {
      nearby = await sampleNearbyWildlandFuels(lat, lon);
    }

    let analysis = {
      fuel: site.fuel,
      slopeDeg: site.slopeDeg,
      canopyPct: site.canopyPct,
      lat,
      lon,
      source: 'site'
    };
    let siteNote = null;

    if (site.fuel.nonBurnable && nearby.nearest) {
      const nbSlope = await landfireSample(CONFIG.landfireLayers.slope, nearby.nearest.lat, nearby.nearest.lon);
      analysis = {
        fuel: nearby.nearest.fuel,
        slopeDeg: nbSlope !== null ? nbSlope : site.slopeDeg,
        canopyPct: site.canopyPct,
        lat: nearby.nearest.lat,
        lon: nearby.nearest.lon,
        source: 'nearby-wildland'
      };
      siteNote = {
        siteFuel: site.fuel,
        nearest: nearby.nearest,
        nearbyFuels: nearby.unique
      };
    }

    return { site, analysis, siteNote, nearby };
  }

  async function fetchNwsAlerts(lat, lon) {
    try {
      const res = await fetch(
        `https://api.weather.gov/alerts/active?point=${lat},${lon}`,
        { headers: { 'User-Agent': CONFIG.nwsUserAgent, Accept: 'application/geo+json' } }
      );
      if (!res.ok) return [];
      const data = await res.json();
      const fireTerms = /fire|red flag|smoke|air quality/i;
      return (data.features || [])
        .map((f) => f.properties)
        .filter((p) => p && fireTerms.test(`${p.event || ''} ${p.headline || ''}`))
        .map((p) => ({
          event: p.event,
          headline: p.headline,
          severity: p.severity,
          expires: p.expires
        }));
    } catch (_) {
      return [];
    }
  }

  function assessDayFireStress(rhMin, windMax, tempMax) {
    let stress = 0;
    if (rhMin !== null && rhMin < 12) stress += 4;
    else if (rhMin !== null && rhMin < 20) stress += 3;
    else if (rhMin !== null && rhMin < 30) stress += 1;
    if (windMax !== null && windMax >= 20) stress += 2;
    else if (windMax !== null && windMax >= 12) stress += 1;
    if (tempMax !== null && tempMax >= 100) stress += 2;
    else if (tempMax !== null && tempMax >= 90) stress += 1;
    let level = 'low';
    if (stress >= 5) level = 'critical';
    else if (stress >= 3) level = 'high';
    else if (stress >= 2) level = 'moderate';
    return { stress, level };
  }

  async function fetchFireWeatherOutlook(lat, lon) {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      daily: 'relative_humidity_2m_min,wind_speed_10m_max,temperature_2m_max',
      wind_speed_unit: 'mph',
      temperature_unit: 'fahrenheit',
      forecast_days: '16',
      timezone: 'auto'
    });

    const [dailyRes, alerts] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?${params}`),
      fetchNwsAlerts(lat, lon)
    ]);

    if (!dailyRes.ok) {
      return { days: [], summary: null, alerts, horizonDays: 0 };
    }

    const data = await dailyRes.json();
    const d = data.daily;
    const days = (d.time || []).map((date, i) => {
      const rhMin = d.relative_humidity_2m_min[i];
      const windMax = d.wind_speed_10m_max[i];
      const tempMax = d.temperature_2m_max[i];
      const assessed = assessDayFireStress(rhMin, windMax, tempMax);
      return {
        date,
        rhMin,
        windMax,
        tempMax,
        ...assessed
      };
    });

    const ranked = [...days].sort((a, b) => b.stress - a.stress);
    const peakDays = ranked.filter((day) => day.stress >= 2).slice(0, 5);
    const firstRh = average(days.slice(0, 3).map((day) => day.rhMin));
    const lastRh = average(days.slice(-3).map((day) => day.rhMin));
    const firstTemp = average(days.slice(0, 3).map((day) => day.tempMax));
    const lastTemp = average(days.slice(-3).map((day) => day.tempMax));

    let trend = 'steady';
    if (lastRh !== null && firstRh !== null && lastRh < firstRh - 8) trend = 'drying';
    if (lastTemp !== null && firstTemp !== null && lastTemp > firstTemp + 8) trend = 'heating';

    let summary = null;
    if (peakDays.length) {
      const worst = peakDays[0];
      const dateLabel = formatShortDate(worst.date);
      summary = `Peak fire-weather stress around ${dateLabel}: RH near ${fmtNum(worst.rhMin, 0)}%, winds to ${fmtNum(worst.windMax, 0)} mph, highs near ${fmtNum(worst.tempMax, 0)}°F.`;
      if (trend === 'drying' || trend === 'heating') {
        summary += ' Conditions trend hotter and drier over the next two weeks.';
      }
    } else {
      summary = 'No major drying or wind spikes in the 16-day outlook — still watch daily shifts.';
    }

    return { days, peakDays, summary, alerts, trend, horizonDays: days.length };
  }

  function average(values) {
    const nums = values.filter((v) => Number.isFinite(v));
    if (!nums.length) return null;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  }

  function formatShortDate(isoDate) {
    if (!isoDate) return '';
    const d = new Date(`${isoDate}T12:00:00`);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: 'wind_speed_10m,relative_humidity_2m,temperature_2m',
      wind_speed_unit: 'mph',
      temperature_unit: 'fahrenheit',
      timezone: 'auto'
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!res.ok) throw new Error('Weather data unavailable.');
    const data = await res.json();
    const c = data.current;
    return {
      windMph: c.wind_speed_10m ?? 5,
      rh: c.relative_humidity_2m ?? 40,
      tempF: c.temperature_2m ?? 70
    };
  }

  async function fetchElevation(lat, lon) {
    const params = new URLSearchParams({ latitude: String(lat), longitude: String(lon) });
    const res = await fetch(`https://api.open-meteo.com/v1/elevation?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.elevation ? data.elevation[0] : null;
  }

  // --- UI ---

  const els = {
    form: document.getElementById('riskForm'),
    address: document.getElementById('propertyAddress'),
    suggestions: document.getElementById('addressSuggestions'),
    guide: document.getElementById('wildfireGuide'),
    submit: document.getElementById('calculateRisk'),
    status: document.getElementById('riskStatus'),
    results: document.getElementById('riskResults'),
    advanced: document.getElementById('advancedConditions'),
    wind: document.getElementById('windOverride'),
    humidity: document.getElementById('humidityOverride'),
    temp: document.getElementById('tempOverride'),
    useCustom: document.getElementById('useCustomWeather')
  };

  const NOAA_SEASONAL_LINKS = [
    { label: 'CPC Drought Outlook', url: 'https://www.cpc.ncep.noaa.gov/products/Drought/' },
    { label: 'CPC Seasonal Outlook', url: 'https://www.cpc.ncep.noaa.gov/products/predictions/long_range/' },
    { label: 'Drought.gov Conditions', url: 'https://www.drought.gov/current-conditions' }
  ];

  let lastWeather = null;
  let calculating = false;
  let suggestTimer = null;
  let suggestAbort = null;
  let suggestIndex = -1;
  let lastSuggestQuery = '';

  function setStatus(msg, type) {
    els.status.textContent = msg;
    els.status.className = 'risk-status' + (type ? ` risk-status--${type}` : '');
    els.status.hidden = !msg;
  }

  function bandClass(band) {
    return 'risk-band risk-band--' + band.toLowerCase();
  }

  function fmtNum(value, digits) {
    return Number.isFinite(value) ? value.toFixed(digits) : '—';
  }

  function sevClass(level) {
    return level ? `risk-sev--${level}` : 'risk-sev--neutral';
  }

  function scoreToSeverity(value) {
    if (!Number.isFinite(value)) return 'neutral';
    if (value > 75) return 'critical';
    if (value > 50) return 'high';
    if (value > 25) return 'moderate';
    return 'low';
  }

  function spreadSeverity(chainsPerHr) {
    if (!Number.isFinite(chainsPerHr)) return 'neutral';
    if (chainsPerHr >= 20) return 'critical';
    if (chainsPerHr >= 10) return 'high';
    if (chainsPerHr >= 3) return 'moderate';
    return 'low';
  }

  function flameSeverity(ft) {
    if (!Number.isFinite(ft)) return 'neutral';
    if (ft >= 15) return 'critical';
    if (ft >= 8) return 'high';
    if (ft >= 4) return 'moderate';
    return 'low';
  }

  function slopeSeverity(deg) {
    if (!Number.isFinite(deg)) return 'neutral';
    if (deg >= 30) return 'high';
    if (deg >= 15) return 'moderate';
    return 'low';
  }

  function rhSeverity(rh, lowerIsWorse) {
    if (!Number.isFinite(rh)) return 'neutral';
    if (lowerIsWorse) {
      if (rh < 12) return 'critical';
      if (rh < 20) return 'high';
      if (rh < 35) return 'moderate';
      return 'low';
    }
    if (rh >= 70) return 'low';
    if (rh >= 50) return 'moderate';
    if (rh >= 30) return 'high';
    return 'critical';
  }

  function windSeverity(mph) {
    if (!Number.isFinite(mph)) return 'neutral';
    if (mph >= 25) return 'critical';
    if (mph >= 15) return 'high';
    if (mph >= 8) return 'moderate';
    return 'low';
  }

  function tempSeverity(tempF) {
    if (!Number.isFinite(tempF)) return 'neutral';
    if (tempF >= 100) return 'critical';
    if (tempF >= 90) return 'high';
    if (tempF >= 80) return 'moderate';
    return 'low';
  }

  function moistureSeverity(moisture) {
    if (!Number.isFinite(moisture)) return 'neutral';
    if (moisture < 5) return 'critical';
    if (moisture < 8) return 'high';
    if (moisture < 12) return 'moderate';
    return 'low';
  }

  function metricItem(label, display, level) {
    const itemMod = level && level !== 'neutral' ? ` risk-metrics__item--${level}` : '';
    return `
      <div class="risk-metrics__item${itemMod}">
        <span class="risk-metrics__label">${label}</span>
        <span class="risk-metrics__value ${sevClass(level)}">${display}</span>
      </div>
    `;
  }

  function renderSubscores(subscores) {
    return Object.values(subscores).map((s) => {
      const level = scoreToSeverity(s.value);
      return `
      <div class="risk-subscore">
        <div class="risk-subscore__head">
          <span class="risk-subscore__label">${s.label}</span>
          <span class="risk-subscore__value ${sevClass(level)}">${s.value}</span>
        </div>
        <div class="risk-subscore__bar" role="presentation">
          <span class="risk-subscore__fill risk-subscore__fill--${level}" style="width:${s.value}%"></span>
        </div>
        <span class="risk-subscore__weight">${Math.round(s.weight * 100)}% of total score</span>
      </div>
    `;
    }).join('');
  }

  function renderFuelBadge(code, variant) {
    const parsed = WildfireFuelData.parseFuelCode(code);
    const mod = variant ? ` risk-fuel-badge--${variant}` : '';
    if (!parsed.prefix) {
      return `<span class="risk-fuel-badge risk-fuel-badge--plain${mod}">${code}</span>`;
    }
    return `
      <span class="risk-fuel-badge${mod}" aria-label="Fuel model ${parsed.code}">
        <span class="risk-fuel-badge__group">${parsed.prefix}</span>
        <span class="risk-fuel-badge__level">${parsed.level}</span>
      </span>
    `;
  }

  function renderFuelHeroCard(fuelCode, fuelName, eyebrow) {
    const parsed = WildfireFuelData.parseFuelCode(fuelCode);
    const group = parsed.group;
    return `
      <div class="risk-fuel-hero">
        <div class="risk-fuel-hero__head">
          ${renderFuelBadge(fuelCode, 'hero')}
          <div class="risk-fuel-hero__identity">
            <p class="risk-fuel-hero__eyebrow">${eyebrow}</p>
            ${group ? `<p class="risk-fuel-hero__group"><span class="risk-fuel-hero__prefix">${parsed.prefix}</span> = ${group.label}</p>` : ''}
          </div>
        </div>
        <div class="risk-fuel-hero__detail">
          <p class="risk-fuel-hero__name">${fuelName}</p>
          ${group ? `<p class="risk-fuel-hero__hint">${group.short}. Level ${parsed.level} = fuel load within this group (higher is heavier).</p>` : ''}
        </div>
      </div>
    `;
  }

  function renderDirectFuelNote(fire) {
    if (fire.nonBurnable) return '';
    return `
      <div class="risk-site-note risk-site-note--direct">
        ${renderFuelHeroCard(fire.fuelCode, fire.fuelName, 'Fuel at your pin')}
      </div>
    `;
  }

  function renderSiteNote(siteNote) {
    if (!siteNote) return '';
    const { nearest, siteFuel, nearbyFuels } = siteNote;
    const others = nearbyFuels.filter((n) => n.fuel.code !== nearest.fuel.code);
    const nearbyList = others.map((n) => `
      <li class="risk-nearby-item">
        ${renderFuelBadge(n.fuel.code, 'chip')}
        <div class="risk-nearby-item__body">
          <span class="risk-nearby-item__name">${n.fuel.name}</span>
          <span class="risk-nearby-item__meta">~${n.distanceM}m ${n.bearing}</span>
        </div>
      </li>
    `).join('');

    return `
      <div class="risk-site-note">
        <p class="risk-site-note__lede">
          <span class="risk-site-note__lede-top">Your pin maps as ${renderFuelBadge(siteFuel.code, 'pin')}</span>
          <span class="risk-site-note__lede-desc"><span class="risk-site-note__pin-name">${siteFuel.name}</span> — common for homes, driveways, and cleared areas in timber country.</span>
        </p>

        ${renderFuelHeroCard(nearest.fuel.code, nearest.fuel.name, `Nearest burnable fuels · ~${nearest.distanceM}m ${nearest.bearing}`)}

        ${others.length ? `
          <details class="risk-nearby-panel">
            <summary>${others.length} other fuel model${others.length === 1 ? '' : 's'} within ~500m</summary>
            <ul class="risk-nearby-list">${nearbyList}</ul>
          </details>
        ` : ''}
      </div>
    `;
  }

  function renderSeasonalLinks() {
    const links = NOAA_SEASONAL_LINKS.map((item) =>
      `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.label} <i class="fas fa-external-link-alt" aria-hidden="true"></i></a></li>`
    ).join('');
    return `
      <div class="risk-seasonal">
        <h5 class="risk-seasonal__title">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          Monthly &amp; seasonal outlook
        </h5>
        <p class="risk-seasonal__intro">Free forecast data stops at 16 days. For drought trends and longer-range fire-season signals, check NOAA&rsquo;s official outlooks:</p>
        <ul class="risk-seasonal__links">${links}</ul>
      </div>
    `;
  }

  function renderOutlook(outlook) {
    if (!outlook || !outlook.horizonDays) return '';

    const alertsHtml = outlook.alerts.length
      ? `<div class="risk-alerts">${outlook.alerts.map((a) =>
          `<p class="risk-alert"><strong>${a.event}</strong> — ${a.headline || ''}</p>`
        ).join('')}</div>`
      : '';

    const peakHtml = outlook.peakDays.length
      ? `<ul class="risk-outlook-days">${outlook.peakDays.map((day) =>
          `<li class="risk-outlook-days__item risk-outlook-days__item--${day.level}">
            <span class="risk-outlook-days__date">${formatShortDate(day.date)}</span>
            <span class="risk-outlook-days__stats">RH ${fmtNum(day.rhMin, 0)}% · Wind ${fmtNum(day.windMax, 0)} mph · High ${fmtNum(day.tempMax, 0)}°F</span>
          </li>`
        ).join('')}</ul>`
      : '<p class="risk-results__hint">No high-stress days flagged in the next 16 days.</p>';

    return `
      <div class="risk-outlook">
        <h4 class="risk-subscores__title">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>
          16-day fire weather outlook
        </h4>
        <p class="risk-outlook__summary">${outlook.summary}</p>
        ${alertsHtml}
        <p class="risk-outlook__label">Highest-stress days in forecast</p>
        ${peakHtml}
        <p class="risk-outlook__fine">Outlook uses <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a> forecast data and active <a href="https://www.weather.gov/" target="_blank" rel="noopener noreferrer">NWS</a> alerts when issued. 16 days is the practical free limit for daily forecasts.</p>
      </div>
    `;
  }

  function renderScoreHero(risk, weatherSource) {
    const bandKey = risk.band.toLowerCase();
    return `
      <div class="risk-score-hero">
        <div class="risk-score-hero__meter risk-score-hero__meter--${bandKey}" aria-hidden="true">
          <svg viewBox="0 0 120 68" class="risk-gauge">
            <path d="M12 58 A48 48 0 0 1 108 58" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="10" stroke-linecap="round"/>
            <path d="M12 58 A48 48 0 0 1 108 58" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"
              stroke-dasharray="${Math.PI * 48}" stroke-dashoffset="${Math.PI * 48 * (1 - risk.score / 100)}" class="risk-gauge__arc"/>
          </svg>
          <span class="risk-score-hero__number">${risk.score}</span>
        </div>
        <div class="risk-score-hero__meta">
          <span class="${bandClass(risk.band)}">${risk.band} risk</span>
          <p class="risk-score-hero__source">${weatherSource}</p>
        </div>
      </div>
    `;
  }

  function renderKeyMetrics(fire) {
    return `
      <div class="risk-metrics risk-metrics--hero">
        ${metricItem('Spread rate', `${fmtNum(fire.spreadChainsPerHr, 1)} ch/hr`, spreadSeverity(fire.spreadChainsPerHr))}
        ${metricItem('Flame length', `${fmtNum(fire.flameLengthFt, 1)} ft`, flameSeverity(fire.flameLengthFt))}
        ${metricItem('Fuel model', fire.fuelCode, 'neutral')}
        ${metricItem('Slope', `${fmtNum(fire.slopeDeg, 0)}°`, slopeSeverity(fire.slopeDeg))}
      </div>
    `;
  }

  function renderContextBlock(fire, env, elevation, weather) {
    const elevStr = elevation != null ? `${Math.round(elevation * 3.28084)} ft` : '—';
    const canopyLevel = env.canopyPct >= 60 ? 'moderate' : env.canopyPct >= 30 ? 'low' : 'neutral';
    const windLevel = windSeverity(weather.windMph);
    const rhLevel = rhSeverity(weather.rh, true);
    const tempLevel = tempSeverity(weather.tempF);
    const moistureLevel = moistureSeverity(fire.moisture1h);

    return `
      <div class="risk-context-metrics">
        ${metricItem('Elevation', elevStr, 'neutral')}
        ${metricItem('Canopy cover', `${env.canopyPct}%`, canopyLevel)}
      </div>
      <p class="risk-results__conditions">
        Wind <span class="${sevClass(windLevel)}">${fmtNum(weather.windMph, 0)} mph</span>
        · RH <span class="${sevClass(rhLevel)}">${fmtNum(weather.rh, 0)}%</span>
        · Air <span class="${sevClass(tempLevel)}">${fmtNum(weather.tempF, 0)}°F</span>
        · 1-hr fuel moisture <span class="${sevClass(moistureLevel)}">~${fmtNum(fire.moisture1h, 0)}%</span>
      </p>
    `;
  }

  function renderBreakdownPanel(risk) {
    return `
      <details class="risk-breakdown" id="riskBreakdown">
        <summary class="risk-breakdown__toggle">
          <i class="fas fa-chart-bar" aria-hidden="true"></i>
          Score breakdown
        </summary>
        <div class="risk-breakdown__body">
          ${renderSubscores(risk.subscores)}
        </div>
      </details>
    `;
  }

  function riskBandModifier(band) {
    return `risk-results__inner--${band.toLowerCase()}`;
  }

  function renderResults(payload) {
    const { geo, env, fire, risk, weather, elevation, weatherSource, siteNote, outlook } = payload;

    if (fire.nonBurnable && !siteNote) {
      els.results.innerHTML = `
        <div class="risk-results__inner risk-results__inner--nb">
          <p class="risk-results__location">${geo.label}</p>
          <section class="risk-results__hero risk-results__hero--nb" aria-label="Fuel assessment">
            <div class="risk-results__nb-headline">
              <p class="risk-results__eyebrow">Surface fuel assessment</p>
              <h3 class="risk-results__title">Non-burnable at this location</h3>
              <p class="risk-results__fuel"><strong>${fire.fuelCode}</strong> — ${fire.fuelName}</p>
            </div>
          </section>
          <div class="risk-results__mid">
            <div class="risk-results__context">
              <p class="risk-results__hint">Federal fuel maps do not show burnable wildland fuels within ~500m of this pin. That can still happen in very open, agricultural, or lake-front areas.</p>
            </div>
            <div class="risk-results__aside">
              ${renderOutlook(outlook)}
            </div>
          </div>
          <div class="risk-results__foot">
            ${renderSeasonalLinks()}
          </div>
        </div>
      `;
      els.results.classList.add('has-results');
      els.results.hidden = false;
      els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const bandMod = risk ? riskBandModifier(risk.band) : '';
    els.results.innerHTML = `
      <div class="risk-results__inner ${bandMod}">
        <p class="risk-results__location">${geo.label}</p>

        <section class="risk-results__hero" aria-label="Risk score summary">
          ${risk ? renderScoreHero(risk, weatherSource) : ''}
          ${renderKeyMetrics(fire)}
        </section>

        <div class="risk-results__mid">
          <div class="risk-results__context">
            ${siteNote ? renderSiteNote(siteNote) : renderDirectFuelNote(fire)}
            ${renderContextBlock(fire, env, elevation, weather)}
            ${risk ? renderBreakdownPanel(risk) : ''}
          </div>
          <div class="risk-results__aside">
            ${renderOutlook(outlook)}
            ${renderSeasonalLinks()}
          </div>
        </div>
      </div>
    `;
    els.results.classList.add('has-results');
    els.results.hidden = false;
    initCollapsiblePanel(document.getElementById('riskBreakdown'));
    els.results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getWeatherInputs() {
    const custom = els.useCustom.checked;
    if (custom) {
      return {
        windMph: parseFloat(els.wind.value) || 5,
        rh: parseFloat(els.humidity.value) || 40,
        tempF: parseFloat(els.temp.value) || 70,
        source: 'Based on your custom weather inputs'
      };
    }
    if (lastWeather) {
      return { ...lastWeather, source: 'Based on current weather at this location' };
    }
    return { windMph: 5, rh: 40, tempF: 70, source: 'Based on current weather at this location' };
  }

  async function runCalculation(evt) {
    evt.preventDefault();
    if (calculating) return;

    const address = els.address.value.trim();
    if (!address) {
      setStatus('Enter a property address.', 'error');
      return;
    }

    calculating = true;
    els.submit.disabled = true;
    els.results.hidden = true;
    els.results.classList.remove('has-results');

    try {
      setStatus('Finding address…', 'loading');
      const geo = await geocodeAddress(address);

      setStatus('Loading fuels, weather, and 16-day outlook…', 'loading');
      const [fuelCtx, weatherApi, elevation, outlook] = await Promise.all([
        fetchFuelContext(geo.lat, geo.lon),
        fetchWeather(geo.lat, geo.lon),
        fetchElevation(geo.lat, geo.lon),
        fetchFireWeatherOutlook(geo.lat, geo.lon)
      ]);

      lastWeather = weatherApi;
      if (!els.useCustom.checked) {
        els.wind.value = fmtNum(weatherApi.windMph, 1);
        els.humidity.value = fmtNum(weatherApi.rh, 0);
        els.temp.value = fmtNum(weatherApi.tempF, 0);
      }

      const weather = getWeatherInputs();
      const moisture = estimateMoisture(weather.rh, weather.tempF);
      const analysis = fuelCtx.analysis;
      const fire = runRothermel(analysis.fuel, moisture, weather.windMph, analysis.slopeDeg);

      let risk = null;
      if (!fire.nonBurnable) {
        risk = computeRiskScore(fire, weather.rh, weather.windMph);
      }

      const weatherSource = fuelCtx.siteNote
        ? `${weather.source} · Score uses nearest wildland fuels`
        : weather.source;

      setStatus('', '');
      renderResults({
        geo,
        env: fuelCtx.site,
        fire,
        risk,
        weather,
        elevation,
        weatherSource,
        siteNote: fuelCtx.siteNote,
        outlook
      });
    } catch (err) {
      setStatus(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      calculating = false;
      els.submit.disabled = false;
    }
  }

  // --- Address autocomplete (Nominatim, debounced) ---

  function highlightMatch(text, query) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + query.length);
    const after = text.slice(idx + query.length);
    return `${before}<mark>${match}</mark>${after}`;
  }

  function hideSuggestions() {
    if (!els.suggestions) return;
    els.suggestions.hidden = true;
    els.suggestions.innerHTML = '';
    suggestIndex = -1;
    els.address.setAttribute('aria-expanded', 'false');
  }

  function selectSuggestion(item) {
    els.address.value = item.display_name;
    hideSuggestions();
    els.address.focus();
  }

  async function fetchSuggestions(query) {
    if (suggestAbort) suggestAbort.abort();
    suggestAbort = new AbortController();

    const params = new URLSearchParams({
      q: query,
      format: 'json',
      addressdetails: '0',
      limit: '6',
      countrycodes: 'us'
    });

    const res = await fetch(`${CONFIG.geocoderUrl}?${params}`, {
      headers: { Accept: 'application/json', 'User-Agent': CONFIG.geocoderAgent },
      signal: suggestAbort.signal
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  function renderSuggestions(items, query) {
    if (!els.suggestions) return;
    if (!items.length) {
      hideSuggestions();
      return;
    }

    els.suggestions.innerHTML = items.map((item, i) =>
      `<li class="risk-suggestions__item" role="option" id="suggest-${i}" data-index="${i}">${highlightMatch(item.display_name, query)}</li>`
    ).join('');
    els.suggestions.hidden = false;
    els.address.setAttribute('aria-expanded', 'true');
    suggestIndex = -1;
  }

  function onAddressInput() {
    const query = els.address.value.trim();
    clearTimeout(suggestTimer);

    if (query.length < 4) {
      hideSuggestions();
      return;
    }

    suggestTimer = setTimeout(async () => {
      if (query === lastSuggestQuery) return;
      lastSuggestQuery = query;
      try {
        const items = await fetchSuggestions(query);
        if (els.address.value.trim() !== query) return;
        renderSuggestions(items, query);
      } catch (err) {
        if (err.name !== 'AbortError') hideSuggestions();
      }
    }, 400);
  }

  function onAddressKeydown(evt) {
    if (!els.suggestions || els.suggestions.hidden) return;
    const options = els.suggestions.querySelectorAll('.risk-suggestions__item');
    if (!options.length) return;

    if (evt.key === 'ArrowDown') {
      evt.preventDefault();
      suggestIndex = Math.min(suggestIndex + 1, options.length - 1);
    } else if (evt.key === 'ArrowUp') {
      evt.preventDefault();
      suggestIndex = Math.max(suggestIndex - 1, 0);
    } else if (evt.key === 'Enter' && suggestIndex >= 0) {
      evt.preventDefault();
      const text = options[suggestIndex].textContent;
      els.address.value = text;
      hideSuggestions();
      return;
    } else if (evt.key === 'Escape') {
      hideSuggestions();
      return;
    } else {
      return;
    }

    options.forEach((opt, i) => {
      opt.classList.toggle('risk-suggestions__item--active', i === suggestIndex);
      if (i === suggestIndex) opt.scrollIntoView({ block: 'nearest' });
    });
  }

  function initCollapsiblePanel(panel) {
    if (!panel) return;
    const mq = window.matchMedia('(min-width: 961px)');

    const sync = () => {
      if (mq.matches) {
        panel.setAttribute('open', '');
      }
    };

    sync();
    if (!panel.dataset.collapsibleInit) {
      panel.dataset.collapsibleInit = '1';
      mq.addEventListener('change', sync);
    }
  }

  function initGuidePanel() {
    initCollapsiblePanel(els.guide);
  }

  const SCORE_PIE_FACTORS = [
    {
      id: 'spread',
      label: 'Spread rate',
      pct: 40,
      color: '#d45a2a',
      start: 0,
      end: 0.4,
      image: 'assets/images/wildfire-risk/score-spread-rate.jpeg',
      imageAlt: 'Surface wildfire spreading across dry grass and shrubs',
      blurb: 'Ground speed of the fire front',
      text: 'How fast surface fire could move across the ground under current fuels, weather, and slope. We estimate this with the Rothermel surface spread model — the same family of formulas used in professional fire-behavior tools.',
      takeaway: 'Faster spread gives firefighters less time to react and can cross driveways or setbacks before defenses are ready.'
    },
    {
      id: 'flame',
      label: 'Flame length',
      pct: 30,
      color: '#e8a030',
      start: 0.4,
      end: 0.7,
      image: 'assets/images/wildfire-risk/score-flame-length.png',
      imageAlt: 'Wildland firefighters near flames in forest fuels',
      blurb: 'Height of flames at the leading edge',
      text: 'Estimated flame length comes from fire intensity given your fuel model and conditions. It is a practical read on how hard the fire is to work near on the ground.',
      takeaway: 'Taller flames preheat trees and structures, throw embers farther, and often mean you need wider defensible space — not just a quick rake pass.'
    },
    {
      id: 'slope',
      label: 'Slope',
      pct: 20,
      color: '#58a07a',
      start: 0.7,
      end: 0.9,
      image: 'assets/images/wildfire-risk/score-slope.png',
      imageAlt: 'Hillside home above timber with sloped terrain',
      blurb: 'Steepness of terrain at your pin',
      text: 'Fire accelerates uphill because slopes preheat fuels above the flame front. We read slope from the same federal fuel-layer maps that define your vegetation type.',
      takeaway: 'A home on a moderate hillside above timber can score higher than a flat lawn nearby — even when the address is only a few hundred yards away.'
    },
    {
      id: 'weather',
      label: 'Weather stress',
      pct: 10,
      color: '#4a8fd4',
      start: 0.9,
      end: 1,
      image: 'assets/images/wildfire-risk/score-weather.png',
      imageAlt: 'Dry windy afternoon over western rangeland',
      blurb: 'Wind and humidity right now',
      text: 'A smaller slice based on live wind and relative humidity. Dry, breezy afternoons nudge the score up; calm, humid weather pulls it down.',
      takeaway: 'Weather can change your score day to day. Fuels and slope set the baseline — weather is the accelerator when things get extreme.'
    }
  ];

  const SCORE_PIE_DEFAULT = SCORE_PIE_FACTORS[0];

  function pieSlicePath(cx, cy, rOuter, rInner, startRatio, endRatio) {
    const start = startRatio * 360;
    const end = endRatio * 360;
    const large = end - start > 180 ? 1 : 0;

    const polar = (r, deg) => {
      const rad = (deg - 90) * Math.PI / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    const p1 = polar(rOuter, start);
    const p2 = polar(rOuter, end);
    const p3 = polar(rInner, end);
    const p4 = polar(rInner, start);

    return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
  }

  function initScorePie() {
    const mix = document.getElementById('wildfireScoreMix');
    const explainer = document.getElementById('pieExplainer');
    const legend = document.getElementById('pieLegend');
    const svg = mix && mix.querySelector('.wildfire-pie__svg');
    if (!mix || !explainer || !legend || !svg) return;

    const renderFactorCard = (factor) => `
      <article class="wildfire-pie-explainer__card wildfire-pie-explainer__card--${factor.id}">
        <figure class="wildfire-pie-explainer__figure">
          <img class="wildfire-pie-explainer__photo" src="${factor.image}" alt="${factor.imageAlt}" width="960" height="540" loading="eager" decoding="async">
        </figure>
        <div class="wildfire-pie-explainer__copy">
          <p class="wildfire-pie-explainer__title" style="color:${factor.color}">${factor.label} · ${factor.pct}%</p>
          <p class="wildfire-pie-explainer__blurb">${factor.blurb}</p>
          <p class="wildfire-pie-explainer__text">${factor.text}</p>
          <p class="wildfire-pie-explainer__takeaway"><strong>Why it matters:</strong> ${factor.takeaway}</p>
        </div>
      </article>
    `;

    const showFactor = (factor) => {
      explainer.innerHTML = renderFactorCard(factor);
      legend.querySelectorAll('.wildfire-pie__legend-item').forEach((el) => {
        el.classList.toggle('wildfire-pie__legend-item--active', el.dataset.factor === factor.id);
      });
      svg.querySelectorAll('.wildfire-pie__slice').forEach((el) => {
        el.classList.toggle('wildfire-pie__slice--active', el.dataset.factor === factor.id);
      });
    };

    const onFactorActivate = (factor, evt) => {
      if (evt && evt.type === 'keydown' && evt.key !== 'Enter' && evt.key !== ' ') return;
      if (evt && evt.type === 'keydown') evt.preventDefault();
      showFactor(factor);
    };

    SCORE_PIE_FACTORS.forEach((factor) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pieSlicePath(50, 50, 42, 26, factor.start, factor.end));
      path.setAttribute('fill', factor.color);
      path.setAttribute('class', 'wildfire-pie__slice');
      path.dataset.factor = factor.id;
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', `${factor.label}, ${factor.pct}% of score`);
      path.addEventListener('mouseenter', () => showFactor(factor));
      path.addEventListener('focus', () => showFactor(factor));
      path.addEventListener('click', (evt) => onFactorActivate(factor, evt));
      path.addEventListener('keydown', (evt) => onFactorActivate(factor, evt));
      svg.appendChild(path);

      const li = document.createElement('li');
      li.className = `wildfire-pie__legend-item wildfire-pie__legend-item--${factor.id}`;
      li.dataset.factor = factor.id;
      li.innerHTML = `
        <span class="wildfire-pie__swatch"></span>
        <span class="wildfire-pie__legend-label">${factor.label}</span>
        <span class="wildfire-pie__legend-pct">${factor.pct}%</span>
      `;
      li.addEventListener('mouseenter', () => showFactor(factor));
      li.addEventListener('focus', () => showFactor(factor));
      li.addEventListener('click', (evt) => onFactorActivate(factor, evt));
      li.addEventListener('keydown', (evt) => onFactorActivate(factor, evt));
      li.setAttribute('tabindex', '0');
      li.setAttribute('role', 'button');
      legend.appendChild(li);
    });

    mix.addEventListener('mouseleave', (evt) => {
      if (!mix.contains(evt.relatedTarget)) showFactor(SCORE_PIE_DEFAULT);
    });

    showFactor(SCORE_PIE_DEFAULT);

    SCORE_PIE_FACTORS.forEach((factor) => {
      const preload = new Image();
      preload.src = factor.image;
    });

    if (els.guide) {
      els.guide.addEventListener('toggle', () => {
        if (els.guide.open) showFactor(SCORE_PIE_DEFAULT);
      });
    }
  }

  if (els.form) {
    els.form.addEventListener('submit', runCalculation);
    els.useCustom.addEventListener('change', () => {
      els.advanced.classList.toggle('risk-advanced--custom', els.useCustom.checked);
    });
  }

  if (els.address && els.suggestions) {
    els.address.addEventListener('input', onAddressInput);
    els.address.addEventListener('keydown', onAddressKeydown);
    els.address.addEventListener('blur', () => {
      setTimeout(hideSuggestions, 180);
    });
    els.suggestions.addEventListener('mousedown', (evt) => {
      const item = evt.target.closest('.risk-suggestions__item');
      if (!item) return;
      evt.preventDefault();
      els.address.value = item.textContent;
      hideSuggestions();
    });
  }

  initGuidePanel();
  initScorePie();
})();

/**
 * Scott & Burgan (2005) FBFM40 fuel model parameters.
 * Loads in tons/acre; depth in feet; mx = dead fuel moisture of extinction (%).
 */
(function (global) {
  const TPA = 2000 / 43560; // tons/acre → lb/ft²

  const FBFM40_VALUE_MAP = {
    '-9999': null,
    91: 'NB1', 92: 'NB2', 93: 'NB3', 98: 'NB8', 99: 'NB9',
    101: 'GR1', 102: 'GR2', 103: 'GR3', 104: 'GR4', 105: 'GR5',
    106: 'GR6', 107: 'GR7', 108: 'GR8', 109: 'GR9',
    121: 'GS1', 122: 'GS2', 123: 'GS3', 124: 'GS4',
    141: 'SH1', 142: 'SH2', 143: 'SH3', 144: 'SH4', 145: 'SH5',
    146: 'SH6', 147: 'SH7', 148: 'SH8', 149: 'SH9',
    161: 'TU1', 162: 'TU2', 163: 'TU3', 164: 'TU4', 165: 'TU5',
    181: 'TL1', 182: 'TL2', 183: 'TL3', 184: 'TL4', 185: 'TL5',
    186: 'TL6', 187: 'TL7', 188: 'TL8', 189: 'TL9',
    201: 'SB1', 202: 'SB2', 203: 'SB3', 204: 'SB4'
  };

  const RAW = {
    NB1: { name: 'Urban / Developed', nb: true },
    NB2: { name: 'Snow / Ice', nb: true },
    NB3: { name: 'Agricultural (non-burnable)', nb: true },
    NB8: { name: 'Open Water', nb: true },
    NB9: { name: 'Barren', nb: true },
    GR1: { name: 'Short, sparse dry climate grass', load: [0.1, 0, 0, 0.3, 0], sav1: 2200, savH: 2000, savW: 9999, depth: 0.4, mx: 15 },
    GR2: { name: 'Low load dry climate grass', load: [0.1, 0, 0, 1.0, 0], sav1: 2000, savH: 1800, savW: 9999, depth: 1.0, mx: 15 },
    GR3: { name: 'Low load, very coarse grass', load: [0.1, 0.4, 0, 1.5, 0], sav1: 1500, savH: 1300, savW: 9999, depth: 2.0, mx: 30 },
    GR4: { name: 'Moderate load dry climate grass', load: [0.3, 0, 0, 1.9, 0], sav1: 2000, savH: 1800, savW: 9999, depth: 2.0, mx: 15 },
    GR5: { name: 'Low load humid climate grass', load: [0.1, 0, 0, 2.5, 0], sav1: 2000, savH: 1800, savW: 9999, depth: 1.5, mx: 40 },
    GR6: { name: 'Moderate load humid climate grass', load: [0.1, 0, 0, 3.4, 0], sav1: 1800, savH: 1600, savW: 9999, depth: 2.0, mx: 40 },
    GR7: { name: 'High load dry climate grass', load: [1.0, 0, 0, 5.4, 0], sav1: 2000, savH: 1800, savW: 9999, depth: 3.0, mx: 15 },
    GR8: { name: 'High load very coarse humid grass', load: [0.5, 0, 0, 6.4, 0], sav1: 1500, savH: 1300, savW: 9999, depth: 4.0, mx: 30 },
    GR9: { name: 'High load humid climate grass', load: [0.5, 0, 0, 7.7, 0], sav1: 1800, savH: 1600, savW: 9999, depth: 5.0, mx: 40 },
    GS1: { name: 'Low load dry climate grass-shrub', load: [0.2, 0, 0, 0.5, 0.7], sav1: 2000, savH: 1800, savW: 1800, depth: 0.9, mx: 15 },
    GS2: { name: 'Moderate load dry climate grass-shrub', load: [0.5, 0.5, 0, 0.6, 1.0], sav1: 2000, savH: 1800, savW: 1800, depth: 1.5, mx: 15 },
    GS3: { name: 'Moderate load humid climate grass-shrub', load: [0.3, 0.5, 0, 1.0, 1.4], sav1: 1800, savH: 1600, savW: 1600, depth: 2.0, mx: 40 },
    GS4: { name: 'High load humid climate grass-shrub', load: [1.0, 1.0, 0, 1.5, 2.2], sav1: 1800, savH: 1600, savW: 1600, depth: 2.5, mx: 40 },
    SH1: { name: 'Low load dry climate shrub', load: [0.2, 0, 0, 0, 0.5], sav1: 2000, savH: 9999, savW: 1600, depth: 1.0, mx: 15 },
    SH2: { name: 'Moderate load dry climate shrub', load: [0.3, 0.3, 0, 0, 1.3], sav1: 2000, savH: 9999, savW: 1600, depth: 1.0, mx: 15 },
    SH3: { name: 'Moderate load humid climate shrub', load: [0.5, 0.5, 0, 0, 2.3], sav1: 1800, savH: 9999, savW: 1400, depth: 2.0, mx: 40 },
    SH4: { name: 'Low load humid climate shrub', load: [0.2, 0.3, 0.1, 0, 1.0], sav1: 1800, savH: 9999, savW: 1400, depth: 2.0, mx: 40 },
    SH5: { name: 'High load dry climate shrub', load: [0.5, 0.5, 0, 0, 2.5], sav1: 2000, savH: 9999, savW: 1600, depth: 2.0, mx: 15 },
    SH6: { name: 'High load humid climate shrub', load: [0.5, 0.5, 0, 0, 3.4], sav1: 1800, savH: 9999, savW: 1400, depth: 3.0, mx: 40 },
    SH7: { name: 'Very high load dry climate shrub', load: [1.0, 1.0, 0, 0, 4.5], sav1: 2000, savH: 9999, savW: 1600, depth: 4.0, mx: 15 },
    SH8: { name: 'Very high load humid climate shrub', load: [1.0, 1.0, 0, 0, 6.0], sav1: 1800, savH: 9999, savW: 1400, depth: 5.0, mx: 40 },
    SH9: { name: 'High load humid climate tundra shrub', load: [1.5, 1.5, 0, 0, 7.0], sav1: 1600, savH: 9999, savW: 1200, depth: 5.0, mx: 40 },
    TU1: { name: 'Low load dry climate timber-grass-shrub', load: [0.2, 0.5, 0, 0.5, 0.5], sav1: 2000, savH: 1800, savW: 1600, depth: 0.6, mx: 20 },
    TU2: { name: 'Moderate load dry climate timber-shrub', load: [0.5, 0.5, 0, 0.5, 1.0], sav1: 2000, savH: 1800, savW: 1600, depth: 1.0, mx: 20 },
    TU3: { name: 'Moderate load humid climate timber-grass-shrub', load: [0.5, 1.0, 0, 0.5, 2.0], sav1: 1800, savH: 1600, savW: 1400, depth: 2.0, mx: 30 },
    TU4: { name: 'Dormant brush, hardwood slash', load: [1.0, 1.0, 0, 0, 1.5], sav1: 1800, savH: 9999, savW: 1400, depth: 2.0, mx: 15 },
    TU5: { name: 'High load humid climate timber-shrub', load: [1.0, 1.0, 0, 1.0, 3.0], sav1: 1800, savH: 1600, savW: 1400, depth: 3.0, mx: 30 },
    TL1: { name: 'Low load compact conifer litter', load: [1.0, 2.0, 3.0, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 0.2, mx: 20 },
    TL2: { name: 'Low load broadleaf litter', load: [1.4, 2.3, 2.0, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 0.2, mx: 25 },
    TL3: { name: 'Moderate load conifer litter', load: [1.5, 4.5, 5.5, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 0.3, mx: 20 },
    TL4: { name: 'Small downed logs', load: [2.0, 3.0, 5.0, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 0.4, mx: 25 },
    TL5: { name: 'Long-needle conifer litter', load: [2.0, 1.0, 3.0, 0, 0], sav1: 1500, savH: 9999, savW: 9999, depth: 0.6, mx: 20 },
    TL6: { name: 'High load conifer litter', load: [2.5, 2.5, 5.0, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 0.5, mx: 20 },
    TL7: { name: 'Large downed logs', load: [3.0, 3.0, 5.0, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 0.6, mx: 25 },
    TL8: { name: 'Long-needle litter (high load)', load: [5.0, 5.0, 8.0, 0, 0], sav1: 1500, savH: 9999, savW: 9999, depth: 0.8, mx: 20 },
    TL9: { name: 'Very high load conifer litter', load: [7.0, 7.0, 8.0, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 0.9, mx: 20 },
    SB1: { name: 'Low load activity fuel', load: [1.5, 3.0, 4.0, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 1.0, mx: 15 },
    SB2: { name: 'Moderate load activity fuel', load: [2.5, 2.5, 2.0, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 1.0, mx: 20 },
    SB3: { name: 'High load activity fuel', load: [3.0, 3.0, 3.0, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 1.5, mx: 20 },
    SB4: { name: 'High load blowdown', load: [4.0, 4.0, 3.0, 0, 0], sav1: 2000, savH: 9999, savW: 9999, depth: 2.0, mx: 20 }
  };

  const FUEL_MODELS = {};
  Object.keys(RAW).forEach((code) => {
    const r = RAW[code];
    if (r.nb) {
      FUEL_MODELS[code] = { code, name: r.name, nonBurnable: true };
      return;
    }
    FUEL_MODELS[code] = {
      code,
      name: r.name,
      nonBurnable: false,
      depth: r.depth,
      mx: r.mx,
      heatDead: 8000,
      heatLive: 8000,
      loadLbFt2: r.load.map((v) => v * TPA),
      sav: [r.sav1, 109, 30, r.savH, r.savW]
    };
  });

  const FUEL_CODE_GROUPS = {
    GR: { label: 'Grass', short: 'Open grass with little woody cover' },
    GS: { label: 'Grass–Shrub', short: 'Mixed grass and low shrubs' },
    SH: { label: 'Shrub', short: 'Shrub-dominated surface fuels' },
    TU: { label: 'Timber–Understory', short: 'Forest canopy with grass, shrub, or slash understory' },
    TL: { label: 'Timber–Litter', short: 'Forest litter and woody ground fuels' },
    SB: { label: 'Slash & Blowdown', short: 'Logging slash, activity fuels, or blowdown' },
    NB: { label: 'Non-burnable', short: 'Urban, water, agriculture, or barren ground' }
  };

  function parseFuelCode(code) {
    const match = /^([A-Z]{2})(\d)$/.exec(String(code || '').toUpperCase());
    if (!match) {
      return { code: code || '', prefix: '', level: '', group: null };
    }
    const prefix = match[1];
    return {
      code: `${prefix}${match[2]}`,
      prefix,
      level: match[2],
      group: FUEL_CODE_GROUPS[prefix] || null
    };
  }

  global.WildfireFuelData = {
    FBFM40_VALUE_MAP,
    FUEL_MODELS,
    FUEL_CODE_GROUPS,
    parseFuelCode,
    mapLandfireValue(value) {
      const key = String(value);
      const code = FBFM40_VALUE_MAP[key];
      if (!code) return null;
      return FUEL_MODELS[code] || null;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);

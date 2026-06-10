/**
 * Plant & Tree Identifier — Givens Fire and Forestry
 * Pl@ntNet API v2
 */
(function () {
  'use strict';

  // Pl@ntNet TDWG flora for North-Central U.S. — includes Montana natives (no state-level project exists).
  const PLANTNET_PROJECT = 'k-north-central-u-s-a';
  const API_BASE = 'https://my-api.plantnet.org/v2/identify/' + PLANTNET_PROJECT;
  const MAX_DIMENSION = 1280;
  const JPEG_QUALITY = 0.9;
  const TOP_RESULTS = 3;
  const MAX_PHOTOS = 5;
  const QUOTA_WARN_THRESHOLD = 50;

  const GENERIC_NOTE = {
    risk: 'unknown',
    riskLabel: 'No data on file',
    displayName: null,
    note: 'No fire risk data on file for this species in our Montana library yet. We cover conifers, native shrubs, invasive weeds, rangeland grasses, and common landscape plants \u2014 but not every species. Contact us for an on-site assessment.'
  };

  const RISK_RANK = {
    extreme: 5,
    very_high: 4,
    high: 3,
    moderate: 2,
    low: 1,
    unknown: 0
  };

  const FIRE_RISK_SPECIES = window.PLANT_IDENTIFIER_SPECIES || [];

  const CTA_BY_RISK = {
    extreme: {
      lead: 'This species is a fire hazard near structures.',
      action: 'Get a free defensible space quote',
      href: 'contact.html',
      className: 'plant-cta--high'
    },
    very_high: {
      lead: 'This species is a fire hazard near structures.',
      action: 'Get a free defensible space quote',
      href: 'contact.html',
      className: 'plant-cta--high'
    },
    high: {
      lead: 'This species is a fire hazard near structures.',
      action: 'Get a free defensible space quote',
      href: 'contact.html',
      className: 'plant-cta--high'
    },
    moderate: {
      lead: 'Want an on-site assessment?',
      action: 'Get a free quote',
      href: 'contact.html',
      className: 'plant-cta--moderate'
    },
    low: {
      lead: 'Questions about your property\u2019s fire risk?',
      action: 'Free defensible space consultations',
      href: 'contact.html',
      className: 'plant-cta--low'
    },
    unknown: {
      lead: 'Want an on-site assessment?',
      action: 'Get a free quote',
      href: 'contact.html',
      className: 'plant-cta--moderate'
    }
  };

  const els = {
    cameraInput: document.getElementById('plantCameraInput'),
    fileInput: document.getElementById('plantFileInput'),
    uploadSection: document.getElementById('plantUploadSection'),
    dropzoneTitle: document.getElementById('plantDropzoneTitle'),
    dropzoneIcon: document.getElementById('plantDropzoneIcon'),
    cameraLabel: document.getElementById('plantCameraLabel'),
    fileLabel: document.getElementById('plantFileLabel'),
    photoQueue: document.getElementById('plantPhotoQueue'),
    photoList: document.getElementById('plantPhotoList'),
    photoCount: document.getElementById('plantPhotoCount'),
    uploadActions: document.getElementById('plantUploadActions'),
    submitRow: document.getElementById('plantSubmitRow'),
    identifyBtn: document.getElementById('plantIdentifyBtn'),
    loadingPanel: document.getElementById('plantLoadingPanel'),
    loadingPreview: document.getElementById('plantLoadingPreview'),
    loadingHint: document.getElementById('plantLoadingHint'),
    resultsPanel: document.getElementById('plantResultsPanel'),
    resultsList: document.getElementById('plantResultsList'),
    resultPhotos: document.getElementById('plantResultPhotos'),
    ctaPanel: document.getElementById('plantCtaPanel'),
    errorPanel: document.getElementById('plantErrorPanel'),
    errorMessage: document.getElementById('plantErrorMessage'),
    tryAgainBtn: document.getElementById('plantTryAgain'),
    tryAgainErrorBtn: document.getElementById('plantTryAgainError'),
    quotaNotice: document.getElementById('plantQuotaNotice')
  };

  let photoQueue = [];
  let nextPhotoId = 0;
  let resultPreviewUrls = [];

  function getApiKey() {
    const cfg = window.PLANT_IDENTIFIER_CONFIG || {};
    const key = cfg.PLANTNET_API_KEY;
    return typeof key === 'string' && key.trim().length > 0 ? key.trim() : '';
  }

  function loadImageFromFile(file) {
    return new Promise(function (resolve, reject) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('Could not read that image. Try a different photo.'));
      };
      img.src = url;
    });
  }

  function scaleDimensions(width, height, maxSize) {
    if (width <= maxSize && height <= maxSize) {
      return { width: width, height: height };
    }
    if (width >= height) {
      return { width: maxSize, height: Math.round(height * (maxSize / width)) };
    }
    return { width: Math.round(width * (maxSize / height)), height: maxSize };
  }

  function compressImage(file) {
    return loadImageFromFile(file).then(function (img) {
      const dims = scaleDimensions(img.naturalWidth, img.naturalHeight, MAX_DIMENSION);
      const canvas = document.createElement('canvas');
      canvas.width = dims.width;
      canvas.height = dims.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, dims.width, dims.height);
      return new Promise(function (resolve, reject) {
        canvas.toBlob(function (blob) {
          if (!blob) {
            reject(new Error('Could not compress that image. Try another photo.'));
            return;
          }
          resolve(new File([blob], 'plant-photo.jpg', { type: 'image/jpeg' }));
        }, 'image/jpeg', JPEG_QUALITY);
      });
    });
  }

  function normalizeText(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function speciesHaystack(result) {
    const species = result.species || {};
    const parts = [
      species.scientificNameWithoutAuthor,
      species.scientificName,
      species.genus && species.genus.scientificNameWithoutAuthor,
      species.genus && species.genus.scientificName
    ];
    if (Array.isArray(species.commonNames)) {
      parts.push.apply(parts, species.commonNames);
    }
    return parts.map(normalizeText).filter(Boolean);
  }

  function matchScore(haystack, entry) {
    let best = 0;
    entry.names.forEach(function (name) {
      const needle = normalizeText(name);
      if (!needle) return;
      haystack.forEach(function (candidate) {
        if (!candidate) return;
        if (candidate === needle) {
          best = Math.max(best, 200 + needle.length);
        } else if (candidate.indexOf(needle) !== -1) {
          best = Math.max(best, 100 + needle.length);
        } else if (needle.length >= 5 && needle.indexOf(candidate) !== -1) {
          best = Math.max(best, 50 + candidate.length);
        }
      });
    });
    return best;
  }

  function lookupFireRisk(result) {
    const haystack = speciesHaystack(result);
    let bestEntry = null;
    let bestScore = 0;

    for (let i = 0; i < FIRE_RISK_SPECIES.length; i++) {
      const score = matchScore(haystack, FIRE_RISK_SPECIES[i]);
      if (score > bestScore) {
        bestScore = score;
        bestEntry = FIRE_RISK_SPECIES[i];
      }
    }

    return bestScore > 0 ? bestEntry : GENERIC_NOTE;
  }

  function getCommonName(result) {
    const species = result.species || {};
    if (Array.isArray(species.commonNames) && species.commonNames.length) {
      return species.commonNames[0];
    }
    return species.scientificNameWithoutAuthor || 'Unknown species';
  }

  function getScientificName(result) {
    const species = result.species || {};
    const base = species.scientificNameWithoutAuthor || '';
    const auth = species.scientificNameAuthorship || '';
    if (base && auth) {
      return base + ' ' + auth;
    }
    return species.scientificName || base || 'Unknown';
  }

  function formatConfidence(score) {
    const pct = Math.round(Math.max(0, Math.min(1, score)) * 100);
    return pct + '% match';
  }

  function riskClassName(risk) {
    if (risk === 'extreme' || risk === 'very_high' || risk === 'high') return 'plant-result--high';
    if (risk === 'moderate') return 'plant-result--moderate';
    if (risk === 'low') return 'plant-result--low';
    return 'plant-result--unknown';
  }

  function riskBadgeClass(risk) {
    if (risk === 'extreme' || risk === 'very_high' || risk === 'high') return 'plant-badge--high';
    if (risk === 'moderate') return 'plant-badge--moderate';
    if (risk === 'low') return 'plant-badge--low';
    return 'plant-badge--unknown';
  }

  function riskBadgeIcon(risk) {
    if (risk === 'extreme' || risk === 'very_high' || risk === 'high') return 'fa-fire';
    if (risk === 'moderate') return 'fa-triangle-exclamation';
    if (risk === 'low') return 'fa-shield-halved';
    return 'fa-circle-question';
  }

  function confidencePercent(score) {
    return Math.round(Math.max(0, Math.min(1, score)) * 100);
  }

  function showPanel(panel) {
    ['uploadSection', 'loadingPanel', 'resultsPanel', 'errorPanel'].forEach(function (key) {
      if (els[key]) {
        els[key].hidden = els[key] !== panel;
      }
    });
    if (els.ctaPanel) {
      els.ctaPanel.hidden = panel !== els.resultsPanel;
    }
  }

  function showError(message) {
    if (!els.errorPanel) return;
    const detail = message && String(message).trim()
      ? String(message).trim()
      : 'Something went wrong. Please try again.';
    if (els.errorMessage) {
      els.errorMessage.innerHTML =
        '<span class="plant-error__lead">Couldn\u2019t identify that photo</span>' +
        escapeHtml(detail);
    }
    showPanel(els.errorPanel);
  }

  function resetInputs() {
    if (els.cameraInput) els.cameraInput.value = '';
    if (els.fileInput) els.fileInput.value = '';
  }

  function isImageFile(file) {
    return file && file.type && file.type.indexOf('image/') === 0;
  }

  function revokeResultPreviews() {
    resultPreviewUrls.forEach(function (url) {
      URL.revokeObjectURL(url);
    });
    resultPreviewUrls = [];
  }

  function clearPhotoQueue() {
    photoQueue.forEach(function (item) {
      URL.revokeObjectURL(item.previewUrl);
    });
    photoQueue = [];
    renderPhotoQueue();
  }

  function renderPhotoQueue() {
    const count = photoQueue.length;
    const atMax = count >= MAX_PHOTOS;

    if (els.photoQueue) els.photoQueue.hidden = count === 0;
    if (els.submitRow) els.submitRow.hidden = count === 0;
    if (els.uploadActions) els.uploadActions.hidden = atMax;
    if (els.dropzoneIcon) els.dropzoneIcon.hidden = count > 0;

    if (els.dropzoneTitle) {
      if (count === 0) {
        els.dropzoneTitle.textContent = 'Add plant photos';
      } else if (atMax) {
        els.dropzoneTitle.textContent = 'Ready to identify';
      } else {
        els.dropzoneTitle.textContent = 'Add another photo';
      }
    }

    if (els.photoCount) {
      els.photoCount.textContent = count + ' of ' + MAX_PHOTOS + ' photos';
    }

    if (els.cameraLabel) {
      els.cameraLabel.textContent = count === 0 ? 'Take Photo' : 'Add Photo';
    }
    if (els.fileLabel) {
      els.fileLabel.textContent = count === 0 ? 'Upload Photos' : 'Add More';
    }

    if (!els.photoList) return;

    els.photoList.innerHTML = photoQueue.map(function (item, index) {
      return (
        '<li class="plant-photo-queue__item">' +
          '<img src="' + item.previewUrl + '" alt="Queued photo ' + (index + 1) + '" width="88" height="66">' +
          '<button type="button" class="plant-photo-queue__remove" data-photo-id="' + item.id + '" aria-label="Remove photo ' + (index + 1) + '">' +
            '<i class="fas fa-times" aria-hidden="true"></i>' +
          '</button>' +
        '</li>'
      );
    }).join('');
  }

  function addPhotosToQueue(fileList) {
    const incoming = Array.prototype.slice.call(fileList || []).filter(isImageFile);
    if (!incoming.length) {
      showError('Please choose a photo (JPG or PNG).');
      return;
    }

    const room = MAX_PHOTOS - photoQueue.length;
    if (room <= 0) return;

    incoming.slice(0, room).forEach(function (file) {
      photoQueue.push({
        id: nextPhotoId++,
        file: file,
        previewUrl: URL.createObjectURL(file)
      });
    });

    renderPhotoQueue();
  }

  function removePhotoFromQueue(photoId) {
    const id = Number(photoId);
    const index = photoQueue.findIndex(function (item) {
      return item.id === id;
    });
    if (index === -1) return;
    URL.revokeObjectURL(photoQueue[index].previewUrl);
    photoQueue.splice(index, 1);
    renderPhotoQueue();
  }

  function buildFormData(files) {
    const form = new FormData();
    files.forEach(function (file) {
      form.append('images', file);
      form.append('organs', 'auto');
    });
    return form;
  }

  function compressImages(files) {
    return Promise.all(files.map(compressImage));
  }

  function buildIdentifyUrl(apiKey) {
    const params = new URLSearchParams();
    params.set('api-key', apiKey);
    params.set('lang', 'en');
    params.set('include-related-images', 'false');
    params.set('no-reject', 'true');
    params.set('nb-results', String(TOP_RESULTS));
    return API_BASE + '?' + params.toString();
  }

  function updateQuotaNotice(remaining) {
    if (!els.quotaNotice) return;
    if (typeof remaining === 'number' && remaining >= 0 && remaining <= QUOTA_WARN_THRESHOLD) {
      els.quotaNotice.hidden = false;
      els.quotaNotice.textContent = remaining === 0
        ? 'Daily identification limit reached \u2014 check back tomorrow.'
        : remaining + ' identifications left today on our shared quota.';
      return;
    }
    els.quotaNotice.hidden = true;
    els.quotaNotice.textContent = '';
  }

  function identifyPlant(files) {
    const apiKey = getApiKey();
    if (!apiKey) {
      return Promise.reject(new Error('Plant identification is not configured yet. Please check back soon.'));
    }

    const url = buildIdentifyUrl(apiKey);
    const formData = buildFormData(files);

    return fetch(url, { method: 'POST', body: formData }).then(function (response) {
      return response.json().catch(function () {
        return {};
      }).then(function (data) {
        if (typeof data.remainingIdentificationRequests === 'number') {
          updateQuotaNotice(data.remainingIdentificationRequests);
        }
        if (response.status === 429) {
          updateQuotaNotice(0);
          throw new Error('Our plant ID tool has hit its daily limit \u2014 check back tomorrow!');
        }
        if (response.status < 200 || response.status >= 300) {
          throw new Error(apiErrorMessage(response.status, data));
        }
        if (!data || !Array.isArray(data.results) || !data.results.length) {
          throw new Error('No matches found. Try a clearer photo of leaves, bark, or the whole plant.');
        }
        return data;
      });
    });
  }

  function apiErrorMessage(status, data) {
    const raw = data && (data.message || data.error || data.status);
    if (typeof raw === 'string' && raw.trim()) {
      if (raw.indexOf('remote IP not allowed') !== -1 || raw.indexOf('Origin not allowed') !== -1) {
        return 'This site is not authorized for plant identification yet. If you are testing locally, use http://localhost:8080 and confirm that URL is listed in your Pl@ntNet API key settings.';
      }
      if (status === 404 || raw.indexOf('Species not found') !== -1) {
        return 'No plant species matched that photo. Try a closer shot of leaves, flowers, fruit, or bark in good light.';
      }
      return raw;
    }
    if (status === 404) {
      return 'No plant species matched that photo. Try a closer shot of leaves, flowers, fruit, or bark in good light.';
    }
    if (status === 401 || status === 403) {
      return 'Identification service authentication failed. Please try again later.';
    }
    return 'Identification failed. Please try another photo.';
  }

  function renderResultPhotos(previewUrls) {
    if (!els.resultPhotos) return;
    const urls = Array.isArray(previewUrls) ? previewUrls : [previewUrls];
    els.resultPhotos.innerHTML = urls.map(function (url, index) {
      return (
        '<figure class="plant-results__photo">' +
          '<img src="' + url + '" alt="Your submitted plant photo ' + (index + 1) + '" width="120" height="90">' +
        '</figure>'
      );
    }).join('');
  }

  function renderResults(data, previewUrls) {
    const top = data.results.slice(0, TOP_RESULTS);
    let highestRisk = 'unknown';
    const urls = Array.isArray(previewUrls) ? previewUrls : [previewUrls];

    els.resultsList.innerHTML = top.map(function (result, index) {
      const riskInfo = lookupFireRisk(result);
      if (RISK_RANK[riskInfo.risk] > RISK_RANK[highestRisk]) {
        highestRisk = riskInfo.risk;
      }

      const pct = confidencePercent(result.score);
      const rankClass = index === 0 ? ' plant-result__rank--best' : '';
      const noteHtml = riskInfo.note.split('\n').map(function (line) {
        return '<p>' + escapeHtml(line) + '</p>';
      }).join('');

      return (
        '<article class="plant-result ' + riskClassName(riskInfo.risk) + '" style="--plant-stagger:' + index + '">' +
          '<div class="plant-result__header">' +
            '<div class="plant-result__meta">' +
              '<span class="plant-result__rank' + rankClass + '">#' + (index + 1) + (index === 0 ? ' Best match' : '') + '</span>' +
              '<span class="plant-badge ' + riskBadgeClass(riskInfo.risk) + '">' +
                '<i class="fas ' + riskBadgeIcon(riskInfo.risk) + '" aria-hidden="true"></i>' +
                escapeHtml(riskInfo.riskLabel) +
              '</span>' +
            '</div>' +
            '<div class="plant-result__titles">' +
              '<h3 class="plant-result__common">' + escapeHtml(getCommonName(result)) + '</h3>' +
              '<p class="plant-result__sci"><em>' + escapeHtml(getScientificName(result)) + '</em></p>' +
            '</div>' +
            '<div class="plant-confidence">' +
              '<div class="plant-confidence__row">' +
                '<span class="plant-confidence__label">Match confidence</span>' +
                '<span class="plant-confidence__value">' + pct + '%</span>' +
              '</div>' +
              '<div class="plant-confidence__track" role="presentation">' +
                '<span class="plant-confidence__fill" style="width:' + pct + '%"></span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="plant-result__note">' + noteHtml + '</div>' +
        '</article>'
      );
    }).join('');

    const cta = CTA_BY_RISK[highestRisk] || CTA_BY_RISK.unknown;
    els.ctaPanel.className = 'plant-cta ' + cta.className;
    els.ctaPanel.innerHTML =
      '<p class="plant-cta__kicker">Next step</p>' +
      '<a class="plant-cta__link" href="' + cta.href + '">' +
        '<span class="plant-cta__lead">' + escapeHtml(cta.lead) + '</span>' +
        '<span class="plant-cta__action">' + escapeHtml(cta.action) + ' <i class="fas fa-arrow-right" aria-hidden="true"></i></span>' +
      '</a>';

    if (urls.length) {
      if (els.loadingPreview) {
        els.loadingPreview.src = urls[0];
        els.loadingPreview.alt = urls.length > 1
          ? 'Analyzing ' + urls.length + ' plant photos'
          : 'Photo being identified';
      }
      revokeResultPreviews();
      resultPreviewUrls = urls.slice();
      renderResultPhotos(urls);
    }

    photoQueue = [];
    renderPhotoQueue();
    showPanel(els.resultsPanel);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  let identifyBusy = false;

  function runIdentification() {
    if (identifyBusy) return;
    if (!photoQueue.length) {
      showError('Add at least one photo before identifying.');
      return;
    }

    identifyBusy = true;
    const sourceFiles = photoQueue.map(function (item) { return item.file; });
    const previewUrls = photoQueue.map(function (item) { return item.previewUrl; });

    if (els.loadingPreview) {
      els.loadingPreview.src = previewUrls[0];
      els.loadingPreview.alt = previewUrls.length > 1
        ? 'Analyzing ' + previewUrls.length + ' plant photos'
        : 'Photo being identified';
    }
    if (els.loadingHint) {
      els.loadingHint.textContent = previewUrls.length > 1
        ? 'Analyzing ' + previewUrls.length + ' photos \u2014 this may take a few seconds'
        : 'This may take a few seconds on slower connections';
    }
    showPanel(els.loadingPanel);

    compressImages(sourceFiles)
      .then(identifyPlant)
      .then(function (data) {
        try {
          renderResults(data, previewUrls);
        } catch (renderErr) {
          showError(renderErr && renderErr.message ? renderErr.message : 'We got a response but could not display results. Please try again.');
        }
      })
      .catch(function (err) {
        const msg = err && err.message ? err.message : '';
        if (msg.indexOf('Failed to fetch') !== -1 || err instanceof TypeError) {
          showError('Could not reach the identification service. Check your connection and try again.');
          return;
        }
        showError(msg);
      })
      .finally(function () {
        resetInputs();
        identifyBusy = false;
      });
  }

  function onInputChange(event) {
    const files = event.target.files;
    if (!files || !files.length) return;
    addPhotosToQueue(files);
    event.target.value = '';
  }

  function onPhotoListClick(event) {
    const btn = event.target.closest('[data-photo-id]');
    if (!btn) return;
    removePhotoFromQueue(btn.getAttribute('data-photo-id'));
  }

  function onTryAgainFresh() {
    resetInputs();
    revokeResultPreviews();
    clearPhotoQueue();
    if (els.resultsList) els.resultsList.innerHTML = '';
    if (els.ctaPanel) els.ctaPanel.innerHTML = '';
    if (els.resultPhotos) els.resultPhotos.innerHTML = '';
    if (els.loadingHint) {
      els.loadingHint.textContent = 'This may take a few seconds on slower connections';
    }
    showPanel(els.uploadSection);
  }

  function onTryAgainRetry() {
    resetInputs();
    showPanel(els.uploadSection);
    renderPhotoQueue();
  }

  if (els.cameraInput) {
    els.cameraInput.addEventListener('change', onInputChange);
  }
  if (els.fileInput) {
    els.fileInput.addEventListener('change', onInputChange);
  }
  if (els.photoList) {
    els.photoList.addEventListener('click', onPhotoListClick);
  }
  if (els.identifyBtn) {
    els.identifyBtn.addEventListener('click', runIdentification);
  }
  if (els.tryAgainBtn) {
    els.tryAgainBtn.addEventListener('click', onTryAgainFresh);
  }
  if (els.tryAgainErrorBtn) {
    els.tryAgainErrorBtn.addEventListener('click', onTryAgainRetry);
  }

  renderPhotoQueue();
})();

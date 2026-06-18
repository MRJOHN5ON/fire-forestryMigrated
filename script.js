const formConfig = window.GFF_FORMS || {};

document.querySelectorAll("form[data-form-key]").forEach((form) => {
  const endpoint = formConfig[form.dataset.formKey];
  if (endpoint) {
    form.action = endpoint;
  }
});

document.querySelectorAll("[data-playback-rate]").forEach((video) => {
  const rate = Number(video.dataset.playbackRate);
  if (rate > 0) {
    video.playbackRate = rate;
  }
});

document.querySelectorAll("[data-property-other]").forEach((input) => {
  const form = input.closest("form");
  const otherField = form?.querySelector("[data-property-other-field]");
  const otherInput = otherField?.querySelector("textarea, input");

  if (!otherField || !otherInput) return;

  const syncOtherField = () => {
    const show = input.checked;
    otherField.hidden = !show;
    otherInput.required = show;
    if (!show) {
      otherInput.value = "";
    }
  };

  input.addEventListener("change", syncOtherField);
  syncOtherField();
});

document.querySelectorAll("[data-tier-checkboxes]").forEach((fieldset) => {
  const form = fieldset.closest("form");
  const boxes = fieldset.querySelectorAll('input[type="checkbox"]');
  const error = fieldset.querySelector("[data-tier-error]");

  if (!form || !boxes.length) return;

  const hasSelection = () => [...boxes].some((box) => box.checked);

  const syncError = () => {
    if (!error) return;
    const show = error.dataset.showError === "true" && !hasSelection();
    error.hidden = !show;
  };

  boxes.forEach((box) => {
    box.addEventListener("change", syncError);
  });

  form.addEventListener("submit", (event) => {
    if (hasSelection()) {
      if (error) {
        error.dataset.showError = "false";
        error.hidden = true;
      }
      return;
    }

    event.preventDefault();
    if (error) {
      error.dataset.showError = "true";
      error.hidden = false;
    }
    fieldset.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");

if (header && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupScrollCarousel(carousel, trackSelector, slideSelector) {
  const track = carousel.querySelector(trackSelector);
  const slides = carousel.querySelectorAll(slideSelector);
  const viewport = track?.closest(".carousel-viewport") || track?.parentElement;
  const prev = carousel.querySelector(".carousel-btn--prev");
  const next = carousel.querySelector(".carousel-btn--next");
  const pageMode = carousel.dataset.carouselMode === "page";
  const pagination = carousel.querySelector(".carousel-pagination");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!track || !slides.length) return;

  let pageIndex = 0;
  let slideIndex = 0;

  const getGap = () => Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;

  const getStep = () => slides[0].offsetWidth + getGap();

  const getSlidesPerView = () => {
    const viewportWidth = viewport?.clientWidth || track.clientWidth;
    const step = getStep();
    if (!step) return 1;
    return Math.max(1, Math.floor((viewportWidth + getGap()) / step));
  };

  const getPageCount = () => Math.max(1, Math.ceil(slides.length / getSlidesPerView()));

  const usesPageScroll = () => pageMode && getSlidesPerView() > 1;

  const getMaxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

  const scrollToOffset = (left) => {
    track.scrollTo({
      left,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const scrollToSlideIndex = (nextIndex) => {
    slideIndex = Math.max(0, Math.min(nextIndex, slides.length - 1));
    scrollToOffset(getStep() * slideIndex);
    updateUI();
  };

  const scrollToPageIndex = (nextIndex) => {
    const perView = getSlidesPerView();
    const maxPage = getPageCount() - 1;
    pageIndex = Math.max(0, Math.min(nextIndex, maxPage));

    if (pageIndex >= maxPage) {
      scrollToOffset(getMaxScroll());
      updateUI();
      return;
    }

    scrollToOffset(pageIndex * perView * getStep());
    updateUI();
  };

  const syncIndicesFromScroll = () => {
    const step = getStep();
    if (!step) return;

    slideIndex = Math.round(track.scrollLeft / step);

    if (usesPageScroll()) {
      const perView = getSlidesPerView();
      pageIndex = Math.round(track.scrollLeft / (perView * step));
      if (track.scrollLeft >= getMaxScroll() - 2) {
        pageIndex = getPageCount() - 1;
      }
    }

    updateUI();
  };

  const updateButtons = () => {
    if (usesPageScroll()) {
      const maxPage = getPageCount() - 1;
      if (prev) prev.disabled = pageIndex <= 0;
      if (next) next.disabled = pageIndex >= maxPage;
      return;
    }

    if (prev) prev.disabled = slideIndex <= 0;
    if (next) next.disabled = slideIndex >= slides.length - 1;
  };

  const updateDots = () => {
    if (!pagination) return;

    const paging = usesPageScroll();
    const dotCount = paging ? getPageCount() : slides.length;
    const activeIndex = paging ? pageIndex : slideIndex;

    if (pagination.children.length !== dotCount) {
      pagination.replaceChildren();
      for (let i = 0; i < dotCount; i += 1) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-pagination__dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", paging ? `Show service group ${i + 1}` : `Show service ${i + 1}`);
        dot.addEventListener("click", () => {
          if (usesPageScroll()) scrollToPageIndex(i);
          else scrollToSlideIndex(i);
        });
        pagination.appendChild(dot);
      }
    }

    [...pagination.children].forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  };

  const updateUI = () => {
    updateButtons();
    updateDots();
  };

  prev?.addEventListener("click", () => {
    if (usesPageScroll()) scrollToPageIndex(pageIndex - 1);
    else scrollToSlideIndex(slideIndex - 1);
  });

  next?.addEventListener("click", () => {
    if (usesPageScroll()) scrollToPageIndex(pageIndex + 1);
    else scrollToSlideIndex(slideIndex + 1);
  });

  track.addEventListener("scroll", syncIndicesFromScroll, { passive: true });

  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(() => updateUI());
    resizeObserver.observe(track);
    if (viewport) resizeObserver.observe(viewport);
  }

  updateUI();
  requestAnimationFrame(updateUI);
  window.addEventListener("load", updateUI, { once: true });
}

document.querySelectorAll("[data-services-carousel]").forEach((carousel) => {
  setupScrollCarousel(carousel, ".carousel-track", ".carousel-slide");
});

document.querySelectorAll("[data-pricing-carousel]").forEach((carousel) => {
  setupScrollCarousel(carousel, ".pricing-wrapper", ".price-box");
});

document.querySelectorAll(".promo-video").forEach((video) => {
  const setSpeed = () => {
    video.playbackRate = 2;
  };

  setSpeed();
  video.addEventListener("loadedmetadata", setSpeed);
});

document.querySelectorAll("[data-ba-slider]").forEach((slider) => {
  const frame = slider.querySelector(".ba-showcase__frame");
  const range = slider.querySelector(".ba-showcase__range");

  if (!frame || !range) return;

  const setPosition = (value) => {
    const num = Number(value);
    const pos = `${num}%`;
    frame.style.setProperty("--ba-pos", pos);
    frame.style.setProperty("--ba-before-label-opacity", String(Math.min(1, num / 8)));
    frame.style.setProperty("--ba-after-label-opacity", String(Math.min(1, (100 - num) / 8)));
    range.setAttribute("aria-valuenow", value);
  };

  range.addEventListener("input", () => {
    setPosition(range.value);
  });

  setPosition(range.value);
});

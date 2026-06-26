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
    if (!viewportWidth || !slides.length) return 1;

    let fitting = 0;
    for (let i = 0; i < slides.length; i += 1) {
      const slideRight = slides[i].offsetLeft + slides[i].offsetWidth;
      if (slideRight <= viewportWidth + 1) {
        fitting = i + 1;
      } else {
        break;
      }
    }

    return Math.max(1, fitting);
  };

  const getPageCount = () => Math.max(1, Math.ceil(slides.length / getSlidesPerView()));

  const usesPageScroll = () => pageMode && getSlidesPerView() > 1;

  const getMaxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

  const getPageScrollLeft = (index) => {
    const perView = getSlidesPerView();
    const maxPage = getPageCount() - 1;
    if (index >= maxPage) return getMaxScroll();
    const startSlide = Math.min(index * perView, slides.length - 1);
    return slides[startSlide].offsetLeft;
  };

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
    const maxPage = getPageCount() - 1;
    pageIndex = Math.max(0, Math.min(nextIndex, maxPage));

    scrollToOffset(getPageScrollLeft(pageIndex));
    updateUI();
  };

  const syncIndicesFromScroll = () => {
    const step = getStep();
    if (!step) return;

    slideIndex = Math.round(track.scrollLeft / step);

    if (usesPageScroll()) {
      const maxPage = getPageCount() - 1;
      if (track.scrollLeft >= getMaxScroll() - 2) {
        pageIndex = maxPage;
      } else {
        let closestPage = 0;
        let closestDistance = Infinity;
        for (let i = 0; i <= maxPage; i += 1) {
          const target = getPageScrollLeft(i);
          const distance = Math.abs(track.scrollLeft - target);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestPage = i;
          }
        }
        pageIndex = closestPage;
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

function setupGalleryLightbox() {
  const gallery = document.querySelector("[data-gallery]");
  const lightbox = document.querySelector("[data-gallery-lightbox]");

  if (!gallery || !lightbox || typeof lightbox.showModal !== "function") return;

  const triggers = [...gallery.querySelectorAll("[data-gallery-open]")];
  const image = lightbox.querySelector(".gallery-lightbox__image");
  const prev = lightbox.querySelector("[data-gallery-prev]");
  const next = lightbox.querySelector("[data-gallery-next]");
  const closeButtons = [...lightbox.querySelectorAll("[data-gallery-close]")];
  const stage = lightbox.querySelector(".gallery-lightbox__stage");

  if (!triggers.length || !image || !prev || !next || !stage) return;

  let activeIndex = 0;
  let lastTrigger = null;
  const mobileQuery = window.matchMedia("(max-width: 768px)");

  const getTriggerLabel = (trigger) => {
    const alt = trigger.querySelector("img")?.alt?.trim();
    return alt ? `View full size: ${alt}` : "View full size project photo";
  };

  const syncMobileTriggers = () => {
    const isMobile = mobileQuery.matches;

    triggers.forEach((trigger) => {
      trigger.disabled = isMobile;
      trigger.tabIndex = isMobile ? -1 : 0;

      if (isMobile) {
        trigger.removeAttribute("aria-label");
      } else {
        trigger.setAttribute("aria-label", getTriggerLabel(trigger));
      }
    });

    if (isMobile && lightbox.open) {
      closeLightbox();
    }
  };

  const getImageData = (trigger) => {
    const thumb = trigger.querySelector("img");
    return {
      src: thumb?.currentSrc || thumb?.src || "",
      alt: thumb?.alt || "Givens Fire and Forestry project photo",
    };
  };

  const updateNav = () => {
    prev.disabled = activeIndex <= 0;
    next.disabled = activeIndex >= triggers.length - 1;
  };

  const showImage = (index) => {
    activeIndex = Math.max(0, Math.min(index, triggers.length - 1));
    const data = getImageData(triggers[activeIndex]);
    image.src = data.src;
    image.alt = data.alt;
    updateNav();
  };

  const openAt = (index, trigger) => {
    if (mobileQuery.matches) return;

    lastTrigger = trigger;
    showImage(index);
    if (!lightbox.open) {
      lightbox.showModal();
    }
  };

  const closeLightbox = () => {
    if (!lightbox.open) return;
    lightbox.close();
    image.removeAttribute("src");
    if (lastTrigger) {
      lastTrigger.focus();
    }
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => openAt(index, trigger));
  });

  syncMobileTriggers();
  mobileQuery.addEventListener("change", syncMobileTriggers);

  prev.addEventListener("click", () => showImage(activeIndex - 1));
  next.addEventListener("click", () => showImage(activeIndex + 1));
  closeButtons.forEach((button) => {
    button.addEventListener("click", closeLightbox);
  });

  lightbox.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });

  lightbox.addEventListener("close", () => {
    image.removeAttribute("src");
    if (lastTrigger) {
      lastTrigger.focus();
    }
  });

  stage.addEventListener("click", (event) => {
    if (event.target === stage) {
      closeLightbox();
    }
  });

  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && activeIndex > 0) {
      event.preventDefault();
      showImage(activeIndex - 1);
    }

    if (event.key === "ArrowRight" && activeIndex < triggers.length - 1) {
      event.preventDefault();
      showImage(activeIndex + 1);
    }
  });
}

setupGalleryLightbox();

document.querySelectorAll("[data-ba-slider]").forEach((slider) => {
  const frame = slider.querySelector(".ba-showcase__frame");
  const handle = slider.querySelector(".ba-showcase__divider");
  const range = slider.querySelector(".ba-showcase__range");
  const label = slider.querySelector("label[for]");

  if (!frame || !handle) return;

  let value = Number(range?.value) || 50;
  let dragging = false;

  const clamp = (num) => Math.max(0, Math.min(100, num));

  const setPosition = (num) => {
    value = clamp(num);
    const rounded = Math.round(value);
    const pos = `${value}%`;

    frame.style.setProperty("--ba-pos", pos);
    frame.style.setProperty("--ba-before-label-opacity", String(Math.min(1, value / 8)));
    frame.style.setProperty("--ba-after-label-opacity", String(Math.min(1, (100 - value) / 8)));
    handle.setAttribute("aria-valuenow", String(rounded));

    if (range) {
      range.value = String(rounded);
    }
  };

  const positionFromClientX = (clientX) => {
    const rect = frame.getBoundingClientRect();
    if (!rect.width) return;

    setPosition(((clientX - rect.left) / rect.width) * 100);
  };

  handle.removeAttribute("aria-hidden");
  handle.setAttribute("role", "slider");
  handle.setAttribute("aria-valuemin", "0");
  handle.setAttribute("aria-valuemax", "100");
  handle.setAttribute("tabindex", "0");

  if (label) {
    handle.setAttribute("aria-label", label.textContent.trim());
    label.classList.add("sr-only");
  } else {
    handle.setAttribute("aria-label", "Drag to compare before and after photos");
  }

  handle.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;

    dragging = true;
    handle.setPointerCapture(event.pointerId);
    positionFromClientX(event.clientX);
  });

  handle.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    positionFromClientX(event.clientX);
  });

  const endDrag = (event) => {
    if (!dragging) return;

    dragging = false;

    if (handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
  };

  handle.addEventListener("pointerup", endDrag);
  handle.addEventListener("pointercancel", endDrag);

  handle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition(value - 2);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition(value + 2);
    }
  });

  setPosition(value);
});

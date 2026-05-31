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

const cordForm = document.querySelector("[data-cord-form]");
const heightForm = document.querySelector("[data-height-form]");

if (cordForm) {
  cordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(cordForm);
    const diameter = Number(data.get("diameter"));
    const length = Number(data.get("length"));
    const result = cordForm.querySelector("[data-cord-result]");

    if (!diameter || !length || !result) return;

    const radiusFeet = diameter / 24;
    const cubicFeet = Math.PI * radiusFeet * radiusFeet * length;
    const cords = cubicFeet / 128;
    result.value = `Approx. ${cubicFeet.toFixed(1)} cubic feet, or ${cords.toFixed(2)} cords.`;
  });
}

if (heightForm) {
  heightForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(heightForm);
    const distance = Number(data.get("distance"));
    const angle = Number(data.get("angle"));
    const eye = Number(data.get("eye"));
    const result = heightForm.querySelector("[data-height-result]");

    if (!distance || !angle || !result) return;

    const height = Math.tan((angle * Math.PI) / 180) * distance + eye;
    result.value = `Estimated tree height: ${height.toFixed(1)} feet.`;
  });
}

document.querySelectorAll("[data-services-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = carousel.querySelectorAll(".carousel-slide");
  const prev = carousel.querySelector(".carousel-btn--prev");
  const next = carousel.querySelector(".carousel-btn--next");

  if (!track || !slides.length) return;

  let index = 0;

  const getStep = () => {
    const slide = slides[0];
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 20;
    return slide.offsetWidth + gap;
  };

  const scrollToIndex = (nextIndex) => {
    index = Math.max(0, Math.min(nextIndex, slides.length - 1));
    track.scrollTo({ left: getStep() * index, behavior: "smooth" });
  };

  prev?.addEventListener("click", () => scrollToIndex(index - 1));
  next?.addEventListener("click", () => scrollToIndex(index + 1));

  track.addEventListener("scroll", () => {
    const step = getStep();
    if (!step) return;
    index = Math.round(track.scrollLeft / step);
  }, { passive: true });
});

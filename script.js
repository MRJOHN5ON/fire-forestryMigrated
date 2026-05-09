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

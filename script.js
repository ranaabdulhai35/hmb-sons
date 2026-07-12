// ===== HMB Sons — site behaviour =====
(function () {
  "use strict";

  // ---- Navbar: shadow on scroll ----
  const navbar = document.getElementById("navbar");
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu toggle ----
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  // ---- Hero slider (Home page only) ----
  const slider = document.getElementById("heroSlider");
  if (slider) {
    const slides = Array.from(slider.querySelectorAll(".slide"));
    const dotsWrap = slider.querySelector(".slider-dots");
    let current = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", () => show(i, true));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function show(i, manual) {
      current = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle("active", idx === current));
      dots.forEach((d, idx) => d.classList.toggle("active", idx === current));
      if (manual) restart();
    }
    function next() { show(current + 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 5000);
    }

    slider.querySelector(".slider-arrow.prev").addEventListener("click", () => show(current - 1, true));
    slider.querySelector(".slider-arrow.next").addEventListener("click", () => show(current + 1, true));
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", restart);

    show(0);
    restart();
  }

  // ---- Scroll-reveal ----
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // ---- Partner logos: monogram chip if the image fails ----
  document.querySelectorAll(".partner-logo-img").forEach((img) => {
    img.addEventListener("error", () => {
      const chip = document.createElement("span");
      chip.className = "logo-chip";
      chip.textContent = img.dataset.initials || "?";
      chip.setAttribute("role", "img");
      chip.setAttribute("aria-label", img.alt);
      img.replaceWith(chip);
    });
  });

  // ---- Contact form ----
  const form = document.getElementById("contactForm");
  if (form) {
    const status = document.getElementById("formStatus");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.classList.remove("error");

      const required = form.querySelectorAll("[required]");
      const missing = Array.from(required).some((f) => !f.value.trim());
      if (missing) {
        status.textContent = "Please fill in all required fields.";
        status.classList.add("error");
        return;
      }

      // No backend yet — acknowledge locally and reset the form.
      status.textContent = "Thank you! Your query has been received — our team will get back to you shortly.";
      form.reset();
      setTimeout(() => { status.textContent = ""; }, 6000);
    });
  }
})();

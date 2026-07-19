// ===== HMB Sons site behaviour =====
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

  // ---- Content images: styled emoji placeholder if the image fails ----
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    onImgFail(img, () => {
      const fallback = document.createElement("div");
      fallback.className = "img-fallback";
      fallback.textContent = img.dataset.fallback;
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", img.alt);
      img.replaceWith(fallback);
    });
  });

  // Runs `replace` when an image fails, even if it already failed before
  // this script attached its listener.
  function onImgFail(img, replace) {
    if (img.complete && img.naturalWidth === 0) {
      replace();
      return;
    }
    img.addEventListener("error", replace);
  }

  // ---- Team photos: fall back to an initials avatar if the image is missing ----
  document.querySelectorAll(".avatar-photo").forEach((img) => {
    onImgFail(img, () => {
      const avatar = document.createElement("div");
      avatar.className = "avatar";
      avatar.textContent = img.dataset.initials || "?";
      avatar.setAttribute("role", "img");
      avatar.setAttribute("aria-label", img.alt);
      img.replaceWith(avatar);
    });
  });

  // ---- Partner logos: monogram chip if the image fails ----
  document.querySelectorAll(".partner-logo-img").forEach((img) => {
    onImgFail(img, () => {
      const chip = document.createElement("span");
      chip.className = "logo-chip";
      chip.textContent = img.dataset.initials || "?";
      chip.setAttribute("role", "img");
      chip.setAttribute("aria-label", img.alt);
      img.replaceWith(chip);
    });
  });

  // ---- Email links: on desktop, open Gmail compose in a new tab ----
  // (mailto: does nothing on PCs with no default mail app configured;
  // phones keep the native behaviour and open the mail/Gmail app.)
  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobileDevice) {
    document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const addr = a.getAttribute("href").replace(/^mailto:/, "").split("?")[0];
        window.open(
          "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(addr),
          "_blank",
          "noopener"
        );
      });
    });
  }

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

      // No backend yet, so acknowledge locally and reset the form.
      status.textContent = "Thank you! Your query has been received. Our team will get back to you shortly.";
      form.reset();
      setTimeout(() => { status.textContent = ""; }, 6000);
    });
  }
})();

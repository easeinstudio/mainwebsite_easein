// nav-contact-fix.js
(function () {
  const body        = document.body;
  const hamburger   = document.getElementById("hamburger");
  const mobileMenu  = document.getElementById("mobileMenu");
  const mobileClose = document.getElementById("mobileClose");

  if (!hamburger || !mobileMenu) {
    return; // no navbar in this page
  }

  // ---------- helpers ----------
  function openMenu() {
    mobileMenu.classList.add("show");
    body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("show");
    body.style.overflow = "";
  }

  function toggleMenu(e) {
    e.preventDefault();
    if (mobileMenu.classList.contains("show")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // ---------- hamburger + close ----------
  ["click", "touchstart"].forEach(evt => {
    hamburger.addEventListener(evt, toggleMenu, { passive: false });
  });

  if (mobileClose) {
    ["click", "touchstart"].forEach(evt => {
      mobileClose.addEventListener(evt, function (e) {
        e.preventDefault();
        closeMenu();
      }, { passive: false });
    });
  }

  // close when clicking outside content
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });

  // ---------- mobile links ----------
  document.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      closeMenu();

      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    });
  });

  // ---------- mobile accordions ----------
  document.querySelectorAll(".mobile-accordion").forEach(acc => {
    const toggle = acc.querySelector(".accordion-toggle");
    const panel  = acc.querySelector(".accordion-panel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("show");
      toggle.setAttribute("aria-expanded", isOpen);
    });
  });

  // ---------- desktop nav smooth scroll (for #hash links only) ----------
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ---------- ESC key closes things ----------
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      document.querySelectorAll(".dropdown").forEach(d =>
        d.classList.remove("open")
      );
    }
  });
})();

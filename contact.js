(function () {
  "use strict";

  const doc = document;
  const html = doc.documentElement;

  /* =====================================================
     1) REDUCED MOTION PREFERENCE
  ===================================================== */
  function prefersReducedMotion() {
    try {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch (e) {
      return false;
    }
  }

  function addReducedMotionClass() {
    if (prefersReducedMotion()) {
      html.classList.add("prefers-reduced-motion");
    }
  }

  /* =====================================================
     2) NAVBAR + MOBILE MENU + DROPDOWN
  ===================================================== */

  function initNavbar() {
    const isMobile = /Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry/i.test(
      navigator.userAgent
    );

    /* ---------- Beam Cursor (desktop only) ---------- */
    const beam = doc.getElementById("beamCursor");
    if (!isMobile && beam) {
      document.addEventListener("mousemove", (e) => {
        beam.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    } else if (beam) {
      beam.style.display = "none";
    }

    /* ---------- Smooth Scroll Helper ---------- */
    function smoothScrollTo(hash) {
      if (!hash || !hash.startsWith("#")) return;
      const target = doc.querySelector(hash);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    /* ---------- Mobile Menu ---------- */
    const hamburger = doc.getElementById("hamburger");
    const mobileMenu = doc.getElementById("mobileMenu");
    const mobileClose = doc.getElementById("mobileClose");

    function showMobileMenu() {
      if (!mobileMenu) return;
      mobileMenu.classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function hideMobileMenu() {
      if (!mobileMenu) return;
      mobileMenu.classList.remove("show");
      document.body.style.overflow = "";
    }

    if (hamburger) {
      hamburger.addEventListener("click", showMobileMenu);
    }
    if (mobileClose) {
      mobileClose.addEventListener("click", hideMobileMenu);
    }
    if (mobileMenu) {
      mobileMenu.addEventListener("click", (e) => {
        if (e.target === mobileMenu) hideMobileMenu();
      });
    }

    /* ---------- Smooth scroll for nav + mobile links ---------- */
    doc.querySelectorAll(".nav-link, .mobile-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          smoothScrollTo(href);
          hideMobileMenu();
        }
      });
    });

    /* ---------- Mobile accordion dropdown (Services / Portfolio) ---------- */
    doc
      .querySelectorAll(".mobile-accordion .accordion-toggle")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const panel = btn.nextElementSibling;
          if (!panel) return;
          panel.classList.toggle("show");
        });
      });

    /* ---------- Desktop dropdown hover with delay ---------- */
    const dropdowns = doc.querySelectorAll(".dropdown");

    dropdowns.forEach((drop) => {
      const menu = drop.querySelector(".dropdown-menu");
      let openTimer = null;
      let closeTimer = null;

      drop.addEventListener("mouseenter", () => {
        clearTimeout(closeTimer);
        openTimer = setTimeout(() => {
          drop.classList.add("open");
        }, 160); // small delay to feel smooth
      });

      drop.addEventListener("mouseleave", () => {
        clearTimeout(openTimer);
        closeTimer = setTimeout(() => {
          drop.classList.remove("open");
        }, 220); // delay so we don't accidentally close too fast
      });

      // Keep open while hovering inside the dropdown menu
      if (menu) {
        menu.addEventListener("mouseenter", () => {
          clearTimeout(closeTimer);
        });
        menu.addEventListener("mouseleave", () => {
          closeTimer = setTimeout(() => {
            drop.classList.remove("open");
          }, 220);
        });

        // Close when clicking a link inside dropdown (for SPA feel)
        menu.querySelectorAll("a").forEach((a) => {
          a.addEventListener("click", () => {
            drop.classList.remove("open");
          });
        });
      }
    });

    /* ---------- Touch feedback for nav links ---------- */
    doc.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("touchstart", () => {
        link.classList.add("tap-glow");
        setTimeout(() => link.classList.remove("tap-glow"), 350);
      });
    });
  }

  /* =====================================================
     3) CONTACT PAGE – FILE INPUT HANDLING
  ===================================================== */
  function initFileInput() {
    const fileInput = doc.getElementById("referenceUpload");
    if (!fileInput) return;

    const wrapper =
      fileInput.closest(".file-input-wrapper") || fileInput.parentElement;
    if (!wrapper) return;

    if (!wrapper.hasAttribute("tabindex")) {
      wrapper.setAttribute("tabindex", "0");
    }

    fileInput.addEventListener("change", () => {
      const f = fileInput.files && fileInput.files[0];
      if (f) {
        wrapper.setAttribute("data-filename", f.name);
        wrapper.classList.add("has-file");
      } else {
        wrapper.removeAttribute("data-filename");
        wrapper.classList.remove("has-file");
      }
    });

    wrapper.addEventListener("click", (e) => {
      if (e.target === wrapper) fileInput.click();
    });

    wrapper.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fileInput.click();
      }
    });
  }

  /* =====================================================
     4) BUTTON RIPPLE ON SUBMIT
  ===================================================== */
  function initRipple() {
    if (prefersReducedMotion()) return;
    const submitBtn = doc.querySelector(".contact-submit-btn");
    if (!submitBtn) return;

    submitBtn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = doc.createElement("span");
      ripple.className = "ripple";

      const size = Math.max(rect.width, rect.height) * 1.2;
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";

      this.appendChild(ripple);

      ripple.addEventListener(
        "animationend",
        () => ripple.remove(),
        { once: true }
      );

      setTimeout(() => {
        if (ripple.parentNode) ripple.remove();
      }, 900);
    });
  }

  /* =====================================================
     5) STAGGERED ENTRANCES (Form + Direct Card)
  ===================================================== */
  function initStaggeredEntrances() {
    const form = doc.querySelector(".contact-form");
    if (form) {
      const groups = Array.from(form.querySelectorAll(".form-group"));
      groups.forEach((g, i) => {
        g.style.animationDelay = i * 80 + "ms";
      });

      requestAnimationFrame(() =>
        requestAnimationFrame(() => form.classList.add("stagger-enter"))
      );

      const inputs = form.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        input.addEventListener("focus", () =>
          input.classList.add("input-focus")
        );
        input.addEventListener("blur", () =>
          input.classList.remove("input-focus")
        );
      });
    }

    const directCard = doc.querySelector(".contact-direct-card");
    if (directCard) {
      const items = Array.from(
        directCard.querySelectorAll(".direct-item")
      );
      items.forEach((it, i) => {
        it.style.animationDelay = i * 110 + "ms";
        it.classList.add("direct-stagger");
      });
    }
  }

  /* =====================================================
     6) SIMPLE INPUT "VALID" VISUAL
  ===================================================== */
  function initInputValidation() {
    const inputs = doc.querySelectorAll(
      ".contact-form input, .contact-form textarea, .contact-form select"
    );
    if (!inputs.length) return;

    inputs.forEach((input) => {
      const checkValidity = () => {
        const wrapper = input.closest(".form-group");
        if (!wrapper) return;

        if (input.value.trim().length > 0) {
          wrapper.classList.add("valid");
        } else {
          wrapper.classList.remove("valid");
        }
      };

      input.addEventListener("input", checkValidity);
      input.addEventListener("blur", checkValidity);
    });
  }

  /* =====================================================
     7) FORM SUBMIT + SUCCESS MODAL
  ===================================================== */
  function initFormSubmit() {
    const form = doc.getElementById("contactForm");
    const modal = doc.getElementById("successModal");
    const closeModalBtn = doc.getElementById("closeModalBtn");

    if (!form || !modal) return;

    const submitBtn = form.querySelector(".contact-submit-btn");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!submitBtn) return;

      const originalText = submitBtn.innerText;
      submitBtn.innerText = "Sending...";
      submitBtn.style.opacity = "0.7";
      submitBtn.disabled = true;

      // Simulated send
      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.style.opacity = "1";
        submitBtn.disabled = false;

        form.reset();

        // Reset "valid" state
        form
          .querySelectorAll(".form-group.valid")
          .forEach((g) => g.classList.remove("valid"));

        // Reset file display
        const fileWrapper = doc.querySelector(".file-input-wrapper");
        if (fileWrapper) {
          fileWrapper.removeAttribute("data-filename");
          fileWrapper.classList.remove("has-file");
        }

        modal.classList.add("active");
      }, 1500);
    });

    function closeModal() {
      modal.classList.remove("active");
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    doc.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* =====================================================
     8) STACK REEL – 3D CARD ROTATION
  ===================================================== */
  function initStackReel() {
    const reelWindow = doc.getElementById("stackReel");
    if (!reelWindow) return;

    const cards = Array.from(reelWindow.querySelectorAll(".reel-card"));
    if (cards.length < 2) return;

    const rotateCards = () => {
      const activeIndex = cards.findIndex((c) =>
        c.classList.contains("active")
      );
      const current = activeIndex >= 0 ? activeIndex : 0;
      const nextIndex = (current + 1) % cards.length;
      const backIndex = (current + 2) % cards.length;

      cards.forEach((c) => c.classList.remove("active", "next", "back"));
      cards[nextIndex].classList.add("active");
      cards[backIndex].classList.add("next");
      cards[current].classList.add("back");
    };

    let interval = setInterval(rotateCards, 4000);

    reelWindow.addEventListener("mouseenter", () =>
      clearInterval(interval)
    );
    reelWindow.addEventListener("mouseleave", () => {
      clearInterval(interval);
      interval = setInterval(rotateCards, 4000);
    });
    reelWindow.addEventListener("click", () => {
      clearInterval(interval);
      rotateCards();
      interval = setInterval(rotateCards, 4000);
    });
  }

  /* =====================================================
     INIT EVERYTHING
  ===================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    addReducedMotionClass();
    initNavbar();
    initFileInput();
    initRipple();
    initStaggeredEntrances();
    initInputValidation();
    initFormSubmit();
    initStackReel();
  });
})();

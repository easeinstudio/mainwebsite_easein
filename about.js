/* ============================================================
   app.js – Clean Version for Easein Studio
   - Mobile menu (hamburger)
   - Smooth scrolling
   - Beam cursor (desktop)
   - Dropdowns
   - Counters, reveals, FAQ, timeline
   - Hero video + About animation (with safe guards)
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------
     DEVICE DETECTION
  ---------------------------- */
  const isMobile = /Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry/i.test(
    navigator.userAgent
  );

  /* ----------------------------
     BEAM CURSOR (DESKTOP ONLY)
  ---------------------------- */
  const beamCursor = document.getElementById("beamCursor");
  if (!isMobile && beamCursor) {
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    document.addEventListener("mousemove", (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      beamCursor.style.transform = `translate(${lastX}px, ${lastY}px)`;
    });

    document.addEventListener("mousedown", () => {
      beamCursor.style.transform = `translate(${lastX}px, ${lastY}px) scale(0.86)`;
    });

    document.addEventListener("mouseup", () => {
      beamCursor.style.transform = `translate(${lastX}px, ${lastY}px)`;
    });
  } else if (beamCursor) {
    beamCursor.style.display = "none";
  }

  /* ----------------------------
     SMOOTH SCROLL HELPER
  ---------------------------- */
  function smoothScrollTo(hash) {
    const target = document.querySelector(hash);
    if (!target) return;

    // Try CSS var if you set --site-header-height, else fallback
    const headerOffset =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--site-header-height"
        )
      ) || 76;

    const rect = target.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY - headerOffset - 10;

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }

  /* ----------------------------
     NAVBAR SCROLL LINKS
  ---------------------------- */
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        smoothScrollTo(href);
        hideMobileMenu();
      }
    });
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      hideMobileMenu();
      if (href && href.startsWith("#")) {
        e.preventDefault();
        setTimeout(() => smoothScrollTo(href), 180);
      }
    });
  });

  /* ----------------------------
     DESKTOP DROPDOWNS (hover with 1s grace)
  ---------------------------- */
  const desktopDropdowns = document.querySelectorAll(".dropdown");
  desktopDropdowns.forEach((drop) => {
    const menu = drop.querySelector(".dropdown-menu");
    if (!menu) return;

    let openTime = 0;
    let closeTimeout = null;

    drop.addEventListener("mouseenter", () => {
      clearTimeout(closeTimeout);
      openTime = Date.now();
      drop.classList.add("open");
    });

    drop.addEventListener("mouseleave", () => {
      const elapsed = Date.now() - openTime;
      if (elapsed >= 1000) {
        drop.classList.remove("open");
      } else {
        closeTimeout = setTimeout(() => drop.classList.remove("open"), 1000 - elapsed);
      }
    });

    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => drop.classList.remove("open"))
    );
  });

  /* ----------------------------
     MOBILE MENU (ONE CLEAN VERSION)
  ---------------------------- */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileClose = document.getElementById("mobileClose");

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

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      if (mobileMenu.classList.contains("show")) {
        hideMobileMenu();
      } else {
        showMobileMenu();
      }
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", hideMobileMenu);
  }

  if (mobileMenu) {
    // click on dark overlay closes menu
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) hideMobileMenu();
    });
  }

  // Accordion inside mobile menu
  document.querySelectorAll(".mobile-accordion .accordion-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      if (!panel) return;
      panel.classList.toggle("show");
    });
  });

  // Touch “hover” effect on mobile dropdown links (small visual only)
  document.querySelectorAll(".accordion-panel a").forEach((link) => {
    link.addEventListener("touchstart", () => {
      document.querySelectorAll(".accordion-panel a").forEach((l) =>
        l.classList.remove("touch-hover")
      );
      link.classList.add("touch-hover");
      setTimeout(() => link.classList.remove("touch-hover"), 500);
    });
  });

  /* ----------------------------
     SCROLL-TO BUTTONS (data-scroll-target)
  ---------------------------- */
  document.querySelectorAll("[data-scroll-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSelector = btn.getAttribute("data-scroll-target");
      if (!targetSelector) return;
      smoothScrollTo(targetSelector);
    });
  });

  /* ----------------------------
     STATS COUNTER (.stat-number)
  ---------------------------- */
  const statEls = document.querySelectorAll(".stat-number");
  if (statEls.length) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const endValue = parseInt(el.getAttribute("data-count"), 10) || 0;
          const duration = 900;
          const startTime = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = Math.floor(progress * endValue);
            el.textContent = value;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = endValue + (endValue > 0 ? "+" : "");
            }
          };

          requestAnimationFrame(tick);
          statsObserver.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );

    statEls.forEach((el) => statsObserver.observe(el));
  }

  /* ----------------------------
     REVEAL ON SCROLL (.reveal → .visible)
  ---------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ----------------------------
     FAQ ACCORDION (uses .active class)
  ---------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");
  if (faqItems.length) {
    faqItems.forEach((item) => {
      const button = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      if (!button || !answer) return;

      button.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // close all
        faqItems.forEach((i) => i.classList.remove("active"));

        // toggle current
        if (!isActive) {
          item.classList.add("active");
        }
      });
    });
  }

  /* ----------------------------
     TIMELINE STEPS (.timeline-item → .active-step)
  ---------------------------- */
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (timelineItems.length) {
    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target;
          if (entry.isIntersecting) {
            item.classList.add("active-step");
          } else {
            item.classList.remove("active-step");
          }
        });
      },
      { threshold: 0.4 }
    );

    timelineItems.forEach((item) => stepObserver.observe(item));
  }

  /* ----------------------------
     HERO VIDEO FRAME (optional)
  ---------------------------- */
  const heroFrame = document.querySelector(".hero-video-frame");
  if (heroFrame) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.15) {
            heroFrame.classList.add("video-visible");
            heroFrame.classList.remove("video-out");
          } else {
            heroFrame.classList.add("video-out");
            heroFrame.classList.remove("video-visible");
          }
        });
      },
      { threshold: [0, 0.15, 0.3] }
    );

    videoObserver.observe(heroFrame);
  }

  /* ----------------------------
     ABOUT “BEHIND” SECTION ANIMATION
  ---------------------------- */
  const behindSection = document.querySelector(".about-behind");
  if (behindSection) {
    const behindObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            behindSection.classList.add("behind-visible");
          } else {
            behindSection.classList.remove("behind-visible");
          }
        });
      },
      { threshold: 0.25 }
    );

    behindObserver.observe(behindSection);
  }
});

/* ============================================================
   portfolio.js – Easein Studio
   - Navbar + mobile menu
   - Smooth scroll
   - Beam cursor (desktop)
   - Dropdowns
   - Portfolio carousels + video hover
   - Lightbox
   - Hero scroll effect
   - Video loading/error overlay
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

  

  /* ============================================================
     PORTFOLIO-SPECIFIC LOGIC
  ============================================================= */

  /* ----------------------------
     1. CAROUSEL NAVIGATION
  ---------------------------- */
  const carousels = document.querySelectorAll(".portfolio-carousel");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const nextBtn = carousel.querySelector(".next");
    const prevBtn = carousel.querySelector(".prev");

    if (nextBtn && track) {
      nextBtn.addEventListener("click", () => {
        track.scrollBy({ left: 300, behavior: "smooth" });
      });
    }

    if (prevBtn && track) {
      prevBtn.addEventListener("click", () => {
        track.scrollBy({ left: -300, behavior: "smooth" });
      });
    }
  });

  /* ----------------------------
     2. LIGHTBOX HELPERS
  ---------------------------- */
  const lightbox = document.getElementById("videoLightbox");
  const lightboxPlayer = document.getElementById("lightboxPlayer");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDesc = document.getElementById("lightboxDesc");
  const lightboxCloseBtn = lightbox
    ? lightbox.querySelector(".lightbox-close")
    : null;

  function openLightbox(card) {
    if (!lightbox || !lightboxPlayer || !lightboxTitle || !lightboxDesc) return;

    const videoEl = card.querySelector("video");
    if (!videoEl || !videoEl.src) return;

    const titleEl = card.querySelector(".video-meta h3");
    const descEl = card.querySelector(".video-meta p");

    const videoSrc = videoEl.src;
    const title = titleEl ? titleEl.textContent : "";
    const desc = descEl ? descEl.textContent : "";

    lightboxPlayer.src = videoSrc;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;

    lightbox.classList.add("active");
    lightboxPlayer.play().catch(() => {});
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxPlayer) return;
    lightbox.classList.remove("active");
    setTimeout(() => {
      lightboxPlayer.pause();
      lightboxPlayer.src = "";
    }, 300);
    document.body.style.overflow = "";
  }

  // Close via X button
  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener("click", closeLightbox);
  }

  // Close by clicking outside the inner content
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  /* ----------------------------
     3. VIDEO CARD INTERACTIONS
  ---------------------------- */
  const cards = document.querySelectorAll(".video-card");

  cards.forEach((card) => {
    const video = card.querySelector("video");

    // Hover preview (desktop)
    card.addEventListener("mouseenter", () => {
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });

    card.addEventListener("mouseleave", () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Click opens lightbox
    card.addEventListener("click", () => {
      openLightbox(card);
    });
  });

  const cards1 = document.querySelectorAll(".video-card1");

cards1.forEach((card) => {
  const video = card.querySelector("video");

  // Hover preview
  card.addEventListener("mouseenter", () => {
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  });

  // Restore poster on unhover
  card.addEventListener("mouseleave", () => {
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.load(); // forces poster back
    }
  });

  // Click opens lightbox
  card.addEventListener("click", () => {
    openLightbox(card);
  });
});

  /* ----------------------------
     4. HERO FILTER PILLS (Smooth Scroll)
  ---------------------------- */
  const pills = document.querySelectorAll(".pill[data-target]");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const targetId = pill.getAttribute("data-target");
      if (!targetId) return;
      const section = document.querySelector(targetId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ----------------------------
     5. HERO SCROLL ANIMATION (Blur/Scale/Opacity)
  ---------------------------- */
  const heroVideoContainer = document.querySelector(".hero-reel-container");

  if (heroVideoContainer) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const triggerHeight = 600;

      if (scrollY < triggerHeight) {
        const progress = scrollY / triggerHeight;
        const scale = 1 - progress * 0.1; // 1 → 0.9
        const opacity = 1 - progress * 0.6; // 1 → 0.4
        // const blur = progress * 10; // 0 → 10px

        heroVideoContainer.style.transform = `scale(${scale})`;
        heroVideoContainer.style.opacity = `${opacity}`;
        // heroVideoContainer.style.filter = `blur(${blur}px)`;
      }
    });
  }

  /* ----------------------------
     6. VIDEO LOADING / ERROR OVERLAY
  ---------------------------- */
  const allVideos = document.querySelectorAll("video");

  allVideos.forEach((video) => {
    const wrapper =
      video.closest(".hero-reel-container") ||
      video.closest(".video-card") ||
      video.parentElement;

    if (!wrapper) return;

    // Create overlay once per wrapper
    if (!wrapper.querySelector(".video-status-layer")) {
      const statusLayer = document.createElement("div");
      statusLayer.className = "video-status-layer is-loading";
      statusLayer.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="error-msg">
          <span class="material-symbols-rounded">broken_image</span>
          <span>UNAVAILABLE</span>
        </div>
      `;

      const pos = getComputedStyle(wrapper).position;
      if (pos !== "relative" && pos !== "absolute" && pos !== "fixed") {
        wrapper.style.position = "relative";
      }
      wrapper.appendChild(statusLayer);
    }

    const container = wrapper;
    const statusLayer = container.querySelector(".video-status-layer");

    const showLoading = () => {
      if (!statusLayer) return;
      container.classList.remove("video-loaded", "has-error");
      statusLayer.classList.add("is-loading");
    };

    const showPlaying = () => {
      if (!statusLayer) return;
      statusLayer.classList.remove("is-loading");
      container.classList.remove("has-error");
      container.classList.add("video-loaded");
    };

    const showError = () => {
      if (!statusLayer) return;
      statusLayer.classList.remove("is-loading");
      container.classList.remove("video-loaded");
      container.classList.add("has-error");
    };

    video.addEventListener("loadstart", showLoading);
    video.addEventListener("waiting", showLoading);
    video.addEventListener("canplay", showPlaying);
    video.addEventListener("playing", showPlaying);
    video.addEventListener("error", showError);

    if (video.readyState >= 3) {
      showPlaying();
    }
  });
});

/* ===== INFINITE AUTO SCROLL (LEFT ONLY) ===== */
document.querySelectorAll(".portfolio-carousel1").forEach(carousel => {
  const track = carousel.querySelector(".carousel-track");
  if (!track) return;

  let isPaused = false;
  const SPEED = 3; // adjust speed here

  // Duplicate cards once (for seamless loop)
  if (!track.dataset.cloned) {
    track.innerHTML += track.innerHTML;
    track.dataset.cloned = "true";
  }

  // Start from middle to avoid jump
  track.scrollLeft = track.scrollWidth / 4;

  function autoScroll() {
    if (!isPaused) {
      track.scrollLeft += SPEED;

      // Reset position when reaching end
      if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }

  // Pause on hover
  carousel.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  carousel.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  autoScroll();
});
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('aiVideoModal');
  const modalVideo = document.getElementById('aiModalVideo');
  const closeBtn = document.querySelector('.ai-video-close');
  const backdrop = document.querySelector('.ai-video-backdrop');
  
  // UPDATED SELECTOR: Yeh ab class name par depend nahi karta.
  // Jahan bhi "data-video" attribute hoga, ye wahan kaam karega.
  const triggers = document.querySelectorAll('[data-video]');

  // Open Modal Function
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const videoUrl = trigger.getAttribute('data-video');
      // Check if URL exists and is not empty
      if(videoUrl && videoUrl.trim() !== "") {
        modalVideo.src = videoUrl;
        modal.classList.add('active'); 
        modalVideo.play();
      }
    });
  });

  // Close Modal Function
  const closeModal = () => {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = ""; // Clear source
  };

  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(backdrop) backdrop.addEventListener('click', closeModal);
});
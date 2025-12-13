/* ============================================================
   app.js - Parallax + Light Beam + RGB Fade + Navigation Logic
   Fully rewritten, optimized, and commented
============================================================ */

/* ----------------------------
   DEVICE DETECTION
---------------------------- */
const isMobile = /Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry/i.test(
  navigator.userAgent
);

/* ----------------------------
   BEAM CURSOR (DESKTOP ONLY)
---------------------------- */
if (!isMobile) {
  const beam = document.getElementById("beamCursor");
  if (beam) {
    document.addEventListener("mousemove", (e) => {
      beam.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    document.addEventListener("mousedown", () => {
      beam.style.transform += " scale(0.86)";
    });
    document.addEventListener("mouseup", () => {
      beam.style.transform = beam.style.transform.replace(" scale(0.86)", "");
    });
  }
} else {
  const beam = document.getElementById("beamCursor");
  if (beam) beam.style.display = "none";
}

/* ----------------------------
   SMOOTH SCROLL HELPER
---------------------------- */
function smoothScrollTo(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileClose = document.getElementById("mobileClose");

hamburger.onclick = () => mobileMenu.classList.add("show");
mobileClose.onclick = () => mobileMenu.classList.remove("show");

/* ===== MOBILE ACCORDION ===== */
document.querySelectorAll(".mobile-accordion").forEach(acc => {
  const btn = acc.querySelector(".accordion-toggle");
  const panel = acc.querySelector(".accordion-panel");

  btn.onclick = () => panel.classList.toggle("show");
});



/* ----------------------------
   HERO + PARALLAX ELEMENTS
---------------------------- */
const lensImg = document.querySelector(".lens-img");
const ghost = document.querySelector(".ghost-text");
const lightBeamEl = createLightElements();

let lastScrollY = window.scrollY || 0;
let ticking = false;

/* ----------------------------
   CREATE BEAM + TRAIL
---------------------------- */
function createLightElements() {
  const beam = document.createElement("div");
  beam.className = "light-beam will-change-transform";
  document.body.appendChild(beam);

  const trail = document.createElement("div");
  trail.className = "light-trail will-change-transform";
  document.body.appendChild(trail);

  beam.style.opacity = "1";
  trail.style.opacity = "0";

  return { beam, trail };
}

/* ----------------------------
   MAIN SCROLL HANDLER
---------------------------- */
function onScroll() {
  lastScrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      applyParallax(lastScrollY);
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener("scroll", onScroll, { passive: true });

/* ----------------------------
   APPLY PARALLAX + BEAM PHYSICS
---------------------------- */
function applyParallax(scrollY) {
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  );
  const winH = window.innerHeight;
  const progress = Math.min(1, scrollY / (docHeight - winH));

  /* ---------- 1. LENS MOVEMENT ---------- */
  if (lensImg) {
    const lx = progress * 60;
    const ly = progress * 30;
    lensImg.style.transform = `translate(${lx}px, ${ly}px)`;
    lensImg.style.opacity = (0.32 + progress * 0.12).toString();
  }

  /* ---------- 2. GHOST TEXT PARALLAX ---------- */
  if (ghost) {
    const ghostY = -(progress * winH * 0.6);
    ghost.style.transform = `translate(-50%, ${ghostY}px)`;
  }

  /* ---------- 3. BEAM/TRAIL MOVEMENT ---------- */
  const { beam, trail } = lightBeamEl;
  const collapseThreshold = 0.12;
  const travelProgress = Math.max(
    0,
    (progress - collapseThreshold) / (1 - collapseThreshold)
  );

  /* ---- BEFORE COLLAPSE (big beam) ---- */
  if (progress <= collapseThreshold) {
    const beamLeft = 6 + scrollY * 0.01;
    const beamTop = Math.min(6 + scrollY * 0.02, 28);

    beam.style.opacity = "1";
    trail.style.opacity = "0";

    beam.style.left = `${beamLeft}%`;
    beam.style.top = `${beamTop}%`;

    beam.style.width = `${28 - progress * 8}vw`;
    beam.style.height = `${36 - progress * 12}vh`;
    beam.style.transform = `rotate(${-8 + progress * 4}deg)`;
  }

  /* ---- AFTER COLLAPSE (trail mode) ---- */
  else {
    trail.style.opacity = Math.min(1, travelProgress * 1.6).toString();
    beam.style.opacity = Math.max(0, 1 - travelProgress * 1.6).toString();

    const startX = window.innerWidth * 0.12;
    const startY = window.innerHeight * 0.12;
    const endX = window.innerWidth * 0.85;

    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    const t = easeInOut(travelProgress);

    const curX = startX + (endX - startX) * t;
    const curY = startY + scrollY * 0.35;

    trail.style.left = `${(curX / window.innerWidth) * 100}%`;
    trail.style.top = `${(curY / window.innerHeight) * 100}%`;
    trail.style.height = `${16 + travelProgress * winH * 0.8}px`;
  }

  /* ---------- 4. RGB FADE-OUT AT FOOTER ---------- */
  if (progress >= 0.94) {
    const fadeRatio = (progress - 0.94) / 0.06;
    const fade = Math.min(1, Math.max(0, fadeRatio));

    trail.style.opacity = `${1 - fade}`;
    trail.style.height = `${(1 - fade) * 140}px`;

    trail.style.setProperty("--rgb-offset", `${fade * 10}px`);

    trail.style.boxShadow = `0 0 ${20 - fade * 20}px rgba(0,255,255,${
      0.25 - fade * 0.25
    })`;

    trail.style.transform = `translateX(${fade * 8}px)`;
  }

  /* Final vanish */
  if (progress >= 0.999) {
    trail.style.opacity = "0";
    trail.style.height = "0px";
  }
}

/* ----------------------------
   DESKTOP LENS PARALLAX
---------------------------- */
if (!isMobile) {
  document.addEventListener("mousemove", (e) => {
    if (lensImg) {
      const x = (e.clientX - window.innerWidth / 2) / 40;
      const y = (e.clientY - window.innerHeight / 2) / 40;
      lensImg.style.transform = `translate(${x}px, ${y}px)`;
    }
  });
}

/* ----------------------------
   INITIAL POSITION UPDATE
---------------------------- */
applyParallax(window.scrollY);

/* ----------------------------
   ESC CLOSE SAFETY
---------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".dropdown").forEach((d) =>
      d.classList.remove("open")
    );
    hideMobileMenu();
  }
});
/* ================= Hologram Section JS ================= */

/* micro-orb floating */
(function holoOrbsLoop(){
  const orbs = document.querySelectorAll('.holo-orbs .orb');
  if(!orbs || orbs.length === 0) return;

  // each orb has a tiny offset speed & direction
  const speeds = Array.from(orbs).map((_,i)=> (0.12 + i*0.04));
  const phases = Array.from(orbs).map(()=> Math.random()*Math.PI*2);

  let last = performance.now();
  function step(now){
    const dt = (now - last) / 1000;
    last = now;
    orbs.forEach((orb, idx) => {
      phases[idx] += dt * speeds[idx] * 0.6;
      // compute subtle parallax movement
      const x = Math.cos(phases[idx]) * (10 + idx*6);
      const y = Math.sin(phases[idx]) * (6 + idx*4);
      orb.style.transform = `translate(${x}px, ${y}px)`;
      // slight pulsate
      const s = 1 + Math.sin(phases[idx]) * 0.04;
      orb.style.opacity = 0.35 + 0.12 * Math.abs(Math.sin(phases[idx]));
      orb.style.width = `${(parseInt(getComputedStyle(orb).width)||100) * s}px`;
      orb.style.height = orb.style.width;
    });
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

/* card reveal observer */
(function cardRevealObserver(){
  const cards = document.querySelectorAll('.why-card');
  if(!cards || cards.length===0) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add('is-visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => obs.observe(c));
})();

/* mouse tilt for cards (desktop only) */
(function cardTilt(){
  if(window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return; // don't enable on touch devices
  const cards = document.querySelectorAll('[data-tilt]');
  if(!cards || cards.length===0) return;

  cards.forEach(card => {
    const rectCache = { w:0, h:0, l:0, t:0 };
    function refreshRect(){ const r = card.getBoundingClientRect(); rectCache.w=r.width; rectCache.h=r.height; rectCache.l=r.left; rectCache.t=r.top; }

    refreshRect();
    window.addEventListener('resize', refreshRect);

    card.addEventListener('mousemove', (e)=>{
      const px = (e.clientX - (rectCache.l + rectCache.w/2)) / (rectCache.w/2);
      const py = (e.clientY - (rectCache.t + rectCache.h/2)) / (rectCache.h/2);
      // const rotateX = (-py * 6).toFixed(2);
      // const rotateY = (px * 6).toFixed(2);
      // const translateZ = 6;
      // card.style.transform = `perspective(800px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      card.style.boxShadow = `0 18px 50px rgba(0,200,255,0.08)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();
/* ============================================================
   OUR PROCESS — Particles + Pulses + Card Slide
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* --------------------
     CARD REVEAL ON SCROLL
  -------------------- */
  const steps = document.querySelectorAll('.process-step');

  const reveal = () => {
    const trigger = window.innerHeight * 0.85;
    steps.forEach(step => {
      const rect = step.getBoundingClientRect();
      if (rect.top < trigger) step.classList.add('step-visible');
    });
  };

  window.addEventListener('scroll', reveal);
  reveal();


  /* --------------------
     AI BEAM PARTICLES
  -------------------- */
  const actors = document.querySelector('.beam-actors');
  if (!actors) return;

  const particles = [];
  const TOTAL = 26;

  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement("div");
    dot.classList.add("p-dot");

    dot.style.left = `${(Math.random() * 6) + 6}px`;
    dot.style.top = `${Math.random() * 100}%`;

    const size = 2 + Math.random() * 3;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;

    actors.appendChild(dot);

    particles.push({
      el: dot,
      top: parseFloat(dot.style.top),
      speed: 8 + Math.random() * 14
    });
  }

  let last = performance.now();
  function animateDots(t) {
    const dt = (t - last) / 1000;
    last = t;

    particles.forEach(p => {
      p.top -= p.speed * dt;
      if (p.top < -5) p.top = 105;
      p.el.style.top = `${p.top}%`;
    });

    requestAnimationFrame(animateDots);
  }
  requestAnimationFrame(animateDots);


  /* --------------------
     RANDOM PULSES
  -------------------- */
  function spawnPulse() {
    const pulse = document.createElement("div");
    pulse.classList.add("beam-pulse");

    const flare = document.createElement("div");
    flare.classList.add("pulse-flare");

    actors.appendChild(pulse);
    actors.appendChild(flare);

    pulse.style.top = "100%";
    flare.style.top = "100%";

    pulse.style.opacity = "1";
    flare.style.opacity = "1";

    const duration = 450;

    pulse.animate(
      [{ top: "100%" }, { top: "-5%", opacity: 0 }],
      { duration, easing: "ease-out", fill: "forwards" }
    );

    flare.animate(
      [{ top: "100%" }, { top: "40%", opacity: 0 }],
      { duration: 350, easing: "ease-out", fill: "forwards" }
    );

    setTimeout(() => {
      pulse.remove();
      flare.remove();
    }, duration + 50);
  }

  function pulseLoop() {
    spawnPulse();
    setTimeout(pulseLoop, 1200 + Math.random() * 1500);
  }
  pulseLoop();
});
/* ============================
   Camera Screen Image Swap
============================ */

const screen = document.getElementById("cameraScreen");
const chips = document.querySelectorAll(".chip");

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    const id = chip.getAttribute("data-img");
    const newImg = document.getElementById(id).src;

    screen.style.opacity = 0;

    setTimeout(() => {
      screen.src = newImg;
      screen.style.opacity = 1;
    }, 250);
  });
});
// ===================== OUR SERVICES – CARD NAVIGATION =====================
document.querySelectorAll(".matrix-card").forEach(card => {
  const url = card.getAttribute("data-url");
  if (!url) return;

  card.addEventListener("click", () => {
    // small click effect handled by :active in CSS
    window.location.href = url;
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = url;
    }
  });
});


// ===================== MATRIX CODE RAIN EFFECT =====================
(function initCodeRain() {
  const canvas = document.getElementById("codeRain");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const section = document.querySelector(".services-matrix-section");

  const letters = "01AIΛΞ∑≡▌█▓░";
  const fontSize = 16;
  let columns;
  let drops = [];

  function resizeCanvas() {
    if (!section) return;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) drops[i] = 1;
  }

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.20)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00eaff";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.93) {
        drops[i] = 0;
      }
      drops[i]+= 0.35;
    }

    requestAnimationFrame(drawMatrix);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  requestAnimationFrame(drawMatrix);
})();


// ===================== PARALLAX FOR BACKGROUND IMAGE =====================
(function initBgParallax() {
  const bgImg = document.querySelector(".services-bg-img");
  const section = document.querySelector(".services-matrix-section");
  if (!bgImg || !section) return;

  function handleScroll() {
    const rect = section.getBoundingClientRect();
    const scrollRatio = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const clamped = Math.max(0, Math.min(1, scrollRatio));
    const y = clamped * 40 - 20; // -20px to +20px range
    bgImg.style.transform = `translateY(${y}px) scale(1.12)`;
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
})();

/* ============================================================
   MOBILE AUTO-CAROUSEL – OUR WORK SECTION
   - Runs only on mobile widths
   - Slides cards from right to left in a loop
============================================================ */

function initMobileWorkCarousel() {
  const carousel = document.querySelector('.work-mobile-carousel');
  if (!carousel) return;

  // Only run on mobile / small tablets
  const mq = window.matchMedia('(max-width: 768px)');
  let autoTimer = null;

  const STEP = 260;      // 🔧 how far to move each step (px)
  const INTERVAL = 2800; // 🔧 delay between moves (ms)

  function goNext() {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    // If near the end, jump back to start
    if (carousel.scrollLeft + 10 >= maxScroll) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: STEP, behavior: 'smooth' });
    }
  }

  function startAuto() {
    if (!mq.matches) return;        // only if small screen
    stopAuto();
    autoTimer = setInterval(goNext, INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Pause when user interacts, resume after a short delay
  let restartTimeout = null;
  function scheduleRestart() {
    clearTimeout(restartTimeout);
    restartTimeout = setTimeout(startAuto, 3500);
  }

  ['touchstart', 'mousedown', 'pointerdown', 'wheel'].forEach(evt => {
    carousel.addEventListener(evt, () => {
      stopAuto();
      scheduleRestart();
    }, { passive: true });
  });

  // React to viewport changes (rotate device etc.)
  mq.addEventListener('change', () => {
    if (mq.matches) startAuto();
    else stopAuto();
  });

  // Kick things off
  if (mq.matches) startAuto();
}

// Run once DOM is ready
document.addEventListener('DOMContentLoaded', initMobileWorkCarousel);
//harshek//
/* ===================== VIDEO MODAL LOGIC ===================== */

const modal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("workVideoPlayer");
const backdrop = document.querySelector(".video-modal-backdrop");

// Replace thumbnail click → open modal with video
document.querySelectorAll(".work-item, .work-mobile-card").forEach(item => {
  item.addEventListener("click", () => {
    
    // 🔧 Add Cloudinary video link here
    const videoURL = item.dataset.video || "CLOUDINARY_VIDEO_URL";

    videoPlayer.src = videoURL;
    modal.style.display = "flex";
    videoPlayer.play();
  });
});

// Close when clicking outside video
backdrop.addEventListener("click", () => {
  modal.style.display = "none";
  videoPlayer.pause();
  videoPlayer.src = "";
});

//harshek end//

// ===================== CTA GHOST TEXT PARALLAX =====================
(function initCtaGhostParallax() {
  const ctaGhost = document.querySelector(".cta-ghost-text");
  if (!ctaGhost) return;

  function onScrollCTA() {
    const scrollY = window.scrollY || window.pageYOffset;
    const movement = scrollY * 0.10; // tweak intensity if needed
    ctaGhost.style.transform =
      `translate(-50%, calc(-50% + ${movement}px))`;
  }

  window.addEventListener("scroll", onScrollCTA, { passive: true });
  onScrollCTA(); // initial position
})();
// ===================== FAQ ACCORDION (Reusable) =====================
(function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // close all
      faqItems.forEach((i) => i.classList.remove("active"));

      // open current if it was closed
      if (!isOpen) item.classList.add("active");
    });
  });
})();

// ===================== FAQ GHOST TEXT PARALLAX =====================
(function initFaqGhostParallax() {
  const ghost = document.querySelector(".faq-ghost-text");
  const section = document.querySelector(".faq-section");
  if (!ghost || !section) return;

  function onScroll() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // ratio of section center relative to viewport
    const centerOffset = (rect.top + rect.height / 2) - vh / 2;
    const normalized = centerOffset / vh; // -1 .. 1
    const translateY = normalized * 40;   // adjust travel strength

    ghost.style.transform =
      `translate(-50%, calc(-50% + ${translateY}px))`;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
/* ==========================================================
   AI SHOWCASE – AUTO CAROUSEL + CLICK-TO-PLAY
========================================================== */
(function () {
  const track = document.querySelector('.ai-showcase-track');
  if (!track) return;

  const STEP_DELAY = 4500; // ms between slides
  let currentIndex = 0;
  let visibleCount = getVisibleCount();
  let autoplayId = null;

  // ---- duplicate cards for seamless loop ----
  const originalCards = Array.from(track.children);
  const originalCount = originalCards.length;

  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });

  const allCards = Array.from(track.children);

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 1024) return 2;
    return 4; // desktop
  }

  function updateTransform(animate = true) {
    visibleCount = getVisibleCount();
    const stepPercent = 100 / visibleCount; // each step = 1 card width
    if (!animate) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.7s cubic-bezier(.25,.85,.35,1)';
    }
    const offset = -currentIndex * stepPercent;
    track.style.transform = `translateX(${offset}%)`;
  }

  function nextStep() {
    currentIndex += 1;
    updateTransform(true);

    // when we've slid through all original cards, snap back using clones
    if (currentIndex >= originalCount) {
      setTimeout(() => {
        currentIndex = currentIndex - originalCount;
        updateTransform(false); // snap without animation
      }, 720); // a bit more than transition time
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(nextStep, STEP_DELAY);
  }

  function stopAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  // responsive recalculation
  window.addEventListener('resize', () => {
    updateTransform(false);
  });

  // ---- click-to-play handling ----
  function setupVideoHandlers() {
    allCards.forEach(card => {
      const thumb = card.querySelector('.ai-showcase-thumb');
      const video = card.querySelector('.ai-showcase-video');
      if (!thumb || !video) return;

      thumb.addEventListener('click', () => {
        // pause all other videos
        allCards.forEach(c => {
          const v = c.querySelector('.ai-showcase-video');
          const th = c.querySelector('.ai-showcase-thumb');
          if (v && v !== video) {
            v.pause();
            if (th) th.classList.remove('playing');
          }
        });

        if (video.paused) {
          video.play().catch(() => {});
          thumb.classList.add('playing');
        } else {
          video.pause();
          thumb.classList.remove('playing');
        }
      });
    });
  }

  setupVideoHandlers();
  updateTransform(false);
  startAutoplay();

  // optional: pause on hover for desktop
  const windowEl = document.querySelector('.ai-showcase-window');
  if (windowEl && window.matchMedia('(hover: hover)').matches) {
    windowEl.addEventListener('mouseenter', stopAutoplay);
    windowEl.addEventListener('mouseleave', startAutoplay);
  }
})();

/* ============================================================
   NAVBAR + MOBILE MENU + BEAM CURSOR (Contact Page Safe Version)
   Fully wrapped in DOMContentLoaded so elements always exist.
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ----------------------------
     DEVICE DETECTION
  ---------------------------- */
  const isMobile = /Android|iPhone|iPad|iPod|Windows Phone|webOS|BlackBerry/i.test(
    navigator.userAgent
  );

  /* ----------------------------
   BEAM CURSOR (DESKTOP ONLY, FIXED)
---------------------------- */
(function () {
  const beam = document.getElementById("beamCursor");
  if (!beam) return;

  // treat touch devices as "no beam"
  const isTouch =
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) ||
    isMobile;

  if (isTouch) {
    beam.style.display = "none";
    return;
  }

  // follow cursor using left/top so CSS transform stays intact
  document.addEventListener("mousemove", (e) => {
    beam.style.left = e.clientX + "px";
    beam.style.top  = e.clientY + "px";
  });
})();

const beam = document.getElementById("beamCursor");
document.addEventListener("mousemove", (e) => {
  beam.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});



  /* --------------------------------
     5. FILE INPUT HANDLING
  -------------------------------- */
  function initFileInput() {
    const fileInput = doc.getElementById('referenceUpload');
    if (!fileInput) return;

    const wrapper =
      fileInput.closest('.file-input-wrapper') || fileInput.parentElement;
    if (!wrapper) return;

    if (!wrapper.hasAttribute('tabindex')) wrapper.setAttribute('tabindex', '0');

    fileInput.addEventListener('change', () => {
      const f = fileInput.files && fileInput.files[0];
      if (f) {
        wrapper.setAttribute('data-filename', f.name);
        wrapper.classList.add('has-file');
      } else {
        wrapper.removeAttribute('data-filename');
        wrapper.classList.remove('has-file');
      }
    });

    wrapper.addEventListener('click', (e) => {
      if (e.target === wrapper) fileInput.click();
    });
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
      }
    });
  }

  /* --------------------------------
     6. BUTTON RIPPLE
  -------------------------------- */
  function initRipple() {
    if (prefersReducedMotion()) return;
    const submitBtn = doc.querySelector('.contact-submit-btn');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = doc.createElement('span');
      ripple.className = 'ripple';

      const size = Math.max(rect.width, rect.height) * 1.2;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), {
        once: true,
      });
      setTimeout(() => {
        if (ripple.parentNode) ripple.remove();
      }, 900);
    });
  }

  /* --------------------------------
     7. STAGGERED FORM ENTRANCE
  -------------------------------- */
  function initStaggeredEntrances() {
    const form = doc.querySelector('.contact-form');
    if (form) {
      const groups = Array.from(form.querySelectorAll('.form-group'));
      groups.forEach((g, i) => {
        g.style.animationDelay = i * 80 + 'ms';
      });

      requestAnimationFrame(() =>
        requestAnimationFrame(() => form.classList.add('stagger-enter'))
      );

      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach((input) => {
        input.addEventListener('focus', () =>
          input.classList.add('input-focus')
        );
        input.addEventListener('blur', () =>
          input.classList.remove('input-focus')
        );
      });
    }

    const directCard = doc.querySelector('.contact-direct-card');
    if (directCard) {
      const items = Array.from(directCard.querySelectorAll('.direct-item'));
      items.forEach((it, i) => {
        it.style.animationDelay = i * 110 + 'ms';
        it.classList.add('direct-stagger');
      });
    }
  }

  /* --------------------------------
     8. INPUT VALIDATION VISUAL
  -------------------------------- */
  function initInputValidation() {
    const inputs = doc.querySelectorAll(
      '.contact-form input, .contact-form textarea, .contact-form select'
    );
    inputs.forEach((input) => {
      const checkValidity = () => {
        const wrapper = input.closest('.form-group');
        if (!wrapper) return;
        if (input.value.trim().length > 0) {
          wrapper.classList.add('valid');
        } else {
          wrapper.classList.remove('valid');
        }
      };
      input.addEventListener('input', checkValidity);
      input.addEventListener('blur', checkValidity);
    });
  }

  /* --------------------------------
     9. FORM SUBMIT + SUCCESS MODAL
  -------------------------------- */
  function initFormSubmit() {
    const form = doc.getElementById('contactForm');
    const modal = doc.getElementById('successModal');
    const closeModalBtn = doc.getElementById('closeModalBtn');

    if (!form || !modal) return;
    const submitBtn = form.querySelector('.contact-submit-btn');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Sending...';
      submitBtn.style.opacity = '0.7';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
        form.reset();

        // clear valid states
        const groups = form.querySelectorAll('.form-group');
        groups.forEach((g) => g.classList.remove('valid'));

        const fileWrapper = doc.querySelector('.file-input-wrapper');
        if (fileWrapper) {
          fileWrapper.removeAttribute('data-filename');
          fileWrapper.classList.remove('has-file');
        }

        modal.classList.add('active');
      }, 1500);
    });

    function closeModal() {
      modal.classList.remove('active');
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    doc.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* --------------------------------
     10. STACK REEL
  -------------------------------- */
  function initStackReel() {
    const reelWindow = doc.getElementById('stackReel');
    if (!reelWindow) return;

    const cards = Array.from(reelWindow.querySelectorAll('.reel-card'));
    if (cards.length < 2) return;

    const rotateCards = () => {
      const activeIndex = cards.findIndex((c) => c.classList.contains('active'));
      const nextIndex = (activeIndex + 1) % cards.length;
      const backIndex = (activeIndex + 2) % cards.length;

      cards.forEach((c) => c.classList.remove('active', 'next', 'back'));
      cards[nextIndex].classList.add('active');
      cards[backIndex].classList.add('next');
      cards[activeIndex].classList.add('back');
    };

    let interval = setInterval(rotateCards, 4000);

    reelWindow.addEventListener('mouseenter', () => clearInterval(interval));
    reelWindow.addEventListener('mouseleave', () => {
      interval = setInterval(rotateCards, 4000);
    });
    reelWindow.addEventListener('click', () => {
      clearInterval(interval);
      rotateCards();
      interval = setInterval(rotateCards, 4000);
    });
  }

  /* --------------------------------
     11. INIT ALL ON DOM READY
  -------------------------------- */
  doc.addEventListener('DOMContentLoaded', () => {
    addReducedMotionClass();
    initBeamCursor();

    // NAV
    initDesktopDropdowns();
    initMobileMenu();
    initNavScrollLinks();

    // CONTACT FEATURES
    initFileInput();
    initRipple();
    initStaggeredEntrances();
    initInputValidation();
    initFormSubmit();
    initStackReel();
  });
// })();

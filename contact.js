/* ============================================================
   Easein Studio — Contact Page JavaScript
   Clean • Stable • Production Ready
============================================================ */

console.log("Contact JS Loaded");

const doc = document;

/* ============================================================
   MAIN INIT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initBeamCursor();
  initFileInput();
  initRipple();
  initStaggeredEntrances();
  initInputValidation();
  initFormSubmit();
  initStackReel();
});

/* ============================================================
   BEAM CURSOR (DESKTOP ONLY)
============================================================ */
function initBeamCursor() {
  const beam = doc.getElementById("beamCursor");
  if (!beam) return;

  const isTouch =
    window.matchMedia("(pointer: coarse)").matches ||
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isTouch) {
    beam.style.display = "none";
    return;
  }

  document.addEventListener("mousemove", (e) => {
    beam.style.left = e.clientX + "px";
    beam.style.top = e.clientY + "px";
  });
}

/* ============================================================
   FILE INPUT
============================================================ */
function initFileInput() {
  const fileInput = doc.getElementById("referenceUpload");
  if (!fileInput) return;

  const wrapper =
    fileInput.closest(".file-input-wrapper") || fileInput.parentElement;

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      wrapper.setAttribute("data-filename", file.name);
      wrapper.classList.add("has-file");
    } else {
      wrapper.removeAttribute("data-filename");
      wrapper.classList.remove("has-file");
    }
  });

  wrapper.addEventListener("click", () => fileInput.click());
}

/* ============================================================
   BUTTON RIPPLE EFFECT
============================================================ */
function initRipple() {
  const btn = doc.querySelector(".contact-submit-btn");
  if (!btn) return;

  btn.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = doc.createElement("span");
    ripple.className = "ripple";

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  });
}

/* ============================================================
   STAGGER ANIMATION
============================================================ */
function initStaggeredEntrances() {
  const form = doc.querySelector(".contact-form");
  if (!form) return;

  const groups = form.querySelectorAll(".form-group");
  groups.forEach((g, i) => {
    g.style.animationDelay = i * 80 + "ms";
  });

  requestAnimationFrame(() =>
    form.classList.add("stagger-enter")
  );
}

/* ============================================================
   INPUT VALIDATION UI
============================================================ */
function initInputValidation() {
  const inputs = doc.querySelectorAll(
    ".contact-form input, .contact-form textarea, .contact-form select"
  );

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const group = input.closest(".form-group");
      if (!group) return;

      if (input.value.trim() !== "") {
        group.classList.add("valid");
      } else {
        group.classList.remove("valid");
      }
    });
  });
}

/* ============================================================
   FORM SUBMIT
============================================================ */
function initFormSubmit() {
  const form = doc.getElementById("contactForm");
  if (!form) return;

  const submitBtn = form.querySelector(".contact-submit-btn");
  const successModal = doc.getElementById("successModal");
  const errorModal = doc.getElementById("errorModal");
  const errorMessage = doc.getElementById("errorMessage");

  const closeSuccessBtn = doc.getElementById("closeModalBtn");
  const closeErrorBtn = doc.getElementById("closeErrorBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Sending...';

    fetch("contact_api.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          form.reset();
          showModal(successModal);
        } else {
          showError(
            data.message || "Submission failed. Please try again."
          );
        }
      })
      .catch((err) => {
        showError("Network error. Please check your internet.");
        console.error(err);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      });
  });

  function showModal(modal) {
    modal?.classList.add("active");
  }

  function hideModal(modal) {
    modal?.classList.remove("active");
  }

  function showError(msg) {
    if (!errorModal) return;
    errorMessage.textContent = msg;
    hideModal(successModal);
    showModal(errorModal);
  }

  closeSuccessBtn?.addEventListener("click", () =>
    hideModal(successModal)
  );
  closeErrorBtn?.addEventListener("click", () =>
    hideModal(errorModal)
  );

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideModal(successModal);
      hideModal(errorModal);
    }
  });
}

/* ============================================================
   STACK REEL ROTATION
============================================================ */
function initStackReel() {
  const reel = doc.getElementById("stackReel");
  if (!reel) return;

  const cards = Array.from(reel.querySelectorAll(".reel-card"));
  if (cards.length < 2) return;

  let index = 0;

  setInterval(() => {
    cards.forEach((c) =>
      c.classList.remove("active", "next", "back")
    );

    cards[index % cards.length].classList.add("active");
    cards[(index + 1) % cards.length].classList.add("next");
    cards[(index + 2) % cards.length].classList.add("back");

    index++;
  }, 4000);
}

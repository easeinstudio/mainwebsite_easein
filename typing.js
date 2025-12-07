// js/typing.js — lightweight typing animation for a single element

(function () {
  function typeText(el, text, opts) {
    const delay = opts.delay || 40;
    const caret = opts.caret || true;
    let i = 0;
    el.textContent = '';

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = text; // respect reduced motion
      return;
    }

    const interval = setInterval(() => {
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        // add small blink at end
        el.classList.add('typer-done');
      }
    }, delay);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const el = document.querySelector('.typer');
    if (!el) return;

    const text = el.getAttribute('data-text') || el.textContent.trim();
    // small delay before typing starts, to let card animation finish
    setTimeout(() => typeText(el, text, { delay: 26 }), 220);
  });
})();


  // Safe popup handlers — query DOM when needed and guard against missing elements.
  (function() {
    

    function openQuoteModal() {
      const modal = document.getElementById('quote-popup');
      const body = document.body;
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('active');
      if (body) body.style.overflow = 'hidden';
      setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 100);
    }

    function closeQuoteModal() {
      const modal = document.getElementById('quote-popup');
      const body = document.body;
      if (!modal) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      if (body) body.style.overflow = 'auto';
    }

    // Expose for inline `onclick` usage in the HTML
    window.openQuoteModal = openQuoteModal;
    window.closeQuoteModal = closeQuoteModal;

    // Close on Escape key (safe-guarded)
    document.addEventListener('keydown', function(event) {
      const modal = document.getElementById('quote-popup');
      if (event.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeQuoteModal();
      }
    });

    // --- Form Submission Logic (Connects to API) ---
    const form = document.getElementById('easein-contact-form');
    if (form) {
      const submitBtn = form.querySelector('.contact-submit-btn');

      form.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop page reload

        // 1. Loading State (only if button exists)
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
          submitBtn.disabled = true;
        }

        // 2. Prepare Data
        const formData = new FormData(form);

        // 3. Send to API
        fetch('https://easeinstudio.com/contact_api.php', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data && data.success) {
  const overlay = document.getElementById('successOverlay');
  const plane = document.getElementById('paperPlane');
  const text  = document.getElementById('successText');

  document.body.style.overflow = 'hidden';
  overlay.style.display = 'flex';

  // Start position (center)
  let x = window.innerWidth / 2 - 40;
  let y = window.innerHeight / 2 - 40;

  plane.style.transform = `translate(${x}px, ${y}px) rotate(0deg)`;
  plane.style.opacity = '1';

  // Random floating movement
  let steps = 0;
  const floatInterval = setInterval(() => {
    steps++;

    x += (Math.random() - 0.5) * 120;
    y += (Math.random() - 0.5) * 80;

    const rot = (Math.random() - 0.5) * 40;

    plane.animate(
      [
        { transform: plane.style.transform },
        { transform: `translate(${x}px, ${y}px) rotate(${rot}deg)` }
      ],
      { duration: 450, easing: 'ease-in-out', fill: 'forwards' }
    );

    plane.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;

    if (steps >= 6) {
      clearInterval(floatInterval);

      // Fly away
      plane.animate(
        [
          { transform: plane.style.transform, opacity: 1 },
          { transform: `translate(${x + 300}px, ${y - 500}px) rotate(60deg)`, opacity: 0 }
        ],
        { duration: 900, easing: 'ease-in', fill: 'forwards' }
      );

      // Show success text
      setTimeout(() => {
        text.animate(
          [
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          { duration: 500, easing: 'ease-out', fill: 'forwards' }
        );
      }, 600);

      // Redirect
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }
  }, 350);

  return;
}
 else {
            // Validation Error (from PHP)
            alert('Error: ' + ((data && data.message) || 'Unknown error occurred.'));
            if (data && data.errors) console.error('Validation errors:', data.errors);
          }
        })
        .catch(error => {
          console.error('Network Error:', error);
          alert('Network error. Please try again later.');
        })
        .finally(() => {
          // 4. Reset Button State (only if button exists)
          if (submitBtn) {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
          }
        });
      });
    } else {
      // No form present — nothing to attach. Avoid runtime errors.
    }

  })();
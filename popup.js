
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
            // Success: Alert user, reset form, close modal
            alert('Thank you! Your message has been sent successfully.');
            form.reset();
            closeQuoteModal();
          } else {
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
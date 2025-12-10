
  // --- UI Elements ---
  const modal = document.getElementById('quote-popup');
  const body = document.body;
  const form = document.getElementById('easein-contact-form');
  const submitBtn = form.querySelector('.contact-submit-btn');

  // --- Modal Functions ---
  function openQuoteModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    body.style.overflow = 'hidden';
    setTimeout(() => {
      const firstInput = modal.querySelector('input');
      if(firstInput) firstInput.focus();
    }, 100);
  }

  function closeQuoteModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    body.style.overflow = 'auto';
  }

  // Close on Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeQuoteModal();
    }
  });

  // --- Form Submission Logic (Connects to API) ---
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop page reload

    // 1. Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // 2. Prepare Data
    const formData = new FormData(form);

    // 3. Send to API
    fetch('https://easeinstudio.com/contact_api.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Success: Alert user, reset form, close modal
        alert("Thank you! Your message has been sent successfully.");
        form.reset();
        closeQuoteModal();
      } else {
        // Validation Error (from PHP)
        alert('Error: ' + (data.message || 'Unknown error occurred.'));
        if (data.errors) {
          console.error('Validation errors:', data.errors);
        }
      }
    })
    .catch(error => {
      console.error('Network Error:', error);
      alert('Network error. Please try again later.');
    })
    .finally(() => {
      // 4. Reset Button State
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    });
  });
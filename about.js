/* ==========================================================================
   ABOUT.JS - Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. SCROLL REVEAL ANIMATION (Intersection Observer)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const revealOptions = {
    threshold: 0.15, // Trigger animation when 15% of element is visible
    rootMargin: "0px 0px -50px 0px" // Offset slightly so it triggers before bottom
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the class that triggers CSS opacity/transform
        entry.target.classList.add('visible');
        
        // Stop observing once animated (so it doesn't fade out again)
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });



  // 3. SMOOTH SCROLL FOR BUTTONS
  // --------------------------------------------------------------------------
  // Handles the "Our Vision & Mission" ghost button or any anchor links
  document.querySelectorAll('a[href^="#"], button[data-scroll-target]').forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      // Determine target ID
      let targetId;
      if (this.hasAttribute('data-scroll-target')) {
        targetId = this.getAttribute('data-scroll-target');
      } else {
        targetId = this.getAttribute('href');
      }

      // Check if target exists on this page
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Calculate header offset
          const headerOffset = 90;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });

});
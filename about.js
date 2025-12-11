/* ==========================================================================
   ABOUT.JS - Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. STANDARD REVEAL ANIMATION (Fade In Up)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const revealOptions = {
    threshold: 0.15, 
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });


  // 2. TIMELINE PROCESS ANIMATION (Dark to Light on Scroll)
  // --------------------------------------------------------------------------
  // Triggers when the timeline item is 40% visible in the viewport
  const timelineItems = document.querySelectorAll('.timeline-item');

  const timelineObserverOptions = {
    threshold: 0.4, 
    rootMargin: "0px 0px -10% 0px"
  };

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Toggle 'active' class: Lights up when in view, goes dark when out
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, timelineObserverOptions);

  timelineItems.forEach(item => {
    timelineObserver.observe(item);
  });


  // 3. SMOOTH SCROLL FOR BUTTONS
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"], button[data-scroll-target]').forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      let targetId;
      if (this.hasAttribute('data-scroll-target')) {
        targetId = this.getAttribute('data-scroll-target');
      } else {
        targetId = this.getAttribute('href');
      }

      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
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
/* ========================================
   ARUJIVA — SANGAMA ONCO CONCLAVE 2026
   Home Page Logic
   ======================================== */

(function () {
  'use strict';

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Scroll Reveal ──
  const reveals = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ── Navbar hide-on-scroll ──
  const nav = document.querySelector('.ataraxis-header');
  let lastScrollTop = 0;
  const scrollThreshold = 100;

  if (nav) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      // Don't do anything if we haven't scrolled past the threshold
      if (Math.abs(lastScrollTop - currentScroll) <= 5) return;

      if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
        // Scroll Down
        nav.classList.add('header-hidden');
      } else {
        // Scroll Up
        nav.classList.remove('header-hidden');
      }
      
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
  }

})();

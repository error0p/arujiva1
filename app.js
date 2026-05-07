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

  // ── Navbar scroll effect ──
  const nav = document.getElementById('top-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(7, 34, 74, 0.95)';
        nav.style.padding = '0.5rem 0';
        nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
      } else {
        nav.style.background = 'rgba(255, 255, 255, 0.1)';
        nav.style.padding = '0';
        nav.style.boxShadow = 'none';
      }
    });
  }

})();

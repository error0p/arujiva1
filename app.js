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
      { threshold: 0.05 }
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

  const navLinks = document.querySelectorAll('.header-links a, .header-actions a, .dropdown-item');

  // Detect active link by URL
  function getActiveLink() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';
    
    let active = null;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === page) {
        active = link;
      }
    });
    return active || document.querySelector('.header-links a.active');
  }

  const activeLink = getActiveLink();
  if (activeLink) activeLink.classList.add('active');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ── Mobile Menu Toggle ──
  const mobileToggle = document.getElementById('mobile-toggle');
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('nav-open');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav-open');
      });
    });
  }

  // ── Back to Top Logic ──
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ── Hero Carousel Logic ──
  const heroCarouselItems = document.querySelectorAll('#hero-carousel .carousel-item');
  if (heroCarouselItems.length > 1) {
    let currentHeroIndex = 0;
    setInterval(() => {
      heroCarouselItems[currentHeroIndex].classList.remove('active');
      currentHeroIndex = (currentHeroIndex + 1) % heroCarouselItems.length;
      heroCarouselItems[currentHeroIndex].classList.add('active');
    }, 5000); // Cross-fade every 5 seconds
  }

})();

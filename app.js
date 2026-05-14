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

  // ── Nav Marker (Sliding Triangle) ──
  const navMarker = document.querySelector('.nav-marker');
  const navLinks = document.querySelectorAll('.header-links a, .header-actions a');

  function moveMarker(link) {
    if (!navMarker || !link) return;
    const rect = link.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const center = rect.left + rect.width / 2 - navRect.left;
    navMarker.style.transform = `translateX(${center - 5}px)`;
  }

  // Detect active link by URL
  function getActiveLink() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';
    
    let active = null;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === page || (page === 'index.html' && href === 'index.html')) {
        active = link;
      }
    });
    return active || document.querySelector('.header-links a.active') || navLinks[0];
  }

  const activeLink = getActiveLink();
  if (activeLink) activeLink.classList.add('active');
  
  setTimeout(() => moveMarker(activeLink), 150);

  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => moveMarker(link));
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      moveMarker(link);
    });
  });

  if (nav) {
    nav.addEventListener('mouseleave', () => {
      const currentActive = document.querySelector('.active') || activeLink;
      moveMarker(currentActive);
    });
  }

  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.active') || activeLink;
    moveMarker(currentActive);
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

})();

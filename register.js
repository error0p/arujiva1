/* ========================================
   REGISTER PAGE — Form Logic
   ======================================== */

(function () {
  'use strict';

  const form = document.getElementById('registration-form');
  const formCard = document.getElementById('form-card');
  const successCard = document.getElementById('success-card');
  const refBadge = document.getElementById('ref-badge');
  const abstractHint = document.getElementById('abstract-hint');

  // ── Clear errors on input ──
  document.querySelectorAll('.field input, .field select').forEach(el => {
    const handler = () => {
      el.classList.remove('has-error');
      const err = el.closest('.field').querySelector('.err');
      if (err) err.classList.remove('show');
    };
    el.addEventListener('input', handler);
    el.addEventListener('change', handler);
  });

  // ── Radio card visual toggle ──
  document.querySelectorAll('.radio-card input, .radio-inline input').forEach(radio => {
    radio.addEventListener('change', () => {
      const group = radio.closest('.field');
      if (group) {
        const err = group.querySelector('.err');
        if (err) err.classList.remove('show');
      }
    });
  });

  // ── Show/hide PG Student template notice ──
  const positionSelect = document.getElementById('position');
  const pgTemplateNotice = document.getElementById('pg-template-notice');
  positionSelect.addEventListener('change', () => {
    pgTemplateNotice.style.display = positionSelect.value === 'PG Student' ? 'flex' : 'none';
  });

  // ── Show/hide abstract hint ──
  document.querySelectorAll('input[name="presenting"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'Yes' && radio.checked) {
        abstractHint.style.display = 'flex';
      } else {
        abstractHint.style.display = 'none';
      }
    });
  });

  // ── Validation ──
  function showError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const input = field.querySelector('input, select');
    const err = field.querySelector('.err');
    if (input) input.classList.add('has-error');
    if (err) err.classList.add('show');
  }

  function showRadioError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const err = field.querySelector('.err');
    if (err) err.classList.add('show');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validate() {
    // Clear all
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    document.querySelectorAll('.err.show').forEach(el => el.classList.remove('show'));

    let valid = true;
    let firstError = null;

    // Personal Info
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const institution = document.getElementById('institution').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value;

    if (!fullname) { showError('f-fullname'); valid = false; firstError = firstError || 'f-fullname'; }
    if (!email || !isValidEmail(email)) { showError('f-email'); valid = false; firstError = firstError || 'f-email'; }
    if (!mobile || mobile.replace(/\D/g, '').length < 7) { showError('f-mobile'); valid = false; firstError = firstError || 'f-mobile'; }
    if (!institution) { showError('f-institution'); valid = false; firstError = firstError || 'f-institution'; }
    if (!city) { showError('f-city'); valid = false; firstError = firstError || 'f-city'; }
    if (!state) { showError('f-state'); valid = false; firstError = firstError || 'f-state'; }

    // Category
    const category = document.querySelector('input[name="category"]:checked');
    if (!category) { showRadioError('f-category'); valid = false; firstError = firstError || 'f-category'; }

    // Professional
    const medicine = document.getElementById('medicine').value;
    const councilReg = document.getElementById('council-reg').value.trim();
    const councilName = document.getElementById('council-name').value;
    const position = document.getElementById('position').value;
    const presenting = document.querySelector('input[name="presenting"]:checked');

    if (!medicine) { showError('f-medicine'); valid = false; firstError = firstError || 'f-medicine'; }
    if (!councilReg) { showError('f-council-reg'); valid = false; firstError = firstError || 'f-council-reg'; }
    if (!councilName) { showError('f-council-name'); valid = false; firstError = firstError || 'f-council-name'; }
    if (!position) { showError('f-position'); valid = false; firstError = firstError || 'f-position'; }
    if (!presenting) { showRadioError('f-presenting'); valid = false; firstError = firstError || 'f-presenting'; }


    // Declaration
    const declaration = document.getElementById('declaration').checked;
    if (!declaration) {
      const declErr = document.querySelector('#f-declaration .err');
      if (declErr) declErr.classList.add('show');
      valid = false;
      firstError = firstError || 'f-declaration';
    }

    // Scroll to first error
    if (firstError) {
      document.getElementById(firstError).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
  }

  // ── Submit ──
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    const submitBtn = document.getElementById('btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      const ref = 'SGM-' + String(Math.floor(100000 + Math.random() * 900000));
      refBadge.textContent = 'REF: ' + ref;

      form.style.display = 'none';
      document.querySelector('.form-card-title').style.display = 'none';
      document.querySelector('.form-card-sub').style.display = 'none';
      successCard.classList.add('show');
      successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }, 1800);
  });

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.fee-card, .form-card');
  reveals.forEach(el => el.classList.add('reveal'));

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
      { threshold: 0.08 }
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
      if (Math.abs(lastScrollTop - currentScroll) <= 5) return;

      if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
        nav.classList.add('header-hidden');
      } else {
        nav.classList.remove('header-hidden');
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
  }

  const navLinks = document.querySelectorAll('.header-links a, .header-actions a, .dropdown-item');

  function getActiveLink() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';
    let active = null;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === page) active = link;
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

})();

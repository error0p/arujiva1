/* ========================================
   ABSTRACT SUBMISSION — JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Title Character Counter ── */
  const abstractTitle      = document.getElementById('abstract-title');
  const titleCharCounter   = document.getElementById('title-char-counter');
  const MAX_TITLE_CHARS    = 150;

  if (abstractTitle && titleCharCounter) {
    abstractTitle.addEventListener('input', () => {
      const len = abstractTitle.value.length;
      titleCharCounter.textContent = `${len} / ${MAX_TITLE_CHARS} characters`;
      titleCharCounter.classList.remove('warn', 'over');
      if (len >= MAX_TITLE_CHARS)           titleCharCounter.classList.add('over');
      else if (len >= MAX_TITLE_CHARS * 0.85) titleCharCounter.classList.add('warn');
    });
  }

  /* ── Presenter Category → show/hide HOD Letter block ── */
  const categoryRadios   = document.querySelectorAll('input[name="presenterCategory"]');
  const hodLetterBlock   = document.getElementById('hod-letter-block');

  categoryRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (!hodLetterBlock) return;
      if (radio.value === 'Postgraduate Student' && radio.checked) {
        hodLetterBlock.style.display = 'block';
      } else if (radio.value === 'Faculty' && radio.checked) {
        hodLetterBlock.style.display = 'none';
        const hodInput = document.getElementById('hod-letter');
        if (hodInput) hodInput.value = '';
        const badge = document.getElementById('hod-file-badge');
        if (badge) { badge.textContent = 'No file chosen'; badge.classList.remove('show'); }
      }
    });
  });

  /* ── Ethics Approval → show/hide certificate upload ── */
  const ethicsRadios     = document.querySelectorAll('input[name="ethicsApproval"]');
  const ethicsCertBlock  = document.getElementById('ethics-cert-block');

  ethicsRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (!ethicsCertBlock) return;
      ethicsCertBlock.style.display = (radio.value === 'Yes' && radio.checked) ? 'block' : 'none';
    });
  });

  /* ── Previously Published → show/hide details textarea ── */
  const prevPublishedRadios = document.querySelectorAll('input[name="prevPublished"]');
  const prevDetailsBlock    = document.getElementById('prev-details-block');

  prevPublishedRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (!prevDetailsBlock) return;
      prevDetailsBlock.style.display = (radio.value === 'Yes' && radio.checked) ? 'block' : 'none';
    });
  });

  /* ── File Upload Handler Factory ── */
  function setupFileUpload(areaId, inputId, badgeId, maxMB) {
    const area  = document.getElementById(areaId);
    const input = document.getElementById(inputId);
    const badge = document.getElementById(badgeId);
    if (!area || !input || !badge) return;

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > maxMB * 1024 * 1024) {
        alert(`File size exceeds ${maxMB} MB. Please upload a smaller file.`);
        input.value = '';
        badge.textContent = 'No file chosen';
        badge.classList.remove('show');
        return;
      }
      badge.textContent = `📎 ${file.name}`;
      badge.classList.add('show');
    });

    area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('drag-over'); });
    area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        input.dispatchEvent(new Event('change'));
      }
    });
  }

  setupFileUpload('abstract-upload-area', 'abstract-file',      'abstract-file-badge', 2);
  setupFileUpload('hod-upload-area',      'hod-letter',          'hod-file-badge',      2);
  setupFileUpload('ethics-upload-area',   'ethics-certificate',  'ethics-file-badge',   2);

  /* ── Form Validation ── */
  const form        = document.getElementById('abstract-form');
  const btnSubmit   = document.getElementById('btn-abs-submit');
  const successCard = document.getElementById('abstract-success-card');
  const formCard    = document.getElementById('form-card');
  const absRefBadge = document.getElementById('abs-ref-badge');

  function showErr(fieldId, show) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const errEl = field.querySelector('.err');
    const input = field.querySelector('input:not([type="radio"]):not([type="checkbox"]):not([type="file"]), select, textarea');
    if (errEl) errEl.style.display = show ? 'block' : 'none';
    if (input) {
      if (show) input.classList.add('has-error');
      else      input.classList.remove('has-error');
    }
  }

  function showErrById(id, show) {
    const el = document.getElementById(id);
    if (el) el.style.display = show ? 'block' : 'none';
  }

  function validate() {
    let valid = true;

    /* Simple required text/email/select fields */
    const required = [
      { id: 'f-presenter-name',    field: 'presenter-name' },
      { id: 'f-presenter-email',   field: 'presenter-email' },
      { id: 'f-presenter-mobile',  field: 'presenter-mobile' },
      { id: 'f-institution',       field: 'institution' },
      { id: 'f-department',        field: 'department' },
      { id: 'f-system-of-medicine',field: 'system-of-medicine' },
      { id: 'f-abstract-title',    field: 'abstract-title' },
      { id: 'f-topic-category',    field: 'topic-category' },
    ];

    required.forEach(({ id, field }) => {
      const el = document.getElementById(field);
      const empty = !el || !el.value.trim();
      showErr(id, empty);
      if (empty) valid = false;
    });

    /* Email format */
    const emailEl = document.getElementById('presenter-email');
    if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      showErr('f-presenter-email', true);
      valid = false;
    }

    /* Presenter Category */
    const categorySelected = document.querySelector('input[name="presenterCategory"]:checked');
    showErrById('category-err', !categorySelected);
    if (!categorySelected) valid = false;

    /* Presentation Type */
    const ptypeSelected = document.querySelector('input[name="presentationType"]:checked');
    showErrById('ptype-err', !ptypeSelected);
    if (!ptypeSelected) valid = false;

    /* Abstract file (mandatory) */
    const abstractFile = document.getElementById('abstract-file');
    const hasAbstractFile = abstractFile && abstractFile.files && abstractFile.files.length > 0;
    showErrById('abstract-file-err', !hasAbstractFile);
    if (!hasAbstractFile) valid = false;

    /* Keywords (3–5) */
    const kwEl = document.getElementById('keywords');
    const kws  = (kwEl?.value || '').split(',').map(k => k.trim()).filter(Boolean);
    if (kws.length < 3 || kws.length > 5) {
      showErr('f-keywords', true);
      valid = false;
    } else {
      showErr('f-keywords', false);
    }

    /* HOD Letter — required for PG students */
    if (categorySelected && categorySelected.value === 'Postgraduate Student') {
      const hodFile = document.getElementById('hod-letter');
      const hasHod  = hodFile && hodFile.files && hodFile.files.length > 0;
      showErrById('hod-err', !hasHod);
      if (!hasHod) valid = false;
    } else {
      showErrById('hod-err', false);
    }

    /* Ethics Approval */
    const ethicsSelected = document.querySelector('input[name="ethicsApproval"]:checked');
    showErrById('ethics-err', !ethicsSelected);
    if (!ethicsSelected) valid = false;

    /* Previously Published */
    const prevSelected = document.querySelector('input[name="prevPublished"]:checked');
    showErrById('prev-published-err', !prevSelected);
    if (!prevSelected) valid = false;

    /* Declaration */
    const declEl  = document.getElementById('declaration');
    const declErr = document.getElementById('decl-err');
    if (!declEl?.checked) {
      if (declErr) declErr.style.display = 'block';
      valid = false;
    } else {
      if (declErr) declErr.style.display = 'none';
    }

    return valid;
  }

  if (form && btnSubmit) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) {
        /* Scroll to first error */
        const firstErr = form.querySelector('.err[style*="block"], .err:not([style])');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      btnSubmit.classList.add('loading');
      btnSubmit.disabled = true;

      setTimeout(() => {
        btnSubmit.classList.remove('loading');
        btnSubmit.disabled = false;

        form.style.display = 'none';
        successCard.classList.add('show');

        const ref = 'ABS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        if (absRefBadge) absRefBadge.textContent = `REF: ${ref}`;

        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1800);
    });

    /* Live clear errors on input */
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => {
        const field = el.closest('.field');
        if (field) {
          el.classList.remove('has-error');
          const errEl = field.querySelector('.err');
          if (errEl) errEl.style.display = 'none';
        }
      });
      el.addEventListener('change', () => {
        const field = el.closest('.field');
        if (field) {
          el.classList.remove('has-error');
          const errEl = field.querySelector('.err');
          if (errEl) errEl.style.display = 'none';
        }
      });
    });
  }

  /* ── Scroll Reveal ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  }

  /* ── Navbar hide-on-scroll ── */
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

});

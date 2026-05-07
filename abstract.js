/* ========================================
   ABSTRACT SUBMISSION — JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Word Counter ── */
  const abstractBody  = document.getElementById('abstract-body');
  const charCounter   = document.getElementById('char-counter');
  const MAX_WORDS     = 300;

  function countWords(text) {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  }

  if (abstractBody && charCounter) {
    abstractBody.addEventListener('input', () => {
      const words = countWords(abstractBody.value);
      charCounter.textContent = `${words} / ${MAX_WORDS} words`;
      charCounter.classList.remove('warn', 'over');
      if (words > MAX_WORDS)      charCounter.classList.add('over');
      else if (words > MAX_WORDS * 0.85) charCounter.classList.add('warn');
    });
  }

  /* ── Co-Author Rows ── */
  const authorRowsEl  = document.getElementById('author-rows');
  const btnAddAuthor  = document.getElementById('btn-add-author');
  let authorCount     = 0;

  function createAuthorRow() {
    authorCount++;
    const row = document.createElement('div');
    row.className = 'author-row';
    row.id = `author-row-${authorCount}`;
    row.innerHTML = `
      <div class="field">
        <label>Co-Author ${authorCount} Name</label>
        <input type="text" name="coAuthorName${authorCount}" placeholder="Full name" />
      </div>
      <div class="field">
        <label>Institution</label>
        <input type="text" name="coAuthorInst${authorCount}" placeholder="Institution / Hospital" />
      </div>
      <button type="button" class="btn-remove-author" title="Remove" data-row="author-row-${authorCount}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    authorRowsEl.appendChild(row);

    row.querySelector('.btn-remove-author').addEventListener('click', (e) => {
      const rowId = e.currentTarget.dataset.row;
      document.getElementById(rowId)?.remove();
    });
  }

  if (btnAddAuthor) {
    btnAddAuthor.addEventListener('click', () => {
      if (authorCount < 6) createAuthorRow();
      else alert('Maximum 6 co-authors allowed.');
    });
  }

  /* ── File Upload ── */
  const uploadArea    = document.getElementById('upload-area');
  const fileInput     = document.getElementById('supporting-file');
  const fileNameBadge = document.getElementById('file-name-badge');

  if (fileInput && fileNameBadge) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('File size exceeds 5 MB. Please upload a smaller file.');
          fileInput.value = '';
          fileNameBadge.classList.remove('show');
          return;
        }
        fileNameBadge.textContent = `📎 ${file.name}`;
        fileNameBadge.classList.add('show');
      }
    });
  }

  if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
      }
    });
  }

  /* ── Form Validation & Submit ── */
  const form          = document.getElementById('abstract-form');
  const btnSubmit     = document.getElementById('btn-abs-submit');
  const successCard   = document.getElementById('abstract-success-card');
  const formCard      = document.getElementById('form-card');
  const absRefBadge   = document.getElementById('abs-ref-badge');

  function showErr(fieldId, show) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const errEl = field.querySelector('.err');
    const input = field.querySelector('input, select, textarea');
    if (errEl) errEl.style.display = show ? 'block' : 'none';
    if (input) {
      if (show) input.classList.add('has-error');
      else      input.classList.remove('has-error');
    }
  }

  function validate() {
    let valid = true;

    const required = [
      { id: 'f-presenter-name', field: 'presenter-name' },
      { id: 'f-designation',    field: 'designation' },
      { id: 'f-abs-email',      field: 'abs-email' },
      { id: 'f-abs-mobile',     field: 'abs-mobile' },
      { id: 'f-abs-institution',field: 'abs-institution' },
      { id: 'f-abs-city',       field: 'abs-city' },
      { id: 'f-abstract-title', field: 'abstract-title' },
      { id: 'f-theme',          field: 'theme' },
    ];

    required.forEach(({ id, field }) => {
      const el = document.getElementById(field);
      const empty = !el || !el.value.trim();
      showErr(id, empty);
      if (empty) valid = false;
    });

    // Email format
    const emailEl = document.getElementById('abs-email');
    if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      showErr('f-abs-email', true);
      valid = false;
    }

    // Abstract body & word count
    const bodyEl = document.getElementById('abstract-body');
    const words  = countWords(bodyEl?.value || '');
    if (!bodyEl || !bodyEl.value.trim() || words > MAX_WORDS) {
      showErr('f-abstract-body', true);
      valid = false;
    } else {
      showErr('f-abstract-body', false);
    }

    // Keywords
    const kwEl = document.getElementById('keywords');
    const kws  = (kwEl?.value || '').split(',').map(k => k.trim()).filter(Boolean);
    if (kws.length < 3 || kws.length > 6) {
      showErr('f-keywords', true);
      valid = false;
    } else {
      showErr('f-keywords', false);
    }

    // Presentation type
    const ptypeSelected = document.querySelector('input[name="presentationType"]:checked');
    const ptypeErr = document.getElementById('ptype-err');
    if (!ptypeSelected) {
      if (ptypeErr) ptypeErr.style.display = 'block';
      valid = false;
    } else {
      if (ptypeErr) ptypeErr.style.display = 'none';
    }

    // Declaration
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
      if (!validate()) return;

      // Loading state
      btnSubmit.classList.add('loading');
      btnSubmit.disabled = true;

      setTimeout(() => {
        btnSubmit.classList.remove('loading');
        btnSubmit.disabled = false;

        // Show success
        form.style.display = 'none';
        successCard.classList.add('show');

        const ref = 'ABS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        if (absRefBadge) absRefBadge.textContent = `REF: ${ref}`;

        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1800);
    });

    // Live clear errors on change
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => {
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

});

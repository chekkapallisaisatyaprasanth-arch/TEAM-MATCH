/**
 * TeamMatch Technology Internships & Co-ops Module
 * Search, filter, listing cards, and interactive ATS resume application modal.
 */

import { store } from './state.js';
import { escapeHTML, openModal, closeModal, showToast } from './utils.js';

let activeApplyingInternshipId = null;

export function initInternshipsView() {
  renderInternships();

  store.subscribe((state, event) => {
    if (
      event === 'INTERNSHIP_FILTERS_CHANGED' || 
      event === 'INTERNSHIP_APPLIED'
    ) {
      renderInternships();
    }
  });

  // Setup Application modal submit listener
  const submitBtn = document.getElementById('btn-submit-application');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleApplicationSubmit);
  }
}

export function renderInternships() {
  const container = document.getElementById('internships-container');
  if (!container) return;

  const filters = store.state.internshipFilters;
  let list = store.state.internships;

  // Filter by search query
  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(i => 
      Boolean(i.company && i.company.toLowerCase().includes(q)) ||
      Boolean(i.role && i.role.toLowerCase().includes(q)) ||
      Boolean(i.location && i.location.toLowerCase().includes(q)) ||
      Boolean(i.tags && i.tags.some(t => t && t.toLowerCase().includes(q)))
    );
  }

  // Filter by workType
  if (filters.workType && filters.workType !== 'ALL') {
    list = list.filter(i => Boolean(i.workType && i.workType.toLowerCase().includes(filters.workType.toLowerCase())));
  }

  // Filter by verifiedOnly
  if (filters.verifiedOnly) {
    list = list.filter(i => i.verifiedPartner);
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-slate-900); letter-spacing: -0.02em;">
            Summer 2025 Technology Internships &amp; Co-ops
          </h2>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.2rem;">
            Explore curated software, AI research, cloud infrastructure, and product design roles.
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.825rem; color: var(--text-muted);">
          <span>Applied: <strong style="color: var(--color-primary-700);">${store.state.internships.filter(i => i.applied).length}</strong> / ${store.state.internships.length}</span>
        </div>
      </div>

      <!-- Filter Controls Toolbar -->
      <div style="background-color: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: var(--shadow-xs);">
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between;">
          <div style="flex: 1; min-width: 240px; position: relative;">
            <input 
              type="text" 
              id="intern-search-input" 
              class="form-input" 
              placeholder="Search companies, roles, technologies (e.g. Stripe, PyTorch, Go)..." 
              value="${escapeHTML(filters.query)}"
              style="padding-left: 2.25rem;"
            >
            <svg style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--color-slate-400);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <label for="intern-worktype-select" style="font-size: 0.825rem; font-weight: 600; color: var(--color-slate-700);">Location:</label>
              <select id="intern-worktype-select" class="form-select" style="width: auto; padding: 0.35rem 0.65rem; font-size: 0.825rem;">
                <option value="ALL" ${filters.workType === 'ALL' ? 'selected' : ''}>All Formats</option>
                <option value="Remote" ${filters.workType === 'Remote' ? 'selected' : ''}>Remote</option>
                <option value="Hybrid" ${filters.workType === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
                <option value="Onsite" ${filters.workType === 'Onsite' ? 'selected' : ''}>Onsite</option>
              </select>
            </div>

            <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.825rem; font-weight: 600; color: var(--color-slate-700); cursor: pointer;">
              <input type="checkbox" id="intern-verified-toggle" ${filters.verifiedOnly ? 'checked' : ''}>
              <span>Verified Partners Only</span>
            </label>
          </div>
        </div>

        <div style="font-size: 0.775rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.6rem; display: flex; justify-content: space-between; align-items: center;">
          <span>Showing <strong>${list.length}</strong> technology internship listings</span>
          <span style="font-style: italic;">Data Provenance: Curated mock listings for TeamMatch demonstration</span>
        </div>
      </div>

      <!-- Listings Grid -->
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${list.length === 0 ? `
          <div class="empty-state">
            <h3 class="empty-title">No internships match your current criteria</h3>
            <p class="empty-desc">Try resetting your keywords or clearing the remote/onsite filter.</p>
          </div>
        ` : list.map(item => `
          <article class="card" style="padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                  <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-slate-900);">${escapeHTML(item.company)}</h3>
                  ${item.verifiedPartner ? `
                    <span class="badge badge-verified" title="Verified Employer Partner on TeamMatch">
                      ✓ Verified Employer
                    </span>
                  ` : `
                    <span class="badge badge-gray">Curated Listing</span>
                  `}
                  <span class="badge badge-sky">${escapeHTML(item.workType)}</span>
                </div>
                <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-primary-700); margin-top: 0.2rem;">
                  ${escapeHTML(item.role)}
                </h4>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
                  <span>📍 ${escapeHTML(item.location)}</span>
                  <span>🗓 ${escapeHTML(item.term)}</span>
                  <span>⏰ Deadline: ${escapeHTML(item.deadline)}</span>
                </div>
              </div>

              <!-- Compensation & Status -->
              <div style="text-align: right;">
                <div style="font-size: 0.95rem; font-weight: 800; color: var(--color-emerald-700);">
                  ${escapeHTML(item.stipend)}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                  ${escapeHTML(item.eligibility)}
                </div>
              </div>
            </div>

            <p style="font-size: 0.85rem; color: var(--color-slate-700); line-height: 1.5;">
              ${escapeHTML(item.description)}
            </p>

            <!-- Tags -->
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${(item.tags || []).map(t => `<span class="skill-chip">${escapeHTML(t)}</span>`).join('')}
            </div>

            <!-- Card Action Footer -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 0.75rem;">
              <span style="font-size: 0.75rem; color: var(--text-muted);">
                ${escapeHTML(item.provenance)}
              </span>

              <div style="display: flex; gap: 0.5rem; align-items: center;">
                ${item.applied ? `
                  <div style="display: flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.75rem; background-color: var(--color-emerald-50); border: 1px solid var(--color-emerald-200); border-radius: var(--radius-md); font-size: 0.825rem; font-weight: 700; color: var(--color-emerald-700);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Applied (${item.applicationStatus || 'Under Review'})</span>
                  </div>
                ` : `
                  <button class="btn btn-primary btn-sm btn-open-apply-modal" data-intern-id="${item.id}">
                    Apply with ATS Resume
                  </button>
                `}
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;

  // Attach search and filter events
  const searchInput = document.getElementById('intern-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      store.setInternshipFilter('query', e.target.value);
    });
  }

  const workTypeSelect = document.getElementById('intern-worktype-select');
  if (workTypeSelect) {
    workTypeSelect.addEventListener('change', (e) => {
      store.setInternshipFilter('workType', e.target.value);
    });
  }

  const verifiedToggle = document.getElementById('intern-verified-toggle');
  if (verifiedToggle) {
    verifiedToggle.addEventListener('change', (e) => {
      store.setInternshipFilter('verifiedOnly', e.target.checked);
    });
  }

  // Application button listeners
  container.querySelectorAll('.btn-open-apply-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const internId = e.currentTarget.dataset.internId;
      openApplicationModal(internId);
    });
  });
}

function openApplicationModal(internshipId) {
  const item = store.state.internships.find(i => i.id === internshipId);
  if (!item) return;

  activeApplyingInternshipId = internshipId;

  const titleEl = document.getElementById('apply-internship-title');
  const compEl = document.getElementById('apply-internship-company');
  const bodyEl = document.getElementById('apply-internship-body');

  if (titleEl) titleEl.textContent = `Apply to ${item.company}`;
  if (compEl) compEl.textContent = `${item.role} &bull; ${item.location}`;

  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="background-color: var(--color-primary-50); border: 1px solid var(--color-primary-100); border-radius: var(--radius-md); padding: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.85rem; color: var(--color-primary-900);">Attached ATS Resume</strong>
            <button class="btn btn-ghost btn-xs" id="btn-edit-resume-from-apply" style="color: var(--color-primary-700);">View/Edit Resume</button>
          </div>
          <p style="font-size: 0.8rem; color: var(--color-primary-800); margin-top: 0.2rem;">
            ${escapeHTML(store.state.currentUser.name)} &bull; ${escapeHTML(store.state.resume.header.headline || store.state.currentUser.headline)}
          </p>
          <span style="font-size: 0.725rem; color: var(--color-primary-600); display: block; margin-top: 0.2rem;">
            ✓ Formatted in single-column machine-readable text
          </span>
        </div>

        <div class="form-group">
          <label for="apply-cover-note" class="form-label">
            <span>Personalized Pitch / Note to Hiring Team</span>
            <span class="form-label-helper">Optional (max 300 words)</span>
          </label>
          <textarea id="apply-cover-note" class="form-textarea" placeholder="Highlight relevant projects, coursework, or why you are excited about ${escapeHTML(item.company)}..."></textarea>
        </div>

        <div style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.4;">
          <strong>Consent Notice:</strong> Submitting will share your verified profile signals and attached ATS resume directly with ${escapeHTML(item.company)}'s recruiter portal on TeamMatch.
        </div>
      </div>
    `;

    const editResumeBtn = document.getElementById('btn-edit-resume-from-apply');
    if (editResumeBtn) {
      editResumeBtn.addEventListener('click', () => {
        closeModal('modal-apply-internship');
        store.setActiveTab('resume');
      });
    }
  }

  openModal('modal-apply-internship');
}

function handleApplicationSubmit() {
  if (!activeApplyingInternshipId) return;

  const noteEl = document.getElementById('apply-cover-note');
  const note = noteEl ? noteEl.value : '';

  const intern = store.state.internships.find(i => i.id === activeApplyingInternshipId);
  store.applyToInternship(activeApplyingInternshipId, { note });

  closeModal('modal-apply-internship');
  showToast(`Application successfully submitted to ${intern ? intern.company : 'Company'}!`, 'success', 3500);
  activeApplyingInternshipId = null;
}

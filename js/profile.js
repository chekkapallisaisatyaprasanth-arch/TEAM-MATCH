/**
 * TeamMatch Profile & Student Stats Module
 * Manages signed-in student profile editor, career stats breakdown, and validation.
 */

import { store } from './state.js';
import { escapeHTML, openModal, closeModal, showToast } from './utils.js';

export function initProfileView() {
  renderProfileTab();
  renderProfileEditModal();

  store.subscribe((state, event) => {
    if (event === 'USER_UPDATED') {
      renderProfileTab();
      renderProfileEditModal();
      updateHeaderProfileSurfaces();
    }
  });

  // Modal Save button
  const saveBtn = document.getElementById('btn-save-profile');
  if (saveBtn) {
    saveBtn.addEventListener('click', handleSaveProfile);
  }

  // Header profile button triggers Profile Tab or Modal
  const headerProfileBtn = document.getElementById('btn-user-profile-header');
  if (headerProfileBtn) {
    headerProfileBtn.addEventListener('click', () => {
      store.setActiveTab('profile');
    });
  }
}

export function updateHeaderProfileSurfaces() {
  const user = store.state.currentUser;
  const nameEl = document.getElementById('header-user-name');
  const avatarEl = document.getElementById('header-avatar-initials');

  if (nameEl) nameEl.textContent = user.name;
  if (avatarEl) avatarEl.textContent = user.avatar || user.name.slice(0, 2).toUpperCase();
}

export function renderProfileTab() {
  const container = document.getElementById('profile-container');
  if (!container) return;

  const user = store.state.currentUser;

  const gpaBadge = user.gpaPublic && user.gpa ? `
    <span class="badge ${user.gpaVerified ? 'badge-verified' : 'badge-selfreported'}">
      ${user.gpaVerified ? '✓ Verified' : 'Self-Reported'} GPA ${escapeHTML(user.gpa)}
    </span>
  ` : `<span class="badge badge-gray">GPA Confidential</span>`;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 900px; margin: 0 auto;">
      <!-- Profile Header Hero Card -->
      <div class="card" style="padding: 1.75rem; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; gap: 1.25rem; align-items: center;">
            <div class="avatar-badge" style="width: 5rem; height: 5rem; font-size: 1.75rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
              ${escapeHTML(user.avatar || 'AC')}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
                <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-slate-900);">${escapeHTML(user.name)}</h2>
                ${gpaBadge}
                <span class="badge badge-sky">Class of ${escapeHTML(user.gradYear)}</span>
              </div>
              <p style="font-size: 0.95rem; font-weight: 600; color: var(--color-primary-700); margin-top: 0.2rem;">
                ${escapeHTML(user.headline)}
              </p>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                ${escapeHTML(user.school)} &bull; ${escapeHTML(user.state)} (${escapeHTML(user.region)})
              </div>
            </div>
          </div>

          <button class="btn btn-primary btn-sm" id="btn-open-edit-profile-main">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Edit Profile
          </button>
        </div>

        <div style="margin-top: 1.25rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
          <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--color-slate-800); text-transform: uppercase;">About</h3>
          <p style="font-size: 0.9rem; color: var(--color-slate-700); line-height: 1.5; margin-top: 0.35rem;">
            ${escapeHTML(user.bio)}
          </p>
        </div>

        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); align-self: center; margin-right: 0.25rem;">Availability:</span>
          <span class="badge badge-amber">${escapeHTML(user.availability)}</span>
        </div>
      </div>

      <!-- Career Readiness & Student Stats Matrix -->
      <div class="card" style="padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-slate-900);">Student Career Readiness Benchmarks</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Verified signals vs self-reported credentials</p>
          </div>
          <span class="badge badge-sky" style="font-size: 0.8rem; font-weight: 800;">
            Overall Score: ${user.stats.compositeRankScore}/100
          </span>
        </div>

        <div class="stats-breakdown-grid">
          <div class="stat-metric-card">
            <span class="stat-metric-title">Coding Practice</span>
            <div class="stat-metric-big">${user.stats.codingPracticeCount}</div>
            <span class="stat-metric-note">Top ${100 - user.stats.codingPercentile}% nationwide</span>
          </div>

          <div class="stat-metric-card">
            <span class="stat-metric-title">Hackathon Awards</span>
            <div class="stat-metric-big">${user.stats.hackathonWins}</div>
            <span class="stat-metric-note">Verified podium finishes</span>
          </div>

          <div class="stat-metric-card">
            <span class="stat-metric-title">Peer Squads</span>
            <div class="stat-metric-big">${store.state.squads.filter(s => s.isMember).length}</div>
            <span class="stat-metric-note">Active project teams</span>
          </div>

          <div class="stat-metric-card">
            <span class="stat-metric-title">Projects Count</span>
            <div class="stat-metric-big">${user.stats.projectsCount}</div>
            <span class="stat-metric-note">Repos &amp; implementations</span>
          </div>
        </div>

        <!-- Verified Signals Checklist -->
        <div style="margin-top: 1.25rem; background-color: var(--color-slate-50); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem;">
          <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--color-slate-800); margin-bottom: 0.5rem;">Verified Platform Credentials</h4>
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            ${(user.stats.verifiedSignals || []).map(sig => `
              <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.825rem; color: var(--color-emerald-700);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${escapeHTML(sig)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Skills & Technologies -->
      <div class="card" style="padding: 1.5rem;">
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-slate-900); margin-bottom: 0.75rem;">Technical Competencies</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${(user.skills || []).map(skill => `
            <span class="skill-chip" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">${escapeHTML(skill)}</span>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const editBtn = document.getElementById('btn-open-edit-profile-main');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      openModal('modal-edit-profile');
    });
  }
}

export function renderProfileEditModal() {
  const form = document.getElementById('form-edit-profile');
  if (!form) return;

  const user = store.state.currentUser;

  form.innerHTML = `
    <!-- Tab 1: General & Contact -->
    <div class="modal-tab-content active" id="mtab-general">
      <div class="form-group">
        <label for="edit-name" class="form-label">Full Name *</label>
        <input type="text" id="edit-name" class="form-input" required value="${escapeHTML(user.name)}">
      </div>

      <div class="form-group">
        <label for="edit-headline" class="form-label">Professional Headline / Specialization</label>
        <input type="text" id="edit-headline" class="form-input" value="${escapeHTML(user.headline)}">
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label for="edit-school" class="form-label">College / University</label>
          <input type="text" id="edit-school" class="form-input" value="${escapeHTML(user.school)}">
        </div>

        <div class="form-group">
          <label for="edit-state" class="form-label">State / Region</label>
          <select id="edit-state" class="form-select">
            <option value="Andhra Pradesh (Vijayawada)" ${user.state === 'Andhra Pradesh (Vijayawada)' ? 'selected' : ''}>Andhra Pradesh (Vijayawada)</option>
            <option value="Karnataka" ${user.state === 'Karnataka' ? 'selected' : ''}>Karnataka</option>
            <option value="Maharashtra" ${user.state === 'Maharashtra' ? 'selected' : ''}>Maharashtra</option>
            <option value="Delhi NCR" ${user.state === 'Delhi NCR' ? 'selected' : ''}>Delhi NCR</option>
            <option value="Telangana" ${user.state === 'Telangana' ? 'selected' : ''}>Telangana</option>
            <option value="Tamil Nadu" ${user.state === 'Tamil Nadu' ? 'selected' : ''}>Tamil Nadu</option>
            <option value="West Bengal" ${user.state === 'West Bengal' ? 'selected' : ''}>West Bengal</option>
            <option value="Uttar Pradesh" ${user.state === 'Uttar Pradesh' ? 'selected' : ''}>Uttar Pradesh</option>
            <option value="Kerala" ${user.state === 'Kerala' ? 'selected' : ''}>Kerala</option>
            <option value="Gujarat" ${user.state === 'Gujarat' ? 'selected' : ''}>Gujarat</option>
            <option value="Rajasthan" ${user.state === 'Rajasthan' ? 'selected' : ''}>Rajasthan</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tab 2: Academic & GPA -->
    <div class="modal-tab-content" id="mtab-academic" style="display: none;">
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label for="edit-major" class="form-label">Major</label>
          <input type="text" id="edit-major" class="form-input" value="${escapeHTML(user.major)}">
        </div>

        <div class="form-group">
          <label for="edit-grad-year" class="form-label">Graduation Year</label>
          <select id="edit-grad-year" class="form-select">
            <option value="2025" ${String(user.gradYear) === '2025' ? 'selected' : ''}>2025</option>
            <option value="2026" ${String(user.gradYear) === '2026' ? 'selected' : ''}>2026</option>
            <option value="2027" ${String(user.gradYear) === '2027' ? 'selected' : ''}>2027</option>
            <option value="2028" ${String(user.gradYear) === '2028' ? 'selected' : ''}>2028</option>
          </select>
        </div>
      </div>

      <!-- GPA and Privacy Controls -->
      <div style="background-color: var(--color-slate-50); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.75rem;">
        <div class="form-group" style="margin-bottom: 0;">
          <label for="edit-gpa" class="form-label">
            <span>Cumulative CGPA (Scale 0.00 – 10.00)</span>
            <span class="badge ${user.gpaVerified ? 'badge-verified' : 'badge-selfreported'}">
              ${user.gpaVerified ? 'Platform Verified' : 'Self-Reported'}
            </span>
          </label>
          <input type="text" id="edit-gpa" class="form-input" value="${escapeHTML(user.gpa || '')}">
        </div>

        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.825rem; color: var(--color-slate-700); cursor: pointer; font-weight: 600;">
          <input type="checkbox" id="edit-gpa-public" ${user.gpaPublic ? 'checked' : ''}>
          <span>Display GPA publicly on profile &amp; leaderboards</span>
        </label>
        <span style="font-size: 0.75rem; color: var(--text-muted);">
          If unchecked, your GPA will be marked confidential and will not be displayed to peers or recruiters.
        </span>
      </div>
    </div>

    <!-- Tab 3: Skills & Bio -->
    <div class="modal-tab-content" id="mtab-skills" style="display: none;">
      <div class="form-group">
        <label for="edit-bio" class="form-label">Short Bio (max 250 characters)</label>
        <textarea id="edit-bio" class="form-textarea" rows="3">${escapeHTML(user.bio)}</textarea>
      </div>

      <div class="form-group">
        <label for="edit-skills" class="form-label">
          <span>Primary Skills &amp; Technologies</span>
          <span class="form-label-helper">Comma-separated</span>
        </label>
        <input type="text" id="edit-skills" class="form-input" value="${escapeHTML((user.skills || []).join(', '))}">
      </div>
    </div>

    <!-- Tab 4: Preferences -->
    <div class="modal-tab-content" id="mtab-preferences" style="display: none;">
      <div class="form-group">
        <label for="edit-availability" class="form-label">Current Availability Status</label>
        <input type="text" id="edit-availability" class="form-input" value="${escapeHTML(user.availability)}">
      </div>

      <div style="background-color: var(--color-slate-100); border-radius: var(--radius-md); padding: 0.85rem; font-size: 0.775rem; color: var(--text-muted);">
        <strong>Privacy Assurance:</strong> TeamMatch never exposes your private email, phone number, or academic records without your explicit application consent.
      </div>
    </div>
  `;

  // Attach tab switching within modal
  const modalTabBtns = document.querySelectorAll('.modal-nav-btn');
  modalTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      modalTabBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const targetTab = e.currentTarget.dataset.modaltab;

      document.querySelectorAll('.modal-tab-content').forEach(pane => {
        pane.style.display = 'none';
      });

      const activePane = document.getElementById(`mtab-${targetTab}`);
      if (activePane) {
        activePane.style.display = 'block';
      }
    });
  });
}

function handleSaveProfile() {
  const nameEl = document.getElementById('edit-name');
  const headlineEl = document.getElementById('edit-headline');
  const schoolEl = document.getElementById('edit-school');
  const stateEl = document.getElementById('edit-state');
  const majorEl = document.getElementById('edit-major');
  const gradEl = document.getElementById('edit-grad-year');
  const gpaEl = document.getElementById('edit-gpa');
  const gpaPublicEl = document.getElementById('edit-gpa-public');
  const bioEl = document.getElementById('edit-bio');
  const skillsEl = document.getElementById('edit-skills');
  const availEl = document.getElementById('edit-availability');

  if (!nameEl || !nameEl.value.trim()) {
    showToast('Student name is required.', 'warning', 3000);
    return;
  }

  const updatedUser = {
    name: nameEl.value.trim(),
    headline: headlineEl ? headlineEl.value.trim() : '',
    school: schoolEl ? schoolEl.value.trim() : '',
    state: stateEl ? stateEl.value : 'Maharashtra',
    major: majorEl ? majorEl.value.trim() : 'Computer Science & Engineering',
    gradYear: gradEl ? parseInt(gradEl.value, 10) : 2026,
    gpa: gpaEl ? gpaEl.value.trim() : '',
    gpaPublic: gpaPublicEl ? gpaPublicEl.checked : true,
    bio: bioEl ? bioEl.value.trim() : '',
    skills: skillsEl ? skillsEl.value.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
    availability: availEl ? availEl.value.trim() : 'Open to Opportunities',
    avatar: (nameEl.value.trim().split(/\s+/).filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()) || 'TM'
  };

  store.updateCurrentUser(updatedUser);
  closeModal('modal-edit-profile');
  showToast('Profile updated across all views and sync ready!', 'success', 3500);
}

/**
 * TeamMatch Discover Profiles View
 * Handles 3-column responsive layout, reactive student filtering, and card interactions.
 */

import { store } from './state.js';
import { escapeHTML, showToast, openModal, closeModal } from './utils.js';

export function initDiscoverView() {
  renderSignedInStudentCard();
  renderActiveSquadsWidget();
  renderTopInternshipsWidget();
  renderLeaderboardSummaryWidget();
  renderStudentFeed();
  bindFilterEvents();

  // Subscribe to store updates
  store.subscribe((state, event, payload) => {
    if (
      event === 'USER_UPDATED' || 
      event === 'SQUADS_UPDATED' || 
      event === 'SQUAD_CREATED'
    ) {
      renderSignedInStudentCard();
      renderActiveSquadsWidget();
    }

    if (
      event === 'DISCOVER_FILTERS_CHANGED' || 
      event === 'RECRUITER_MODE_CHANGED' || 
      event === 'RECRUITER_PIPELINE_UPDATED' || 
      event === 'RECRUITER_FILTER_CHANGED' ||
      event === 'COMPARE_LIST_CHANGED'
    ) {
      renderStudentFeed();
    }
  });
}

function bindFilterEvents() {
  const stateSelect = document.getElementById('filter-state');
  const majorSelect = document.getElementById('filter-major');
  const skillSelect = document.getElementById('filter-skill');
  const gradSelect = document.getElementById('filter-grad-year');
  const resetBtn = document.getElementById('btn-reset-filters');
  const searchInput = document.getElementById('global-search-input');

  if (stateSelect) {
    stateSelect.addEventListener('change', (e) => {
      store.setDiscoverFilter('state', e.target.value);
    });
  }

  if (majorSelect) {
    majorSelect.addEventListener('change', (e) => {
      store.setDiscoverFilter('major', e.target.value);
    });
  }

  if (skillSelect) {
    skillSelect.addEventListener('change', (e) => {
      store.setDiscoverFilter('skill', e.target.value);
    });
  }

  if (gradSelect) {
    gradSelect.addEventListener('change', (e) => {
      store.setDiscoverFilter('gradYear', e.target.value);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (stateSelect) stateSelect.value = 'ALL';
      if (majorSelect) majorSelect.value = 'ALL';
      if (skillSelect) skillSelect.value = 'ALL';
      if (gradSelect) gradSelect.value = 'ALL';
      if (searchInput) searchInput.value = '';
      store.resetDiscoverFilters();
      showToast('Filters reset to default', 'info', 2000);
    });
  }

  // Quick navigation widgets
  const viewAllSquads = document.getElementById('widget-view-all-squads');
  if (viewAllSquads) {
    viewAllSquads.addEventListener('click', () => store.setActiveTab('squads'));
  }

  const viewAllInternships = document.getElementById('widget-view-all-internships');
  if (viewAllInternships) {
    viewAllInternships.addEventListener('click', () => store.setActiveTab('internships'));
  }

  const viewLeaderboards = document.getElementById('widget-view-leaderboards');
  if (viewLeaderboards) {
    viewLeaderboards.addEventListener('click', () => store.setActiveTab('leaderboards'));
  }
}

// 1. Signed-in student summary card (Left Column)
export function renderSignedInStudentCard() {
  const container = document.getElementById('signed-in-student-card');
  if (!container) return;

  const user = store.state.currentUser;

  const gpaBadge = user.gpaPublic && user.gpa ? `
    <span class="badge ${user.gpaVerified ? 'badge-verified' : 'badge-selfreported'}" title="${user.gpaVerified ? 'Verified via University Registrar Integration' : 'Self-Reported by Student'}">
      ${user.gpaVerified ? '✓ Verified' : 'Self-Reported'} GPA ${escapeHTML(user.gpa)}
    </span>
  ` : `<span class="badge badge-gray">GPA Confidential</span>`;

  container.innerHTML = `
    <div style="padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem;">
      <div style="display: flex; gap: 0.85rem; align-items: center;">
        <div class="avatar-badge" style="width: 3.5rem; height: 3.5rem; font-size: 1.25rem;">
          ${escapeHTML(user.avatar || 'AS')}
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.15rem; min-width: 0;">
          <h2 style="font-size: 1.1rem; font-weight: 800; color: var(--color-slate-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${escapeHTML(user.name)}
          </h2>
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary-700);">
            Class of ${escapeHTML(user.gradYear)} &bull; ${escapeHTML(user.state)}
          </span>
          <span style="font-size: 0.775rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${escapeHTML(user.school)}
          </span>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
        ${gpaBadge}
        <span class="badge badge-sky">${escapeHTML(user.major)}</span>
      </div>

      <p style="font-size: 0.8rem; color: var(--color-slate-600); line-height: 1.45;">
        ${escapeHTML(user.bio)}
      </p>

      <!-- Career Metrics Grid -->
      <div class="student-stats-grid">
        <div class="stat-item">
          <span class="stat-value">${escapeHTML(user.stats.codingPracticeCount)}</span>
          <span class="stat-label">Coding</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${escapeHTML(user.stats.hackathonWins)}</span>
          <span class="stat-label">Hackathons</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${escapeHTML(user.stats.projectsCount)}</span>
          <span class="stat-label">Projects</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${escapeHTML(user.stats.compositeRankScore)}</span>
          <span class="stat-label">Score</span>
        </div>
      </div>

      <!-- Primary Skills Chips -->
      <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.25rem;">
        ${(user.skills || []).slice(0, 5).map(skill => `
          <span class="skill-chip">${escapeHTML(skill)}</span>
        `).join('')}
        ${(user.skills || []).length > 5 ? `<span class="skill-chip">+${user.skills.length - 5}</span>` : ''}
      </div>

      <!-- Quick Action Buttons -->
      <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
        <button class="btn btn-secondary btn-sm" id="btn-quick-edit-profile" style="flex: 1;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Edit Profile
        </button>
        <button class="btn btn-primary btn-sm" id="btn-quick-view-resume" style="flex: 1;">
          ATS Resume
        </button>
      </div>
    </div>
  `;

  // Attach button events
  const editBtn = document.getElementById('btn-quick-edit-profile');
  if (editBtn) {
    editBtn.addEventListener('click', () => openModal('modal-edit-profile'));
  }

  const resumeBtn = document.getElementById('btn-quick-view-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => store.setActiveTab('resume'));
  }
}

// 2. Active squads mini-list (Left Column)
function renderActiveSquadsWidget() {
  const container = document.getElementById('widget-active-squads-list');
  if (!container) return;

  const userSquads = store.state.squads.filter(s => s.isMember);

  if (userSquads.length === 0) {
    container.innerHTML = `
      <p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 0.5rem 0;">
        Not in any squads yet. Browse peer squads to join a team!
      </p>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 0.65rem;">
      ${userSquads.map(squad => `
        <div style="padding: 0.65rem; background-color: var(--color-slate-50); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.825rem; color: var(--color-slate-900);">${escapeHTML(squad.name)}</strong>
            <span class="badge badge-sky" style="font-size: 0.65rem;">${squad.membersCount}/${squad.maxMembers}</span>
          </div>
          <span style="font-size: 0.725rem; color: var(--text-muted); line-height: 1.3;">
            ${escapeHTML(squad.focus)}
          </span>
        </div>
      `).join('')}
    </div>
  `;
}

// 3. Top Internships preview widget (Right Column)
function renderTopInternshipsWidget() {
  const container = document.getElementById('widget-top-internships-list');
  if (!container) return;

  const featured = store.state.internships.slice(0, 3);

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${featured.map(intern => `
        <div style="display: flex; flex-direction: column; gap: 0.2rem; padding-bottom: 0.6rem; border-bottom: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: 0.85rem; color: var(--color-slate-900);">${escapeHTML(intern.company)}</strong>
            <span style="font-size: 0.7rem; color: var(--color-emerald-700); font-weight: 600;">${escapeHTML(intern.stipend.split('+')[0])}</span>
          </div>
          <span style="font-size: 0.775rem; color: var(--color-primary-700); font-weight: 500;">${escapeHTML(intern.role)}</span>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.2rem;">
            <span style="font-size: 0.7rem; color: var(--text-muted);">${escapeHTML(intern.location.split('/')[0])}</span>
            <button class="btn btn-ghost btn-xs btn-widget-apply" data-intern-id="${intern.id}" style="color: var(--color-primary-600); font-weight: 700;">
              ${intern.applied ? 'Applied ✓' : 'View →'}
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.btn-widget-apply').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setActiveTab('internships');
    });
  });
}

// 4. Leaderboard preview widget (Right Column)
function renderLeaderboardSummaryWidget() {
  const container = document.getElementById('widget-leaderboard-summary');
  if (!container) return;

  const topStudent = store.state.students.slice().sort((a, b) => b.stats.compositeRankScore - a.stats.compositeRankScore)[0];
  const user = store.state.currentUser;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 0.65rem;">
      <div style="background-color: var(--color-amber-50); border: 1px solid var(--color-amber-200); border-radius: var(--radius-md); padding: 0.65rem;">
        <span style="font-size: 0.675rem; text-transform: uppercase; font-weight: 800; color: var(--color-amber-700);">#1 National Benchmark</span>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.25rem;">
          <strong style="font-size: 0.85rem; color: var(--color-slate-900);">${escapeHTML(topStudent.name)}</strong>
          <span style="font-size: 0.85rem; font-weight: 800; color: var(--color-amber-700);">${topStudent.stats.compositeRankScore} pts</span>
        </div>
        <span style="font-size: 0.725rem; color: var(--color-slate-600);">${escapeHTML(topStudent.school)}</span>
      </div>

      <div style="background-color: var(--color-slate-50); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.65rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.725rem; font-weight: 700; color: var(--text-muted);">Your Standing</span>
          <span class="badge badge-sky">${escapeHTML(user.state)} Top 5%</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.25rem;">
          <strong style="font-size: 0.85rem; color: var(--color-slate-900);">${escapeHTML(user.name)}</strong>
          <span style="font-weight: 800; color: var(--color-primary-700); font-size: 0.85rem;">${user.stats.compositeRankScore} pts</span>
        </div>
      </div>
    </div>
  `;
}

// 5. Center Column: Render Filtered Student Feed
export function renderStudentFeed() {
  const container = document.getElementById('discover-students-container');
  const countLabel = document.getElementById('discover-results-count');
  if (!container) return;

  const filters = store.state.discoverFilters;
  const isRecruiter = store.state.recruiterMode;
  const recruiterStage = store.state.recruiterStageFilter;

  let list = store.state.students;

  // Filter by Recruiter Stage if in recruiter mode and not 'All Candidates'
  if (isRecruiter && recruiterStage !== 'All Candidates') {
    list = list.filter(s => s.pipelineStatus === recruiterStage);
  }

  // Filter by query (name, school, headline, skills, state)
  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(s => 
      Boolean(s.name && s.name.toLowerCase().includes(q)) ||
      Boolean(s.school && s.school.toLowerCase().includes(q)) ||
      Boolean(s.headline && s.headline.toLowerCase().includes(q)) ||
      Boolean(s.state && s.state.toLowerCase().includes(q)) ||
      Boolean(s.major && s.major.toLowerCase().includes(q)) ||
      Boolean(s.skills && s.skills.some(skill => skill && skill.toLowerCase().includes(q)))
    );
  }

  // Filter by state (with robust substring matching for Vijayawada / Andhra Pradesh)
  if (filters.state && filters.state !== 'ALL') {
    const targetState = filters.state.toLowerCase();
    list = list.filter(s => {
      if (!s.state) return false;
      const st = s.state.toLowerCase();
      return st === targetState || st.includes(targetState) || targetState.includes(st);
    });
  }

  // Filter by major
  if (filters.major && filters.major !== 'ALL') {
    const targetMajor = filters.major.toLowerCase();
    list = list.filter(s => Boolean(s.major && s.major.toLowerCase().includes(targetMajor)));
  }

  // Filter by skill
  if (filters.skill && filters.skill !== 'ALL') {
    const targetSkill = filters.skill.toLowerCase();
    list = list.filter(s => Boolean(s.skills && s.skills.some(sk => sk && sk.toLowerCase().includes(targetSkill))));
  }

  // Filter by graduation year
  if (filters.gradYear && filters.gradYear !== 'ALL') {
    list = list.filter(s => String(s.gradYear) === String(filters.gradYear));
  }

  if (countLabel) {
    countLabel.textContent = list.length;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon-wrap" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <h3 class="empty-title">No matching student profiles found</h3>
        <p class="empty-desc">Try clearing or broadening your filters, or search for different skills like Python, React, or Distributed Systems.</p>
        <button class="btn btn-secondary btn-sm" id="btn-empty-reset" style="margin-top: 0.5rem;">Reset All Filters</button>
      </div>
    `;

    const emptyReset = document.getElementById('btn-empty-reset');
    if (emptyReset) {
      emptyReset.addEventListener('click', () => {
        store.resetDiscoverFilters();
      });
    }
    return;
  }

  container.innerHTML = list.map(student => {
    const isCompared = store.state.compareList.includes(student.id);

    const gpaBadge = student.gpaPublic && student.gpa ? `
      <span class="badge ${student.gpaVerified ? 'badge-verified' : 'badge-selfreported'}" title="${student.gpaVerified ? 'Verified transcript / registrar' : 'Self-Reported'}">
        ${student.gpaVerified ? '✓ Verified' : 'Self-Reported'} GPA ${escapeHTML(student.gpa)}
      </span>
    ` : `<span class="badge badge-gray" title="Student preferred not to share GPA publicly">GPA Confidential</span>`;

    const recruiterStageSelect = isRecruiter ? `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <label for="stage-${student.id}" class="sr-only">Pipeline Stage for ${escapeHTML(student.name)}</label>
        <select class="form-select select-pipeline-stage" data-student-id="${student.id}" style="padding: 0.25rem 0.6rem; font-size: 0.775rem; width: auto; font-weight: 600; border-color: var(--color-indigo-300); background-color: var(--color-indigo-50); color: var(--color-indigo-900);">
          <option value="All Candidates" ${student.pipelineStatus === 'All Candidates' ? 'selected' : ''}>All Candidates</option>
          <option value="Shortlisted" ${student.pipelineStatus === 'Shortlisted' ? 'selected' : ''}>★ Shortlisted</option>
          <option value="Contacted" ${student.pipelineStatus === 'Contacted' ? 'selected' : ''}>✉ Contacted</option>
          <option value="Interviewing" ${student.pipelineStatus === 'Interviewing' ? 'selected' : ''}>⏳ Interviewing</option>
          <option value="Offer" ${student.pipelineStatus === 'Offer' ? 'selected' : ''}>🎉 Offer Extended</option>
        </select>
        <label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.775rem; color: var(--color-indigo-700); cursor: pointer; font-weight: 600;">
          <input type="checkbox" class="compare-checkbox" data-student-id="${student.id}" ${isCompared ? 'checked' : ''}>
          <span>Compare</span>
        </label>
      </div>
    ` : '';

    return `
      <article class="student-card" data-student-id="${student.id}">
        <div class="student-card-header">
          <div class="student-info-left">
            <div class="student-avatar" style="background-color: ${student.avatarBg || '#0284c7'};">
              ${escapeHTML(student.avatar)}
            </div>
            <div class="student-details">
              <div class="student-name-row">
                <h3 class="student-name">${escapeHTML(student.name)}</h3>
                ${gpaBadge}
                <span class="badge badge-sky">Class of ${escapeHTML(student.gradYear)}</span>
              </div>
              <span class="student-headline">${escapeHTML(student.headline)}</span>
              <div class="student-institution">
                <span>${escapeHTML(student.school)}</span>
                <span>&bull;</span>
                <span>${escapeHTML(student.state)} (${escapeHTML(student.region)})</span>
              </div>
            </div>
          </div>

          ${recruiterStageSelect}
        </div>

        <p class="student-bio-text">${escapeHTML(student.bio)}</p>

        <!-- Stats Matrix -->
        <div class="student-stats-grid">
          <div class="stat-item" title="Standardized coding benchmark questions completed">
            <span class="stat-value">${escapeHTML(student.stats.codingPracticeCount)}</span>
            <span class="stat-label">Coding (${student.stats.codingPercentile}th%)</span>
          </div>
          <div class="stat-item" title="Collegiate Hackathons won or track prize">
            <span class="stat-value">${escapeHTML(student.stats.hackathonWins)}</span>
            <span class="stat-label">Hackathons</span>
          </div>
          <div class="stat-item" title="Verified side projects & repositories">
            <span class="stat-value">${escapeHTML(student.stats.projectsCount)}</span>
            <span class="stat-label">Projects</span>
          </div>
          <div class="stat-item" title="Composite benchmark score out of 100">
            <span class="stat-value" style="color: var(--color-primary-700);">${escapeHTML(student.stats.compositeRankScore)}</span>
            <span class="stat-label">Rank Score</span>
          </div>
        </div>

        <!-- Verified Signals & Badges -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center;">
          ${(student.stats.verifiedSignals || []).map(signal => `
            <span class="badge badge-verified" title="Platform verified achievement">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ${escapeHTML(signal)}
            </span>
          `).join('')}
        </div>

        <!-- Skills Pills -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
          ${(student.skills || []).map(skill => `
            <span class="skill-chip">${escapeHTML(skill)}</span>
          `).join('')}
        </div>

        <!-- Recruiter Note Snippet if present -->
        ${isRecruiter && student.recruiterNotes ? `
          <div style="background-color: var(--color-indigo-50); border: 1px dashed var(--color-indigo-200); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; font-size: 0.775rem; color: var(--color-indigo-900);">
            <strong>Private Recruiter Note:</strong> ${escapeHTML(student.recruiterNotes)}
          </div>
        ` : ''}

        <div class="student-card-footer">
          <div style="font-size: 0.775rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${escapeHTML(student.availability)}</span>
          </div>

          <div class="student-actions-group">
            <button class="btn btn-secondary btn-sm btn-view-student" data-student-id="${student.id}">
              View Profile &amp; Stats
            </button>
            <button class="btn btn-primary btn-sm btn-connect-student" data-student-id="${student.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>${isRecruiter ? 'Recruiter Message' : 'Connect / Message'}</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach card interaction listeners
  container.querySelectorAll('.btn-view-student').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.dataset.studentId;
      openStudentDetailModal(studentId);
    });
  });

  container.querySelectorAll('.btn-connect-student').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.dataset.studentId;
      const student = store.state.students.find(s => s.id === studentId);
      if (student) {
        store.startOrOpenConversation({
          id: student.id,
          name: student.name,
          headline: student.headline,
          school: student.school,
          avatar: student.avatar,
          participantType: 'student'
        });
        showToast(`Opened conversation with ${student.name}`, 'info', 2500);
      }
    });
  });

  // Pipeline stage dropdown change
  container.querySelectorAll('.select-pipeline-stage').forEach(select => {
    select.addEventListener('change', (e) => {
      const studentId = e.currentTarget.dataset.studentId;
      const newStage = e.currentTarget.value;
      store.setRecruiterStage(studentId, newStage);
      showToast(`Updated stage for candidate to "${newStage}"`, 'recruiter', 2500);
    });
  });

  // Compare Checkboxes
  container.querySelectorAll('.compare-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const studentId = e.currentTarget.dataset.studentId;
      const res = store.toggleCompareCandidate(studentId);
      if (!res.success) {
        e.currentTarget.checked = false;
        showToast(res.message, 'warning', 3500);
      } else {
        showToast(`${res.count} candidate(s) selected for comparison`, 'recruiter', 2000);
      }
    });
  });
}

// 6. Student Full Profile Detail Modal
export function openStudentDetailModal(studentId) {
  const student = store.state.students.find(s => s.id === studentId);
  if (!student) return;

  const titleEl = document.getElementById('student-detail-name');
  const subEl = document.getElementById('student-detail-sub');
  const bodyEl = document.getElementById('student-detail-content');
  const footerEl = document.getElementById('student-detail-footer');

  if (titleEl) titleEl.textContent = student.name;
  if (subEl) subEl.textContent = `${student.headline} | ${student.school}`;

  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <!-- Top header info -->
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div class="student-avatar" style="background-color: ${student.avatarBg || '#0284c7'}; width: 4rem; height: 4rem; font-size: 1.4rem;">
            ${escapeHTML(student.avatar)}
          </div>
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--color-slate-900);">${escapeHTML(student.name)}</h3>
            <p style="font-size: 0.85rem; color: var(--color-primary-700); font-weight: 600;">${escapeHTML(student.headline)}</p>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
              ${escapeHTML(student.school)} &bull; ${escapeHTML(student.state)} &bull; Class of ${escapeHTML(student.gradYear)}
            </div>
          </div>
        </div>

        <!-- Academic & Verification Badges -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="badge ${student.gpaVerified ? 'badge-verified' : 'badge-selfreported'}">
            ${student.gpaVerified ? '✓ Platform Verified' : 'Self-Reported'} GPA: ${student.gpaPublic ? escapeHTML(student.gpa) : 'Confidential'}
          </span>
          <span class="badge badge-sky">${escapeHTML(student.major)}</span>
          <span class="badge badge-amber">Composite Score: ${escapeHTML(student.stats.compositeRankScore)}/100</span>
        </div>

        <!-- Bio -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--color-slate-800); margin-bottom: 0.35rem;">About</h4>
          <p style="font-size: 0.85rem; color: var(--color-slate-700); line-height: 1.5;">${escapeHTML(student.bio)}</p>
        </div>

        <!-- Verified Signals & Accolades -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--color-slate-800); margin-bottom: 0.35rem;">Verified Career Signals</h4>
          <div style="display: flex; flex-direction: column; gap: 0.4rem;">
            ${(student.stats.verifiedSignals || []).map(sig => `
              <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.825rem; color: var(--color-emerald-700); background-color: var(--color-emerald-50); padding: 0.4rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--color-emerald-200);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>${escapeHTML(sig)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Technical Competencies -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--color-slate-800); margin-bottom: 0.35rem;">Skills & Technologies</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${(student.skills || []).map(skill => `<span class="skill-chip">${escapeHTML(skill)}</span>`).join('')}
          </div>
        </div>

        <!-- Links -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--color-slate-800); margin-bottom: 0.35rem;">External References</h4>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.825rem;">
            ${student.links.github ? `<span>GitHub: <code>${escapeHTML(student.links.github)}</code></span>` : ''}
            ${student.links.portfolio ? `<span>Portfolio: <code>${escapeHTML(student.links.portfolio)}</code></span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  if (footerEl) {
    footerEl.innerHTML = `
      <button class="btn btn-secondary" data-close-modal>Close</button>
      <button class="btn btn-primary" id="btn-modal-connect">
        Start Conversation
      </button>
    `;

    const connectBtn = document.getElementById('btn-modal-connect');
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        closeModal('modal-student-detail');
        store.startOrOpenConversation({
          id: student.id,
          name: student.name,
          headline: student.headline,
          school: student.school,
          avatar: student.avatar,
          participantType: 'student'
        });
      });
    }
  }

  openModal('modal-student-detail');
}

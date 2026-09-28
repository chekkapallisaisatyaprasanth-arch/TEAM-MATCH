/**
 * TeamMatch Recruiter Mode & Talent Sourcing Workflow Module
 * Candidate pipeline stages, side-by-side comparison matrix, and recruiter actions.
 */

import { store } from './state.js';
import { escapeHTML, openModal, closeModal, showToast } from './utils.js';

export function initRecruiterMode() {
  updateRecruiterFunnelBar();
  updateCompareDock();
  bindRecruiterEvents();

  store.subscribe((state, event) => {
    if (
      event === 'RECRUITER_MODE_CHANGED' || 
      event === 'RECRUITER_PIPELINE_UPDATED' || 
      event === 'RECRUITER_FILTER_CHANGED' ||
      event === 'COMPARE_LIST_CHANGED'
    ) {
      updateRecruiterFunnelBar();
      updateCompareDock();
    }
  });
}

function bindRecruiterEvents() {
  // Toggle switch in navbar
  const toggleCheckbox = document.getElementById('recruiter-mode-checkbox');
  const toggleContainer = document.getElementById('recruiter-toggle-container');

  if (toggleCheckbox) {
    toggleCheckbox.checked = store.state.recruiterMode;
    toggleCheckbox.addEventListener('change', (e) => {
      store.toggleRecruiterMode(e.target.checked);
      if (e.target.checked) {
        showToast('Switched to Recruiter Mode: Pipeline and Candidate Funnel active.', 'recruiter', 3500);
      } else {
        showToast('Switched to Student Mode.', 'info', 2500);
      }
    });
  }

  // Pipeline stage buttons in funnel bar
  document.querySelectorAll('.funnel-stage-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const stage = e.currentTarget.dataset.stage;
      document.querySelectorAll('.funnel-stage-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      store.setRecruiterStageFilter(stage);
      showToast(`Showing candidates in "${stage}" stage`, 'recruiter', 2000);
    });
  });

  // Compare dock buttons
  const openCompareBtn = document.getElementById('btn-open-compare-modal');
  if (openCompareBtn) {
    openCompareBtn.addEventListener('click', openCandidateCompareModal);
  }

  const clearCompareBtn = document.getElementById('btn-clear-compare');
  if (clearCompareBtn) {
    clearCompareBtn.addEventListener('click', () => {
      store.clearCompareList();
      showToast('Cleared candidate comparison list', 'info', 2000);
    });
  }
}

export function updateRecruiterFunnelBar() {
  const bar = document.getElementById('recruiter-funnel-bar');
  const toggleCheckbox = document.getElementById('recruiter-mode-checkbox');
  const toggleContainer = document.getElementById('recruiter-toggle-container');
  const isRecruiter = store.state.recruiterMode;

  if (toggleCheckbox) {
    toggleCheckbox.checked = isRecruiter;
  }

  if (toggleContainer) {
    if (isRecruiter) {
      toggleContainer.classList.add('active');
    } else {
      toggleContainer.classList.remove('active');
    }
  }

  if (bar) {
    if (isRecruiter) {
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
    }
  }

  // Calculate stage counts
  const students = store.state.students;
  const countAll = students.length;
  const countShortlisted = students.filter(s => s.pipelineStatus === 'Shortlisted').length;
  const countContacted = students.filter(s => s.pipelineStatus === 'Contacted').length;
  const countInterviewing = students.filter(s => s.pipelineStatus === 'Interviewing').length;
  const countOffer = students.filter(s => s.pipelineStatus === 'Offer').length;

  const elAll = document.getElementById('stage-count-all');
  const elShort = document.getElementById('stage-count-shortlisted');
  const elContact = document.getElementById('stage-count-contacted');
  const elInterview = document.getElementById('stage-count-interviewing');
  const elOffer = document.getElementById('stage-count-offer');

  if (elAll) elAll.textContent = countAll;
  if (elShort) elShort.textContent = countShortlisted;
  if (elContact) elContact.textContent = countContacted;
  if (elInterview) elInterview.textContent = countInterviewing;
  if (elOffer) elOffer.textContent = countOffer;
}

export function updateCompareDock() {
  const dock = document.getElementById('recruiter-compare-dock');
  const countEl = document.getElementById('compare-candidates-count');
  const count = store.state.compareList.length;

  if (countEl) countEl.textContent = count;

  if (dock) {
    if (count > 0 && store.state.recruiterMode) {
      dock.classList.add('visible');
    } else {
      dock.classList.remove('visible');
    }
  }
}

export function openCandidateCompareModal() {
  const modalBody = document.getElementById('candidate-compare-body');
  if (!modalBody) return;

  const selectedIds = store.state.compareList;
  const candidates = store.state.students.filter(s => selectedIds.includes(s.id));

  if (candidates.length === 0) {
    showToast('No candidates selected for comparison.', 'warning', 2500);
    return;
  }

  modalBody.innerHTML = `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
        <thead>
          <tr style="background-color: var(--color-slate-50); border-bottom: 2px solid var(--border-subtle);">
            <th style="padding: 1rem; width: 180px; font-weight: 700; color: var(--color-slate-700);">Comparison Attribute</th>
            ${candidates.map(c => `
              <th style="padding: 1rem; min-width: 220px; text-align: center;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 0.35rem;">
                  <div class="avatar-badge" style="width: 3rem; height: 3rem; font-size: 1.1rem; background-color: ${c.avatarBg || '#0284c7'};">
                    ${escapeHTML(c.avatar)}
                  </div>
                  <strong style="font-size: 1rem; color: var(--color-slate-900);">${escapeHTML(c.name)}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHTML(c.school)}</span>
                </div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <!-- Major & Headline -->
          <tr style="border-bottom: 1px solid var(--border-subtle);">
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: var(--color-slate-700);">Degree &amp; Major</td>
            ${candidates.map(c => `
              <td style="padding: 0.75rem 1rem; text-align: center;">
                <strong>${escapeHTML(c.major)}</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Class of ${escapeHTML(c.gradYear)}</div>
              </td>
            `).join('')}
          </tr>

          <!-- Composite Rank Score -->
          <tr style="border-bottom: 1px solid var(--border-subtle); background-color: var(--color-slate-50);">
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: var(--color-slate-700);">Composite Score</td>
            ${candidates.map(c => `
              <td style="padding: 0.75rem 1rem; text-align: center;">
                <span style="font-size: 1.25rem; font-weight: 800; color: var(--color-primary-700);">
                  ${c.stats.compositeRankScore}
                </span>
                <div style="font-size: 0.725rem; color: var(--text-muted);">Scale of 100</div>
              </td>
            `).join('')}
          </tr>

          <!-- Coding Practice & Benchmarks -->
          <tr style="border-bottom: 1px solid var(--border-subtle);">
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: var(--color-slate-700);">Coding Practice</td>
            ${candidates.map(c => `
              <td style="padding: 0.75rem 1rem; text-align: center;">
                <strong>${c.stats.codingPracticeCount} Problems</strong>
                <div style="font-size: 0.75rem; color: var(--color-emerald-700); font-weight: 600;">${c.stats.codingPercentile}th Percentile</div>
              </td>
            `).join('')}
          </tr>

          <!-- Collegiate Hackathons -->
          <tr style="border-bottom: 1px solid var(--border-subtle); background-color: var(--color-slate-50);">
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: var(--color-slate-700);">Hackathon Honors</td>
            ${candidates.map(c => `
              <td style="padding: 0.75rem 1rem; text-align: center;">
                <strong>${c.stats.hackathonWins} Podiums / Track Wins</strong>
              </td>
            `).join('')}
          </tr>

          <!-- GPA Signal (Explicit Verified / Self-Reported / Confidential) -->
          <tr style="border-bottom: 1px solid var(--border-subtle);">
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: var(--color-slate-700);">Academic Signal</td>
            ${candidates.map(c => `
              <td style="padding: 0.75rem 1rem; text-align: center;">
                ${c.gpaPublic && c.gpa ? `
                  <span class="badge ${c.gpaVerified ? 'badge-verified' : 'badge-selfreported'}">
                    ${c.gpaVerified ? '✓ Verified' : 'Self-Reported'} GPA ${escapeHTML(c.gpa)}
                  </span>
                ` : `<span class="badge badge-gray">Confidential</span>`}
              </td>
            `).join('')}
          </tr>

          <!-- Top Skills -->
          <tr style="border-bottom: 1px solid var(--border-subtle); background-color: var(--color-slate-50);">
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: var(--color-slate-700);">Core Skills</td>
            ${candidates.map(c => `
              <td style="padding: 0.75rem 1rem; text-align: center;">
                <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; justify-content: center;">
                  ${(c.skills || []).slice(0, 5).map(sk => `<span class="skill-chip">${escapeHTML(sk)}</span>`).join('')}
                </div>
              </td>
            `).join('')}
          </tr>

          <!-- Pipeline Stage -->
          <tr style="border-bottom: 1px solid var(--border-subtle);">
            <td style="padding: 0.75rem 1rem; font-weight: 700; color: var(--color-slate-700);">Pipeline Stage</td>
            ${candidates.map(c => `
              <td style="padding: 0.75rem 1rem; text-align: center;">
                <span class="badge badge-indigo" style="font-size: 0.8rem;">
                  ${escapeHTML(c.pipelineStatus)}
                </span>
              </td>
            `).join('')}
          </tr>

          <!-- Action Row -->
          <tr>
            <td style="padding: 1rem; font-weight: 700; color: var(--color-slate-700);">Action</td>
            ${candidates.map(c => `
              <td style="padding: 1rem; text-align: center;">
                <button class="btn btn-primary btn-sm btn-compare-message" data-student-id="${c.id}">
                  Message Candidate
                </button>
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;

  modalBody.querySelectorAll('.btn-compare-message').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.dataset.studentId;
      const student = store.state.students.find(s => s.id === studentId);
      if (student) {
        closeModal('modal-candidate-compare');
        store.startOrOpenConversation({
          id: student.id,
          name: student.name,
          headline: student.headline,
          school: student.school,
          avatar: student.avatar,
          participantType: 'student'
        });
      }
    });
  });

  openModal('modal-candidate-compare');
}

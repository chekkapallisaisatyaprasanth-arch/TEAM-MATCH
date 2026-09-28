/**
 * TeamMatch State & National Leaderboards Module
 * Renders rankings table, summary cards, state selectors, and transparent methodology.
 */

import { store } from './state.js';
import { LEADERBOARD_METHODOLOGY } from './data.js';
import { escapeHTML, openModal, showToast } from './utils.js';
import { openStudentDetailModal } from './discover.js';

export function initLeaderboardsView() {
  renderLeaderboards();

  const footerMethodologyBtn = document.getElementById('footer-btn-methodology');
  if (footerMethodologyBtn) {
    footerMethodologyBtn.addEventListener('click', () => openRankingCriteriaModal());
  }

  store.subscribe((state, event) => {
    if (
      event === 'LEADERBOARD_FILTERS_CHANGED' || 
      event === 'USER_UPDATED' ||
      event === 'RECRUITER_PIPELINE_UPDATED'
    ) {
      renderLeaderboards();
    }
  });
}

export function renderLeaderboards() {
  const container = document.getElementById('leaderboards-container');
  if (!container) return;

  const selectedState = store.state.leaderboardFilter.state;
  const sortBy = store.state.leaderboardFilter.sortBy;
  const user = store.state.currentUser;

  // Combine currentUser and other students into one competitive pool (deduplicating if needed)
  const otherStudents = store.state.students.filter(s => s.id !== user.id);
  const allStudents = [
    {
      id: user.id,
      name: `${user.name} (You)`,
      isCurrentUser: true,
      school: user.school,
      state: user.state,
      region: user.region,
      major: user.major,
      gpa: user.gpa,
      gpaVerified: user.gpaVerified,
      gpaPublic: user.gpaPublic,
      avatar: user.avatar,
      avatarBg: '#0284c7',
      stats: user.stats,
      headline: user.headline
    },
    ...otherStudents
  ];

  // Filter by state if not ALL (substring-tolerant for Vijayawada / Andhra Pradesh)
  let filtered = allStudents;
  if (selectedState !== 'ALL') {
    const targetState = selectedState.toLowerCase();
    filtered = allStudents.filter(s => {
      if (!s.state) return false;
      const st = s.state.toLowerCase();
      return st === targetState || st.includes(targetState) || targetState.includes(st);
    });
  }

  // Sort by chosen metric with safe fallback
  filtered.sort((a, b) => {
    if (sortBy === 'coding') {
      return (b.stats?.codingPracticeCount || 0) - (a.stats?.codingPracticeCount || 0);
    } else if (sortBy === 'hackathons') {
      return (b.stats?.hackathonWins || 0) - (a.stats?.hackathonWins || 0);
    } else {
      return (b.stats?.compositeRankScore || 0) - (a.stats?.compositeRankScore || 0);
    }
  });

  // Calculate ranks supporting ties fairly
  let currentRank = 1;
  let prevScore = null;
  const denseRanks = filtered.map((student, idx) => {
    const score = sortBy === 'coding' ? (student.stats?.codingPracticeCount || 0)
                : sortBy === 'hackathons' ? (student.stats?.hackathonWins || 0)
                : (student.stats?.compositeRankScore || 0);
    if (idx > 0 && score === prevScore) {
      // tie
    } else {
      currentRank = idx + 1;
    }
    prevScore = score;
    return currentRank;
  });

  const poolSize = filtered.length;
  const topStudent = filtered[0] || null;
  const userRankIndex = filtered.findIndex(s => s.isCurrentUser);
  const userRank = userRankIndex !== -1 ? denseRanks[userRankIndex] : 'Unranked in State';

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">

      <!-- Top Header & Transparent Methodology Banner -->
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-slate-900); letter-spacing: -0.02em;">
              Regional &amp; National Leaderboards
            </h2>
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.2rem;">
              Compare engineering and tech students based on verified problem solving, hackathons, and projects.
            </p>
          </div>

          <button class="btn btn-secondary btn-sm" id="btn-view-methodology" style="gap: 0.4rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Transparent Ranking Methodology
          </button>
        </div>

        <!-- Data Provenance Notice -->
        <div style="background-color: var(--color-slate-100); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem 1rem; font-size: 0.8rem; color: var(--color-slate-600); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <strong>Educational Demonstration Pool:</strong> Seeded records represent simulated benchmarks. GPA privacy is strictly respected with no penalty for undisclosed fields.
          </div>
          <span style="font-size: 0.725rem; color: var(--text-muted);">Methodology v${LEADERBOARD_METHODOLOGY.version}</span>
        </div>
      </div>

      <!-- 3 Summary Metrics Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
        <!-- Card 1: Top Ranked Student -->
        <div class="card" style="border-left: 4px solid var(--color-amber-500); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span style="font-size: 0.725rem; font-weight: 700; text-transform: uppercase; color: var(--color-amber-700);">
              #1 Ranked Student (${selectedState === 'ALL' ? 'Nationwide' : selectedState})
            </span>
            <span class="badge badge-amber">Top Performer</span>
          </div>
          ${topStudent ? `
            <div style="margin-top: 0.5rem;">
              <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--color-slate-900);">${escapeHTML(topStudent.name)}</h3>
              <p style="font-size: 0.8rem; color: var(--color-primary-700); font-weight: 600;">${escapeHTML(topStudent.school)}</p>
              <div style="display: flex; gap: 0.75rem; font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">
                <span>Score: <strong style="color: var(--color-amber-700);">${topStudent.stats.compositeRankScore}</strong></span>
                <span>Coding: <strong>${topStudent.stats.codingPracticeCount}</strong></span>
                <span>Hackathons: <strong>${topStudent.stats.hackathonWins}</strong></span>
              </div>
            </div>
          ` : '<p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.5rem;">No candidates in this region.</p>'}
        </div>

        <!-- Card 2: Signed-In User Standing -->
        <div class="card" style="border-left: 4px solid var(--color-primary-600); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span style="font-size: 0.725rem; font-weight: 700; text-transform: uppercase; color: var(--color-primary-700);">
              Your Standing
            </span>
            <span class="badge badge-sky">Rank #${userRank}</span>
          </div>
          <div style="margin-top: 0.5rem;">
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--color-slate-900);">${escapeHTML(user.name)}</h3>
            <p style="font-size: 0.8rem; color: var(--color-primary-700); font-weight: 600;">${escapeHTML(user.school)} &bull; ${escapeHTML(user.state)}</p>
            <div style="display: flex; gap: 0.75rem; font-size: 0.8rem; color: var(--text-muted); margin-top: 0.4rem;">
              <span>Score: <strong style="color: var(--color-primary-700);">${user.stats.compositeRankScore}</strong></span>
              <span>Percentile: <strong>${user.stats.codingPercentile}th%</strong></span>
            </div>
          </div>
        </div>

        <!-- Card 3: Displayed Pool Size -->
        <div class="card" style="border-left: 4px solid var(--color-indigo-600); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span style="font-size: 0.725rem; font-weight: 700; text-transform: uppercase; color: var(--color-indigo-700);">
              Scope &amp; Sample Size
            </span>
            <span class="badge badge-indigo">${selectedState === 'ALL' ? 'All India' : selectedState}</span>
          </div>
          <div style="margin-top: 0.5rem;">
            <div style="font-size: 1.85rem; font-weight: 800; color: var(--color-slate-900);">
              ${poolSize} <span style="font-size: 0.95rem; font-weight: 500; color: var(--text-muted);">Students Listed</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
              Filter by specific state or switch ranking signal to test rankings.
            </p>
          </div>
        </div>
      </div>

      <!-- Controls Bar: State Selector & Sort Dimension Selector -->
      <div style="background-color: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <label for="leaderboard-state-select" style="font-size: 0.825rem; font-weight: 700; color: var(--color-slate-700);">State / Region:</label>
            <select id="leaderboard-state-select" class="form-select" style="width: auto; padding: 0.35rem 0.75rem; font-size: 0.825rem;">
              <option value="ALL" ${selectedState === 'ALL' ? 'selected' : ''}>All India (National)</option>
              <option value="Andhra Pradesh (Vijayawada)" ${selectedState === 'Andhra Pradesh (Vijayawada)' ? 'selected' : ''}>Andhra Pradesh (Vijayawada)</option>
              <option value="Karnataka" ${selectedState === 'Karnataka' ? 'selected' : ''}>Karnataka (Bengaluru)</option>
              <option value="Maharashtra" ${selectedState === 'Maharashtra' ? 'selected' : ''}>Maharashtra (Mumbai / Pune)</option>
              <option value="Delhi NCR" ${selectedState === 'Delhi NCR' ? 'selected' : ''}>Delhi NCR</option>
              <option value="Telangana" ${selectedState === 'Telangana' ? 'selected' : ''}>Telangana (Hyderabad)</option>
              <option value="Tamil Nadu" ${selectedState === 'Tamil Nadu' ? 'selected' : ''}>Tamil Nadu (Chennai)</option>
              <option value="West Bengal" ${selectedState === 'West Bengal' ? 'selected' : ''}>West Bengal (Kolkata)</option>
              <option value="Uttar Pradesh" ${selectedState === 'Uttar Pradesh' ? 'selected' : ''}>Uttar Pradesh</option>
              <option value="Kerala" ${selectedState === 'Kerala' ? 'selected' : ''}>Kerala</option>
              <option value="Gujarat" ${selectedState === 'Gujarat' ? 'selected' : ''}>Gujarat</option>
              <option value="Rajasthan" ${selectedState === 'Rajasthan' ? 'selected' : ''}>Rajasthan</option>
            </select>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <label for="leaderboard-sort-select" style="font-size: 0.825rem; font-weight: 700; color: var(--color-slate-700);">Ranking Signal:</label>
            <select id="leaderboard-sort-select" class="form-select" style="width: auto; padding: 0.35rem 0.75rem; font-size: 0.825rem;">
              <option value="composite" ${sortBy === 'composite' ? 'selected' : ''}>Composite Rank Score (Default)</option>
              <option value="coding" ${sortBy === 'coding' ? 'selected' : ''}>Coding Practice Benchmark</option>
              <option value="hackathons" ${sortBy === 'hackathons' ? 'selected' : ''}>Hackathon Wins</option>
            </select>
          </div>
        </div>

        <span style="font-size: 0.8rem; color: var(--text-muted);">
          Showing ${filtered.length} rankings
        </span>
      </div>

      <!-- Responsive Leaderboards Table -->
      <div style="background-color: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow-x: auto; box-shadow: var(--shadow-xs);">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
          <thead>
            <tr style="background-color: var(--color-slate-50); border-bottom: 1px solid var(--border-subtle); color: var(--color-slate-600); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
              <th style="padding: 0.85rem 1rem; width: 60px;">Rank</th>
              <th style="padding: 0.85rem 1rem;">Student / University</th>
              <th style="padding: 0.85rem 1rem;">State</th>
              <th style="padding: 0.85rem 1rem;">Major</th>
              <th style="padding: 0.85rem 1rem;">Coding Practice</th>
              <th style="padding: 0.85rem 1rem;">GPA Signal</th>
              <th style="padding: 0.85rem 1rem;">Composite Score</th>
              <th style="padding: 0.85rem 1rem; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((student, idx) => {
              const rank = denseRanks[idx];
              const isUserRow = student.isCurrentUser;

              let rankBadge = `<span style="font-weight: 700; color: var(--color-slate-500);">${rank}</span>`;
              if (rank === 1) {
                rankBadge = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background-color: var(--color-amber-500); color: #ffffff; font-weight: 800; font-size: 0.8rem;">1</span>`;
              } else if (rank === 2) {
                rankBadge = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background-color: #94a3b8; color: #ffffff; font-weight: 800; font-size: 0.8rem;">2</span>`;
              } else if (rank === 3) {
                rankBadge = `<span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background-color: #b45309; color: #ffffff; font-weight: 800; font-size: 0.8rem;">3</span>`;
              }

              const gpaCell = student.gpaPublic && student.gpa ? `
                <span class="badge ${student.gpaVerified ? 'badge-verified' : 'badge-selfreported'}">
                  ${student.gpaVerified ? '✓ ' : ''}${escapeHTML(student.gpa)}
                </span>
              ` : `<span class="badge badge-gray">Confidential</span>`;

              return `
                <tr style="border-bottom: 1px solid var(--border-subtle); ${isUserRow ? 'background-color: var(--color-primary-50);' : ''} transition: background-color var(--transition-fast);">
                  <td style="padding: 0.85rem 1rem; text-align: center;">${rankBadge}</td>
                  <td style="padding: 0.85rem 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.65rem;">
                      <div class="avatar-badge" style="width: 2rem; height: 2rem; font-size: 0.75rem; background-color: ${student.avatarBg || '#0284c7'};">
                        ${escapeHTML(student.avatar)}
                      </div>
                      <div>
                        <strong style="color: var(--color-slate-900); display: block;">${escapeHTML(student.name)}</strong>
                        <span style="font-size: 0.775rem; color: var(--text-muted);">${escapeHTML(student.school)}</span>
                      </div>
                    </div>
                  </td>
                  <td style="padding: 0.85rem 1rem; color: var(--color-slate-700);">${escapeHTML(student.state)}</td>
                  <td style="padding: 0.85rem 1rem; color: var(--color-slate-700);">${escapeHTML(student.major)}</td>
                  <td style="padding: 0.85rem 1rem;">
                    <div style="font-weight: 700; color: var(--color-slate-900);">${student.stats.codingPracticeCount} probs</div>
                    <span style="font-size: 0.725rem; color: var(--text-muted);">${student.stats.codingPercentile}th percentile</span>
                  </td>
                  <td style="padding: 0.85rem 1rem;">${gpaCell}</td>
                  <td style="padding: 0.85rem 1rem;">
                    <div style="font-size: 1rem; font-weight: 800; color: var(--color-primary-700);">
                      ${student.stats.compositeRankScore}
                    </div>
                  </td>
                  <td style="padding: 0.85rem 1rem; text-align: right;">
                    ${isUserRow ? `
                      <button class="btn btn-secondary btn-xs btn-leaderboard-profile" data-student-id="${student.id}">
                        My Stats
                      </button>
                    ` : `
                      <button class="btn btn-secondary btn-xs btn-leaderboard-profile" data-student-id="${student.id}">
                        Profile
                      </button>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Attach event listeners
  const stateSelect = document.getElementById('leaderboard-state-select');
  if (stateSelect) {
    stateSelect.addEventListener('change', (e) => {
      store.setLeaderboardFilter('state', e.target.value);
    });
  }

  const sortSelect = document.getElementById('leaderboard-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      store.setLeaderboardFilter('sortBy', e.target.value);
    });
  }

  const methodologyBtn = document.getElementById('btn-view-methodology');
  if (methodologyBtn) {
    methodologyBtn.addEventListener('click', () => openRankingCriteriaModal());
  }

  container.querySelectorAll('.btn-leaderboard-profile').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const studentId = e.currentTarget.dataset.studentId;
      if (studentId === user.id) {
        store.setActiveTab('profile');
      } else {
        openStudentDetailModal(studentId);
      }
    });
  });
}

export function openRankingCriteriaModal() {
  const content = document.getElementById('ranking-criteria-content');
  if (content) {
    content.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <p style="font-size: 0.875rem; color: var(--color-slate-700); line-height: 1.5;">
          ${escapeHTML(LEADERBOARD_METHODOLOGY.disclaimer)}
        </p>

        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-slate-900);">Evaluation Weight Breakdown</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${LEADERBOARD_METHODOLOGY.weights.map(item => `
            <div style="background-color: var(--color-slate-50); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <strong style="font-size: 0.875rem; color: var(--color-slate-900);">${escapeHTML(item.factor)}</strong>
                <span class="badge badge-sky" style="font-weight: 800;">${item.weight}%</span>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-muted);">${escapeHTML(item.description)}</p>
            </div>
          `).join('')}
        </div>

        <div style="background-color: var(--color-primary-50); border: 1px solid var(--color-primary-200); border-radius: var(--radius-md); padding: 0.85rem; font-size: 0.8rem; color: var(--color-primary-800);">
          <strong>Fairness &amp; Ties Rule:</strong> Students with undisclosed or private GPAs are not docked points; the remaining signals are re-normalized proportionately. Ties share the highest ranking position.
        </div>
      </div>
    `;
  }
  openModal('modal-ranking-criteria');
}

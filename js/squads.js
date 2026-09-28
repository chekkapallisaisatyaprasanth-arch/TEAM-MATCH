/**
 * TeamMatch Peer Squads & Teammate Formation Module
 * Assemble collaborative project & hackathon teams by complementary skills.
 */

import { store } from './state.js';
import { escapeHTML, openModal, closeModal, showToast } from './utils.js';

let activeJoiningSquadId = null;

export function initSquadsView() {
  renderSquads();

  store.subscribe((state, event) => {
    if (
      event === 'SQUAD_FILTERS_CHANGED' || 
      event === 'SQUADS_UPDATED' || 
      event === 'SQUAD_CREATED'
    ) {
      renderSquads();
    }
  });

  // Modal bindings
  const createSquadBtn = document.getElementById('btn-submit-create-squad');
  if (createSquadBtn) {
    createSquadBtn.addEventListener('click', handleCreateSquadSubmit);
  }
}

export function renderSquads() {
  const container = document.getElementById('squads-container');
  if (!container) return;

  const filters = store.state.squadFilters;
  let list = store.state.squads;

  // Filter by query
  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.toLowerCase().trim();
    list = list.filter(s => 
      Boolean(s.name && s.name.toLowerCase().includes(q)) ||
      Boolean(s.goal && s.goal.toLowerCase().includes(q)) ||
      Boolean(s.focus && s.focus.toLowerCase().includes(q)) ||
      Boolean(s.requiredSkills && s.requiredSkills.some(sk => sk && sk.toLowerCase().includes(q))) ||
      Boolean(s.tags && s.tags.some(t => t && t.toLowerCase().includes(q)))
    );
  }

  // Filter by open slots
  if (filters.openSlotsOnly) {
    list = list.filter(s => s.membersCount < s.maxMembers);
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-slate-900); letter-spacing: -0.02em;">
            Peer Squads &amp; Teammate Matching
          </h2>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.2rem;">
            Find or assemble small teams around skills, hackathons, open-source projects, and research goals.
          </p>
        </div>

        <button class="btn btn-primary" id="btn-open-create-squad">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create a New Squad
        </button>
      </div>

      <!-- Squad Filter Toolbar -->
      <div style="background-color: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1rem 1.25rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between; box-shadow: var(--shadow-xs);">
        <div style="flex: 1; min-width: 240px; position: relative;">
          <input 
            type="text" 
            id="squad-search-input" 
            class="form-input" 
            placeholder="Search squads by goal, hackathon, or skill (e.g. Rust, HealthAI, Quant)..." 
            value="${escapeHTML(filters.query)}"
            style="padding-left: 2.25rem;"
          >
          <svg style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--color-slate-400);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.825rem; font-weight: 600; color: var(--color-slate-700); cursor: pointer;">
            <input type="checkbox" id="squad-slots-toggle" ${filters.openSlotsOnly ? 'checked' : ''}>
            <span>Has Open Slots Only</span>
          </label>
        </div>
      </div>

      <!-- Squads Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 1.25rem;">
        ${list.length === 0 ? `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <h3 class="empty-title">No peer squads match your criteria</h3>
            <p class="empty-desc">Be the first to launch a squad for your hackathon or passion project!</p>
          </div>
        ` : list.map(squad => {
          const isOpen = squad.membersCount < squad.maxMembers;
          const isMember = squad.isMember || squad.members.some(m => m.name === store.state.currentUser.name);

          return `
            <article class="card card-interactive" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.25rem; gap: 1rem;">
              <div>
                <!-- Top Status Row -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <span class="badge ${isOpen ? 'badge-sky' : 'badge-gray'}">
                    ${isOpen ? `● Open (${squad.membersCount}/${squad.maxMembers} filled)` : `Full (${squad.membersCount}/${squad.maxMembers})`}
                  </span>
                  <span style="font-size: 0.725rem; font-weight: 600; color: var(--color-indigo-700); background-color: var(--color-indigo-50); padding: 0.15rem 0.5rem; border-radius: var(--radius-sm);">
                    ${escapeHTML(squad.focus)}
                  </span>
                </div>

                <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--color-slate-900);">
                  ${escapeHTML(squad.name)}
                </h3>

                <p style="font-size: 0.85rem; color: var(--color-slate-700); line-height: 1.5; margin-top: 0.4rem;">
                  ${escapeHTML(squad.goal)}
                </p>

                <!-- Needed Skills / Looking For -->
                <div style="background-color: var(--color-slate-50); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem; margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.35rem;">
                  <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--color-slate-500);">
                    Seeking Roles &amp; Skills:
                  </span>
                  <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary-700);">
                    ${(squad.lookingFor || []).map(r => escapeHTML(r)).join(' &bull; ')}
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.2rem;">
                    ${(squad.requiredSkills || []).map(sk => `<span class="skill-chip">${escapeHTML(sk)}</span>`).join('')}
                  </div>
                </div>

                <!-- Squad Members Roster -->
                <div style="margin-top: 0.85rem;">
                  <span style="font-size: 0.725rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Current Roster:</span>
                  <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.35rem;">
                    ${squad.members.map(member => `
                      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; padding: 0.25rem 0.5rem; background-color: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                          <div class="avatar-badge" style="width: 1.5rem; height: 1.5rem; font-size: 0.65rem;">
                            ${escapeHTML(member.avatar || 'M')}
                          </div>
                          <span style="font-weight: 600; color: var(--color-slate-800);">${escapeHTML(member.name)}</span>
                        </div>
                        <span style="font-size: 0.725rem; color: var(--text-muted);">${escapeHTML(member.role)}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Footer with Meeting Cadence & Join Action -->
              <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                  🗓 ${escapeHTML(squad.meetingCadence)}
                </div>

                ${isMember ? `
                  <span class="badge badge-verified" style="font-size: 0.8rem;">
                    ✓ Member
                  </span>
                ` : isOpen ? `
                  <button class="btn btn-primary btn-sm btn-join-squad" data-squad-id="${squad.id}">
                    Join Squad
                  </button>
                ` : `
                  <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6; cursor: not-allowed;">
                    Squad Full
                  </button>
                `}
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Attach search events
  const searchInput = document.getElementById('squad-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      store.setSquadFilter('query', e.target.value);
    });
  }

  const slotsToggle = document.getElementById('squad-slots-toggle');
  if (slotsToggle) {
    slotsToggle.addEventListener('change', (e) => {
      store.setSquadFilter('openSlotsOnly', e.target.checked);
    });
  }

  const openCreateBtn = document.getElementById('btn-open-create-squad');
  if (openCreateBtn) {
    openCreateBtn.addEventListener('click', () => {
      renderCreateSquadForm();
      openModal('modal-create-squad');
    });
  }

  // Join button listeners
  container.querySelectorAll('.btn-join-squad').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const squadId = e.currentTarget.dataset.squadId;
      const squad = store.state.squads.find(s => s.id === squadId);
      if (squad) {
        store.joinSquad(squadId, "Full-Stack Contributor");
        showToast(`Joined ${squad.name}! Welcome to the squad.`, 'success', 3500);
      }
    });
  });
}

function renderCreateSquadForm() {
  const form = document.getElementById('form-create-squad');
  if (!form) return;

  form.innerHTML = `
    <div class="form-group">
      <label for="create-squad-name" class="form-label">Squad / Project Name</label>
      <input type="text" id="create-squad-name" class="form-input" required placeholder="e.g. Autonomous Drone Mapping">
    </div>

    <div class="form-group">
      <label for="create-squad-focus" class="form-label">Focus Area / Event</label>
      <input type="text" id="create-squad-focus" class="form-input" placeholder="e.g. HackHealth 2025 or Systems Project">
    </div>

    <div class="form-group">
      <label for="create-squad-goal" class="form-label">Mission &amp; Deliverables</label>
      <textarea id="create-squad-goal" class="form-textarea" required placeholder="What are you building? What problem does this solve?"></textarea>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
      <div class="form-group">
        <label for="create-squad-max-members" class="form-label">Team Capacity</label>
        <select id="create-squad-max-members" class="form-select">
          <option value="3">3 Members</option>
          <option value="4" selected>4 Members (Standard Hackathon)</option>
          <option value="5">5 Members</option>
          <option value="6">6 Members</option>
        </select>
      </div>

      <div class="form-group">
        <label for="create-squad-user-role" class="form-label">Your Role</label>
        <input type="text" id="create-squad-user-role" class="form-input" value="Squad Lead / Backend">
      </div>
    </div>

    <div class="form-group">
      <label for="create-squad-roles-needed" class="form-label">
        <span>Roles You Are Looking For</span>
        <span class="form-label-helper">Comma-separated</span>
      </label>
      <input type="text" id="create-squad-roles-needed" class="form-input" placeholder="e.g. Frontend Engineer, UI/UX Designer, ML Specialist">
    </div>

    <div class="form-group">
      <label for="create-squad-skills" class="form-label">
        <span>Required Technologies</span>
        <span class="form-label-helper">Comma-separated</span>
      </label>
      <input type="text" id="create-squad-skills" class="form-input" placeholder="e.g. PyTorch, React Native, TypeScript, Docker">
    </div>

    <div class="form-group">
      <label for="create-squad-cadence" class="form-label">Meeting Cadence</label>
      <input type="text" id="create-squad-cadence" class="form-input" value="Wednesdays &amp; Sundays 7 PM IST (Virtual)">
    </div>
  `;
}

function handleCreateSquadSubmit() {
  const nameEl = document.getElementById('create-squad-name');
  const goalEl = document.getElementById('create-squad-goal');
  const focusEl = document.getElementById('create-squad-focus');
  const maxEl = document.getElementById('create-squad-max-members');
  const roleEl = document.getElementById('create-squad-user-role');
  const lookingEl = document.getElementById('create-squad-roles-needed');
  const skillsEl = document.getElementById('create-squad-skills');
  const cadenceEl = document.getElementById('create-squad-cadence');

  if (!nameEl || !nameEl.value.trim() || !goalEl || !goalEl.value.trim()) {
    showToast('Please provide a squad name and mission goal.', 'warning', 3000);
    return;
  }

  const payload = {
    name: nameEl.value.trim(),
    goal: goalEl.value.trim(),
    focus: focusEl ? focusEl.value.trim() : 'Project Squad',
    maxMembers: maxEl ? maxEl.value : 4,
    userRole: roleEl ? roleEl.value.trim() : 'Squad Lead',
    lookingFor: lookingEl ? lookingEl.value.trim() : 'Contributors',
    requiredSkills: skillsEl ? skillsEl.value.trim() : 'TypeScript, Python',
    meetingCadence: cadenceEl ? cadenceEl.value.trim() : 'Weekly (Virtual)'
  };

  store.createSquad(payload);
  closeModal('modal-create-squad');
  showToast(`Squad "${payload.name}" published! Recruit teammates now.`, 'success', 3500);
}

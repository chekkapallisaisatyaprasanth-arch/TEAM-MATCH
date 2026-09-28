/**
 * TeamMatch Application Orchestrator
 * Bootstraps modules, manages tab routing, global search, keyboard shortcuts, and modals.
 */

import { store } from './state.js';
import { initDiscoverView } from './discover.js';
import { initLeaderboardsView, openRankingCriteriaModal } from './leaderboards.js';
import { initInternshipsView } from './internships.js';
import { initSquadsView } from './squads.js';
import { initMessagesView } from './messages.js';
import { initResumeView } from './resume.js';
import { initProfileView, updateHeaderProfileSurfaces } from './profile.js';
import { initRecruiterMode } from './recruiter.js';
import { closeAllModals, closeModal, openModal, showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Sub-Modules
  initDiscoverView();
  initLeaderboardsView();
  initInternshipsView();
  initSquadsView();
  initMessagesView();
  initResumeView();
  initProfileView();
  initRecruiterMode();
  updateHeaderProfileSurfaces();

  // 2. Setup Navigation & Routing
  setupNavigation();

  // 3. Setup Global Search & Keyboard Shortcuts
  setupGlobalSearch();

  // 4. Setup Global Modal Handlers
  setupModalDismissals();

  // 5. Setup Footer Actions
  setupFooterActions();

  // 6. Setup Settings Menu, State Change & Log Out
  setupSettingsMenu();
  setupStateChangeModal();
  setupLogoutModal();

  // Handle URL hash on initial load and browser back/forward navigation
  const validTabs = ['discover', 'leaderboards', 'internships', 'squads', 'messages', 'resume', 'profile'];
  const applyHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (validTabs.includes(hash) && store.state.activeTab !== hash) {
      store.setActiveTab(hash);
    }
  };

  applyHash();
  window.addEventListener('hashchange', applyHash);
  window.addEventListener('popstate', applyHash);
});

function setupNavigation() {
  // Desktop navigation tab buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = e.currentTarget.dataset.tab;
      store.setActiveTab(tabName);
    });
  });

  // Mobile navigation tab buttons
  document.querySelectorAll('.mobile-nav-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = e.currentTarget.dataset.tab;
      store.setActiveTab(tabName);
    });
  });

  // Top header ATS resume button
  const headerAtsBtn = document.getElementById('btn-header-ats');
  if (headerAtsBtn) {
    headerAtsBtn.addEventListener('click', () => {
      store.setActiveTab('resume');
    });
  }

  // Brand Home Link
  const brandLink = document.getElementById('brand-home-link');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      store.setActiveTab('discover');
    });
  }

  // Subscribe to TAB_CHANGED events
  store.subscribe((state, event, tabName) => {
    if (event === 'TAB_CHANGED') {
      // Update desktop tab buttons
      document.querySelectorAll('.nav-tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tabName);
      });

      // Update mobile tab buttons
      document.querySelectorAll('.mobile-nav-tab').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tabName);
      });

      // Update tab content panes
      document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
      });

      const activePane = document.getElementById(`tab-${tabName}`);
      if (activePane) {
        activePane.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Update URL hash without reload
      if (history.pushState) {
        history.pushState(null, null, `#${tabName}`);
      } else {
        window.location.hash = `#${tabName}`;
      }
    }
  });
}

function setupGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    // If not on discover, switch to discover so user sees search results
    if (store.state.activeTab !== 'discover') {
      store.setActiveTab('discover');
    }
    store.setDiscoverFilter('query', val);
  });

  // Keyboard shortcut: Press "/" to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
}

function setupModalDismissals() {
  // Delegated close for any [data-close-modal] element (handles static and dynamically injected modal controls)
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-modal]')) {
      closeAllModals();
    }
  });

  // Clicking on background backdrop outside modal dialog closes it
  document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal-backdrop')) {
      closeAllModals();
    }
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

function setupFooterActions() {
  const guideBtn = document.getElementById('footer-btn-ats-guide');
  if (guideBtn) {
    guideBtn.addEventListener('click', () => {
      store.setActiveTab('resume');
      showToast('ATS Resume Builder loaded with machine-readable layout standards.', 'info', 3000);
    });
  }

  const privacyBtn = document.getElementById('footer-btn-privacy');
  if (privacyBtn) {
    privacyBtn.addEventListener('click', () => {
      showToast('Student Privacy Notice: Verified signals require consent. GPA may be kept confidential at any time.', 'info', 4000);
    });
  }
}

function setupSettingsMenu() {
  const settingsBtn = document.getElementById('btn-settings-header');
  const dropdownMenu = document.getElementById('settings-dropdown-menu');
  const stateLabel = document.getElementById('settings-active-state-text');
  const changeStateBtn = document.getElementById('btn-setting-change-state');
  const editProfileBtn = document.getElementById('btn-setting-edit-profile');
  const logoutBtn = document.getElementById('btn-setting-logout');

  const updateStateLabel = () => {
    if (stateLabel) {
      stateLabel.textContent = `Active: ${store.state.currentUser.state || 'Maharashtra'}`;
    }
  };

  const updateLogoutButtonText = () => {
    if (logoutBtn) {
      if (store.state.isGuest) {
        logoutBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          <span>Log In as Demo Student</span>
        `;
        logoutBtn.classList.remove('text-danger');
      } else {
        logoutBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Log Out</span>
        `;
        logoutBtn.classList.add('text-danger');
      }
    }
  };

  updateStateLabel();
  updateLogoutButtonText();

  store.subscribe((state, event) => {
    if (event === 'USER_UPDATED' || event === 'AUTH_STATE_CHANGED') {
      updateStateLabel();
      updateLogoutButtonText();
    }
  });

  if (settingsBtn && dropdownMenu) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!settingsBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('active');
      }
    });
  }

  if (changeStateBtn) {
    changeStateBtn.addEventListener('click', () => {
      if (dropdownMenu) dropdownMenu.classList.remove('active');
      renderStateSelectionGrid();
      openModal('modal-state-change');
    });
  }

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      if (dropdownMenu) dropdownMenu.classList.remove('active');
      openModal('modal-edit-profile');
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (dropdownMenu) dropdownMenu.classList.remove('active');
      if (store.state.isGuest) {
        store.login();
        showToast('Welcome back! Logged in as Aarav Sharma.', 'success', 3500);
      } else {
        openModal('modal-logout');
      }
    });
  }
}

const INDIAN_STATES = [
  { name: "Andhra Pradesh (Vijayawada)", desc: "KL University, SRM AP, IIT / NIT AP", key: "Andhra Pradesh (Vijayawada)" },
  { name: "Karnataka", desc: "Bengaluru, IISc, Top Tech Hubs", key: "Karnataka" },
  { name: "Maharashtra", desc: "Mumbai, Pune, IIT Bombay", key: "Maharashtra" },
  { name: "Delhi NCR", desc: "New Delhi, Gurugram, Noida, DTU", key: "Delhi NCR" },
  { name: "Telangana", desc: "Hyderabad, IIIT-H, Cyberabad", key: "Telangana" },
  { name: "Tamil Nadu", desc: "Chennai, IIT Madras, NIT Trichy", key: "Tamil Nadu" },
  { name: "West Bengal", desc: "Kolkata, IIT Kharagpur, Jadavpur", key: "West Bengal" },
  { name: "Uttar Pradesh", desc: "IIT Kanpur, MNNIT Allahabad", key: "Uttar Pradesh" },
  { name: "Kerala", desc: "Kochi, Kozhikode, NIT Calicut", key: "Kerala" },
  { name: "Gujarat", desc: "Ahmedabad, IIT Gandhinagar, SVNIT", key: "Gujarat" },
  { name: "Rajasthan", desc: "BITS Pilani, IIT Jodhpur, Jaipur", key: "Rajasthan" },
  { name: "All India", desc: "Nationwide pool across all states", key: "ALL" }
];

function renderStateSelectionGrid() {
  const container = document.getElementById('quick-state-selector-container');
  if (!container) return;

  const currentState = store.state.currentUser.state;

  container.innerHTML = INDIAN_STATES.map(st => {
    const isSelected = st.key === currentState || (st.key === 'ALL' && store.state.discoverFilters.state === 'ALL');

    return `
      <button class="state-select-btn ${isSelected ? 'active' : ''}" data-state-key="${st.key}">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <strong style="font-size: 0.85rem; color: var(--color-slate-900);">${st.name}</strong>
          ${isSelected ? '<span class="badge badge-sky" style="font-size: 0.65rem;">Active</span>' : ''}
        </div>
        <span style="font-size: 0.725rem; color: var(--text-muted); line-height: 1.3;">${st.desc}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.state-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const stateKey = e.currentTarget.dataset.stateKey;

      if (stateKey !== 'ALL') {
        store.updateCurrentUser({ state: stateKey });
        store.setDiscoverFilter('state', stateKey);
        store.setLeaderboardFilter('state', stateKey);
      } else {
        store.setDiscoverFilter('state', 'ALL');
        store.setLeaderboardFilter('state', 'ALL');
      }

      // Synchronize the dropdown on Discover page
      const discoverSelect = document.getElementById('filter-state');
      if (discoverSelect) {
        discoverSelect.value = stateKey;
      }

      closeModal('modal-state-change');
      showToast(`State changed to ${stateKey === 'ALL' ? 'All India' : stateKey}! Feed & rankings updated.`, 'success', 3000);
    });
  });
}

function setupStateChangeModal() {
  // Handled via renderStateSelectionGrid
}

function setupLogoutModal() {
  const confirmBtn = document.getElementById('btn-confirm-logout');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      closeModal('modal-logout');
      store.logout();
      showToast('Logged out successfully. Browsing in Guest Mode.', 'info', 3500);
    });
  }
}

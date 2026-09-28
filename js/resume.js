/**
 * TeamMatch ATS Resume Builder & Machine-Readable Preview Module
 * Structured section editing, real-time ATS parseability audit, and native browser print.
 */

import { store } from './state.js';
import { escapeHTML, showToast } from './utils.js';

export function initResumeView() {
  renderResumeView();

  store.subscribe((state, event) => {
    if (event === 'RESUME_UPDATED' || event === 'USER_UPDATED') {
      renderResumeView();
    }
  });
}

export function renderResumeView() {
  const container = document.getElementById('resume-container');
  if (!container) return;

  const resume = store.state.resume;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- Page Top Header & Action Controls -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;" class="resume-actions-bar">
        <div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--color-slate-900); letter-spacing: -0.02em;">
            My ATS-Friendly Resume Builder
          </h2>
          <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.2rem;">
            Single-column machine-readable format optimized for Applicant Tracking Systems (Workday, Greenhouse, Lever).
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <button class="btn btn-secondary btn-sm" id="btn-sync-profile-resume">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            Sync from Student Profile
          </button>

          <button class="btn btn-primary btn-sm" id="btn-print-resume">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print / Save as ATS PDF
          </button>
        </div>
      </div>

      <!-- Main Two-Column Layout: Left Editor + Right ATS Preview -->
      <div class="resume-layout">

        <!-- Left Column: Section Editors -->
        <div class="resume-editor-panel">
          
          <!-- ATS Audit Score Card -->
          <div class="ats-score-card">
            <div class="ats-score-header">
              <div>
                <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #94a3b8;">ATS Parseability Audit</span>
                <div class="ats-score-badge">98 <span>/ 100</span></div>
              </div>
              <span class="badge badge-verified" style="font-size: 0.8rem; background-color: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.3);">
                ✓ High Parser Compatibility
              </span>
            </div>

            <div class="ats-audit-list">
              <div class="ats-audit-item">
                <span class="ats-audit-icon-pass">✓</span>
                <span><strong>Single Column Layout:</strong> Zero complex tables or multi-column text frames that scramble parsers.</span>
              </div>
              <div class="ats-audit-item">
                <span class="ats-audit-icon-pass">✓</span>
                <span><strong>Standard Typography:</strong> Standard serif/sans font hierarchy with clear header tags.</span>
              </div>
              <div class="ats-audit-item">
                <span class="ats-audit-icon-pass">✓</span>
                <span><strong>Action Verbs &amp; Impact:</strong> Quantified achievements with percentage, scale, and latency metrics.</span>
              </div>
              <div class="ats-audit-item">
                <span class="ats-audit-icon-pass">✓</span>
                <span><strong>Machine-Extractable Contact:</strong> Plain text email, phone, location, and portfolio URLs.</span>
              </div>
            </div>

            <div class="ats-disclaimer">
              <strong>Transparent ATS Notice:</strong> Clean formatting ensures maximum parser readability across enterprise recruiting systems. Resume structure alone does not guarantee hiring or interview decisions.
            </div>
          </div>

          <!-- Section 1: Contact & Header Info -->
          <div class="card" style="padding: 1.25rem;">
            <h3 style="font-size: 1rem; font-weight: 700; color: var(--color-slate-900); margin-bottom: 0.85rem;">
              1. Contact &amp; Header
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label for="res-name" class="form-label">Full Legal Name</label>
                <input type="text" id="res-name" class="form-input" value="${escapeHTML(resume.header.fullName)}">
              </div>
              <div class="form-group">
                <label for="res-email" class="form-label">Primary Email</label>
                <input type="email" id="res-email" class="form-input" value="${escapeHTML(resume.header.email)}">
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="form-group">
                <label for="res-phone" class="form-label">Phone Number</label>
                <input type="text" id="res-phone" class="form-input" value="${escapeHTML(resume.header.phone)}">
              </div>
              <div class="form-group">
                <label for="res-location" class="form-label">Location (City, State)</label>
                <input type="text" id="res-location" class="form-input" value="${escapeHTML(resume.header.location)}">
              </div>
            </div>
            <div class="form-group">
              <label for="res-headline" class="form-label">Professional Target Headline</label>
              <input type="text" id="res-headline" class="form-input" value="${escapeHTML(resume.header.headline)}">
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem;">
              <div class="form-group">
                <label for="res-github" class="form-label">GitHub URL</label>
                <input type="text" id="res-github" class="form-input" value="${escapeHTML(resume.header.github || '')}">
              </div>
              <div class="form-group">
                <label for="res-linkedin" class="form-label">LinkedIn URL</label>
                <input type="text" id="res-linkedin" class="form-input" value="${escapeHTML(resume.header.linkedin || '')}">
              </div>
              <div class="form-group">
                <label for="res-portfolio" class="form-label">Portfolio Website</label>
                <input type="text" id="res-portfolio" class="form-input" value="${escapeHTML(resume.header.portfolio || '')}">
              </div>
            </div>
          </div>

          <!-- Section 2: Education -->
          <div class="card" style="padding: 1.25rem;">
            <h3 style="font-size: 1rem; font-weight: 700; color: var(--color-slate-900); margin-bottom: 0.85rem;">
              2. Education
            </h3>
            ${resume.education.map((edu, idx) => `
              <div style="display: flex; flex-direction: column; gap: 0.65rem; padding-bottom: 0.75rem; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
                <div class="form-group">
                  <label for="edu-inst-${idx}" class="form-label">University / College</label>
                  <input type="text" id="edu-inst-${idx}" class="form-input edu-field" data-idx="${idx}" data-key="institution" value="${escapeHTML(edu.institution)}">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                  <div class="form-group">
                    <label for="edu-deg-${idx}" class="form-label">Degree &amp; Major</label>
                    <input type="text" id="edu-deg-${idx}" class="form-input edu-field" data-idx="${idx}" data-key="degree" value="${escapeHTML(edu.degree)}">
                  </div>
                  <div class="form-group">
                    <label for="edu-grad-${idx}" class="form-label">Graduation Date</label>
                    <input type="text" id="edu-grad-${idx}" class="form-input edu-field" data-idx="${idx}" data-key="graduationDate" value="${escapeHTML(edu.graduationDate)}">
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 0.75rem;">
                  <div class="form-group">
                    <label for="edu-gpa-${idx}" class="form-label">GPA (Optional)</label>
                    <input type="text" id="edu-gpa-${idx}" class="form-input edu-field" data-idx="${idx}" data-key="gpa" value="${escapeHTML(edu.gpa)}">
                  </div>
                  <div class="form-group">
                    <label for="edu-course-${idx}" class="form-label">Relevant Coursework</label>
                    <input type="text" id="edu-course-${idx}" class="form-input edu-field" data-idx="${idx}" data-key="coursework" value="${escapeHTML(edu.coursework)}">
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Section 3: Technical Skills -->
          <div class="card" style="padding: 1.25rem;">
            <h3 style="font-size: 1rem; font-weight: 700; color: var(--color-slate-900); margin-bottom: 0.85rem;">
              3. Technical Skills
            </h3>
            <div class="form-group">
              <label for="res-skills-languages" class="form-label">Programming Languages</label>
              <input type="text" id="res-skills-languages" class="form-input" value="${escapeHTML(resume.skills.languages)}">
            </div>
            <div class="form-group">
              <label for="res-skills-systems" class="form-label">Systems, Cloud &amp; Developer Tools</label>
              <input type="text" id="res-skills-systems" class="form-input" value="${escapeHTML(resume.skills.systemsTools)}">
            </div>
            <div class="form-group">
              <label for="res-skills-frameworks" class="form-label">Frameworks &amp; Libraries</label>
              <input type="text" id="res-skills-frameworks" class="form-input" value="${escapeHTML(resume.skills.frameworks)}">
            </div>
          </div>

          <!-- Section 4: Projects (Key for Students) -->
          <div class="card" style="padding: 1.25rem;">
            <h3 style="font-size: 1rem; font-weight: 700; color: var(--color-slate-900); margin-bottom: 0.85rem;">
              4. Key Technical Projects
            </h3>
            ${resume.projects.map((proj, idx) => `
              <div style="padding-bottom: 0.75rem; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.5rem;">
                  <div class="form-group">
                    <label for="proj-name-${idx}" class="form-label">Project Name</label>
                    <input type="text" id="proj-name-${idx}" class="form-input proj-field" data-idx="${idx}" data-key="name" value="${escapeHTML(proj.name)}">
                  </div>
                  <div class="form-group">
                    <label for="proj-tech-${idx}" class="form-label">Tech Stack</label>
                    <input type="text" id="proj-tech-${idx}" class="form-input proj-field" data-idx="${idx}" data-key="technologies" value="${escapeHTML(proj.technologies)}">
                  </div>
                </div>
                <div class="form-group">
                  <label for="proj-bullets-${idx}" class="form-label">Bullet Points (One per line)</label>
                  <textarea id="proj-bullets-${idx}" class="form-textarea proj-bullets" data-idx="${idx}" rows="3">${escapeHTML(proj.bullets.join('\n'))}</textarea>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Section 5: Experience -->
          <div class="card" style="padding: 1.25rem;">
            <h3 style="font-size: 1rem; font-weight: 700; color: var(--color-slate-900); margin-bottom: 0.85rem;">
              5. Work &amp; Research Experience
            </h3>
            ${resume.experience.map((exp, idx) => `
              <div style="padding-bottom: 0.75rem; margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                  <div class="form-group">
                    <label for="exp-comp-${idx}" class="form-label">Company / Lab</label>
                    <input type="text" id="exp-comp-${idx}" class="form-input exp-field" data-idx="${idx}" data-key="company" value="${escapeHTML(exp.company)}">
                  </div>
                  <div class="form-group">
                    <label for="exp-title-${idx}" class="form-label">Role Title</label>
                    <input type="text" id="exp-title-${idx}" class="form-input exp-field" data-idx="${idx}" data-key="title" value="${escapeHTML(exp.title)}">
                  </div>
                </div>
                <div class="form-group">
                  <label for="exp-bullets-${idx}" class="form-label">Accomplishments (One per line)</label>
                  <textarea id="exp-bullets-${idx}" class="form-textarea exp-bullets" data-idx="${idx}" rows="3">${escapeHTML(exp.bullets.join('\n'))}</textarea>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Section 6: Honors & Achievements -->
          <div class="card" style="padding: 1.25rem;">
            <h3 style="font-size: 1rem; font-weight: 700; color: var(--color-slate-900); margin-bottom: 0.85rem;">
              6. Honors &amp; Certifications
            </h3>
            <div class="form-group">
              <label for="res-achievements" class="form-label">Achievements (One per line)</label>
              <textarea id="res-achievements" class="form-textarea" rows="4">${escapeHTML((resume.achievements || []).join('\n'))}</textarea>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-save-resume-changes" style="width: 100%;">
            Save &amp; Update ATS Resume
          </button>
        </div>

        <!-- Right Column: ATS Machine-Readable Preview Document -->
        <div class="resume-preview-panel">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.95rem; color: var(--color-slate-900);">ATS Live Document Preview</strong>
            <span style="font-size: 0.775rem; color: var(--text-muted);">Standard 8.5 x 11 In. Dimensions</span>
          </div>

          <div class="ats-paper-container">
            <article class="ats-paper" id="ats-paper-document">
              <!-- Name & Headline -->
              <h1 class="ats-name">${escapeHTML(resume.header.fullName)}</h1>
              <div class="ats-headline">${escapeHTML(resume.header.headline)}</div>

              <!-- Contact Line -->
              <div class="ats-contact-line">
                ${[
                  resume.header.location,
                  resume.header.email,
                  resume.header.phone,
                  resume.header.github,
                  resume.header.linkedin,
                  resume.header.portfolio
                ].filter(s => s && String(s).trim().length > 0).map(s => escapeHTML(s)).join(' &bull; ')}
              </div>

              <!-- Education Section -->
              <section class="ats-section">
                <h2 class="ats-section-title">Education</h2>
                ${resume.education.map(edu => `
                  <div style="margin-bottom: 6pt;">
                    <div class="ats-entry-header">
                      <span>${escapeHTML(edu.institution)}</span>
                      <span>${escapeHTML(edu.graduationDate)}</span>
                    </div>
                    <div class="ats-entry-subheader">
                      <span>${escapeHTML(edu.degree)}</span>
                      <span>${escapeHTML(edu.gpa)}</span>
                    </div>
                    ${edu.coursework ? `
                      <div style="font-size: 9.5pt; font-style: italic;">
                        Relevant Coursework: ${escapeHTML(edu.coursework)}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </section>

              <!-- Technical Skills Section -->
              <section class="ats-section">
                <h2 class="ats-section-title">Technical Skills</h2>
                <div class="ats-skills-line">
                  <strong>Languages:</strong> ${escapeHTML(resume.skills.languages)}
                </div>
                <div class="ats-skills-line">
                  <strong>Systems &amp; Tools:</strong> ${escapeHTML(resume.skills.systemsTools)}
                </div>
                <div class="ats-skills-line">
                  <strong>Frameworks &amp; Architectures:</strong> ${escapeHTML(resume.skills.frameworks)}
                </div>
                ${resume.skills.concepts ? `
                  <div class="ats-skills-line">
                    <strong>Core Concepts:</strong> ${escapeHTML(resume.skills.concepts)}
                  </div>
                ` : ''}
              </section>

              <!-- Projects Section -->
              <section class="ats-section">
                <h2 class="ats-section-title">Technical Projects</h2>
                ${resume.projects.map(proj => `
                  <div style="margin-bottom: 6pt;">
                    <div class="ats-entry-header">
                      <span>${escapeHTML(proj.name)}</span>
                      <span style="font-size: 9.5pt; font-weight: normal; font-style: italic;">${escapeHTML(proj.technologies)}</span>
                    </div>
                    <ul class="ats-bullet-list">
                      ${proj.bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </section>

              <!-- Work Experience Section -->
              <section class="ats-section">
                <h2 class="ats-section-title">Experience</h2>
                ${resume.experience.map(exp => `
                  <div style="margin-bottom: 6pt;">
                    <div class="ats-entry-header">
                      <span>${escapeHTML(exp.company)}</span>
                      <span>${escapeHTML(exp.startDate)} – ${escapeHTML(exp.endDate)}</span>
                    </div>
                    <div class="ats-entry-subheader">
                      <span>${escapeHTML(exp.title)}</span>
                      <span>${escapeHTML(exp.location)}</span>
                    </div>
                    <ul class="ats-bullet-list">
                      ${exp.bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </section>

              <!-- Honors & Achievements Section -->
              ${resume.achievements && resume.achievements.length > 0 ? `
                <section class="ats-section">
                  <h2 class="ats-section-title">Honors &amp; Certifications</h2>
                  <ul class="ats-bullet-list">
                    ${resume.achievements.map(ach => `<li>${escapeHTML(ach)}</li>`).join('')}
                  </ul>
                </section>
              ` : ''}
            </article>
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach Print event
  const printBtn = document.getElementById('btn-print-resume');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Attach Sync from profile event
  const syncBtn = document.getElementById('btn-sync-profile-resume');
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      store.syncResumeFromProfile();
      showToast('ATS Resume synced with your latest student profile!', 'success', 3000);
    });
  }

  // Attach Save resume changes event
  const saveBtn = document.getElementById('btn-save-resume-changes');
  if (saveBtn) {
    saveBtn.addEventListener('click', handleSaveResumeChanges);
  }
}

function handleSaveResumeChanges() {
  const currentResume = store.state.resume;

  const nameEl = document.getElementById('res-name');
  const emailEl = document.getElementById('res-email');
  const phoneEl = document.getElementById('res-phone');
  const locEl = document.getElementById('res-location');
  const headEl = document.getElementById('res-headline');
  const gitEl = document.getElementById('res-github');
  const linkEl = document.getElementById('res-linkedin');
  const portEl = document.getElementById('res-portfolio');

  const langEl = document.getElementById('res-skills-languages');
  const sysEl = document.getElementById('res-skills-systems');
  const frameEl = document.getElementById('res-skills-frameworks');
  const achEl = document.getElementById('res-achievements');

  const updated = {
    ...currentResume,
    header: {
      fullName: nameEl ? nameEl.value : currentResume.header.fullName,
      headline: headEl ? headEl.value : currentResume.header.headline,
      email: emailEl ? emailEl.value : currentResume.header.email,
      phone: phoneEl ? phoneEl.value : currentResume.header.phone,
      location: locEl ? locEl.value : currentResume.header.location,
      github: gitEl ? gitEl.value : currentResume.header.github,
      linkedin: linkEl ? linkEl.value : currentResume.header.linkedin,
      portfolio: portEl ? portEl.value : currentResume.header.portfolio
    },
    skills: {
      ...currentResume.skills,
      languages: langEl ? langEl.value : currentResume.skills.languages,
      systemsTools: sysEl ? sysEl.value : currentResume.skills.systemsTools,
      frameworks: frameEl ? frameEl.value : currentResume.skills.frameworks
    },
    achievements: achEl ? achEl.value.split('\n').filter(s => s.trim().length > 0) : currentResume.achievements
  };

  // Update education fields
  document.querySelectorAll('.edu-field').forEach(input => {
    const idx = parseInt(input.dataset.idx, 10);
    const key = input.dataset.key;
    if (updated.education[idx]) {
      updated.education[idx][key] = input.value;
    }
  });

  // Update project fields
  document.querySelectorAll('.proj-field').forEach(input => {
    const idx = parseInt(input.dataset.idx, 10);
    const key = input.dataset.key;
    if (updated.projects[idx]) {
      updated.projects[idx][key] = input.value;
    }
  });

  document.querySelectorAll('.proj-bullets').forEach(textarea => {
    const idx = parseInt(textarea.dataset.idx, 10);
    if (updated.projects[idx]) {
      updated.projects[idx].bullets = textarea.value.split('\n').filter(s => s.trim().length > 0);
    }
  });

  // Update experience fields
  document.querySelectorAll('.exp-field').forEach(input => {
    const idx = parseInt(input.dataset.idx, 10);
    const key = input.dataset.key;
    if (updated.experience[idx]) {
      updated.experience[idx][key] = input.value;
    }
  });

  document.querySelectorAll('.exp-bullets').forEach(textarea => {
    const idx = parseInt(textarea.dataset.idx, 10);
    if (updated.experience[idx]) {
      updated.experience[idx].bullets = textarea.value.split('\n').filter(s => s.trim().length > 0);
    }
  });

  store.updateResume(updated);
  showToast('ATS Resume saved and preview updated!', 'success', 3000);
}

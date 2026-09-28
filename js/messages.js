/**
 * TeamMatch Networking Messages & Inbox Module
 * Student-to-student and student-to-recruiter chat view.
 */

import { store } from './state.js';
import { escapeHTML, showToast } from './utils.js';

export function initMessagesView() {
  renderMessages();

  store.subscribe((state, event) => {
    if (
      event === 'CONVERSATION_SELECTED' || 
      event === 'CONVERSATION_OPENED' ||
      event === 'MESSAGE_SENT'
    ) {
      renderMessages();
    }
  });
}

let mobileChatView = 'chat'; // 'threads' | 'chat'

export function renderMessages() {
  const container = document.getElementById('messages-container');
  if (!container) return;

  const conversations = store.state.conversations;
  const activeId = store.state.activeConversationId;
  const activeConv = conversations.find(c => c.id === activeId) || conversations[0];

  // Update unread count badge in header
  const totalUnread = conversations.filter(c => c.unread).length;
  const badgeEl = document.getElementById('unread-messages-count');
  if (badgeEl) {
    badgeEl.textContent = totalUnread;
    badgeEl.style.display = totalUnread > 0 ? 'inline-block' : 'none';
  }

  const viewingClass = (mobileChatView === 'chat' && activeConv) ? 'viewing-chat' : 'viewing-threads';

  container.innerHTML = `
    <div class="chat-container-box ${viewingClass}" id="chat-wrapper">
      <!-- Conversation Threads Sidebar -->
      <aside class="chat-sidebar">
        <div style="padding: 1rem; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <h2 style="font-size: 1.05rem; font-weight: 800; color: var(--color-slate-900);">Messages</h2>
          <span class="badge badge-sky" style="font-size: 0.7rem;">${conversations.length} Threads</span>
        </div>

        <div style="overflow-y: auto; flex: 1;" id="conversations-list">
          ${conversations.map(c => {
            const isSelected = activeConv && activeConv.id === c.id;
            const lastMsg = (c.messages && c.messages.length > 0) ? c.messages[c.messages.length - 1] : null;

            return `
              <div class="conv-thread-item" data-conv-id="${c.id}" style="padding: 0.85rem 1rem; border-bottom: 1px solid var(--border-subtle); cursor: pointer; background-color: ${isSelected ? 'var(--color-primary-50)' : '#ffffff'}; border-left: 3px solid ${isSelected ? 'var(--color-primary-600)' : 'transparent'}; transition: background-color var(--transition-fast);">
                <div style="display: flex; gap: 0.65rem; align-items: flex-start;">
                  <div class="avatar-badge" style="width: 2.25rem; height: 2.25rem; font-size: 0.8rem; flex-shrink: 0; background-color: ${c.participantType === 'recruiter' ? 'var(--color-indigo-600)' : 'var(--color-primary-600)'};">
                    ${escapeHTML(c.participantAvatar || 'U')}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                      <strong style="font-size: 0.875rem; color: var(--color-slate-900); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${escapeHTML(c.participantName)}
                      </strong>
                      <span style="font-size: 0.675rem; color: var(--text-muted); flex-shrink: 0;">${escapeHTML(c.lastUpdated)}</span>
                    </div>
                    <span style="font-size: 0.725rem; color: ${c.participantType === 'recruiter' ? 'var(--color-indigo-700)' : 'var(--color-primary-700)'}; font-weight: 600; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      ${escapeHTML(c.participantRole)}
                    </span>
                    <p style="font-size: 0.775rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 0.2rem;">
                      ${lastMsg ? escapeHTML(lastMsg.text) : 'Start collaborating...'}
                    </p>
                  </div>
                  ${c.unread ? `
                    <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--color-primary-600); flex-shrink: 0; margin-top: 0.35rem;"></span>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </aside>

      <!-- Active Conversation Main Chat Window -->
      <section class="chat-main" aria-label="Conversation with ${activeConv ? escapeHTML(activeConv.participantName) : 'User'}">
        ${activeConv ? `
          <!-- Chat Header -->
          <div style="padding: 0.85rem 1.25rem; background-color: #ffffff; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <!-- Mobile Back Button -->
              <button class="btn btn-secondary btn-xs btn-mobile-back-threads" id="btn-chat-mobile-back" title="Back to conversations list" style="display: none; align-items: center; gap: 0.3rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                <span>Threads</span>
              </button>

              <div class="avatar-badge" style="width: 2.25rem; height: 2.25rem; font-size: 0.85rem; background-color: ${activeConv.participantType === 'recruiter' ? 'var(--color-indigo-600)' : 'var(--color-primary-600)'};">
                ${escapeHTML(activeConv.participantAvatar || 'U')}
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                  <h3 style="font-size: 0.95rem; font-weight: 800; color: var(--color-slate-900);">${escapeHTML(activeConv.participantName)}</h3>
                  <span class="badge ${activeConv.participantType === 'recruiter' ? 'badge-indigo' : 'badge-sky'}" style="font-size: 0.65rem;">
                    ${activeConv.participantType === 'recruiter' ? 'Verified Recruiter' : 'Student Peer'}
                  </span>
                </div>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${escapeHTML(activeConv.participantRole)}</span>
              </div>
            </div>

            <!-- In-product Privacy Notice -->
            <span style="font-size: 0.725rem; color: var(--text-muted); display: none;" class="chat-privacy-notice">
              🛡 In-product secure messaging active
            </span>
          </div>

          <!-- Message History -->
          <div style="flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem;" id="chat-messages-scroll">
            <div style="text-align: center; margin-bottom: 0.5rem;">
              <span style="background-color: var(--color-slate-200); color: var(--color-slate-700); font-size: 0.675rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: var(--radius-full); text-transform: uppercase;">
                Encrypted Peer Communication
              </span>
            </div>

            ${activeConv.messages.map(msg => {
              const isMe = msg.sender === 'me';
              return `
                <div style="display: flex; flex-direction: column; align-items: ${isMe ? 'flex-end' : 'flex-start'}; gap: 0.2rem;">
                  <div style="max-width: 75%; padding: 0.75rem 1rem; border-radius: var(--radius-lg); font-size: 0.875rem; line-height: 1.45; ${
                    isMe 
                      ? 'background-color: var(--color-primary-600); color: #ffffff; border-bottom-right-radius: var(--radius-xs);' 
                      : 'background-color: #ffffff; color: var(--color-slate-900); border: 1px solid var(--border-subtle); border-bottom-left-radius: var(--radius-xs); box-shadow: var(--shadow-xs);'
                  }">
                    ${escapeHTML(msg.text)}
                  </div>
                  <span style="font-size: 0.675rem; color: var(--text-muted); padding: 0 0.25rem;">
                    ${escapeHTML(msg.timestamp)}
                  </span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Quick Suggestion Chips -->
          <div style="padding: 0.5rem 1rem; background-color: #ffffff; border-top: 1px solid var(--border-subtle); display: flex; gap: 0.4rem; overflow-x: auto;">
            <button class="btn btn-ghost btn-xs btn-chip-reply" data-text="Here is my attached ATS resume from TeamMatch for your review.">
              📄 Share ATS Resume
            </button>
            <button class="btn btn-ghost btn-xs btn-chip-reply" data-text="I would love to connect about collaborating on your squad!">
              🤝 Collaborate on Squad
            </button>
            <button class="btn btn-ghost btn-xs btn-chip-reply" data-text="When would be a good time for a quick 15-minute sync?">
              🗓 Suggest a Time
            </button>
          </div>

          <!-- Compose Bar -->
          <div style="padding: 0.85rem 1rem; background-color: #ffffff; border-top: 1px solid var(--border-subtle); display: flex; gap: 0.65rem; align-items: center;">
            <input 
              type="text" 
              id="chat-compose-input" 
              class="form-input" 
              placeholder="Type a message to ${escapeHTML(activeConv.participantName)}..." 
              autocomplete="off"
            >
            <button class="btn btn-primary" id="btn-send-message" style="flex-shrink: 0;">
              <span>Send</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        ` : `
          <div class="empty-state" style="margin: auto;">
            <h3 class="empty-title">Select a conversation</h3>
            <p class="empty-desc">Choose a thread from the left or connect with a student or recruiter on TeamMatch.</p>
          </div>
        `}
      </section>
    </div>
  `;

  // Responsive privacy notice visibility on desktop
  const privacyNotice = container.querySelector('.chat-privacy-notice');
  if (window.innerWidth >= 768 && privacyNotice) {
    privacyNotice.style.display = 'block';
  }

  // Mobile Back Button listener
  const backBtn = document.getElementById('btn-chat-mobile-back');
  const chatWrapper = document.getElementById('chat-wrapper');
  if (backBtn && chatWrapper) {
    backBtn.addEventListener('click', () => {
      mobileChatView = 'threads';
      chatWrapper.classList.remove('viewing-chat');
      chatWrapper.classList.add('viewing-threads');
    });
  }

  // Scroll messages to bottom
  const scrollArea = document.getElementById('chat-messages-scroll');
  if (scrollArea) {
    scrollArea.scrollTop = scrollArea.scrollHeight;
  }

  // Conversation thread selection
  container.querySelectorAll('.conv-thread-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const convId = e.currentTarget.dataset.convId;
      mobileChatView = 'chat';
      store.setActiveConversation(convId);
    });
  });

  // Compose send
  const sendBtn = document.getElementById('btn-send-message');
  const inputEl = document.getElementById('chat-compose-input');

  const handleSend = () => {
    if (!inputEl || !activeConv) return;
    const text = inputEl.value.trim();
    if (!text) return;

    store.sendMessage(activeConv.id, text);
    inputEl.value = '';
    inputEl.focus();
  };

  if (sendBtn) {
    sendBtn.addEventListener('click', handleSend);
  }

  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }

  // Quick reply chips
  container.querySelectorAll('.btn-chip-reply').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = e.currentTarget.dataset.text;
      if (inputEl) {
        inputEl.value = text;
        inputEl.focus();
      }
    });
  });
}

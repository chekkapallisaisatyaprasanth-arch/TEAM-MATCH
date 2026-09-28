/**
 * TeamMatch Reactive State Store
 * Handles central state, LocalStorage persistence, actions, and event subscriptions.
 */

import {
  INITIAL_CURRENT_USER,
  INITIAL_STUDENTS,
  INITIAL_INTERNSHIPS,
  INITIAL_SQUADS,
  INITIAL_CONVERSATIONS,
  INITIAL_ATS_RESUME
} from './data.js';

const STORAGE_KEYS = {
  USER: 'teammatch_user_in_v3',
  STUDENTS: 'teammatch_students_in_v3',
  INTERNSHIPS: 'teammatch_internships_in_v3',
  SQUADS: 'teammatch_squads_in_v3',
  CONVERSATIONS: 'teammatch_conversations_in_v3',
  RESUME: 'teammatch_resume_in_v3',
  RECRUITER_MODE: 'teammatch_recruiter_mode_in_v3'
};

function loadStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    // If fallback is an array of objects with id, merge any newly added seed items
    if (Array.isArray(fallback) && Array.isArray(parsed) && fallback.length > 0 && fallback[0]?.id) {
      const existingIds = new Set(parsed.map(p => p.id));
      const missing = fallback.filter(f => !existingIds.has(f.id));
      return [...parsed, ...missing];
    }
    return parsed;
  } catch (e) {
    console.warn(`Could not read localStorage for key: ${key}`, e);
    return fallback;
  }
}

function saveStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Could not write localStorage for key: ${key}`, e);
  }
}

class Store {
  constructor() {
    this.state = {
      currentUser: loadStorage(STORAGE_KEYS.USER, INITIAL_CURRENT_USER),
      students: loadStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS),
      internships: loadStorage(STORAGE_KEYS.INTERNSHIPS, INITIAL_INTERNSHIPS),
      squads: loadStorage(STORAGE_KEYS.SQUADS, INITIAL_SQUADS),
      conversations: loadStorage(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS),
      resume: loadStorage(STORAGE_KEYS.RESUME, INITIAL_ATS_RESUME),
      recruiterMode: loadStorage(STORAGE_KEYS.RECRUITER_MODE, false),
      activeTab: 'discover',
      activeConversationId: 'conv-1',
      compareList: [], // student IDs for recruiter compare (max 3)
      recruiterStageFilter: 'All Candidates',
      discoverFilters: {
        query: '',
        state: 'ALL',
        major: 'ALL',
        skill: 'ALL',
        gradYear: 'ALL'
      },
      leaderboardFilter: {
        state: 'ALL',
        sortBy: 'composite' // 'composite' | 'coding' | 'hackathons'
      },
      internshipFilters: {
        query: '',
        role: 'ALL',
        workType: 'ALL',
        verifiedOnly: false
      },
      squadFilters: {
        query: '',
        category: 'ALL',
        openSlotsOnly: false
      }
    };

    this.subscribers = new Set();
  }

  subscribe(listener) {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  notify(event, payload) {
    this.subscribers.forEach(fn => fn(this.state, event, payload));
  }

  // --- TAB & MODE NAVIGATION ---
  setActiveTab(tabName) {
    this.state.activeTab = tabName;
    this.notify('TAB_CHANGED', tabName);
  }

  toggleRecruiterMode(forceVal = null) {
    this.state.recruiterMode = forceVal !== null ? forceVal : !this.state.recruiterMode;
    saveStorage(STORAGE_KEYS.RECRUITER_MODE, this.state.recruiterMode);
    this.notify('RECRUITER_MODE_CHANGED', this.state.recruiterMode);
  }

  // --- CURRENT USER PROFILE ACTIONS ---
  updateCurrentUser(updatedFields) {
    this.state.currentUser = {
      ...this.state.currentUser,
      ...updatedFields
    };
    saveStorage(STORAGE_KEYS.USER, this.state.currentUser);
    this.notify('USER_UPDATED', this.state.currentUser);
  }

  logout() {
    this.state.isGuest = true;
    this.state.currentUser = {
      ...this.state.currentUser,
      name: "Guest Student",
      avatar: "GS",
      headline: "Guest Explorer Mode",
      school: "Visitor University",
      bio: "Browsing TeamMatch in Guest Mode. Log in as Aarav Sharma to manage your profile, squads, and ATS resume."
    };
    this.notify('USER_UPDATED', this.state.currentUser);
    this.notify('AUTH_STATE_CHANGED', { isGuest: true });
  }

  login() {
    this.state.isGuest = false;
    this.state.currentUser = loadStorage(STORAGE_KEYS.USER, INITIAL_CURRENT_USER);
    this.notify('USER_UPDATED', this.state.currentUser);
    this.notify('AUTH_STATE_CHANGED', { isGuest: false });
  }

  // --- DISCOVER & LEADERBOARDS FILTERS ---
  setDiscoverFilter(key, value) {
    this.state.discoverFilters[key] = value;
    this.notify('DISCOVER_FILTERS_CHANGED', this.state.discoverFilters);
  }

  resetDiscoverFilters() {
    this.state.discoverFilters = {
      query: '',
      state: 'ALL',
      major: 'ALL',
      skill: 'ALL',
      gradYear: 'ALL'
    };
    this.notify('DISCOVER_FILTERS_CHANGED', this.state.discoverFilters);
  }

  setLeaderboardFilter(key, value) {
    this.state.leaderboardFilter[key] = value;
    this.notify('LEADERBOARD_FILTERS_CHANGED', this.state.leaderboardFilter);
  }

  // --- RECRUITER ACTIONS ---
  setRecruiterStage(studentId, newStage) {
    this.state.students = this.state.students.map(s => {
      if (s.id === studentId) {
        return { ...s, pipelineStatus: newStage };
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.STUDENTS, this.state.students);
    this.notify('RECRUITER_PIPELINE_UPDATED', { studentId, newStage });
  }

  updateRecruiterNotes(studentId, notes) {
    this.state.students = this.state.students.map(s => {
      if (s.id === studentId) {
        return { ...s, recruiterNotes: notes };
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.STUDENTS, this.state.students);
    this.notify('RECRUITER_NOTES_UPDATED', { studentId, notes });
  }

  setRecruiterStageFilter(stage) {
    this.state.recruiterStageFilter = stage;
    this.notify('RECRUITER_FILTER_CHANGED', stage);
  }

  toggleCompareCandidate(studentId) {
    const exists = this.state.compareList.includes(studentId);
    if (exists) {
      this.state.compareList = this.state.compareList.filter(id => id !== studentId);
    } else {
      if (this.state.compareList.length >= 3) {
        return { success: false, message: 'You can compare up to 3 candidates simultaneously.' };
      }
      this.state.compareList.push(studentId);
    }
    this.notify('COMPARE_LIST_CHANGED', this.state.compareList);
    return { success: true, count: this.state.compareList.length };
  }

  clearCompareList() {
    this.state.compareList = [];
    this.notify('COMPARE_LIST_CHANGED', this.state.compareList);
  }

  // --- INTERNSHIPS ---
  setInternshipFilter(key, value) {
    this.state.internshipFilters[key] = value;
    this.notify('INTERNSHIP_FILTERS_CHANGED', this.state.internshipFilters);
  }

  applyToInternship(internshipId, applicationData = {}) {
    this.state.internships = this.state.internships.map(item => {
      if (item.id === internshipId) {
        return {
          ...item,
          applied: true,
          appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          applicationStatus: 'Submitted',
          applicationNote: applicationData.note || 'ATS Resume Submitted'
        };
      }
      return item;
    });
    saveStorage(STORAGE_KEYS.INTERNSHIPS, this.state.internships);
    this.notify('INTERNSHIP_APPLIED', internshipId);
  }

  // --- PEER SQUADS ---
  setSquadFilter(key, value) {
    this.state.squadFilters[key] = value;
    this.notify('SQUAD_FILTERS_CHANGED', this.state.squadFilters);
  }

  joinSquad(squadId, userRole = "Full-Stack Contributor") {
    this.state.squads = this.state.squads.map(s => {
      if (s.id === squadId) {
        const isAlreadyMember = s.members.some(m => m.name === this.state.currentUser.name);
        if (!isAlreadyMember && s.membersCount < s.maxMembers) {
          const updatedMembers = [
            ...s.members,
            {
              name: this.state.currentUser.name,
              role: userRole,
              avatar: this.state.currentUser.avatar || "AC"
            }
          ];
          return {
            ...s,
            members: updatedMembers,
            membersCount: updatedMembers.length,
            isMember: true,
            status: updatedMembers.length >= s.maxMembers ? "Full" : s.status
          };
        }
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SQUADS, this.state.squads);
    this.notify('SQUADS_UPDATED', squadId);
  }

  createSquad(squadPayload) {
    const newSquad = {
      id: `squad-${Date.now()}`,
      name: squadPayload.name,
      goal: squadPayload.goal,
      focus: squadPayload.focus || "Hackathon / Project",
      leader: {
        name: this.state.currentUser.name,
        school: this.state.currentUser.school,
        avatar: this.state.currentUser.avatar || "AC"
      },
      membersCount: 1,
      maxMembers: parseInt(squadPayload.maxMembers, 10) || 4,
      members: [
        {
          name: this.state.currentUser.name,
          role: squadPayload.userRole || "Squad Lead",
          avatar: this.state.currentUser.avatar || "AC"
        }
      ],
      lookingFor: squadPayload.lookingFor ? squadPayload.lookingFor.split(',').map(s => s.trim()) : ["Contributors"],
      requiredSkills: squadPayload.requiredSkills ? squadPayload.requiredSkills.split(',').map(s => s.trim()) : ["TypeScript", "Python"],
      meetingCadence: squadPayload.meetingCadence || "Weekly (Virtual)",
      tags: squadPayload.tags ? squadPayload.tags.split(',').map(s => s.trim()) : ["Project"],
      isMember: true,
      status: "Recruiting"
    };

    this.state.squads = [newSquad, ...this.state.squads];
    saveStorage(STORAGE_KEYS.SQUADS, this.state.squads);
    this.notify('SQUAD_CREATED', newSquad);
    return newSquad;
  }

  // --- MESSAGES ---
  setActiveConversation(convId) {
    this.state.activeConversationId = convId;
    this.state.conversations = this.state.conversations.map(c => {
      if (c.id === convId) {
        return { ...c, unread: false };
      }
      return c;
    });
    saveStorage(STORAGE_KEYS.CONVERSATIONS, this.state.conversations);
    this.notify('CONVERSATION_SELECTED', convId);
  }

  sendMessage(convId, text) {
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "me",
      senderName: this.state.currentUser.name,
      text: text,
      timestamp: "Just now"
    };

    this.state.conversations = this.state.conversations.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastUpdated: "Just now"
        };
      }
      return c;
    });

    saveStorage(STORAGE_KEYS.CONVERSATIONS, this.state.conversations);
    this.notify('MESSAGE_SENT', { convId, message: newMessage });
  }

  startOrOpenConversation(targetUser) {
    let existing = this.state.conversations.find(c => c.participantId === targetUser.id);
    if (!existing) {
      existing = {
        id: `conv-user-${Date.now()}`,
        participantId: targetUser.id,
        participantName: targetUser.name,
        participantRole: targetUser.headline || `${targetUser.major} @ ${targetUser.school}`,
        participantAvatar: targetUser.avatar || targetUser.name.slice(0, 2).toUpperCase(),
        participantType: targetUser.participantType || "student",
        verifiedCompany: targetUser.school || "TeamMatch Peer",
        unread: false,
        lastUpdated: "Just now",
        messages: [
          {
            id: `msg-intro-${Date.now()}`,
            sender: "them",
            senderName: targetUser.name,
            text: `Hi ${this.state.currentUser.name}! Great connecting with you on TeamMatch. Let's collaborate!`,
            timestamp: "Just now"
          }
        ]
      };
      this.state.conversations = [existing, ...this.state.conversations];
      saveStorage(STORAGE_KEYS.CONVERSATIONS, this.state.conversations);
    }
    this.state.activeConversationId = existing.id;
    this.setActiveTab('messages');
    this.notify('CONVERSATION_OPENED', existing);
  }

  // --- ATS RESUME ---
  updateResume(updatedResume) {
    this.state.resume = updatedResume;
    saveStorage(STORAGE_KEYS.RESUME, this.state.resume);
    this.notify('RESUME_UPDATED', this.state.resume);
  }

  syncResumeFromProfile() {
    const user = this.state.currentUser;
    const syncedResume = {
      ...this.state.resume,
      header: {
        ...this.state.resume.header,
        fullName: user.name,
        headline: `${user.headline} | ${user.school}`,
        location: `${user.state}, India`,
        github: user.links?.github || this.state.resume.header.github,
        linkedin: user.links?.linkedin || this.state.resume.header.linkedin,
        portfolio: user.links?.portfolio || this.state.resume.header.portfolio
      },
      education: [
        {
          institution: user.school,
          degree: `Bachelor of Technology in ${user.major}${user.minor ? `, Minor in ${user.minor}` : ''}`,
          graduationDate: `Expected May ${user.gradYear}`,
          gpa: user.gpa ? `${user.gpa} (${user.gpaVerified ? 'Platform Verified' : 'Self-Reported'})` : 'Confidential',
          coursework: "Data Structures & Algorithms, Operating Systems, Computer Networks, Database Systems, Distributed Systems"
        }
      ],
      skills: {
        ...this.state.resume.skills,
        languages: user.skills.slice(0, 5).join(', '),
        frameworks: user.skills.slice(5).join(', ') || "React, PyTorch, Node.js, FastAPI"
      }
    };
    this.updateResume(syncedResume);
    return syncedResume;
  }
}

export const store = new Store();

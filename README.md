# TeamMatch 🚀

> **Student Talent Discovery, Peer Networking, Internships & ATS Recruiting Platform**

TeamMatch is a cohesive, modern web application designed for engineering and technology students to showcase verified skills, assemble complementary project teams, discover technology internships, and connect directly with recruiters.

---

## 🌟 Key Features

### 1. 🔍 Discover Profiles
- Multi-dimensional filtering by **State/Region**, **Major**, **Technical Skills** (Python, Distributed Systems, React, Rust, Go, CUDA), and **Graduation Year**.
- Real-time search across student names, universities, and technical credentials.
- Clear distinction between **Platform-Verified Signals** and **Self-Reported Achievements**.

### 2. 🏆 Regional & National Leaderboards
- Transparent composite ranking methodology (algorithmic coding practice, hackathon podiums, open-source projects, and academic foundations).
- State-level filtering (including Andhra Pradesh, Karnataka, Maharashtra, Delhi NCR, and All India).
- Privacy-first: Students with confidential GPAs are never penalized in composite rankings.

### 3. 💼 Technology Internships & Co-ops
- Curated technology internship listings for Summer 2025.
- One-click ATS resume application modal with personalized pitch notes.
- Honest partner labeling (Verified Employers vs. Curated Listings).

### 4. 👥 Peer Squads
- Form and join complementary student teams for collegiate hackathons (e.g., Smart India Hackathon), research labs, and open-source projects.
- Real-time roster tracking and open slot management.

### 5. 💬 In-App Networking & Messages
- Clean conversational interface for student-to-student and recruiter-to-student collaboration.
- Pre-composed quick reply action chips.

### 6. 📄 My ATS Resume Builder & Printable Preview
- Single-column, machine-readable format optimized for enterprise Applicant Tracking Systems (Workday, Greenhouse, Lever).
- Real-time ATS parseability audit score with actionable checklist.
- One-click profile synchronization and native browser print to ATS PDF.

### 7. 🎯 Recruiter Mode & Candidate Funnel
- Recruiter workflow toggle with live talent pipeline stages (*All Candidates*, *Shortlisted*, *Contacted*, *Interviewing*, *Offer Extended*).
- Interactive candidate comparison dock with a side-by-side evaluation matrix.

---

## 🛠️ Technology Stack

- **Frontend:** Vanilla HTML5, Modern CSS3 (CSS Variables, Flexbox/Grid, Dark/Light palettes), ES6+ JavaScript Modules.
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security & REST API).
- **Design System:** Custom tokenized design system (`Inter` and `JetBrains Mono` typography).

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Edge, Chrome, Firefox, Safari).
- Python 3.x (to serve static files locally).

### 1. Clone the Repository
```bash
git clone https://github.com/chekkapallisaisatyaprasanth-arch/TEAM-MATCH.git
cd TEAM-MATCH
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update with your Supabase credentials:
```env
SUPABASE_URL=https://mfuxqkrqikilxchtadql.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Launch Local Server
```bash
python -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

Run the automated test runner in headless Microsoft Edge:
```bash
python run_test_suite.py
```

---

## 📄 License
MIT License. Built for educational talent discovery and peer networking.

import json
import urllib.request
import re

supabase_url = "https://mfuxqkrqikilxchtadql.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mdXhxa3JxaWtpbHhjaHRhZHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODExOTYsImV4cCI6MjEwNjE1NzE5Nn0.A5HQwo3kJzKcqf3J3GAutvNL-JUCSfNIPJxYFVfK_Pc"

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def post_to_supabase(table, data):
    url = f"{supabase_url}/rest/v1/{table}"
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"Table '{table}': Status {resp.status}")
            return True
    except Exception as e:
        print(f"Table '{table}' ERROR: {e}")
        if hasattr(e, 'read'):
            print("Response:", e.read().decode('utf-8', errors='replace'))
        return False

# Parse js/data.js by running node or python regex or small node-like evaluation
# Since data.js is ES module, let's extract INITIAL_STUDENTS, INITIAL_INTERNSHIPS, INITIAL_SQUADS, INITIAL_CONVERSATIONS, INITIAL_ATS_RESUME
with open('js/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's extract JS objects using python
import ast

def extract_js_const(name):
    pattern = rf'export const {name} = (\[[\s\S]*?\]|\{{[\s\S]*?\}};)'
    match = re.search(pattern, content)
    if not match:
        return None
    raw = match.group(1).rstrip(';')
    # Replace single quotes and format to valid JSON
    # Or use python's json.loads with regex cleanup
    return raw

# Let's write a small script that uses Edge headless to serialize the data objects to JSON!
print("Using Edge headless to dump exact JSON from js/data.js...")
js_extractor_html = """<!DOCTYPE html>
<html>
<body>
  <pre id="out"></pre>
  <script type="module">
    import { INITIAL_STUDENTS, INITIAL_INTERNSHIPS, INITIAL_SQUADS, INITIAL_CONVERSATIONS, INITIAL_ATS_RESUME, INITIAL_CURRENT_USER } from './js/data.js';
    const payload = {
      students: [INITIAL_CURRENT_USER, ...INITIAL_STUDENTS],
      internships: INITIAL_INTERNSHIPS,
      squads: INITIAL_SQUADS,
      conversations: INITIAL_CONVERSATIONS,
      resume: INITIAL_ATS_RESUME
    };
    document.getElementById('out').textContent = JSON.stringify(payload);
  </script>
</body>
</html>"""

with open('dump_data.html', 'w', encoding='utf-8') as f:
    f.write(js_extractor_html)

import subprocess
cmd = [r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe", "--headless", "--dump-dom", "http://localhost:3000/dump_data.html"]
res = subprocess.run(cmd, capture_output=True, timeout=10)
dom = res.stdout.decode('utf-8', errors='replace')

if '<pre id="out">' in dom:
    raw_json = dom.split('<pre id="out">')[1].split('</pre>')[0]
    # unescape html entities if any
    raw_json = raw_json.replace('&quot;', '"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    payload = json.loads(raw_json)
    
    # 1. Students
    students_data = []
    for s in payload['students']:
        students_data.append({
            "id": s.get("id"),
            "name": s.get("name"),
            "headline": s.get("headline"),
            "school": s.get("school"),
            "major": s.get("major"),
            "minor": s.get("minor"),
            "state": s.get("state"),
            "region": s.get("region"),
            "grad_year": s.get("gradYear"),
            "gpa": s.get("gpa"),
            "gpa_verified": s.get("gpaVerified", False),
            "gpa_public": s.get("gpaPublic", True),
            "avatar": s.get("avatar"),
            "avatar_bg": s.get("avatarBg") or "#0284c7",
            "bio": s.get("bio"),
            "skills": s.get("skills", []),
            "links": s.get("links", {}),
            "stats": s.get("stats", {}),
            "availability": s.get("availability"),
            "pipeline_status": s.get("pipelineStatus", "All Candidates"),
            "recruiter_notes": s.get("recruiterNotes")
        })
    post_to_supabase("students", students_data)

    # 2. Internships
    internships_data = []
    for i in payload['internships']:
        internships_data.append({
            "id": i.get("id"),
            "company": i.get("company"),
            "role": i.get("role"),
            "location": i.get("location"),
            "work_type": i.get("workType"),
            "stipend": i.get("stipend"),
            "eligibility": i.get("eligibility"),
            "term": i.get("term"),
            "deadline": i.get("deadline"),
            "description": i.get("description"),
            "tags": i.get("tags", []),
            "verified_partner": i.get("verifiedPartner", True),
            "provenance": i.get("provenance"),
            "applied": i.get("applied", False),
            "application_status": i.get("applicationStatus"),
            "applied_date": i.get("appliedDate")
        })
    post_to_supabase("internships", internships_data)

    # 3. Squads
    squads_data = []
    for sq in payload['squads']:
        squads_data.append({
            "id": sq.get("id"),
            "name": sq.get("name"),
            "goal": sq.get("goal"),
            "focus": sq.get("focus"),
            "leader": sq.get("leader", {}),
            "members_count": sq.get("membersCount", 1),
            "max_members": sq.get("maxMembers", 4),
            "members": sq.get("members", []),
            "looking_for": sq.get("lookingFor", []),
            "required_skills": sq.get("requiredSkills", []),
            "meeting_cadence": sq.get("meetingCadence"),
            "tags": sq.get("tags", []),
            "status": sq.get("status", "Recruiting")
        })
    post_to_supabase("squads", squads_data)

    # 4. Conversations
    conversations_data = []
    for c in payload['conversations']:
        conversations_data.append({
            "id": c.get("id"),
            "participant_id": c.get("participantId"),
            "participant_name": c.get("participantName"),
            "participant_role": c.get("participantRole"),
            "participant_avatar": c.get("participantAvatar"),
            "participant_type": c.get("participantType", "student"),
            "unread": c.get("unread", False),
            "last_updated": c.get("lastUpdated"),
            "messages": c.get("messages", [])
        })
    post_to_supabase("conversations", conversations_data)

    # 5. Resume
    res = payload['resume']
    resume_data = [{
        "id": "resume-aarav-sharma",
        "user_id": "student-aarav-sharma",
        "header": res.get("header", {}),
        "education": res.get("education", []),
        "experience": res.get("experience", []),
        "projects": res.get("projects", []),
        "skills": res.get("skills", {}),
        "achievements": res.get("achievements", [])
    }]
    post_to_supabase("resumes", resume_data)

    print("\nALL DATA SUCCESSFULLY SEEDED INTO SUPABASE!")
else:
    print("Could not extract data from dump_data.html")

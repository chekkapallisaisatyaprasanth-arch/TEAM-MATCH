/**
 * TeamMatch Core Data Layer - India Edition
 * Comprehensive seed datasets for Indian technology students, state leaderboards,
 * technology internships, peer squads, and networking messages.
 * Note: Data represents simulated student benchmarks for fairness and privacy demonstration.
 */

export const INITIAL_CURRENT_USER = {
  id: "student-aarav-sharma",
  name: "Aarav Sharma",
  headline: "Final Year B.Tech CSE & Distributed Systems Specialist",
  school: "Indian Institute of Technology, Bombay (IIT Bombay)",
  major: "Computer Science & Engineering",
  minor: "Artificial Intelligence",
  state: "Maharashtra",
  region: "West India",
  gradYear: 2026,
  gpa: "9.42 / 10.00",
  gpaVerified: false, // self-reported
  gpaPublic: true,
  avatar: "AS",
  avatarColor: "from-sky-500 to-indigo-600",
  bio: "Passionate about building low-latency distributed systems, financial rails, and kernel networking. Seeking Summer 2025 Backend / Systems Engineering internships. ACM-ICPC Regionalist and Smart India Hackathon Winner.",
  skills: ["C++", "Go", "Rust", "Distributed Systems", "PyTorch", "Docker", "PostgreSQL", "Kafka", "Linux Kernel"],
  links: {
    github: "github.com/aaravsharma-dev",
    linkedin: "linkedin.com/in/aaravsharma-iitb",
    portfolio: "aaravsharma.in"
  },
  stats: {
    codingPracticeCount: 520,
    codingPercentile: 98,
    hackathonWins: 4,
    projectsCount: 8,
    squadCount: 2,
    compositeRankScore: 96.8,
    verifiedSignals: ["Smart India Hackathon 2024 Winner", "ACM-ICPC Amritapuri Regionalist", "AWS Certified Solutions Architect"],
    selfReportedSignals: ["CGPA 9.42 (Self-Reported)", "Inter-IIT Tech Meet Gold Medalist"]
  },
  availability: "Open to Summer 2025 Internships & Co-ops",
  preferredRoles: ["Backend Systems Engineer", "Cloud Infrastructure Intern", "Low-Latency FinTech"],
  preferredLocations: ["Bengaluru, KA", "Hyderabad, TS", "Mumbai, MH", "Remote (India)"]
};

export const INITIAL_STUDENTS = [
  {
    id: "student-1",
    name: "Ananya Iyer",
    headline: "Full-Stack Engineer & HCI Researcher",
    school: "Indian Institute of Technology, Madras (IIT Madras)",
    major: "Computer Science & Engineering",
    state: "Tamil Nadu",
    region: "South India",
    gradYear: 2025,
    gpa: "9.65 / 10.00",
    gpaVerified: true,
    gpaPublic: true,
    avatar: "AI",
    avatarBg: "#0284c7",
    bio: "Senior designing accessible developer tools and multi-agent workflow interfaces. Ex-intern at Google India. Passionate about frontend architecture, TypeScript, and design systems.",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "GraphQL", "Tailwind CSS", "Figma", "Web Performance"],
    links: { github: "github.com/ananyaiyer", linkedin: "linkedin.com/in/ananya-iyer-iitm", portfolio: "ananyaiyer.dev" },
    stats: {
      codingPracticeCount: 580,
      codingPercentile: 99,
      hackathonWins: 5,
      projectsCount: 10,
      squadCount: 3,
      compositeRankScore: 98.6,
      verifiedSignals: ["Google India STEP Intern (Summer 2024)", "Shaastra Tech Fest 1st Prize", "ACM Student Chapter Chair"],
      selfReportedSignals: ["CGPA 9.65 (Verified Transcript)", "10k+ NPM downloads on micro-frontend tool"]
    },
    availability: "Seeking Full-time New Grad 2025 (Bengaluru / Hyderabad)",
    pipelineStatus: "Shortlisted",
    recruiterNotes: "Top-tier frontend & product talent. Google India internship experience verified."
  },
  {
    id: "student-2",
    name: "Rohan Kulkarni",
    headline: "ML Infrastructure & CUDA Acceleration",
    school: "BITS Pilani",
    major: "Electrical & Electronics Engineering",
    state: "Rajasthan",
    region: "North India",
    gradYear: 2026,
    gpa: "9.20 / 10.00",
    gpaVerified: true,
    gpaPublic: true,
    avatar: "RK",
    avatarBg: "#6366f1",
    bio: "Junior specializing in CUDA kernel optimization, hardware-accelerated inferencing, and embedded robotics. APOGEE Robotics Lead.",
    skills: ["C++", "CUDA", "Python", "PyTorch", "TensorRT", "Linux Kernel", "ROS2", "Computer Vision"],
    links: { github: "github.com/rohankulkarni", linkedin: "linkedin.com/in/rohan-kulkarni-bits" },
    stats: {
      codingPracticeCount: 490,
      codingPercentile: 97,
      hackathonWins: 4,
      projectsCount: 7,
      squadCount: 2,
      compositeRankScore: 95.8,
      verifiedSignals: ["Inter-BITS Tech Champion", "NVIDIA CUDA Certified", "Robotics Society Lead"],
      selfReportedSignals: ["CGPA 9.20", "Published paper on TensorRT inference speedup"]
    },
    availability: "Seeking Summer 2025 AI/Systems Intern",
    pipelineStatus: "Interviewing",
    recruiterNotes: "Cleared Round 1 System Design and Data Structures with top score."
  },
  {
    id: "student-3",
    name: "Pooja Deshmukh",
    headline: "Indic NLP Specialist & Generative AI Applications",
    school: "IIIT Hyderabad",
    major: "Computer Science & Artificial Intelligence",
    state: "Telangana",
    region: "South India",
    gradYear: 2026,
    gpa: "9.55 / 10.00",
    gpaVerified: true,
    gpaPublic: true,
    avatar: "PD",
    avatarBg: "#d97706",
    bio: "Junior at IIIT Hyderabad researching multilingual Indic language models, tokenization efficiency, and retrieval-augmented generation (RAG) for public sector services.",
    skills: ["Python", "PyTorch", "Hugging Face", "LangChain", "Vector DBs (Qdrant)", "FastAPI", "React", "Docker"],
    links: { github: "github.com/poojadeshmukh", linkedin: "linkedin.com/in/pooja-deshmukh-iiith" },
    stats: {
      codingPracticeCount: 510,
      codingPercentile: 98,
      hackathonWins: 5,
      projectsCount: 8,
      squadCount: 3,
      compositeRankScore: 97.4,
      verifiedSignals: ["IIIT-H Dean's Research Scholar", "EMNLP Workshop Student Co-author", "Smart India Hackathon Finalist"],
      selfReportedSignals: ["CGPA 9.55", "Author of open-source Hindi/Telugu semantic search engine"]
    },
    availability: "Seeking Summer 2025 GenAI Research Intern",
    pipelineStatus: "Shortlisted",
    recruiterNotes: "Remarkable Indic LLM expertise. Excellent fit for Hyderabad AI lab."
  },
  {
    id: "student-4",
    name: "Karthik Nair",
    headline: "Cloud Architect & DevSecOps Platform Engineer",
    school: "National Institute of Technology, Tiruchirappalli (NIT Trichy)",
    major: "Computer Science & Engineering",
    state: "Tamil Nadu",
    region: "South India",
    gradYear: 2025,
    gpa: "8.92 / 10.00",
    gpaVerified: false,
    gpaPublic: true,
    avatar: "KN",
    avatarBg: "#059669",
    bio: "Senior passionate about Kubernetes orchestration, Terraform automation, and high-resilience multi-cloud governance. Pragyan Tech Lead.",
    skills: ["Go", "Terraform", "Kubernetes", "AWS", "Docker", "Python", "Prometheus", "CI/CD"],
    links: { github: "github.com/karthiknair-cloud", linkedin: "linkedin.com/in/karthik-nair-nitt" },
    stats: {
      codingPracticeCount: 420,
      codingPercentile: 92,
      hackathonWins: 3,
      projectsCount: 11,
      squadCount: 2,
      compositeRankScore: 92.5,
      verifiedSignals: ["AWS Certified Solutions Architect", "CNCF Kubernetes Contributor", "Pragyan Hackathon Winner"],
      selfReportedSignals: ["CGPA 8.92", "Self-hosted high-availability k3s homelab"]
    },
    availability: "Seeking Full-time Cloud/DevOps Engineer 2025",
    pipelineStatus: "Shortlisted",
    recruiterNotes: "AWS Certified Architect verified. Strong hands-on Kubernetes."
  },
  {
    id: "student-5",
    name: "Tanmay Joshi",
    headline: "Mobile Product Engineer & Fintech Specialist",
    school: "Delhi Technological University (DTU Delhi)",
    major: "Software Engineering",
    state: "Delhi NCR",
    region: "North India",
    gradYear: 2027,
    gpa: "8.85 / 10.00",
    gpaVerified: true,
    gpaPublic: true,
    avatar: "TJ",
    avatarBg: "#ea580c",
    bio: "Sophomore with 2 live Android & iOS apps in production (>50,000 downloads). Built real-time offline-first UPI reconciliation tracker.",
    skills: ["Kotlin", "React Native", "TypeScript", "Swift", "SQLite", "Firebase", "Node.js", "Redux"],
    links: { github: "github.com/tanmayjoshi", linkedin: "linkedin.com/in/tanmay-joshi-dtu", portfolio: "tanmay.app" },
    stats: {
      codingPracticeCount: 440,
      codingPercentile: 94,
      hackathonWins: 3,
      projectsCount: 6,
      squadCount: 3,
      compositeRankScore: 93.6,
      verifiedSignals: ["Google Play Student Showcase Finalist", "HackDTU 1st Place Mobile"],
      selfReportedSignals: ["CGPA 8.85", "50k+ active users on budgeting mobile app"]
    },
    availability: "Seeking Summer 2025 Mobile / Full-Stack Co-op",
    pipelineStatus: "Contacted",
    recruiterNotes: "Reached out for CRED and Swiggy mobile client teams."
  },
  {
    id: "student-6",
    name: "Siddharth Verma",
    headline: "Distributed Databases & Storage Engine Internals",
    school: "Indian Institute of Science, Bangalore (IISc Bangalore)",
    major: "Computer Science (Research)",
    state: "Karnataka",
    region: "South India",
    gradYear: 2025,
    gpa: "9.75 / 10.00",
    gpaVerified: true,
    gpaPublic: true,
    avatar: "SV",
    avatarBg: "#7c3aed",
    bio: "Masters student researching Raft/Paxos consensus correctness and LSM-tree write amplification. Developed a toy distributed KV store in Go from scratch.",
    skills: ["Go", "Rust", "C++", "Distributed Systems", "RocksDB", "Raft", "gRPC", "Protobuf"],
    links: { github: "github.com/siddharthverma-sys", linkedin: "linkedin.com/in/siddharth-verma-iisc" },
    stats: {
      codingPracticeCount: 610,
      codingPercentile: 99,
      hackathonWins: 4,
      projectsCount: 9,
      squadCount: 2,
      compositeRankScore: 99.1,
      verifiedSignals: ["IISc Research Excellence Award", "Apache Open Source Committer", "ACM SIGMOD Student Fellow"],
      selfReportedSignals: ["CGPA 9.75 (Institute Gold Medalist)", "Published peer-reviewed benchmarks on Raft replication"]
    },
    availability: "Seeking Full-time Systems / Infrastructure 2025 (Bengaluru)",
    pipelineStatus: "Offer",
    recruiterNotes: "Superlative systems intellect. Offer extended for Distributed Core Platform."
  },
  {
    id: "student-7",
    name: "Devika Sen",
    headline: "Quantitative Finance & Causal Econometrics",
    school: "Indian Institute of Technology, Kharagpur (IIT Kharagpur)",
    major: "Data Science & Mathematics",
    state: "West Bengal",
    region: "East India",
    gradYear: 2026,
    gpa: "9.38 / 10.00",
    gpaVerified: false,
    gpaPublic: true,
    avatar: "DS",
    avatarBg: "#0891b2",
    bio: "Junior building causal inference pipelines and order book liquidity simulations. Active lead in IIT Kharagpur's High-Frequency Quant Club.",
    skills: ["Python", "C++", "SQL", "Pandas", "NumPy", "Time Series", "Snowflake", "Scikit-Learn"],
    links: { github: "github.com/devikasen-quant", linkedin: "linkedin.com/in/devika-sen-iitkgp" },
    stats: {
      codingPracticeCount: 460,
      codingPercentile: 95,
      hackathonWins: 3,
      projectsCount: 8,
      squadCount: 2,
      compositeRankScore: 94.7,
      verifiedSignals: ["Kshitij Tech Fest Best Quant Model", "WorldQuant Challenge Gold Badge"],
      selfReportedSignals: ["CGPA 9.38", "Order matching engine simulator in modern C++"]
    },
    availability: "Open to Summer 2025 Quantitative / Data Internships",
    pipelineStatus: "All Candidates",
    recruiterNotes: ""
  },
  {
    id: "student-8",
    name: "Meera Nambiar",
    headline: "Cybersecurity Analyst & Systems Penetration Tester",
    school: "National Institute of Technology, Calicut (NIT Calicut)",
    major: "Computer Science & Cyber Security",
    state: "Kerala",
    region: "South India",
    gradYear: 2025,
    gpa: "9.10 / 10.00",
    gpaVerified: false,
    gpaPublic: false, // private GPA
    avatar: "MN",
    avatarBg: "#475569",
    bio: "Specializing in binary exploitation, reverse engineering, and threat intelligence. Captain of collegiate Capture-The-Flag (CTF) squad.",
    skills: ["C", "Python", "Assembly (x86/ARM)", "Ghidra", "Wireshark", "Burp Suite", "Linux", "Cryptography"],
    links: { github: "github.com/meeranambiar-sec", linkedin: "linkedin.com/in/meera-nambiar-nitc" },
    stats: {
      codingPracticeCount: 410,
      codingPercentile: 91,
      hackathonWins: 5,
      projectsCount: 6,
      squadCount: 2,
      compositeRankScore: 92.0,
      verifiedSignals: ["InCTF National Collegiate Top 10", "DEFCON Open Quals Ranked", "CompTIA Security+"],
      selfReportedSignals: ["GPA Confidential by User Request", "Published CVE bug bounty write-ups"]
    },
    availability: "Seeking Full-time Security Engineer 2025",
    pipelineStatus: "All Candidates",
    recruiterNotes: ""
  },
  {
    id: "student-9",
    name: "Aditya Patel",
    headline: "Robotics Perception & Autonomous Navigation",
    school: "Indian Institute of Technology, Roorkee (IIT Roorkee)",
    major: "Electrical & Computer Engineering",
    state: "Gujarat",
    region: "West India",
    gradYear: 2026,
    gpa: "9.05 / 10.00",
    gpaVerified: true,
    gpaPublic: true,
    avatar: "AP",
    avatarBg: "#16a34a",
    bio: "Junior developing LiDAR SLAM pipelines and visual odometry for autonomous indoor robots. Lead engineer at IIT Roorkee Robotics Section.",
    skills: ["C++", "Python", "ROS2", "OpenCV", "Point Cloud (PCL)", "Linux", "Microcontrollers", "Git"],
    links: { github: "github.com/adityapatel-robotics", linkedin: "linkedin.com/in/aditya-patel-iitr" },
    stats: {
      codingPracticeCount: 430,
      codingPercentile: 93,
      hackathonWins: 3,
      projectsCount: 7,
      squadCount: 2,
      compositeRankScore: 93.1,
      verifiedSignals: ["Inter-IIT Tech Meet Robotics Silver", "DRDO Student Innovation Fellow"],
      selfReportedSignals: ["CGPA 9.05", "Custom quadruped robot gait controller project"]
    },
    availability: "Seeking Summer 2025 Robotics / Embedded Intern",
    pipelineStatus: "All Candidates",
    recruiterNotes: ""
  },
  {
    id: "student-10",
    name: "Divya Chauhan",
    headline: "Distributed Microservices & Cloud-Native Platforms",
    school: "Motilal Nehru National Institute of Technology (MNNIT Allahabad)",
    major: "Information Technology",
    state: "Uttar Pradesh",
    region: "North India",
    gradYear: 2025,
    gpa: "9.15 / 10.00",
    gpaVerified: true,
    gpaPublic: true,
    avatar: "DC",
    avatarBg: "#be185d",
    bio: "Senior experienced in event-driven microservices architecture using Java Spring Boot, Apache Kafka, and Redis caching. Avishkar Tech Coordinator.",
    skills: ["Java", "Spring Boot", "Apache Kafka", "Redis", "Docker", "PostgreSQL", "Microservices", "REST APIs"],
    links: { github: "github.com/divyachauhan-dev", linkedin: "linkedin.com/in/divya-chauhan-mnnit" },
    stats: {
      codingPracticeCount: 475,
      codingPercentile: 96,
      hackathonWins: 3,
      projectsCount: 8,
      squadCount: 2,
      compositeRankScore: 94.9,
      verifiedSignals: ["Smart India Hackathon 2024 Winner", "Oracle Certified Java Professional", "Avishkar Best Software Project"],
      selfReportedSignals: ["CGPA 9.15 (Official Transcript)", "High-throughput mock UPI processing gateway"]
    },
    availability: "Seeking Full-time Backend / Microservices 2025",
    pipelineStatus: "Shortlisted",
    recruiterNotes: "Rock-solid Java and Kafka core foundations. High problem-solving speed."
  },
  {
    id: "student-11",
    name: "Vikramaditya Roy",
    headline: "Frontend Architect & WebAssembly Performance",
    school: "Jadavpur University",
    major: "Computer Science & Engineering",
    state: "West Bengal",
    region: "East India",
    gradYear: 2026,
    gpa: "8.95 / 10.00",
    gpaVerified: false,
    gpaPublic: true,
    avatar: "VR",
    avatarBg: "#0284c7",
    bio: "Passionate about browser rendering pipelines, WebAssembly compilation, and micro-frontend performance optimizations. Srijan Open Source Fellow.",
    skills: ["JavaScript", "TypeScript", "React", "WebAssembly", "Rust", "Vite", "Node.js", "Tailwind CSS"],
    links: { github: "github.com/vikramadityaroy", linkedin: "linkedin.com/in/vikramaditya-roy-ju" },
    stats: {
      codingPracticeCount: 380,
      codingPercentile: 88,
      hackathonWins: 2,
      projectsCount: 7,
      squadCount: 1,
      compositeRankScore: 89.2,
      verifiedSignals: ["Srijan Hackathon Grand Winner", "Mozilla MDN Contributor"],
      selfReportedSignals: ["CGPA 8.95", "Authored benchmark study on Wasm DOM reconciliation"]
    },
    availability: "Seeking Summer 2025 Frontend / Web Intern",
    pipelineStatus: "All Candidates",
    recruiterNotes: ""
  },
  {
    id: "student-12",
    name: "Sneha Reddy",
    headline: "Bioinformatics & Genomic Computing Specialist",
    school: "IIT Hyderabad",
    major: "Biomedical Engineering & CS",
    state: "Telangana",
    region: "South India",
    gradYear: 2027,
    gpa: "9.25 / 10.00",
    gpaVerified: true,
    gpaPublic: true,
    avatar: "SR2",
    avatarBg: "#db2777",
    bio: "Sophomore building genomic sequence alignment models and molecular property predictors using graph neural networks. Indian Academy of Sciences Summer Fellow.",
    skills: ["Python", "PyTorch", "BioPython", "R", "C++", "Nextflow", "Docker", "Git"],
    links: { github: "github.com/snehareddy-bio", linkedin: "linkedin.com/in/sneha-reddy-iith" },
    stats: {
      codingPracticeCount: 420,
      codingPercentile: 92,
      hackathonWins: 2,
      projectsCount: 5,
      squadCount: 2,
      compositeRankScore: 91.8,
      verifiedSignals: ["IASc-INSA-NASI Summer Research Fellow", "BioHack India 2nd Place"],
      selfReportedSignals: ["CGPA 9.25", "Co-author on preprint: GNN for drug-target binding"]
    },
    availability: "Seeking Summer 2025 Biotech / AI Intern",
    pipelineStatus: "All Candidates",
    recruiterNotes: ""
  },
  {
    id: "student-13",
    name: "Sai Teja Reddy",
    headline: "Backend Cloud Systems & High-Speed Microservices",
    school: "Koneru Lakshmaiah Education Foundation (KL University, Vijayawada)",
    major: "Computer Science & Engineering",
    state: "Andhra Pradesh (Vijayawada)",
    region: "South India",
    gradYear: 2026,
    gpa: "9.35 / 10.00",
    gpaVerified: true,
    gpaPublic: true,
    avatar: "ST",
    avatarBg: "#0ea5e9",
    bio: "Junior building event-driven microservices with Go and Apache Kafka. 1st Place at Andhra Pradesh State Innovation Hackathon and AWS Cloud Practitioner certified.",
    skills: ["Go", "Kafka", "Docker", "PostgreSQL", "Kubernetes", "AWS", "Python", "gRPC"],
    links: { github: "github.com/saiteja-reddy", linkedin: "linkedin.com/in/saiteja-reddy-klu" },
    stats: {
      codingPracticeCount: 465,
      codingPercentile: 95,
      hackathonWins: 3,
      projectsCount: 8,
      squadCount: 2,
      compositeRankScore: 94.6,
      verifiedSignals: ["AP State Innovation Hackathon 1st Place", "AWS Certified Cloud Practitioner", "KLU Coding Club Lead"],
      selfReportedSignals: ["CGPA 9.35 (Official Transcript)", "High-throughput mock ticket booking engine"]
    },
    availability: "Open to Summer 2025 Backend / Cloud Internships",
    pipelineStatus: "Shortlisted",
    recruiterNotes: "Strong candidate from Vijayawada. Great Go and distributed queue skills."
  },
  {
    id: "student-14",
    name: "Kavya Maddukuri",
    headline: "Computer Vision & Medical Imaging Researcher",
    school: "SRM University AP, Amaravati (Vijayawada Region)",
    major: "Artificial Intelligence & Data Science",
    state: "Andhra Pradesh (Vijayawada)",
    region: "South India",
    gradYear: 2025,
    gpa: "9.52 / 10.00",
    gpaVerified: true,
    gpaPublic: true,
    avatar: "KM",
    avatarBg: "#8b5cf6",
    bio: "Senior developing lightweight CNNs and vision transformers for healthcare diagnostic screening. Inter-university AI symposium best presenter.",
    skills: ["Python", "PyTorch", "OpenCV", "TensorFlow", "FastAPI", "React", "Docker"],
    links: { github: "github.com/kavyamaddukuri", linkedin: "linkedin.com/in/kavya-maddukuri-srmap" },
    stats: {
      codingPracticeCount: 495,
      codingPercentile: 97,
      hackathonWins: 4,
      projectsCount: 7,
      squadCount: 2,
      compositeRankScore: 96.1,
      verifiedSignals: ["SRM AP Academic Excellence Award", "Inter-University AI Symposium Best Paper", "Smart India Hackathon Finalist"],
      selfReportedSignals: ["CGPA 9.52", "Retinal fundus image classification package on GitHub"]
    },
    availability: "Seeking Full-time AI / ML Engineer 2025",
    pipelineStatus: "Interviewing",
    recruiterNotes: "Excellent vision transformer domain knowledge."
  }
];

export const INITIAL_INTERNSHIPS = [
  {
    id: "intern-1",
    company: "Google India",
    role: "Software Engineering Intern - Cloud & Core Infrastructure",
    location: "Bengaluru, Karnataka / Hyderabad, Telangana",
    workType: "Hybrid",
    term: "Summer 2025 (10-12 Weeks)",
    deadline: "Nov 15, 2024",
    stipend: "₹1,15,000 / month + Housing Stipend",
    eligibility: "B.Tech / Dual Degree students graduating in 2026 or 2027",
    tags: ["Distributed Systems", "C++", "Go", "Java", "Cloud Platforms"],
    description: "Work on Google's globally scaled backend infrastructure, Kubernetes clusters, and cloud platform services powering billions of users.",
    requirements: ["Strong grasp of algorithms, data structures, and concurrency", "Proficiency in C++, Java, or Go", "Ability to write clean, maintainable, and well-tested code"],
    provenance: "Curated Educational Partner (Simulated Listing for TeamMatch Demo)",
    verifiedPartner: true,
    applied: false
  },
  {
    id: "intern-2",
    company: "Microsoft India (IDC)",
    role: "Software Engineering Intern - Azure Distributed Systems & AI",
    location: "Hyderabad, Telangana / Bengaluru, Karnataka",
    workType: "Hybrid",
    term: "Summer 2025 (8-10 Weeks)",
    deadline: "Dec 1, 2024",
    stipend: "₹1,25,000 / month + Travel & Accommodation",
    eligibility: "Enrolled in B.Tech / M.Tech in CS/ECE with graduation in 2026",
    tags: ["C#", "C++", "Azure", "Distributed Systems", "Machine Learning"],
    description: "Join the Microsoft India Development Center (IDC) engineering team designing next-generation hyperscale cloud infrastructure and copilot AI runtime services.",
    requirements: ["Deep understanding of operating systems, networking, and memory management", "Excellent analytical and collaborative skills", "Prior project or competitive programming experience"],
    provenance: "Curated Educational Partner (Simulated Listing for TeamMatch Demo)",
    verifiedPartner: true,
    applied: true,
    appliedDate: "Sep 20, 2024",
    applicationStatus: "Interviewing"
  },
  {
    id: "intern-3",
    company: "Razorpay",
    role: "Software Engineer Intern - Core Payments Engine & UPI",
    location: "Bengaluru, Karnataka",
    workType: "Hybrid",
    term: "Summer 2025 (12 Weeks)",
    deadline: "Oct 31, 2024",
    stipend: "₹95,000 / month + Health Insurance",
    eligibility: "3rd or final year engineering students (Class of 2025 or 2026)",
    tags: ["Go", "PHP", "Kafka", "MySQL", "Distributed Systems", "Fintech"],
    description: "Power India's financial backbone. Architect fault-tolerant transaction processing pipelines handling tens of thousands of UPI queries per second.",
    requirements: ["Solid understanding of relational database ACID properties and message queues", "Proficiency in Go, Java, or Python", "Passion for fintech and system reliability"],
    provenance: "Curated Educational Partner (Simulated Listing for TeamMatch Demo)",
    verifiedPartner: true,
    applied: false
  },
  {
    id: "intern-4",
    company: "Swiggy",
    role: "Backend Software Engineering Intern - Logistics & Dispatch",
    location: "Bengaluru, Karnataka",
    workType: "Hybrid",
    term: "Summer 2025 (12 Weeks)",
    deadline: "Nov 30, 2024",
    stipend: "₹85,000 / month + Swiggy One Benefits",
    eligibility: "Pre-final year B.Tech / M.Tech students (Class of 2026)",
    tags: ["Java", "Go", "Redis", "Kafka", "Microservices", "High Throughput"],
    description: "Optimize delivery batching algorithms, real-time driver allocation, and high-frequency location streaming at scale.",
    requirements: ["Strong hands-on experience with Java/Go microservices", "Familiarity with distributed caching and message brokers", "Good algorithmic problem solving"],
    provenance: "Curated Educational Partner (Simulated Listing for TeamMatch Demo)",
    verifiedPartner: true,
    applied: false
  },
  {
    id: "intern-5",
    company: "CRED",
    role: "Frontend & Product Craft Engineering Co-op",
    location: "Bengaluru, Karnataka",
    workType: "Onsite",
    term: "Summer 2025 (12 Weeks)",
    deadline: "Dec 15, 2024",
    stipend: "₹90,000 / month + Catered Gourmet Meals",
    eligibility: "Students graduating in 2026 or 2027",
    tags: ["React", "TypeScript", "Mobile UI", "Animations", "Design Systems"],
    description: "Build immersive, fluid user interfaces with rich animations, pixel-perfection, and buttery 60fps mobile web interactions.",
    requirements: ["Exceptional eye for design craft, typography, and micro-interactions", "Proficiency in modern TypeScript, CSS3 animations, and React", "Strong project portfolio"],
    provenance: "Curated Educational Partner (Simulated Listing for TeamMatch Demo)",
    verifiedPartner: false,
    applied: false
  },
  {
    id: "intern-6",
    company: "Atlassian India",
    role: "Cloud Platform & Developer Productivity Intern",
    location: "Bengaluru, Karnataka / Remote (India)",
    workType: "Remote",
    term: "Summer 2025 (12 Weeks)",
    deadline: "Nov 20, 2024",
    stipend: "₹1,00,000 / month + Home Office Setup",
    eligibility: "B.Tech/Dual Degree students graduating 2026",
    tags: ["Java", "Kotlin", "AWS", "GraphQL", "DevTools"],
    description: "Build team collaboration services used by tens of millions across Jira, Confluence, and Bitbucket with global reliability standards.",
    requirements: ["Proficiency in Java or Kotlin with object-oriented principles", "Interest in developer tooling and cloud platforms", "Clear written and verbal communication"],
    provenance: "Curated Educational Partner (Simulated Listing for TeamMatch Demo)",
    verifiedPartner: true,
    applied: false
  },
  {
    id: "intern-7",
    company: "Zomato",
    role: "Systems & Real-Time Logistics Engineering Intern",
    location: "Gurugram, Delhi NCR",
    workType: "Hybrid",
    term: "Summer 2025 (12 Weeks)",
    deadline: "Dec 20, 2024",
    stipend: "₹85,000 / month + Travel Allowance",
    eligibility: "Engineering students graduating in 2026 or 2027",
    tags: ["Go", "Python", "Redis", "Kafka", "Elasticsearch"],
    description: "Build hyper-local search, ordering microservices, and live order tracking systems processing millions of daily transactions.",
    requirements: ["Strong fundamentals in data structures, algorithms, and networks", "Comfortable with rapid startup iteration", "Demonstrated project portfolio"],
    provenance: "Curated Educational Partner (Simulated Listing for TeamMatch Demo)",
    verifiedPartner: false,
    applied: false
  },
  {
    id: "intern-8",
    company: "Flipkart",
    role: "Machine Learning & Recommendation Systems Intern",
    location: "Bengaluru, Karnataka",
    workType: "Onsite",
    term: "Summer 2025 (12 Weeks)",
    deadline: "Nov 10, 2024",
    stipend: "₹80,000 / month + Relocation Support",
    eligibility: "Pre-final year undergraduate or post-graduate students",
    tags: ["Python", "PyTorch", "Spark", "Transformers", "RecSys"],
    description: "Develop cutting-edge recommendation algorithms, search rankers, and customer personalization models for India's premier e-commerce platform.",
    requirements: ["Deep learning and classical machine learning expertise", "Experience with PyTorch, Scikit-learn, and SQL", "Strong analytical problem solving"],
    provenance: "Curated Educational Partner (Simulated Listing for TeamMatch Demo)",
    verifiedPartner: true,
    applied: false
  }
];

export const INITIAL_SQUADS = [
  {
    id: "squad-1",
    name: "Smart India Hackathon (SIH 2025) Healthcare AI Squad",
    goal: "Building an edge-device ultrasound inference helper for primary health centers in rural India",
    focus: "Healthcare & AI Hackathon",
    leader: {
      name: "Aarav Sharma",
      school: "IIT Bombay",
      avatar: "AS"
    },
    membersCount: 3,
    maxMembers: 4,
    members: [
      { name: "Aarav Sharma", role: "Backend & Systems (C++)", avatar: "AS" },
      { name: "Pooja Deshmukh", role: "Multilingual ML Lead", avatar: "PD" },
      { name: "Rohan Kulkarni", role: "CUDA Edge Acceleration", avatar: "RK" }
    ],
    lookingFor: ["Mobile App Developer (React Native / Flutter)"],
    requiredSkills: ["React Native", "Flutter", "TypeScript", "Offline-First SQLite"],
    meetingCadence: "Tuesdays & Thursdays, 8 PM IST (Virtual)",
    tags: ["Healthcare", "SIH 2025", "Edge AI", "Mobile"],
    isMember: true,
    status: "Active"
  },
  {
    id: "squad-2",
    name: "Open Financial Network & UPI Switch Build Club",
    goal: "Implementing and stress-testing an ultra-fast simulated UPI switch with instant settlement reconciliations",
    focus: "FinTech & Distributed Systems",
    leader: {
      name: "Divya Chauhan",
      school: "MNNIT Allahabad",
      avatar: "DC"
    },
    membersCount: 2,
    maxMembers: 4,
    members: [
      { name: "Divya Chauhan", role: "Kafka & Event Stream Lead", avatar: "DC" },
      { name: "Karthik Nair", role: "Cloud & Reliability Lead", avatar: "KN" }
    ],
    lookingFor: ["Go / Rust Core Developer", "Database Reliability Specialist"],
    requiredSkills: ["Go", "Kafka", "PostgreSQL", "Redis"],
    meetingCadence: "Sundays, 4 PM IST (Discord)",
    tags: ["Fintech", "UPI", "Go", "Kafka", "Open Source"],
    isMember: false,
    status: "Recruiting"
  },
  {
    id: "squad-3",
    name: "IndicLLM Multilingual Speech & Translation Collective",
    goal: "Fine-tuning open lightweight language models for real-time translation across 10 Indian languages",
    focus: "Open Source AI & Indic Languages",
    leader: {
      name: "Pooja Deshmukh",
      school: "IIIT Hyderabad",
      avatar: "PD"
    },
    membersCount: 3,
    maxMembers: 5,
    members: [
      { name: "Pooja Deshmukh", role: "NLP Architecture", avatar: "PD" },
      { name: "Ananya Iyer", role: "Frontend Showcase & Accessibility", avatar: "AI" },
      { name: "Sneha Reddy", role: "Dataset Curation & Evaluation", avatar: "SR2" }
    ],
    lookingFor: ["FastAPI Backend Engineer", "Voice / ASR Model Evaluator"],
    requiredSkills: ["Python", "FastAPI", "Hugging Face", "PyTorch"],
    meetingCadence: "Wednesdays & Saturdays, 7 PM IST",
    tags: ["Indic AI", "PyTorch", "HuggingFace", "Open Source"],
    isMember: false,
    status: "Recruiting"
  },
  {
    id: "squad-4",
    name: "Autonomous AgriTech Drone Swarm",
    goal: "Collaborative drone-based crop disease and moisture sensing for Indian smallholder farms",
    focus: "Robotics & Computer Vision",
    leader: {
      name: "Aditya Patel",
      school: "IIT Roorkee",
      avatar: "AP"
    },
    membersCount: 2,
    maxMembers: 4,
    members: [
      { name: "Aditya Patel", role: "Perception & SLAM", avatar: "AP" },
      { name: "Rohan Kulkarni", role: "Embedded Compute", avatar: "RK" }
    ],
    lookingFor: ["Computer Vision Specialist (YOLO/PyTorch)", "Path Planning Lead"],
    requiredSkills: ["ROS2", "C++", "Python", "OpenCV"],
    meetingCadence: "Saturdays, 11 AM IST",
    tags: ["Robotics", "AgriTech", "C++", "Computer Vision"],
    isMember: false,
    status: "Recruiting"
  },
  {
    id: "squad-5",
    name: "Distributed Consensus & Raft Storage Engine",
    goal: "Authoring a zero-dependency, Jepsen-tested distributed key-value storage engine in Rust",
    focus: "Systems & Infrastructure",
    leader: {
      name: "Siddharth Verma",
      school: "IISc Bangalore",
      avatar: "SV"
    },
    membersCount: 3,
    maxMembers: 4,
    members: [
      { name: "Siddharth Verma", role: "Raft Consensus Lead", avatar: "SV" },
      { name: "Aarav Sharma", role: "Storage Engine & LSM Tree", avatar: "AS" },
      { name: "Vikramaditya Roy", role: "Benchmarking & Telemetry", avatar: "VR" }
    ],
    lookingFor: ["Systems Profiler / Chaos Testing Lead"],
    requiredSkills: ["Rust", "Go", "Distributed Systems", "Linux"],
    meetingCadence: "Mondays & Fridays, 9 PM IST",
    tags: ["Systems", "Rust", "Distributed Systems", "Open Source"],
    isMember: true,
    status: "Active"
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: "conv-1",
    participantId: "recruiter-priya-razorpay",
    participantName: "Priya Sundaram",
    participantRole: "Lead University Talent Partner @ Razorpay Bengaluru",
    participantAvatar: "PS",
    participantType: "recruiter",
    verifiedCompany: "Razorpay",
    unread: true,
    lastUpdated: "10 mins ago",
    messages: [
      {
        id: "msg-101",
        sender: "them",
        senderName: "Priya Sundaram",
        text: "Hi Aarav! I came across your distributed systems projects, your Smart India Hackathon award, and your high coding practice score on TeamMatch. Our Core Payments team at Razorpay Bengaluru is actively reviewing candidates for Summer 2025.",
        timestamp: "Yesterday, 3:42 PM IST"
      },
      {
        id: "msg-102",
        sender: "me",
        senderName: "Aarav Sharma",
        text: "Hi Priya, thank you for reaching out! Razorpay has been at the frontier of payments architecture in India—I would love to learn more about the challenges your team is tackling.",
        timestamp: "Yesterday, 4:15 PM IST"
      },
      {
        id: "msg-103",
        sender: "them",
        senderName: "Priya Sundaram",
        text: "That is great to hear! Could you share your updated ATS resume directly via TeamMatch? I will fast-track your profile to our Engineering Hiring Manager.",
        timestamp: "Today, 10:14 AM IST"
      }
    ]
  },
  {
    id: "conv-2",
    participantId: "student-1",
    participantName: "Ananya Iyer",
    participantRole: "Full-Stack Engineer @ IIT Madras",
    participantAvatar: "AI",
    participantType: "student",
    verifiedCompany: "Ex-Google India Intern",
    unread: false,
    lastUpdated: "2 hours ago",
    messages: [
      {
        id: "msg-201",
        sender: "them",
        senderName: "Ananya Iyer",
        text: "Hey Aarav! Saw your squad post for the SIH 2025 Healthcare AI team. Do you need any frontend work for charting or offline-first sync?",
        timestamp: "Sep 26, 2:10 PM IST"
      },
      {
        id: "msg-202",
        sender: "me",
        senderName: "Aarav Sharma",
        text: "Hey Ananya! Absolutely, we have a fast C++ inferencing core emitting JSON diffs, but we need someone with your UI polish and web performance expertise to build the clinician dashboard.",
        timestamp: "Sep 26, 2:45 PM IST"
      },
      {
        id: "msg-203",
        sender: "them",
        senderName: "Ananya Iyer",
        text: "Awesome, count me in! Let me review the repo specs tonight.",
        timestamp: "Today, 8:30 AM IST"
      }
    ]
  },
  {
    id: "conv-3",
    participantId: "student-3",
    participantName: "Pooja Deshmukh",
    participantRole: "Indic NLP Lead @ IIIT Hyderabad",
    participantAvatar: "PD",
    participantType: "student",
    verifiedCompany: "IIIT Hyderabad",
    unread: false,
    lastUpdated: "1 day ago",
    messages: [
      {
        id: "msg-301",
        sender: "me",
        senderName: "Aarav Sharma",
        text: "Hi Pooja, I just pushed the Dockerized microservice for the translation model wrapper. Ready for your review!",
        timestamp: "Sep 24, 6:30 PM IST"
      },
      {
        id: "msg-302",
        sender: "them",
        senderName: "Pooja Deshmukh",
        text: "Super clean! The latency dropped under 38ms on our local test server. We are in great shape for the hackathon showcase!",
        timestamp: "Sep 25, 9:15 AM IST"
      }
    ]
  }
];

export const INITIAL_ATS_RESUME = {
  header: {
    fullName: "Aarav Sharma",
    headline: "Software Engineer | Distributed Systems & High-Throughput Infrastructure",
    email: "aarav.sharma.cse@iitb.ac.in",
    phone: "+91 98765 43210",
    location: "Mumbai, MH / Bengaluru, KA, India",
    linkedin: "linkedin.com/in/aaravsharma-iitb",
    github: "github.com/aaravsharma-dev",
    portfolio: "aaravsharma.in"
  },
  education: [
    {
      institution: "Indian Institute of Technology, Bombay (IIT Bombay)",
      degree: "Bachelor of Technology in Computer Science & Engineering",
      graduationDate: "Expected May 2026",
      gpa: "9.42 / 10.00 CGPA (Self-Reported)",
      coursework: "Data Structures & Algorithms, Operating Systems, Computer Networks, Database Management Systems, Distributed Systems, Compilers"
    }
  ],
  experience: [
    {
      company: "IIT Bombay Systems Research Lab",
      title: "Undergraduate Systems Researcher",
      location: "Powai, Mumbai",
      startDate: "Jan 2024",
      endDate: "Present",
      bullets: [
        "Implemented a fault-tolerant Raft consensus protocol in Go, supporting dynamic cluster membership re-configuration with zero lost writes.",
        "Profiled memory allocations and CPU cycles using pprof, reducing GC pause frequency by 34% under a 25,000 req/sec benchmark load.",
        "Authored automated integration test suite validating state-machine safety under simulated 40% network packet drop conditions."
      ]
    },
    {
      company: "Fintech Innovation Co-op",
      title: "Backend Engineer Intern",
      location: "Bengaluru, Karnataka",
      startDate: "May 2024",
      endDate: "July 2024",
      bullets: [
        "Engineered scalable RESTful microservices using Go and PostgreSQL to process 15,000 active merchant transactions per minute.",
        "Optimized complex SQL join queries and configured Redis cache invalidation, reducing 95th percentile latency from 420ms to 58ms.",
        "Architected GitHub Actions CI/CD pipelines deploying containerized services directly to AWS EKS."
      ]
    }
  ],
  projects: [
    {
      name: "FluxKV: High-Throughput Distributed Key-Value Store",
      technologies: "Go, gRPC, Protobuf, RocksDB, Docker",
      link: "github.com/aaravsharma-dev/flux-kv",
      bullets: [
        "Engineered a distributed key-value store with consistent hashing and virtual nodes for balanced partition distribution across 5 nodes.",
        "Implemented write-ahead logging (WAL) and SSTable compaction routines to guarantee ACID durability across node crashes.",
        "Achieved 45,000 write ops/sec with < 8ms p99 latency in containerized benchmarking cluster."
      ]
    },
    {
      name: "MicroInfer: Lightweight Tensor Inference Engine",
      technologies: "C++, CUDA, CMake, Python bindings",
      link: "github.com/aaravsharma-dev/micro-infer",
      bullets: [
        "Authored custom Matrix Multiplication (GEMM) CUDA kernels with shared memory tiling, reaching 82% of peak theoretical GPU FLOPS on RTX 3080.",
        "Built PyTorch C++ extension allowing seamless model offloading without redundant host-to-device memory copies."
      ]
    }
  ],
  skills: {
    languages: "C++, Go, Python, Rust, TypeScript, Java, SQL, Bash",
    systemsTools: "Docker, Kubernetes, AWS, Kafka, Redis, PostgreSQL, Linux Kernel, Git",
    frameworks: "FastAPI, gRPC, Protobuf, PyTorch, React, Next.js, Spring Boot",
    concepts: "Distributed Systems, Concurrency, Raft/Paxos, REST APIs, Microservices, ACID"
  },
  achievements: [
    "Smart India Hackathon (SIH 2024) 1st Prize Winner - Ministry of Education, Govt. of India",
    "ACM-ICPC Amritapuri Regionalist (Ranked in top 2% of collegiate competitive programmers)",
    "Inter-IIT Tech Meet Gold Medalist in Systems Architecture Challenge",
    "Top 2% All India Percentile on TeamMatch Coding Practice Benchmark (520 problems completed)",
    "AWS Certified Solutions Architect - Associate"
  ]
};

export const LEADERBOARD_METHODOLOGY = {
  version: "2025.1-India-Transparent-Signal",
  lastUpdated: "September 28, 2024",
  weights: [
    { factor: "Coding Practice & Algorithmic Rigor", weight: 35, description: "Standardized algorithmic problem benchmarks, test complexity, and consistent daily practice." },
    { factor: "Peer Squads & Project Execution", weight: 25, description: "Active open-source repos, verified production deployments, and squad collaboration milestones." },
    { factor: "Hackathons & Technical Competitions", weight: 25, description: "Smart India Hackathon, Inter-IIT Tech Meet, collegiate hackathons, and ICPC achievements." },
    { factor: "Academic & Coursework Foundations", weight: 15, description: "Optional verified or self-reported coursework. Note: Missing or private CGPA is normalized fairly without penalty." }
  ],
  disclaimer: "TeamMatch Leaderboards are transparent ranking demonstrations based on observable public signals. Rankings do not represent an absolute judgment of a student's potential, and unverified self-reported attributes are explicitly tagged. Ties are resolved favorably and missing private fields never decrease standing."
};

export type UserRole = "student" | "alumni" | "admin";
export type ConnectionStatus = "pending" | "accepted" | "rejected";
export type ReferralStatus = "pending" | "accepted" | "rejected" | "expired";
export type PostType = "internship_achievement" | "hackathon_achievement" | "job_opening" | "internship_opening" | "referral_opportunity";
export type VerificationStatus = "verified" | "pending" | "unverified";

export interface User {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  role: UserRole;
  domain: string;
  skills: string[];
  currentStatus: "studying" | "working";
  passOutYear: number;
  company?: string;
  companyVerified: VerificationStatus;
  reputationScore: number;
  referralCount: number;
  availableForReferrals: boolean;
  avatar: string;
  joinedAt: string;
  bio?: string;
  maxReferralsPerMonth?: number;
  maxResumesPerDay?: number;
}

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: ConnectionStatus;
  purpose: "resume_review" | "career_guidance" | "referral";
  createdAt: string;
}

export interface ReferralRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: ReferralStatus;
  resumeUrl: string;
  jobId: string;
  jobRole: string;
  company: string;
  skillsMatchScore: number;
  createdAt: string;
  respondedAt?: string;
}

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  title: string;
  description: string;
  company: string;
  domain: string;
  batch: number;
  createdAt: string;
  jobLink?: string;
  imageUrl?: string;
  flagged?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: "connection_request" | "referral_update" | "admin_notice" | "post_relevant";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  linkTo?: string;
}

const initials = (name: string) =>
  name.split(" ").map(w => w[0]).join("").toUpperCase();

export const USERS: User[] = [
  {
    id: "u1", name: "Arjun Mehta", email: "arjun.mehta@college.edu", registrationNumber: "CSE2021034",
    role: "alumni", passOutYear: 2022, domain: "Software Engineering", skills: ["React", "Node.js", "AWS", "System Design"],
    currentStatus: "working", company: "Google", companyVerified: "verified", reputationScore: 92,
    referralCount: 14, availableForReferrals: true, avatar: initials("Arjun Mehta"), joinedAt: "2022-06-15",
    bio: "SDE-2 at Google. Happy to help juniors with referrals and resume reviews.", maxReferralsPerMonth: 5, maxResumesPerDay: 3,
  },
  {
    id: "u2", name: "Priya Sharma", email: "priya.sharma@college.edu", registrationNumber: "CSE2021089",
    role: "alumni", passOutYear: 2022, domain: "Data Science", skills: ["Python", "ML", "TensorFlow", "SQL"],
    currentStatus: "working", company: "Microsoft", companyVerified: "verified", reputationScore: 87,
    referralCount: 9, availableForReferrals: true, avatar: initials("Priya Sharma"), joinedAt: "2022-07-01",
    bio: "Data Scientist at Microsoft. Passionate about helping students break into DS/ML roles.", maxReferralsPerMonth: 3, maxResumesPerDay: 2,
  },
  {
    id: "u3", name: "Rahul Verma", email: "rahul.verma@college.edu", registrationNumber: "CSE2020045",
    role: "alumni", passOutYear: 2021, domain: "Backend Engineering", skills: ["Java", "Spring Boot", "Microservices", "Kafka"],
    currentStatus: "working", company: "Amazon", companyVerified: "verified", reputationScore: 78,
    referralCount: 6, availableForReferrals: false, avatar: initials("Rahul Verma"), joinedAt: "2021-08-20",
    bio: "SDE at Amazon. Currently maxed out on referrals this quarter.", maxReferralsPerMonth: 2, maxResumesPerDay: 1,
  },
  {
    id: "u4", name: "Sneha Iyer", email: "sneha.iyer@college.edu", registrationNumber: "CSE2023011",
    role: "student", passOutYear: 2025, domain: "Frontend Development", skills: ["React", "TypeScript", "Tailwind", "Figma"],
    currentStatus: "studying", reputationScore: 45, referralCount: 0, availableForReferrals: false,
    companyVerified: "unverified", avatar: initials("Sneha Iyer"), joinedAt: "2023-09-01",
    bio: "Final year CSE student. Looking for frontend/full-stack roles.",
  },
  {
    id: "u5", name: "Karan Patel", email: "karan.patel@college.edu", registrationNumber: "CSE2023067",
    role: "student", passOutYear: 2025, domain: "Full Stack Development", skills: ["MERN", "Docker", "Git", "REST APIs"],
    currentStatus: "studying", reputationScore: 38, referralCount: 0, availableForReferrals: false,
    companyVerified: "unverified", avatar: initials("Karan Patel"), joinedAt: "2023-09-01",
    bio: "Aspiring full-stack developer. Built 3 projects. Looking for internships.",
  },
  {
    id: "u6", name: "Ananya Desai", email: "ananya.desai@college.edu", registrationNumber: "CSE2022033",
    role: "alumni", passOutYear: 2023, domain: "DevOps", skills: ["AWS", "Kubernetes", "CI/CD", "Terraform"],
    currentStatus: "working", company: "Flipkart", companyVerified: "pending", reputationScore: 55,
    referralCount: 3, availableForReferrals: true, avatar: initials("Ananya Desai"), joinedAt: "2023-06-10",
    bio: "DevOps Engineer at Flipkart. Can help with cloud and infrastructure roles.", maxReferralsPerMonth: 4, maxResumesPerDay: 2,
  },
  {
    id: "u7", name: "Vikram Singh", email: "vikram.singh@college.edu", registrationNumber: "CSE2024012",
    role: "student", passOutYear: 2026, domain: "Machine Learning", skills: ["Python", "PyTorch", "NLP", "OpenCV"],
    currentStatus: "studying", reputationScore: 22, referralCount: 0, availableForReferrals: false,
    companyVerified: "unverified", avatar: initials("Vikram Singh"), joinedAt: "2024-09-01",
    bio: "3rd year student interested in ML/AI research and engineering roles.",
  },
  {
    id: "u8", name: "Meera Nair", email: "meera.nair@college.edu", registrationNumber: "CSE2021056",
    role: "alumni", passOutYear: 2022, domain: "Product Management", skills: ["Product Strategy", "Analytics", "SQL", "Figma"],
    currentStatus: "working", company: "Razorpay", companyVerified: "verified", reputationScore: 71,
    referralCount: 5, availableForReferrals: true, avatar: initials("Meera Nair"), joinedAt: "2022-07-15",
    bio: "APM at Razorpay. Helping students transition into product roles.", maxReferralsPerMonth: 3, maxResumesPerDay: 2,
  },
  {
    id: "u9", name: "Aditya Joshi", email: "aditya.joshi@college.edu", registrationNumber: "CSE2023099",
    role: "student", passOutYear: 2025, domain: "Cybersecurity", skills: ["Networking", "Pentesting", "Linux", "Python"],
    currentStatus: "studying", reputationScore: 30, referralCount: 0, availableForReferrals: false,
    companyVerified: "unverified", avatar: initials("Aditya Joshi"), joinedAt: "2023-09-01",
    bio: "Final year student specializing in cybersecurity. CTF enthusiast.",
  },
  {
    id: "u10", name: "Ritu Gupta", email: "ritu.gupta@college.edu", registrationNumber: "CSE2020078",
    role: "alumni", passOutYear: 2021, domain: "Software Engineering", skills: ["Go", "gRPC", "PostgreSQL", "Redis"],
    currentStatus: "working", company: "Uber", companyVerified: "verified", reputationScore: 83,
    referralCount: 11, availableForReferrals: true, avatar: initials("Ritu Gupta"), joinedAt: "2021-06-20",
    bio: "Backend engineer at Uber. Open to helping with system design prep and referrals.", maxReferralsPerMonth: 4, maxResumesPerDay: 2,
  },
  {
    id: "u11", name: "Naveen Kumar", email: "naveen.kumar@college.edu", registrationNumber: "CSE2024045",
    role: "student", passOutYear: 2026, domain: "Mobile Development", skills: ["React Native", "Flutter", "Firebase", "TypeScript"],
    currentStatus: "studying", reputationScore: 18, referralCount: 0, availableForReferrals: false,
    companyVerified: "unverified", avatar: initials("Naveen Kumar"), joinedAt: "2024-09-01",
    bio: "Building mobile apps. Looking for internship opportunities.",
  },
  {
    id: "u12", name: "Divya Reddy", email: "divya.reddy@college.edu", registrationNumber: "CSE2022067",
    role: "alumni", passOutYear: 2023, domain: "Data Engineering", skills: ["Spark", "Airflow", "Python", "Snowflake"],
    currentStatus: "working", company: "Swiggy", companyVerified: "verified", reputationScore: 64,
    referralCount: 4, availableForReferrals: true, avatar: initials("Divya Reddy"), joinedAt: "2023-07-01",
    bio: "Data Engineer at Swiggy. Can help with data engineering career paths.", maxReferralsPerMonth: 3, maxResumesPerDay: 1,
  },
  {
    id: "u13", name: "Saurabh Tiwari", email: "saurabh.tiwari@college.edu", registrationNumber: "CSE2023022",
    role: "student", passOutYear: 2025, domain: "Cloud Computing", skills: ["AWS", "Azure", "Docker", "Linux"],
    currentStatus: "studying", reputationScore: 35, referralCount: 0, availableForReferrals: false,
    companyVerified: "unverified", avatar: initials("Saurabh Tiwari"), joinedAt: "2023-09-01",
    bio: "AWS certified. Preparing for cloud/DevOps roles.",
  },
  {
    id: "u14", name: "Pooja Bhatt", email: "pooja.bhatt@college.edu", registrationNumber: "CSE2021090",
    role: "alumni", passOutYear: 2022, domain: "Frontend Development", skills: ["React", "Vue", "CSS", "Accessibility"],
    currentStatus: "working", company: "Atlassian", companyVerified: "verified", reputationScore: 76,
    referralCount: 7, availableForReferrals: false, avatar: initials("Pooja Bhatt"), joinedAt: "2022-06-01",
    bio: "Senior Frontend Engineer at Atlassian. Currently not accepting referrals.", maxReferralsPerMonth: 0, maxResumesPerDay: 0,
  },
  {
    id: "u15", name: "Admin User", email: "admin@college.edu", registrationNumber: "ADM001",
    role: "admin", passOutYear: 2020, domain: "Administration", skills: ["Management"],
    currentStatus: "working", reputationScore: 100, referralCount: 0, availableForReferrals: false,
    companyVerified: "unverified", avatar: initials("Admin User"), joinedAt: "2020-01-01",
    bio: "Platform administrator.",
  },
];

export const CONNECTIONS: Connection[] = [
  { id: "c1", fromUserId: "u4", toUserId: "u1", status: "accepted", purpose: "referral", createdAt: "2025-01-10" },
  { id: "c2", fromUserId: "u5", toUserId: "u2", status: "accepted", purpose: "career_guidance", createdAt: "2025-01-12" },
  { id: "c3", fromUserId: "u4", toUserId: "u8", status: "pending", purpose: "resume_review", createdAt: "2025-03-15" },
  { id: "c4", fromUserId: "u9", toUserId: "u1", status: "accepted", purpose: "career_guidance", createdAt: "2025-02-01" },
  { id: "c5", fromUserId: "u7", toUserId: "u2", status: "pending", purpose: "referral", createdAt: "2025-03-18" },
  { id: "c6", fromUserId: "u5", toUserId: "u10", status: "accepted", purpose: "referral", createdAt: "2025-01-20" },
  { id: "c7", fromUserId: "u13", toUserId: "u6", status: "rejected", purpose: "referral", createdAt: "2025-02-14" },
  { id: "c8", fromUserId: "u11", toUserId: "u14", status: "accepted", purpose: "resume_review", createdAt: "2025-02-28" },
];

export const REFERRAL_REQUESTS: ReferralRequest[] = [
  { id: "r1", fromUserId: "u4", toUserId: "u1", status: "accepted", resumeUrl: "/resumes/sneha_resume.pdf", jobId: "GOO-SWE-2025", jobRole: "Software Engineer L3", company: "Google", skillsMatchScore: 82, createdAt: "2025-01-15", respondedAt: "2025-01-18" },
  { id: "r2", fromUserId: "u5", toUserId: "u10", status: "pending", resumeUrl: "/resumes/karan_resume.pdf", jobId: "UBR-BE-2025", jobRole: "Backend Engineer", company: "Uber", skillsMatchScore: 74, createdAt: "2025-03-10" },
  { id: "r3", fromUserId: "u9", toUserId: "u1", status: "rejected", resumeUrl: "/resumes/aditya_resume.pdf", jobId: "GOO-SEC-2025", jobRole: "Security Engineer", company: "Google", skillsMatchScore: 58, createdAt: "2025-02-05", respondedAt: "2025-02-08" },
  { id: "r4", fromUserId: "u4", toUserId: "u2", status: "pending", resumeUrl: "/resumes/sneha_resume_v2.pdf", jobId: "MSF-DS-2025", jobRole: "Data Scientist", company: "Microsoft", skillsMatchScore: 45, createdAt: "2025-03-12" },
  { id: "r5", fromUserId: "u13", toUserId: "u6", status: "expired", resumeUrl: "/resumes/saurabh_resume.pdf", jobId: "FLK-DO-2025", jobRole: "DevOps Engineer", company: "Flipkart", skillsMatchScore: 71, createdAt: "2025-01-25" },
  { id: "r6", fromUserId: "u7", toUserId: "u2", status: "pending", resumeUrl: "/resumes/vikram_resume.pdf", jobId: "MSF-ML-2025", jobRole: "ML Engineer", company: "Microsoft", skillsMatchScore: 67, createdAt: "2025-03-19" },
];

export const POSTS: Post[] = [
  { id: "p1", authorId: "u1", type: "job_opening", title: "SWE Openings at Google Bangalore", description: "Multiple L3/L4 positions open in my team. Looking for strong DSA and system design candidates. Referrals available for college alumni.", company: "Google", domain: "Software Engineering", batch: 2025, createdAt: "2025-03-01", jobLink: "https://careers.google.com/jobs/123" },
  { id: "p2", authorId: "u4", type: "internship_achievement", title: "Completed Summer Internship at Zomato", description: "Built a real-time order tracking feature using React and WebSockets. Great learning experience with a supportive team.", company: "Zomato", domain: "Frontend Development", batch: 2025, createdAt: "2025-03-05", imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" },
  { id: "p3", authorId: "u2", type: "referral_opportunity", title: "DS/ML Roles at Microsoft IDC", description: "My team is hiring for data scientist and ML engineer positions. Strong Python and statistics background required. Reach out with your resume.", company: "Microsoft", domain: "Data Science", batch: 2025, createdAt: "2025-03-08", jobLink: "https://careers.microsoft.com/jobs/456" },
  { id: "p4", authorId: "u5", type: "hackathon_achievement", title: "Won Smart India Hackathon 2025", description: "Our team built an AI-powered document verification system. Placed 1st in the software edition. Technologies: Python, TensorFlow, React.", company: "SIH", domain: "Full Stack Development", batch: 2025, createdAt: "2025-03-10", imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop" },
  { id: "p5", authorId: "u10", type: "job_opening", title: "Backend Engineers Needed at Uber", description: "Hiring for Go and gRPC experienced engineers. Competitive packages. DM for referral (connected alumni only).", company: "Uber", domain: "Backend Engineering", batch: 2025, createdAt: "2025-03-12", jobLink: "https://uber.com/careers/789" },
  { id: "p6", authorId: "u6", type: "internship_opening", title: "DevOps Internships at Flipkart", description: "Looking for candidates with Kubernetes and AWS experience. 6-month internship with PPO opportunity.", company: "Flipkart", domain: "DevOps", batch: 2025, createdAt: "2025-03-14" },
  { id: "p7", authorId: "u9", type: "hackathon_achievement", title: "CTF Competition - 2nd Place", description: "Secured 2nd place in the national-level CTF competition organized by IIT Bombay. Solved 18/20 challenges.", company: "IIT Bombay CTF", domain: "Cybersecurity", batch: 2025, createdAt: "2025-03-16" },
  { id: "p8", authorId: "u8", type: "job_opening", title: "APM Hiring at Razorpay", description: "Associate Product Manager openings. Looking for candidates with strong analytical skills and some technical background.", company: "Razorpay", domain: "Product Management", batch: 2025, createdAt: "2025-03-18", jobLink: "https://razorpay.com/careers/101" },
  { id: "p9", authorId: "u1", type: "referral_opportunity", title: "Referrals for Google SDE Roles", description: "I have 2 referral slots left this month for SDE-1 and SDE-2 positions. DSA + system design required. Connected alumni only.", company: "Google", domain: "Software Engineering", batch: 2025, createdAt: "2025-03-20" },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "u4", type: "referral_update", title: "Referral Accepted", message: "Arjun Mehta accepted your referral request for Google SWE L3.", read: false, createdAt: "2025-03-18", linkTo: "/student/referrals" },
  { id: "n2", userId: "u4", type: "connection_request", title: "Connection Pending", message: "Your connection request to Meera Nair is awaiting approval.", read: true, createdAt: "2025-03-15", linkTo: "/student/connections" },
  { id: "n3", userId: "u1", type: "connection_request", title: "New Connection Request", message: "Aditya Joshi wants to connect for career guidance.", read: false, createdAt: "2025-03-17", linkTo: "/alumni/connections" },
  { id: "n4", userId: "u1", type: "post_relevant", title: "New Post in Your Domain", message: "Karan Patel shared a hackathon achievement in Full Stack Development.", read: true, createdAt: "2025-03-10" },
  { id: "n5", userId: "u15", type: "admin_notice", title: "Pending Verification", message: "Ananya Desai's company verification for Flipkart is awaiting review.", read: false, createdAt: "2025-03-19", linkTo: "/admin/verifications" },
];

// Helper functions
export const getUserById = (id: string) => USERS.find(u => u.id === id);
export const getUsersByRole = (role: UserRole) => USERS.filter(u => u.role === role);
export const getConnectionsForUser = (userId: string) =>
  CONNECTIONS.filter(c => c.fromUserId === userId || c.toUserId === userId);
export const getReferralRequestsForUser = (userId: string, direction: "sent" | "received") =>
  REFERRAL_REQUESTS.filter(r => direction === "sent" ? r.fromUserId === userId : r.toUserId === userId);
export const getPostsByAuthor = (authorId: string) => POSTS.filter(p => p.authorId === authorId);
export const getNotificationsForUser = (userId: string) => NOTIFICATIONS.filter(n => n.userId === userId);

// Current logged-in user context (mock)
export const CURRENT_USER_ID = "u4"; // Sneha Iyer (student) by default
export const CURRENT_ADMIN_ID = "u15";

// Analytics mock data for admin
export const ANALYTICS = {
  totalUsers: USERS.length,
  totalStudents: USERS.filter(u => u.role === "student").length,
  totalAlumni: USERS.filter(u => u.role === "alumni").length,
  totalReferrals: REFERRAL_REQUESTS.length,
  acceptedReferrals: REFERRAL_REQUESTS.filter(r => r.status === "accepted").length,
  pendingReferrals: REFERRAL_REQUESTS.filter(r => r.status === "pending").length,
  rejectedReferrals: REFERRAL_REQUESTS.filter(r => r.status === "rejected").length,
  companyDistribution: [
    { company: "Google", count: 2 },
    { company: "Microsoft", count: 1 },
    { company: "Amazon", count: 1 },
    { company: "Uber", count: 1 },
    { company: "Flipkart", count: 1 },
    { company: "Razorpay", count: 1 },
    { company: "Swiggy", count: 1 },
    { company: "Atlassian", count: 1 },
  ],
  topAlumni: [
    { userId: "u1", name: "Arjun Mehta", referrals: 14, score: 92 },
    { userId: "u10", name: "Ritu Gupta", referrals: 11, score: 83 },
    { userId: "u2", name: "Priya Sharma", referrals: 9, score: 87 },
    { userId: "u14", name: "Pooja Bhatt", referrals: 7, score: 76 },
    { userId: "u8", name: "Meera Nair", referrals: 5, score: 71 },
  ],
  skillGaps: [
    { skill: "System Design", demand: 85, supply: 32 },
    { skill: "Machine Learning", demand: 78, supply: 45 },
    { skill: "Cloud/AWS", demand: 72, supply: 38 },
    { skill: "Data Structures", demand: 90, supply: 65 },
    { skill: "DevOps/CI-CD", demand: 60, supply: 25 },
  ],
  monthlyReferrals: [
    { month: "Oct", sent: 8, accepted: 3 },
    { month: "Nov", sent: 12, accepted: 5 },
    { month: "Dec", sent: 6, accepted: 2 },
    { month: "Jan", sent: 15, accepted: 7 },
    { month: "Feb", sent: 10, accepted: 4 },
    { month: "Mar", sent: 18, accepted: 6 },
  ],
};

// Utility functions
// Note: getUserById and getPostsByAuthor are already defined above

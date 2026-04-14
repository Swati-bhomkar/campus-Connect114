
# CampusConnect Pro — Full UI Mockup (Phase 1)

## Overview
Build the complete frontend for a college-verified professional networking platform with all screens, navigation, and mock data. No backend wiring — purely UI with realistic dummy data.

## Pages & Screens

### 1. Authentication Pages
- **Login Page** — Email/registration number + password, clean professional form
- **Registration Page** — Multi-step form: personal info → college verification (email or reg number + pass-out year) → domain/skills selection
- **Alumni Verification Page** — Work email or document upload for company verification

### 2. Student Dashboard
- **Overview** — Stats cards (connections, pending referrals, reputation), recent activity feed
- **Profile Page** — Full editable profile with skills, batch, status, availability toggle
- **Discovery/Search** — Filter sidebar (pass-out year, domain, company, availability) + ranked results list
- **My Connections** — List of approved connections with status indicators
- **My Referral Requests** — Sent requests with status (pending/accepted/rejected), resume attached
- **Create Referral Request** — Form with resume upload, job ID, role, auto-generated skills match score
- **Professional Posts Feed** — Structured cards (type badge, company, domain, batch) — no likes/reels
- **Create Post** — Structured form with type selector (Internship/Job/Hackathon), company, domain fields

### 3. Alumni Dashboard
- **Overview** — Stats (referrals given, pending requests, reputation score, monthly cap usage)
- **Profile Page** — Same as student + company verification badge + referral settings
- **Incoming Referral Requests** — Queue with resume preview, skills match score, accept/reject/ignore actions
- **Referral Settings** — Max referrals/month, max resumes/day, availability toggle
- **My Posts** — Job openings and referral opportunities posted
- **Discovery** — Same search but from alumni perspective

### 4. Admin Dashboard
- **User Management** — Table with all users, verification status, role, actions (approve/suspend/flag)
- **Company Verification** — Pending verifications with document preview, approve/reject
- **Analytics Dashboard** — Charts: referral success rates, company-wise distribution, most helpful alumni leaderboard, skill gap insights
- **Spam & Abuse Detection** — Flagged users (3+ flags), audit log timeline
- **System Settings** — Configurable college email domains, referral limits, platform rules

### 5. Shared Components
- **Top Navigation** — Role-aware nav (Student/Alumni/Admin views)
- **Profile Card** — Compact card with verification badge, reputation score, availability indicator
- **Referral Request Card** — Structured card with resume link, job details, skills match
- **Post Card** — Professional structured post (no social media vibes)
- **Reputation Badge** — Visual indicator of reputation level
- **Connection Request Modal** — Purpose selector (resume review / career guidance / referral)

### 6. Additional Pages
- **Profile View (Public)** — View another user's profile with Connect/Follow buttons
- **Notification Center** — Connection requests, referral updates, admin notices
- **404 / Unauthorized** — Clean error pages

## Design Direction
- Professional, LinkedIn-inspired but simpler and cleaner
- Dashboard-driven layout with sidebar navigation
- Muted color palette (navy, white, subtle grays, green for verification badges)
- No animations, no flashy elements — pure utility
- Clear visual separation between Student, Alumni, and Admin experiences
- Responsive design for desktop primary, mobile-friendly

## Mock Data
- 15-20 dummy users (mix of students and alumni across batches)
- Sample referral requests in various states
- Sample professional posts
- Analytics data for admin charts

## Navigation Structure
- Role-based routing: `/student/*`, `/alumni/*`, `/admin/*`
- Shared routes: `/profile/:id`, `/search`
- Auth routes: `/login`, `/register`, `/verify`

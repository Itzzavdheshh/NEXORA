# 16. Development History, Git Chronology & Refactoring Log

## 1. 45-Day Development Chronology Overview

The development of **NEXORA** progressed systematically across the 45-Day Industrial Training at **GradToPro** under tutor **Mrs. Anshu Mathur**, evolving from initial architectural requirements to a fully deployed v2.0.0 production platform.

---

## 2. Git Commit Timeline & Sprint Analysis

Below is the chronological record of major git commits reflecting the milestone evolution of the project:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DEVELOPMENT TIMELINE                                 │
├───────────┬───────────────────────────────────┬────────────────────────────────────────┤
│ COMMIT    │ SUMMARY                           │ MILESTONE / DELIVERABLE                │
├───────────┼───────────────────────────────────┼────────────────────────────────────────┤
│ `e222b92` │ Day 1 tasks                       │ SRS & Engineering Requirements Document │
│ `519b9fe` │ Day 2 Diagram                     │ Architecture & Data Flow Diagramming   │
│ `8069c7c` │ design\                           │ UI/UX Dashboard Mockup Screenshots     │
│ `b633ca0` │ README                            │ Initial Repository Readme Definition   │
│ `36c6b8a` │ chore: initialize backend project │ Express.js Node server initialization   │
│ `a060b35` │ feat: add health check routes     │ Supabase connection & health probes    │
│ `4eb0e32` │ feat: add users database schema   │ SQL Migrations 001 & 002 (Users & RLS) │
│ `49e3020` │ feat(auth): user registration     │ Supabase Auth & JWT registration flow  │
│ `b09a552` │ feat(student): student profile    │ Student Profile Controller & Service   │
│ `3f2401e` │ feat(mentor): mentor profile      │ Mentor Profile Controller & Service    │
│ `05b024d` │ feat(auth): complete auth         │ `/me` endpoint & JWT middleware        │
│ `892687f` │ feat(availability): mentor slots  │ Slot creation & overlap validation     │
│ `3542e2c` │ feat(booking): booking management │ Booking state machine & Resend email   │
│ `826b271` │ Complete Nexora backend           │ Idempotent Seeder (`seed.js`)          │
│ `d52e763` │ feat(frontend): pages             │ React SPA Pages, React Router v6 setup │
│ `a16b6fd` │ release: Nexora v2.0.0            │ v2.0.0 Production Baseline Release     │
│ `fcefa08` │ frontend Design improved          │ Design token integration (`tokens.css`)│
│ `7648e82` │ Frontend Updations                │ Notification card & skeleton updates   │
│ `df97c33` │ refactor: update Navbar component │ Navbar redesign & unread badge counter │
│ `526497a` │ refactor: update useMentorBookings│ Optimistic React Query hook refactoring│
│ `5d22e0d` │ refactor: update AdminDashboard   │ Verification Drawer & admin metrics    │
│ `6ca278e` │ Vercel file                       │ `client/vercel.json` SPA rewrite rules │
│ `be74cb9` │ design improvements & security    │ Helmet, Rate Limiters & Sanitizer      │
│ `c45c092` │ fix: force dark theme init        │ Resolved dark mode theme flash bug     │
└───────────┴───────────────────────────────────┴────────────────────────────────────────┘
```

---

## 3. Sprint Retrospective & Architectural Evolution

### Sprint 1: Requirements Engineering & SRS (Days 1–5)
- Documented engineering requirements ([DOCS/Nexora_Day1_Engineering_Requirements.pdf](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/DOCS/Nexora_Day1_Engineering_Requirements.pdf)).
- Formulated system topology diagrams ([DOCS/Nexora_Day2_Design_Diagram.pdf](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/DOCS/Nexora_Day2_Design_Diagram.pdf)).

### Sprint 2: Core Backend Engine & Relational Schema (Days 6–15)
- Initialized Express 4 server, Winston logger, and Supabase client configuration.
- Executed PostgreSQL migration `001_create_users_table.sql` and enabled Row Level Security in `002_enable_rls.sql`.

### Sprint 3: Authentication & Domain Services (Days 16–25)
- Implemented Supabase Auth integration, registration, login, and JWT validation middleware.
- Built Student Profile, Mentor Profile, Slot Availability, and Booking Management modules.
- Integrated Resend API SDK for asynchronous email dispatches.

### Sprint 4: Frontend SPA & React 18 Implementation (Days 26–35)
- Initialized React 18 SPA with Vite 5 and Tailwind CSS 3.
- Developed custom hooks (`useMentorAvailability`, `useMentorBookings`, etc.) utilizing TanStack React Query for caching.

### Sprint 5: Refactoring, Security Hardening & Deployment (Days 36–45)
- Added global XSS input sanitizer (`sanitizer.js`), rate limiting, Helmet headers, and CORS rules.
- Created Docker container configs (`docker-compose.yml`) and deployed Frontend to Vercel and Backend to Render.
- Fixed dark mode theme flash bug (`c45c092`) by forcing root document class initialization in `ThemeContext.jsx`.

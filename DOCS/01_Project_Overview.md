# 01. Project Overview & Industrial Training Context

## 1. Executive Summary

**NEXORA** is an enterprise-grade, full-stack mentorship discovery, slot-scheduling, and session management platform. Designed and implemented as the **Final Capstone Project** for the **45-Day Industrial Training on Full Stack Development**, NEXORA solves the critical real-world problem of fragmented academic and professional mentorship workflows.

By offering role-based access for **Students**, **Mentors**, and **Institution Administrators**, real-time slot synchronization, automated email notification dispatch, and administrative verification, NEXORA elevates mentorship scheduling from informal ad-hoc messages to a structured, transparent, and scalable ecosystem.

---

## 2. Industrial Training Context & Metadata

This project represents the culmination of an intensive 45-day hands-on software engineering program organized by **GradToPro**.

### Student Information
- **Student Name:** Avdhesh Kumar Dadhich
- **Institution / College:** JIET Jodhpur (Jodhpur Institute of Engineering & Technology)
- **Degree & Branch:** Bachelor of Technology (B.Tech) - Computer Science Engineering (CSE)
- **Training Duration:** 45 Days
- **Training Organization:** GradToPro
- **Industrial Tutor / Instructor:** Mrs. Anshu Mathur

### About the Training Organization (GradToPro)
GradToPro is an industry-aligned technical education platform specializing in practical, production-oriented software development. Its curriculum emphasizes bridging the gap between theoretical computer science concepts and modern enterprise engineering workflows through real-world system architecture, coding best practices, and project-based learning.

### Training Objectives
1. **Industry-Relevant Engineering Experience:** Transitioning from academic toy programs to structured, production-ready full-stack application development.
2. **Full-Stack Competency:** Achieving mastery across client-side SPA rendering, server-side REST API architecture, database normalization, state management, and continuous delivery.
3. **Frontend & Backend Synergy:** Understanding network protocols, HTTP methods, asynchronous processing, JWT authentication, and database query optimization.
4. **Deployable System Delivery:** Constructing cloud-hosted, security-hardened applications complete with containerization (Docker) and automated CI/CD pipelines.

---

## 3. Industrial Training Phases & Evolution

The 45-Day Industrial Training program was partitioned into two distinct phases:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 45-DAY INDUSTRIAL TRAINING                              │
├───────────────────────────────────────────┬─────────────────────────────────────────────┤
│            PHASE 1: LEARNING              │           PHASE 2: CAPSTONE PROJECT         │
│               (Days 1 - 25)               │                (Days 26 - 45)               │
├───────────────────────────────────────────┼─────────────────────────────────────────────┤
│ • Git, GitHub Workflow & Branching        │ • Requirement Engineering & SRS             │
│ • HTML5, CSS3, Responsive Web Design      │ • System Architecture & Diagramming         │
│ • JS Engine, Event Loop, Promises, Async  │ • Database Schema Design & Normalization    │
│ • Java OOP, Data Structures (Stack, Queue)│ • Supabase Auth & Row Level Security        │
│ • DBMS Principles, Relational Models      │ • Express.js REST API Development           │
│ • React 18, Hooks, Router v6, Context API │ • React 18 SPA UI/UX Implementation         │
│ • Node.js, Express.js Middleware & APIs   │ • Transactional Email Engine (Resend)       │
│ • Supabase PostgreSQL, RLS & JWT Auth     │ • Bug Fixing, Security & Optimization       │
│ • Mini Projects: Login Clone, Counter App,│ • Multi-Platform Cloud Deployment           │
│   Todo App, Banking Backend Engine        │ • System Documentation & Viva Preparation   │
└───────────────────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 4. Problem Statement

Mentorship in academic institutions, universities, and professional networks is severely hindered by four systemic bottlenecks:

1. **Information Asymmetry & Discoverability Deficit:** Students lack a central, searchable index of mentors with verified credentials, domain expertise, and availability schedules.
2. **Scheduling Friction & Double-Booking Hazards:** Availability is typically communicated via unstructured text messages, email threads, or shared spreadsheets. This manual coordination leads to frequent double-bookings, time zone confusion, and high drop-out rates.
3. **Lack of Institutional Oversight:** Educational institutions and training platforms have no quantitative visibility into mentorship activity, engagement metrics, or mentor quality control. Unverified profiles reduce platform trust.
4. **Scalability Limitations of Generic Tools:** Standard calendar booking tools (e.g., Calendly) lack role-specific features such as mentor verification, student profiles, institutional admin controls, and custom feedback tracking.

---

## 5. Solution Overview

**NEXORA** directly addresses these challenges by delivering an integrated, end-to-end mentorship management engine:

- **Role-Based Architecture:** Dedicated dashboards and workflows for Students, Mentors, and Administrators.
- **Real-Time Slot Engine:** Mentors define exact recurring or one-time time slots; students browse and book available slots instantaneously with automatic status updating.
- **Verification Workflow:** Admins review pending mentor profiles, verify documentation or credentials, and approve/reject applications to maintain platform integrity.
- **Automated Communication Layer:** Transactional emails automatically notify participants upon booking creation, status changes (Approval/Rejection), and session reminders.
- **Production Infrastructure:** A modern React 18 client coupled with an Express 4 REST API, backed by Supabase PostgreSQL with Row Level Security (RLS) and Resend API.

---

## 6. Key Capabilities & Feature Matrix

| Capability | Module | Technical Implementation | Value Delivered |
|---|---|---|---|
| **Role-Based Auth** | `Auth` | Supabase Auth + JWT Middleware + `authStorage.js` | Enforces isolation across Student, Mentor, Admin accounts |
| **Mentor Discovery** | `Student` | `ExploreMentorsPage.jsx`, search & filter hooks | Allows filtering by domain, expertise, and availability |
| **Slot Management** | `Mentor` | `MentorAvailabilityPage.jsx`, `availability.service.js` | Enables creation, toggling, and deletion of booking slots |
| **Real-Time Booking** | `Booking` | `BookingModal.jsx`, `booking.service.js` | Prevents race conditions and double-bookings |
| **Email Dispatch** | `Notifications` | `email.js` using `resend` SDK | Instant transactional alerts on booking lifecycle events |
| **Verification Gate** | `Admin` | `MentorVerificationPage.jsx`, `admin.service.js` | Maintains network trust through manual credential check |
| **User Oversight** | `Admin` | `UserManagementPage.jsx`, `UserDrawer.jsx` | Full administrative control over user accounts and roles |
| **Theme System** | `UI/UX` | `ThemeContext.jsx`, Tailwind dark mode class | Seamless dark/light theme switching across all views |

---

## 7. Document Organization & Knowledge Structure

This Master Technical Knowledge Document is split into 20 specialized volumes located in `/docs`:

1. [01_Project_Overview.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/01_Project_Overview.md) - Executive summary, training context, problem & solution statement.
2. [02_Project_Architecture.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/02_Project_Architecture.md) - High-level system architecture, client-server topology, data flow.
3. [03_Frontend.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/03_Frontend.md) - React SPA architecture, Vite, Tailwind CSS, global state, routing.
4. [04_Backend.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/04_Backend.md) - Express.js REST API layer, controllers, services, middleware stack.
5. [05_Database.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/05_Database.md) - Supabase PostgreSQL schemas, tables, relationships, indexes, RLS policies.
6. [06_APIs.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/06_APIs.md) - Complete endpoint reference with request/response schemas.
7. [07_Authentication.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/07_Authentication.md) - Supabase Auth, JWT validation, RBAC middleware, token lifecycles.
8. [08_Business_Logic.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/08_Business_Logic.md) - Slot reservation, state transitions, notification engine, verification logic.
9. [09_Project_Structure.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/09_Project_Structure.md) - Deep directory layout analysis for `client/` and `server/`.
10. [10_Components.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/10_Components.md) - UI components reference (Props, state, hooks, parents/children).
11. [11_Custom_Hooks.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/11_Custom_Hooks.md) - React hooks reference (Parameters, return values, side effects).
12. [12_Utilities.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/12_Utilities.md) - Backend and frontend helper scripts, validators, loggers.
13. [13_Deployment.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/13_Deployment.md) - Vercel, Render, Supabase deployment configs, Docker setup, CI/CD.
14. [14_Security.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/14_Security.md) - Threat modeling, OWASP Top 10 mitigation, RLS, input sanitization.
15. [15_Performance.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/15_Performance.md) - Vite bundler optimization, React rendering performance, DB indexing.
16. [16_Project_Journey.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/16_Project_Journey.md) - 45-day development chronology, git commit logs, Sprint retrospectives.
17. [17_Dependencies.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/17_Dependencies.md) - NPM dependency audit for both frontend and backend.
18. [18_Code_Quality.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/18_Code_Quality.md) - Linting, standards, error boundaries, styling rules.
19. [19_Future_Improvements.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/19_Future_Improvements.md) - Architectural roadmap (AI match, WebRTC video, chat, payments).
20. [20_Master_Summary.md](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/docs/20_Master_Summary.md) - Final synthesis, key learnings, Viva examination Q&A guide.

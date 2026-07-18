# Nexora

### Mentorship & Career Growth Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📖 Project Description

**Nexora** is a mentorship and career-growth platform built to connect students with experienced mentors through a structured, transparent, and scheduling-first system. The current MVP focuses on a **One-on-One Mentor Slot Booking System**, allowing students to discover mentors, view real-time availability, and book sessions seamlessly — while giving mentors and institutions the tools to manage time, verify identity, and track engagement.

Nexora is designed to scale from individual mentor-student interactions to institution-wide mentorship programs.

---

## ❓ Problem Statement

Mentorship today is fragmented and inaccessible at scale:

- Students struggle to find **verified, relevant mentors** for their career goals.
- Scheduling happens through scattered channels — DMs, spreadsheets, and email threads.
- Mentors lack a centralized way to **manage availability** and avoid double-booking.
- Training organizations and institutions have **no unified dashboard** to oversee mentorship activity, verify mentors, or measure outcomes.
- Existing solutions are either too generic (calendar tools) or too expensive/closed (enterprise mentorship SaaS).

---

## 💡 Solution Overview

Nexora solves this with a purpose-built platform that combines:

- **Role-based access** for students, mentors, and institution admins.
- **Real-time slot availability** so double-bookings and stale data are eliminated.
- **A structured booking flow** — discover, view profile, pick a slot, confirm, get notified.
- **Verification workflows** so institutions can trust the mentors on their platform.
- **A foundation built to scale** — from a single mentor-student MVP to multi-institution deployments.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Student Registration/Login** | Secure sign-up and authentication for students via Supabase Auth |
| 🔐 **Mentor Registration/Login** | Dedicated onboarding and authentication flow for mentors |
| 🛡️ **Role-Based Access Control** | Distinct permissions and views for Students, Mentors, and Admins |
| 👤 **Mentor Profiles** | Public profiles showcasing expertise, experience, and bio |
| 📅 **Availability Slot Management** | Mentors define and update their available time slots |
| 📌 **Slot Booking System** | Students browse and book open mentor slots in real time |
| 📧 **Email Notifications** | Automated booking confirmations and reminders via Resend |
| ⚡ **Real-Time Updates** | Live slot availability powered by Supabase Realtime |
| 🧑‍💼 **Admin Dashboard** | Centralized oversight for institutions and platform admins |
| ✅ **Mentor Verification** | Verification workflow to ensure mentor authenticity and quality |

---

## 🛠️ Tech Stack

**Frontend**
- [React.js](https://react.dev/) — Component-based UI
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling

**Backend**
- [Node.js](https://nodejs.org/) — Runtime environment
- [Express.js](https://expressjs.com/) — REST API framework

**Database & Auth**
- [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/) — Relational data store
- [Supabase Authentication](https://supabase.com/auth) — User auth & session management
- [Supabase Realtime](https://supabase.com/realtime) — Live data subscriptions

**Communication**
- [Resend Email API](https://resend.com/) — Transactional email delivery

**Deployment**
- [Vercel](https://vercel.com/) — Frontend hosting
- [Render](https://render.com/) — Backend hosting

---

## 🏗️ System Architecture Summary

```
┌─────────────────┐         ┌──────────────────┐         ┌────────────────────┐
│   React Client   │  HTTPS  │  Express.js API   │  SQL    │  Supabase (Postgres)│
│  (Vercel hosted)  │◄──────►│  (Render hosted)  │◄──────►│  Auth + DB + Realtime│
└─────────────────┘         └──────────────────┘         └────────────────────┘
        │                            │                              │
        │                            ▼                              │
        │                  ┌──────────────────┐                     │
        └─────────────────►│   Resend Email API │◄────────────────────┘
                            │ (Notifications)    │
                            └──────────────────┘
```

**Flow Summary:**
1. The **React client** handles UI, auth state, and slot booking interactions.
2. The **Express.js API** handles business logic, validation, and route protection.
3. **Supabase** serves as the source of truth for users, mentor data, and slots — and pushes real-time updates back to the client.
4. **Resend** dispatches transactional emails (booking confirmations, reminders) triggered by backend events.

---

## 📁 Project Structure

```
nexora/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/               # Route-level pages
│   │   ├── hooks/               # Custom React hooks
│   │   ├── context/              # Auth & global state context
│   │   ├── services/             # API call wrappers
│   │   └── utils/                # Helper functions
│   ├── public/
│   └── package.json
│
├── server/                     # Express backend
│   ├── controllers/             # Route logic
│   ├── routes/                  # API route definitions
│   ├── middleware/               # Auth, validation, error handling
│   ├── config/                   # Supabase & environment config
│   ├── utils/                    # Helper functions
│   └── package.json
│
├── .env.example                # Sample environment variables
├── README.md
└── LICENSE
```

---

## ⚙️ Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn
- A [Supabase](https://supabase.com/) project (free tier works)
- A [Resend](https://resend.com/) API key

### Clone the Repository

```bash
git clone https://github.com/Itzzavdheshh/NEXORA.git
cd NEXORA
```

### Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in both `client/` and `server/` directories based on `.env.example`.

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port for the Express server |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `RESEND_API_KEY` | API key for Resend email service |
| `CLIENT_URL` | Frontend URL for CORS configuration |
| `JWT_SECRET` | Secret used for token signing/verification |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key |
| `VITE_API_BASE_URL` | Base URL of the backend API |

> ⚠️ Never commit `.env` files. Use `.env.example` as a reference template only.

---

## 🚀 Running Locally

```bash
# Start the backend server
cd server
npm run dev

# In a separate terminal, start the frontend
cd client
npm run dev
```

By default:
- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:5000`

---

## ☁️ Deployment Overview

| Layer | Platform | Notes |
|---|---|---|
| Frontend | **Vercel** | Auto-deploys from the `main` branch; configure environment variables in the Vercel dashboard |
| Backend | **Render** | Deployed as a Web Service; configure environment variables in the Render dashboard |
| Database & Auth | **Supabase** | Managed Postgres, Auth, and Realtime — no separate deployment needed |
| Email | **Resend** | API-based, no infrastructure to deploy |

**Steps:**
1. Push your code to GitHub.
2. Connect the `client/` directory to Vercel as a new project.
3. Connect the `server/` directory to Render as a new Web Service.
4. Add the required environment variables on both platforms.
5. Update `VITE_API_BASE_URL` (client) and `CLIENT_URL` (server) to point to the deployed URLs.

---

## 🔭 Future Scope

- 📊 Mentor and student analytics dashboards
- 💬 In-app chat between mentors and students
- 🎥 Integrated video call support for sessions
- 🏢 Multi-institution / organization workspaces
- ⭐ Session ratings and feedback system
- 🤖 AI-based mentor recommendations
- 📱 Mobile application (React Native)
- 💳 Paid mentorship session support

---

## 👥 Contributors

Thanks to everyone who contributes to Nexora!


Want to contribute? Check out our [Contributing Guidelines](CONTRIBUTING.md) and open issues to get started.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ for students and mentors everywhere.</p>

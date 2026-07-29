# 20. Master Technical Summary & Industrial Viva Preparation Guide

## 1. Capstone Project Synthesis & Technical Achievements

**NEXORA** represents a comprehensive engineering effort successfully bridging academic computer science principles with enterprise full-stack development standards. Developed by **Avdhesh Kumar Dadhich** (JIET Jodhpur) as the Final Capstone Project for the **45-Day Industrial Training on Full Stack Development** at **GradToPro** under the guidance of **Mrs. Anshu Mathur**, NEXORA solves real-world mentorship scheduling friction through modern software architecture.

### Key Milestones Delivered:
1. **Production React 18 SPA:** Client-side SPA featuring Vite 5, Tailwind CSS 3, Framer Motion animations, dark/light theme persistence, dynamic skeletons, and code-split routing.
2. **Layered Monolith Express REST API:** Node.js v18 REST server with strict separation across controllers, services, Zod validators, and a global middleware stack (Compression, Helmet, Correlation ID, Sanitizer, Rate Limiters).
3. **Normalized Relational Schema & Security:** Supabase PostgreSQL 15 database storing 6 normalized tables with B-Tree indexes, automated PL/pgSQL triggers, and Row Level Security (RLS) policies.
4. **Automated Transactional Emails:** Decoupled asynchronous email notification dispatches powered by the Resend API SDK.
5. **Multi-Cloud CI/CD & Deployment:** Docker containerization (`docker-compose.yml`), GitHub Actions workflows, Vercel frontend hosting, and Render backend cloud deployment.

---

## 2. Industrial Viva & Defense Examination Cheat Sheet (Top 20 Technical Q&As)

---

### Q1: What architectural pattern does NEXORA use and why?
**Answer:** NEXORA uses a decoupled client-server architecture. The frontend is a React 18 Single Page Application (SPA) hosted on Vercel Edge. The backend is a Layered Monolith built with Express.js on Render. This decouples presentation logic from business rules, allowing independent deployment, scaling, and maintenance.

### Q2: How does NEXORA handle user authentication and session persistence?
**Answer:** Authentication uses Supabase Auth Engine for identity verification. Upon login, Supabase returns a JWT Bearer token. On the frontend, `authStorage.js` persists the token in `localStorage`. `apiClient.js` attaches the token to outgoing HTTP requests via Axios request interceptors. On the backend, `auth.middleware.js` verifies the token using `supabase.auth.getUser(token)` and loads the application user profile from `public.users`.

### Q3: What happens when an authentication token expires?
**Answer:** `apiClient.js` includes a response interceptor that catches HTTP 401 Unauthorized responses. Upon catching a 401, it clears local storage via `authStorage.clear()` and dispatches a custom DOM event (`nexora:auth-expired`). `AuthContext.jsx` listens for this event, resets the React user state to `null`, and automatically redirects the user to `/login`.

### Q4: How is Role-Based Access Control (RBAC) implemented?
**Answer:** RBAC is enforced on both frontend and backend. On the frontend, `ProtectedRoute.jsx` checks the user's role against `allowedRoles` (e.g. `['student']`). On the backend, `role.middleware.js` exports `authorizeRoles(...roles)` which inspects `req.user.role` attached by `auth.middleware.js`. If the user's role is not allowed, it returns HTTP 403 Forbidden.

### Q5: How does the system prevent double-booking of mentor slots?
**Answer:** Slot reservation is protected at multiple levels. When a mentor creates a slot, `availability.service.js` checks for temporal intersections with existing slots. When a student books a slot, `booking.service.js` checks `availability_slots.is_available` and queries `bookings` table for pre-existing reservations. Upon booking creation, `availability_slots.is_available` is atomically set to `false`. Unique database constraints on `(mentor_id, day_of_week, start_time)` enforce uniqueness at the PostgreSQL layer.

### Q6: What is Row Level Security (RLS) and how is it used in NEXORA?
**Answer:** Row Level Security (RLS) is a PostgreSQL feature that restricts which rows in a table can be selected, inserted, updated, or deleted based on SQL policies. Migration `002_enable_rls.sql` enables RLS on all 6 tables. For example, in `bookings`, users can only read records where their application ID matches `student_id` or `mentor_id`, or if their role is `admin`.

### Q7: Why does the Express backend use `SUPABASE_SERVICE_ROLE_KEY`?
**Answer:** The Express backend acts as the authoritative business engine executing complex validations, multi-table joins, and admin overrides. Using `SUPABASE_SERVICE_ROLE_KEY` allows the backend service layer to bypass client RLS rules while enforcing centralized domain rules in Express code.

### Q8: How does NEXORA mitigate Cross-Site Scripting (XSS) attacks?
**Answer:** NEXORA uses global input sanitization middleware (`sanitizer.js`). Implemented via `sanitizerMiddleware` in `app.js`, it recursively traverses `req.body`, `req.query`, and `req.params`, stripping HTML tags (`/<[^>]*>/g`) from string inputs before hitting route controllers or database storage.

### Q9: How are rate limits applied to prevent brute-force attacks?
**Answer:** `app.js` uses `express-rate-limit` to establish two distinct throttling tiers: `authLimiter` limits requests to `/api/v1/auth/*` to 20 requests per 15 minutes per IP; `apiLimiter` limits general endpoints under `/api/v1/*` to 200 requests per 15 minutes.

### Q10: How are transactional emails handled without blocking user API responses?
**Answer:** In `booking.service.js` and `admin.service.js`, the Resend email API (`email.js`) is invoked asynchronously inside `try...catch` blocks after database state commits succeed. Email errors are logged to Winston without throwing exceptions, ensuring that network latency or email API issues never fail a database transaction or block user HTTP response cycles.

### Q11: Explain the Finite State Machine (FSM) of a session booking.
**Answer:** A booking starts in state `pending`. A mentor can accept it (transition to `confirmed`) or reject it (transition to `cancelled`). Either party can cancel a `pending` or `confirmed` booking (transition to `cancelled`). Once a confirmed session takes place, the mentor marks it `completed`. Invalid state jumps (e.g., `completed` -> `pending`) are rejected by `ALLOWED_TRANSITIONS` in `booking.service.js`.

### Q12: How is mentor verification conducted by administrators?
**Answer:** Unverified mentors are registered with `is_verified = false`. They appear in the Admin Dashboard pending queue. An admin reviews their credentials in `VerificationDrawer.jsx` and submits an approval or rejection (`PATCH /api/v1/admin/mentors/:id/verify`). Approval sets `is_verified = true` and `status = 'active'`, making the mentor visible in the public directory; rejection sets `status = 'rejected'`.

### Q13: How does client-side caching work in NEXORA?
**Answer:** Client-side caching is managed by **TanStack React Query**. Hooks like `useMentorAvailability` and `useMentorBookings` cache API responses under unique query keys (`['availability']`, `['mentorBookings']`). Caching reduces unnecessary network requests, while optimistic updates (`onMutate`) provide instant UI state feedback.

### Q14: How does NEXORA handle dark/light theme switching?
**Answer:** `ThemeContext.jsx` manages theme state. It initializes theme choice from `localStorage.getItem('nexora-theme')` or system preferences (`prefers-color-scheme`). It toggles the `'dark'` CSS class on `document.documentElement`, activating Tailwind's `dark:` modifier classes and CSS custom properties in `tokens.css`. Commit `c45c092` fixed a initial theme flash bug by forcing immediate root class execution on bootstrap.

### Q15: What tool is used for logging on the backend and what formats are produced?
**Answer:** Backend logging uses **Winston** in `logger.js`. It outputs colored, human-readable text to the console during development, and structured timestamped JSON objects to `logs/error.log` and `logs/combined.log`. Log envelopes include `timestamp`, `level`, `message`, `requestId`, `userId`, `status`, and `stack`.

### Q16: What is the purpose of `requestTrace.middleware.js`?
**Answer:** `requestTrace.middleware.js` assigns a unique `X-Request-ID` UUID to every incoming HTTP request. It attaches `req.id` to the Express Request object and echoes `X-Request-ID` in response headers, allowing engineers to trace log entries across log files for specific user requests.

### Q17: How is code splitting implemented in the React application?
**Answer:** Route components in `AppRoutes.jsx` are dynamically imported using `React.lazy()`. Pages are wrapped in a `<LazyRoute>` component that provides a `Suspense` fallback rendering `<RouteFallback>` shimmer skeletons while bundle chunks load.

### Q18: What Docker configuration is provided for deployment?
**Answer:** `docker-compose.yml` orchestrates two containers: `backend` (built from `server/Dockerfile` on Node 20 Alpine, listening on port 5000) and `frontend` (built from multi-stage `client/Dockerfile` using Node 20 to compile static assets and Nginx Alpine to serve them on port 80).

### Q19: How are database migrations and idempotency managed?
**Answer:** Database migrations are structured SQL scripts (`001_create_users_table.sql`, `002_enable_rls.sql`, `003_add_rejected_status.sql`). Database seeding is handled by `server/src/database/seed.js`, which uses upsert logic (`onConflict: 'email'`) to safely run multiple times without duplicating auth or user records.

### Q20: How does NEXORA prepare for future expansion into AI matching?
**Answer:** The backend includes a dedicated AI service abstraction ([aiService.js](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/server/src/services/aiService.js)) supporting OpenAI, Gemini, Claude, Groq, and Ollama providers. Future releases can extend this service with vector embeddings (pgvector) to compute semantic similarity scores between student career goals and mentor expertise.

---

## 3. Project Certification & Sign-off

```
========================================================================================
                      INDUSTRIAL CAPSTONE PROJECT CERTIFICATION
========================================================================================

PROJECT NAME           : NEXORA Mentorship & Career Growth Platform
DEVELOPER / STUDENT    : Avdhesh Kumar Dadhich
INSTITUTION            : JIET Jodhpur (B.Tech Computer Science Engineering)
TRAINING ORGANIZATION  : GradToPro (45-Day Full Stack Industrial Training)
TRAINING TUTOR         : Mrs. Anshu Mathur
DOCUMENTATION STATUS   : Complete Master Technical Documentation (20 Volumes in /docs)
SOURCE TRUTH VERIFIED  : 100% Reverse-Engineered from Source Code Repository
REPOSITORY LOCATION    : c:\Users\itzza\OneDrive\Desktop\NEXORA

This technical documentation suite serves as the official engineering record, portfolio
showcase, and viva defense guide for NEXORA.

========================================================================================
```

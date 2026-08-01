# 09. Repository File Structure & Architectural Directory Map

## 1. Top-Level Repository Directory Layout

```
NEXORA/
├── .github/                     # GitHub Actions CI/CD workflows
│   └── workflows/
│       ├── build.yml            # Application build validation pipeline
│       ├── lint.yml             # ESLint code quality workflow
│       └── security.yml         # Security vulnerability scanner
├── client/                      # React 18 SPA Frontend Application
│   ├── public/                  # Static web assets (favicons, robots.txt)
│   ├── src/                     # React source code (components, hooks, pages)
│   ├── .env                     # Local environment variables
│   ├── .env.example             # Template environment configuration
│   ├── Dockerfile               # Production NGINX/Client container setup
│   ├── eslint.config.js         # ESLint flat configuration file
│   ├── index.html               # Main HTML entrypoint with font imports
│   ├── package.json             # Frontend NPM dependency manifest
│   ├── postcss.config.js        # PostCSS configuration for Tailwind
│   ├── tailwind.config.js       # Tailwind CSS theme & plugin setup
│   ├── vercel.json              # Vercel SPA routing configuration
│   └── vite.config.js           # Vite 5 bundler configuration
├── Design/                      # UI/UX Mockup Screenshots
│   ├── Admin-Dashboard.png
│   ├── Login.png
│   ├── Mentor-Profile.png
│   ├── Signup.png
│   ├── Slot-Booking.png
│   └── Student-Dashboard.png
├── DOCS/                        # Day-1 and Day-2 Training Specs & Logs
│   ├── DEVELOPMENT_LOG.md       # Sprint development logs
│   ├── Nexora_Day1_Engineering_Requirements.pdf
│   └── Nexora_Day2_Design_Diagram.pdf
├── docs/                        # Master Technical Knowledge Documentation (20 Volumes)
├── logs/                        # Server log files (Winston output)
│   ├── combined.log
│   └── error.log
├── server/                      # Express.js REST API Backend Server
│   ├── database/
│   │   ├── migrations/          # PostgreSQL SQL migration files
│   │   └── seed.js              # Idempotent seed script
│   ├── src/                     # Express application source code
│   ├── .env                     # Server environment variables
│   ├── .env.example             # Server template environment config
│   ├── Dockerfile               # Node.js backend container setup
│   └── package.json             # Backend NPM dependency manifest
├── docker-compose.yml           # Multi-container orchestration config
├── LICENSE                      # MIT Open Source License
└── README.md                    # Project overview documentation
```

---

## 2. Detailed Frontend File Map (`client/src/`)

### A. Root Application Entry
- `main.jsx`: Mounts React DOM root, wraps App in `BrowserRouter` and `ThemeProvider`.
- `App.jsx`: Top-level application shell wrapped in Framer Motion `<AnimatePresence>`.
- `routes/AppRoutes.jsx`: Defines entire client router table, code-split lazy routes, fallback skeletons, and role guards.
- `routes/ProtectedRoute.jsx`: Authentication & RBAC guard for protected routes.
- `routes/PublicOnlyRoute.jsx`: Public guard redirecting logged-in users away from auth pages.

### B. State Contexts & Services
- `context/AuthContext.jsx`: Global authentication state provider.
- `context/ThemeContext.jsx`: Global dark/light theme state provider.
- `services/apiClient.js`: Axios client instance with Bearer token interceptor and 401 handler.
- `services/authService.js`: Authentication API endpoints wrapper.
- `services/studentService.js`: Student profile API calls wrapper.
- `services/mentorService.js`: Mentor directory & profile API wrapper.
- `services/availabilityService.js`: Slot management API wrapper.
- `services/bookingService.js`: Booking creation & status update API wrapper.
- `services/notificationService.js`: User notifications API wrapper.
- `services/adminService.js`: Administrator verification & user management API wrapper.

### C. Custom Hooks (`client/src/hooks/`)
- `useAuth.js`: Convenience hook returning `AuthContext`.
- `useAuthActions.js`: Auth action dispatches (login, register, logout).
- `useStudentProfile.js`: Manages student profile fetching and editing.
- `useMentorProfile.js`: Manages mentor profile fetching and editing.
- `useMentorAvailability.js`: Fetches and toggles mentor availability slots.
- `useMentorBookings.js`: Manages mentor session list and status updates.
- `useStudentBookings.js`: Manages student session bookings list.
- `useNotifications.js`: Fetches user notifications and manages read states.
- `useAdminDashboard.js`: Fetches admin metrics and pending verification queues.
- `useUserManagement.js`: Handles admin user search, role update, and account status toggles.
- `useMentorVerification.js`: Handles admin mentor approve/reject actions.
- `useTheme.js`: Convenience hook returning `ThemeContext`.
- `useFocusTrap.js`: Accessibility focus trapper for drawers and modal dialogs.

### D. UI Components (`client/src/components/`)
- `ui/Button.jsx`: Styled button component supporting variants (`primary`, `secondary`, `outline`, `ghost`, `danger`) and loading spinners.
- `ui/Drawer.jsx`: Slide-out panel component for filters and details.
- `ui/ConfirmationModal.jsx`: Modal dialog for confirming destructive actions.
- `ui/FormField.jsx`: Label, input, error message wrapper component.
- `ui/Skeleton.jsx`: Animated shimmer loading state component.
- `ui/EmptyState.jsx`: Placeholder component for empty data sets.
- `ui/PageTransition.jsx`: Animated Framer Motion page wrapper.
- `Navbar.jsx`: Global navigation header with user profile menu and theme toggle.
- `Sidebar.jsx`: Collapsible dashboard sidebar displaying role-specific navigation links.

---

## 3. Detailed Backend File Map (`server/src/`)

- `server.js`: Boots process, loads `.env`, binds Express server to port.
- `app.js`: Configures Express middleware, security headers, rate limiters, routes, Swagger UI, health check endpoints, and error handling.
- `config/supabase.js`: Initializes Supabase admin client using `SUPABASE_SERVICE_ROLE_KEY`.
- `constants/status.js`: Centralized enum definitions (`BOOKING_STATUS`, `USER_ROLES`, `USER_STATUS`).
- `controllers/`: HTTP request handlers mapping request parameters to service calls.
  - `admin.controller.js`, `auth.controller.js`, `availability.controller.js`, `booking.controller.js`, `health.controller.js`, `mentor.controller.js`, `notification.controller.js`, `student.controller.js`.
- `services/`: Business logic layer executing database queries and sending emails.
  - `admin.service.js`, `aiService.js`, `auth.service.js`, `availability.service.js`, `booking.service.js`, `mentor.service.js`, `notification.service.js`, `student.service.js`.
- `middleware/`: Express middleware handlers.
  - `auth.middleware.js`, `role.middleware.js`, `errorHandler.middleware.js`, `requestTrace.middleware.js`.
- `utils/`: Helper utilities.
  - `email.js`, `env.validator.js`, `handleSupabaseError.js`, `logger.js`, `sanitizer.js`.
- `validators/`: Input payload validation using Zod.
  - `auth.validator.js`, `availability.validator.js`, `booking.validator.js`, `mentor.validator.js`, `notification.validator.js`, `student.validator.js`.

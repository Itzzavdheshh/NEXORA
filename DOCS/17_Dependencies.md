# 17. NPM Dependency Audit & Technology Catalog

## 1. Executive Summary

NEXORA’s dependency stack is curated for production security, high performance, and minimal bundle footprint. All dependencies are locked in `package-lock.json` manifests.

---

## 2. Frontend NPM Dependency Audit (`client/package.json`)

### Core Production Dependencies

| Package | Version | Purpose & Architectural Role | Used In |
|---|---|---|---|
| `react` | `^19.1.0` | Core UI rendering engine (Functional Components & Hooks). | Entire frontend |
| `react-dom` | `^19.1.0` | DOM rendering and mounting. | `main.jsx` |
| `react-router-dom` | `^7.6.3` | Client-side SPA routing, route parameters, role guards. | `AppRoutes.jsx`, `ProtectedRoute.jsx` |
| `@tanstack/react-query` | `^5.83.0` | Server state fetching, caching, optimistic updates, refetching. | `useMentorAvailability.js`, custom hooks |
| `axios` | `^1.10.0` | HTTP transport client with Bearer token interceptor. | `apiClient.js` |
| `@supabase/supabase-js` | `^2.110.7` | Supabase auth & DB client wrapper. | `supabaseClient.js` |
| `framer-motion` | `^12.42.2` | Declarative page transitions and micro-animations. | `App.jsx`, `Button.jsx`, `motion.js` |
| `lucide-react` | `^0.525.0` | Vector icon system. | Navbar, Sidebar, EmptyState, UI elements |
| `tailwindcss` | `^3.4.17` | Utility-first styling engine. | All UI components |
| `tailwind-merge` | `^3.3.1` | Resolves conflicting Tailwind utility classes. | `cn.js` |
| `clsx` | `^2.1.1` | Conditional class string constructor. | `cn.js` |
| `date-fns` | `^4.1.0` | Date formatting and slot timing calculations. | Booking cards, calendar views |
| `react-hook-form` | `^7.60.0` | Form state management and submission handling. | Auth and profile forms |
| `zod` | `^3.25.76` | Schema validation library. | `zodForm.js` |
| `react-hot-toast` | `^2.5.2` | Toast notification alerts. | Action feedback |
| `recharts` | `^3.1.0` | Analytics charting component. | `AdminDashboardPage.jsx` |

### Development Dependencies
- `@vitejs/plugin-react` (`^4.6.0`): Vite plugin enabling Fast Refresh.
- `eslint` (`^9.30.1`) & `eslint-plugin-react-hooks`: Linting and code quality checks.
- `postcss` (`^8.5.6`) & `autoprefixer`: CSS compilation for Tailwind.

---

## 3. Backend NPM Dependency Audit (`server/package.json`)

### Core Production Dependencies

| Package | Version | Purpose & Architectural Role | Used In |
|---|---|---|---|
| `express` | `^5.2.1` | Core REST API web framework. | `app.js`, `server.js`, controllers, routes |
| `@supabase/supabase-js` | `^2.110.0` | Database client with `service_role` bypass key. | `config/supabase.js`, backend services |
| `helmet` | `^8.3.0` | Sets security headers (CSP, HSTS, X-Frame-Options). | `app.js` |
| `cors` | `^2.8.6` | Cross-Origin Resource Sharing control. | `app.js` |
| `compression` | `^1.8.1` | Gzip HTTP response body compression. | `app.js` |
| `express-rate-limit` | `^8.5.2` | IP request throttling for auth and general APIs. | `app.js` |
| `sanitizer` | Custom | Recursive HTML bracket stripping for XSS defense. | `sanitizer.js` |
| `resend` | `^6.17.2` | Transactional email delivery service. | `utils/email.js` |
| `winston` | `^3.19.0` | Multi-transport structured JSON logger. | `utils/logger.js` |
| `morgan` | `^1.11.0` | HTTP request logging middleware. | `app.js` |
| `dotenv` | `^17.4.2` | Environment variables loader. | `server.js`, `app.js` |
| `swagger-jsdoc` & `swagger-ui-express` | `^6.3.0` / `^5.0.1` | OpenAPI 3.0 API documentation generator. | `app.js` (`/api-docs`) |

### Development Dependencies
- `nodemon` (`^3.1.14`): Automatic server restart on file changes during development.

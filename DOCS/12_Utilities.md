# 12. Helper Utilities & Constants Reference

## 1. Executive Summary

Helper utilities in NEXORA encapsulate core cross-cutting concerns: logging, input sanitization, environment validation, transactional email dispatch, local storage synchronization, class merging, and database error normalization.

---

## 2. Backend Utilities (`server/src/utils/`)

### 1. `sanitizer.js` (`server/src/utils/sanitizer.js`)
- **Purpose:** Cross-Site Scripting (XSS) prevention engine.
- **Exported Functions:**
  - `sanitizeString(str)`: Accepts a string, strips all `<...>` HTML/JS brackets via regular expression `/<[^>]*>/g`, and trims whitespace.
  - `sanitizeInput(data)`: Recursive object traversal function that sanitizes strings, arrays, and nested object fields while preserving non-string types (numbers, booleans).
  - `sanitizerMiddleware(req, res, next)`: Express middleware invoking `sanitizeInput()` across `req.body`, `req.query`, and `req.params`.
- **Consumers:** Mounted globally in `app.js` prior to controller routing.

### 2. `logger.js` (`server/src/utils/logger.js`)
- **Purpose:** Structured logging engine built on **Winston**.
- **Log Levels:** `error`, `warn`, `info`, `debug`.
- **Transports:**
  - `Console`: Colorized log output for development.
  - `File`: `logs/error.log` (errors only) and `logs/combined.log` (all logs).
- **Log Format:** Timestamped JSON envelopes including `message`, `requestId`, `userId`, `status`, and `stack`.
- **Consumers:** `errorHandler.middleware.js`, `server.js`, `seed.js`, backend services.

### 3. `email.js` (`server/src/utils/email.js`)
- **Purpose:** Transactional email delivery service using the **Resend API SDK**.
- **Exported Function:** `sendEmail({ to, subject, html })`.
- **Configuration:** Reads `process.env.RESEND_API_KEY` and sets sender address to `Nexora Mentorship <onboarding@resend.dev>`.
- **Error Handling:** Logs delivery errors via `logger.error()` without throwing exceptions to parent callers.
- **Consumers:** [booking.service.js](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/server/src/services/booking.service.js), `admin.service.js`.

### 4. `env.validator.js` (`server/src/utils/env.validator.js`)
- **Purpose:** Server bootstrap configuration validation.
- **Exported Function:** `validateEnv()`.
- **Validation Rules:** Ensures `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `RESEND_API_KEY`, and `CLIENT_URL` exist in `process.env`. If any variable is missing, logs error and exits process with code 1.
- **Consumers:** `app.js` initialization.

### 5. `handleSupabaseError.js` (`server/src/utils/handleSupabaseError.js`)
- **Purpose:** Normalizes Supabase database error payloads into structured HTTP Exception objects.
- **Exported Function:** `handleSupabaseError(error, defaultMessage)`.
- **Logic:** Maps PostgreSQL error codes (e.g. `23505` unique violation -> 409 Conflict; `23503` foreign key violation -> 400 Bad Request) to appropriate status codes.

---

## 3. Frontend Utilities (`client/src/utils/`)

### 1. `cn.js` (`client/src/utils/cn.js`)
- **Purpose:** Conditional Tailwind CSS class string merger.
- **Exported Function:** `cn(...inputs)`.
- **Dependencies:** Combines `clsx` (for conditional boolean class evaluation) and `tailwind-merge` (for resolving conflicting utility classes like `px-2 px-4`).
- **Consumers:** Used across all React components (`Button.jsx`, `Drawer.jsx`, `Navbar.jsx`).

### 2. `authStorage.js` (`client/src/utils/authStorage.js`)
- **Purpose:** Encapsulates `localStorage` interactions for JWT bearer tokens and active user metadata.
- **Methods:** `getToken()`, `setToken(token)`, `clearToken()`, `getUser()`, `setUser(user)`, `clearUser()`, `clear()`.
- **Consumers:** `apiClient.js`, `AuthContext.jsx`, `useAuthActions.js`.

### 3. `zodForm.js` (`client/src/utils/zodForm.js`)
- **Purpose:** Client-side form validation helper mapping Zod schema validation errors to react component error state objects.

---

## 4. Platform Constants

### Backend Status Constants (`server/src/constants/status.js`)
- `BOOKING_STATUS`: `{ PENDING: 'pending', CONFIRMED: 'confirmed', CANCELLED: 'cancelled', COMPLETED: 'completed', REJECTED: 'rejected' }`.
- `USER_ROLES`: `{ STUDENT: 'student', MENTOR: 'mentor', ADMIN: 'admin' }`.
- `USER_STATUS`: `{ ACTIVE: 'active', INACTIVE: 'inactive', SUSPENDED: 'suspended', REJECTED: 'rejected' }`.

### Frontend Navigation Constants (`client/src/constants/navigation.js`)
- `NAV_ITEMS`: Defines sidebar and navbar links grouped by role (`STUDENT_NAV`, `MENTOR_NAV`, `ADMIN_NAV`), specifying route paths, Lucide icon components, and badge indicators.

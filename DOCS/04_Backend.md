# 04. Backend Architecture & Server Deep-Dive

## 1. Executive Technical Summary

The NEXORA backend is constructed as a RESTful application service using **Node.js (v18+)** and **Express.js (v4.19)**. The backend acts as the authoritative business engine, orchestrating validation, role-based security, state transitions, Supabase database persistence, and transactional email triggers.

### Architectural Blueprint:
- **Server Bootstrap:** [server.js](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/server/src/server.js) initializes environment loading and binds Express application to the configured TCP `PORT`.
- **Application Engine:** [app.js](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/server/src/app.js) builds the Express application instance, configures global middleware, mounts API routes under `/api/v1`, configures Swagger UI OpenAPI docs at `/api-docs`, exposes health checks (`/health`, `/ready`), and registers centralized error handling.
- **Layered Pattern:** Strict separation into Controllers (HTTP handling), Services (Database queries & business rules), Validators (Input payload validation), and Middleware (Security, telemetry, authentication, authorization).

---

## 2. Global Middleware Stack & Execution Pipeline

Incoming HTTP requests travel through an ordered pipeline of 8 global middleware layers before hitting target route controllers:

```
 Incoming Request
       │
       ▼
 [1. compression()] ──────────> Compresses HTTP responses (Gzip)
       │
       ▼
 [2. requestTrace] ───────────> Generates X-Request-ID UUID & attaches to req.id
       │
       ▼
 [3. cors(corsOptions)] ──────> Validates Origin, HTTP Methods, and Authorization headers
       │
       ▼
 [4. helmet()] ───────────────> Sets HTTP security headers (X-Frame-Options, CSP, HSTS)
       │
       ▼
 [5. morgan("dev")] ──────────> Logs incoming request method, path, status, and response latency
       │
       ▼
 [6. express.json()] ─────────> Parses JSON body payloads
       │
       ▼
 [7. sanitizerMiddleware] ────> Recursively strips malicious HTML/JS tags to eliminate XSS
       │
       ▼
 [8. rateLimiters] ───────────> Throttles IP requests (authLimiter vs apiLimiter)
       │
       ▼
  Route Controller (Protected by auth.middleware & role.middleware if applicable)
       │
       ▼
 [9. errorHandler] ───────────> Catches uncaught exceptions, logs to Winston, formats JSON response
```

### Detailed Middleware Specifications

1. **Environment Validator (`src/utils/env.validator.js`):**
   Runs prior to Express server instantiation. Checks `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `RESEND_API_KEY`, and `CLIENT_URL`. Halts process with code 1 if critical keys are missing.
2. **Request Trace Middleware (`src/middleware/requestTrace.middleware.js`):**
   Extracts `X-Request-ID` from request headers or generates a fresh `crypto.randomUUID()`. Attaches `req.id` to the request and echoes `X-Request-ID` in the response headers for microservice tracing.
3. **Global Sanitizer Middleware (`src/utils/sanitizer.js`):**
   Applies an iterative sanitizer across `req.body`, `req.query`, and `req.params`. Strips script tags, Javascript protocols, and malicious event handlers before hitting business controllers.
4. **Rate Limiters (`express-rate-limit` in `app.js`):**
   - `authLimiter`: Applied to `/api/v1/auth/*`. Restricts clients to 20 requests per 15-minute window (`AUTH_RATE_LIMIT_WINDOW`).
   - `apiLimiter`: Applied globally to `/api/v1/*`. Restricts clients to 200 requests per 15-minute window (`API_RATE_LIMIT_WINDOW`).
5. **Authentication Middleware (`src/middleware/auth.middleware.js`):**
   Extracts the Bearer JWT token from `Authorization` header, verifies it via `supabase.auth.getUser(token)`, retrieves the application user from `users` table via `auth_id`, checks account status (`status === 'active'`), and attaches user object to `req.user`.
6. **Role Authorization Middleware (`src/middleware/role.middleware.js`):**
   Higher-order middleware `authorizeRoles(...roles)` that checks `req.user.role`. Rejects unauthorized roles with `403 Access Denied`.
7. **Error Handling Middleware (`src/middleware/errorHandler.middleware.js`):**
   Four-argument Express error middleware `(err, req, res, next)`. Captures error stack, logs error details alongside `req.id` and `req.user.id` using Winston (`logger.js`), and returns a standardized JSON structure. Stack trace is included in non-production environments only.

---

## 3. Controller-Service-Validator Separation Pattern

NEXORA enforces strict domain isolation:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CONTROLLER LAYER (e.g. `src/controllers/booking.controller.js`)                        │
│ • Handles HTTP Request & Response objects.                                             │
│ • Extracts route parameters, query strings, and body payloads.                         │
│ • Invokes validator functions and delegates business operations to Service.           │
│ • Maps Service return values to HTTP Status Codes (200 OK, 201 Created, 400 Bad Req).  │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │ Passes clean DTOs / Parameters
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ SERVICE LAYER (e.g. `src/services/booking.service.js`)                                 │
│ • Pure domain logic & multi-step transaction handling.                                 │
│ • Interacts with Supabase PostgreSQL client (`src/config/supabase.js`).                │
│ • Enforces business invariants (slot overlap checks, double-booking prevention).       │
│ • Triggers asynchronous side effects (Resend transactional email dispatches).          │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │ Validates input schema
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ VALIDATOR LAYER (e.g. `src/validators/booking.validator.js`)                            │
│ • Zod-powered schema validation routines.                                              │
│ • Validates payload types, date constraints, string lengths, UUID formats.              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Centralized Logging & Telemetry Subsystem

Backend logging is managed by **Winston** in [logger.js](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/server/src/utils/logger.js):
- **Log Outputs:**
  - Console transport: Formatted colored text for local development.
  - Daily file transport: `logs/error.log` (level `error`) and `logs/combined.log` (all levels).
- **Log Envelope Structure:**
  ```json
  {
    "timestamp": "2026-07-24T02:30:00.123Z",
    "level": "error",
    "message": "Slot duration violates minimum threshold",
    "requestId": "c4b9f2e1-8890-410a-b333-876129481234",
    "userId": "usr_99812",
    "status": 400,
    "stack": "Error: Slot duration violates...\n  at availability.service.js:45"
  }
  ```

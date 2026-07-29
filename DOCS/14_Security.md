# 14. Security Architecture & Threat Mitigation

## 1. Security Design Principles

NEXORA incorporates a **Defense-in-Depth Strategy** safeguarding user identities, data privacy, and server infrastructure across multiple security layers:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                SECURITY DEFENSE LAYERS                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ LAYER 1: Transport & Network ──> HTTPS / TLS Encryption, Strict CORS Policies          │
│ LAYER 2: HTTP Perimeter ───────> Helmet Security Headers, Rate Limiters (20/15min)     │
│ LAYER 3: Payload Hygiene ──────> Recursive XSS Input Sanitizer, Zod Schema Validator  │
│ LAYER 4: Auth & Identity ──────> Supabase JWT Cryptographic Verification, Passwords     │
│ LAYER 5: Authorization (RBAC) ─> Express Middleware Role Enforcement ('student'|'admin')│
│ LAYER 6: Persistence Layer ────> PostgreSQL Row Level Security (RLS), Parameterized SQL│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. OWASP Top 10 Vulnerability Mitigation Analysis

| OWASP Risk | Platform Threat | NEXORA Mitigation & Implementation | Source Evidence |
|---|---|---|---|
| **A01: Broken Access Control** | Unauthorized user attempting to update other users' bookings or access admin endpoints. | `auth.middleware.js` verifies identity; `role.middleware.js` enforces RBAC; PostgreSQL RLS policies restrict direct database access. | `002_enable_rls.sql`, `role.middleware.js` |
| **A02: Cryptographic Failures** | Interception of tokens or exposed passwords. | Supabase Auth handles password hashing (Bcrypt/Argon2); JWT tokens transmitted exclusively over HTTPS; secrets validated on boot by `env.validator.js`. | `env.validator.js` |
| **A03: Injection (SQL & XSS)** | Malicious HTML/JS tags in profile bios or notes; SQL injection in queries. | SQL: Supabase JS client uses parameterized queries. XSS: `sanitizerMiddleware` strips HTML brackets (`/<[^>]*>/g`) across `req.body`, `query`, `params`. | `sanitizer.js` |
| **A04: Insecure Design** | Double-booking slots or booking own sessions. | Domain logic enforces state machine transitions (`ALLOWED_TRANSITIONS`) and atomic slot updates. | `booking.service.js` |
| **A05: Security Misconfiguration** | Exposure of stack traces, default passwords, missing headers. | `helmet()` sets security headers; `errorHandler.middleware.js` suppresses stack traces in production (`process.env.NODE_ENV === 'production'`). | `errorHandler.middleware.js` |
| **A07: Identification & Auth Failures** | Brute-force credential guessing. | `authLimiter` limits authentication attempts to 20 per 15-minute window per IP. | `app.js` |
| **A08: Software & Data Integrity** | Compromised NPM packages. | Lockfiles (`package-lock.json`), GitHub Actions `security.yml` vulnerability scanner. | `.github/workflows/security.yml` |

---

## 3. Detailed Input Sanitization Engine (`sanitizer.js`)

To defeat Cross-Site Scripting (XSS), every request passes through recursive sanitization:

```javascript
const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return str.replace(/<[^>]*>/g, "").trim();
};

const sanitizeInput = (data) => {
  if (!data) return data;
  if (typeof data === "string") return sanitizeString(data);
  if (Array.isArray(data)) return data.map(sanitizeInput);
  if (typeof data === "object") {
    const sanitized = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitized[key] = sanitizeInput(data[key]);
      }
    }
    return sanitized;
  }
  return data;
};
```
*Effect:* Any attempt to inject `<script>alert('xss')</script>` is transformed to `alert('xss')` before reaching controllers or database storage.

---

## 4. Row Level Security Policy Verification

Even if an attacker obtains a public Supabase Anon key, Row Level Security policies enforce strict isolation:

```sql
-- Example RLS Policy for Bookings:
CREATE POLICY "Allow users to read their own bookings"
ON public.bookings FOR SELECT TO authenticated
USING (
  student_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  OR mentor_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  OR (SELECT role FROM public.users WHERE auth_id = auth.uid()) = 'admin'
);
```
*Effect:* Authenticated students can only read bookings where they are the student; mentors can only read bookings where they are the mentor. Admins possess global view rights.

# 07. Authentication, Authorization & Security Lifecycle

## 1. Authentication Architecture Overview

NEXORA implements a dual-tier security protocol utilizing **Supabase Authentication Engine** for token issuance and cryptographic verification, coupled with custom Express **JWT Authorization Middleware** and **Role-Based Access Control (RBAC)**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              AUTHENTICATION & RBAC FLOW                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. USER CREATION / LOGIN                                                               │
│    Client (LoginPage / RegisterPage) ──> POST /api/v1/auth/login                       │
│    Express (auth.service.js) ──> Supabase Auth API (signInWithPassword)                │
│    Supabase ──> Returns Supabase JWT Access Token                                      │
│    Express ──> Fetches App User record from `public.users` (joins Role & Verification) │
│    Express ──> Responds HTTP 200 { user, token }                                       │
│    Client ──> Stores JWT in `localStorage` via `authStorage.js`                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. AUTHORIZED API REQUEST                                                              │
│    Client ──> Axios Interceptor (`apiClient.js`) attaches `Authorization: Bearer <token>`│
│    Express ──> `auth.middleware.js` verifies token via `supabase.auth.getUser(token)`  │
│    Express ──> Checks `users` table: status must equal 'active'                         │
│    Express ──> `role.middleware.js` enforces `authorizeRoles('student'|'mentor'|'admin')` │
│    Controller ──> Executes operation with `req.user` context                           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Token Lifecycle & Storage Mechanics

### Frontend Token Management (`client/src/utils/authStorage.js`)
- **Key Identifiers:**
  - `nexora.accessToken`: Stores raw Supabase JWT string.
  - `nexora.user`: Stores stringified user identity metadata.
- **Security Operations:**
  - `getToken()`: Retrieves Bearer token for header injection.
  - `setUser(user)` / `getUser()`: Syncs session profile state with fallback handling for corrupted JSON.
  - `clear()`: Atomically removes both keys upon logout or authentication failure.

### Interceptor-Driven Session Restoration & Invalidation (`client/src/services/apiClient.js`)
- **Request Interceptor:** Reads `authStorage.getToken()`. If present, injects `config.headers.Authorization = 'Bearer ' + token`.
- **Response Interceptor:** Intercepts HTTP `401 Unauthorized` responses. Upon receiving 401:
  1. Invokes `authStorage.clear()`.
  2. Dispatches global DOM event `window.dispatchEvent(new Event("nexora:auth-expired"))`.
  3. `AuthContext.jsx` catches event and resets React `user` state to `null`, forcing automatic redirect to `/login`.

---

## 3. Server-Side Authentication Middleware (`server/src/middleware/auth.middleware.js`)

The `authenticate` middleware guards all protected REST routes:

```javascript
const authenticate = async (req, res, next) => {
  // 1. Extract Bearer token from HTTP Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authorization token is required." });
  }
  const token = authHeader.split(" ")[1];

  // 2. Validate token against Supabase Auth Engine
  const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
  if (error || !authUser) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }

  // 3. Resolve internal application user from `public.users` database table
  const { data: appUser, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", authUser.id)
    .single();

  if (profileError || !appUser) {
    return res.status(404).json({ success: false, message: "User profile not found." });
  }

  // 4. Enforce account status invariant
  if (appUser.status !== "active") {
    return res.status(403).json({
      success: false,
      message: `Access denied. Your account status is currently ${appUser.status}.`
    });
  }

  // 5. Attach application user context to Express Request object
  req.user = appUser;
  next();
};
```

---

## 4. Role-Based Access Control (RBAC) Subsystem (`server/src/middleware/role.middleware.js`)

Authorization is enforced using the `authorizeRoles(...roles)` factory function:

```javascript
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not allowed to access this resource."
      });
    }
    next();
  };
};
```

### Role Matrix & System Permissions:

| Endpoint Resource | Allowed Roles | Enforced Policy |
|---|---|---|
| `POST /api/v1/student/*` | `student` | Students can manage only their own profiles and bookings |
| `POST /api/v1/mentor/availability` | `mentor` | Mentors can create and delete their availability slots |
| `PATCH /api/v1/bookings/:id/status` | `mentor`, `student`, `admin` | Participants or Admins can update booking state |
| `GET /api/v1/admin/*` | `admin` | Only administrators can access pending mentor verifications |
| `PATCH /api/v1/admin/mentors/:id/verify` | `admin` | Admins verify mentor accounts (`is_verified = true`) |

---

## 5. Security Environment Verification (`server/src/utils/env.validator.js`)

On server startup, `validateEnv()` verifies that all cryptographic keys and URLs exist before listening for traffic:

```javascript
const requiredEnvVars = [
  "PORT",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "JWT_SECRET",
  "RESEND_API_KEY",
  "CLIENT_URL"
];
```
If any required variable is missing, the backend process logs an error via Winston and exits immediately with process code 1.

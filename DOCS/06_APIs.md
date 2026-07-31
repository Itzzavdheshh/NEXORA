# 06. API Reference & Endpoint Specification

## 1. API Architecture & Standard Protocols

NEXORA exposes a RESTful API versioned under the `/api/v1` namespace. All data exchanges use JSON formatting (`Content-Type: application/json`).

### Standard Response Envelopes

#### A. Success Envelope (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... }
}
```

#### B. Error Envelope (`400`, `401`, `403`, `404`, `429`, `500`)
```json
{
  "success": false,
  "message": "Detailed human-readable error description.",
  "requestId": "c4b9f2e1-8890-410a-b333-876129481234"
}
```

---

## 2. Exhaustive API Endpoint Reference Matrix

---

### Module 1: System Health & Probes (`/api/v1/health`)

#### 1. Liveness Probe
- **Method:** `GET` | **URL:** `/health`
- **Controller:** [health.controller.js](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/server/src/controllers/health.controller.js)
- **Middleware:** None (Public)
- **Database Access:** None
- **Response:** `200 OK` `{ "status": "UP", "timestamp": "2026-07-24T02:00:00.000Z" }`

#### 2. Readiness Probe
- **Method:** `GET` | **URL:** `/ready`
- **Controller:** Inline handler in `app.js`
- **Database Access:** Executes `SELECT id FROM users LIMIT 1` via Supabase.
- **Response:** `200 OK` `{ "status": "READY", "database": "connected" }` or `503 Service Unavailable`.

---

### Module 2: Authentication & Session (`/api/v1/auth`)

#### 1. User Registration
- **Method:** `POST` | **URL:** `/api/v1/auth/register`
- **Controller:** `auth.controller.js -> register`
- **Service:** `auth.service.js -> registerUser`
- **Middleware:** `authLimiter`, `sanitizerMiddleware`
- **Validation:** `validateRegister` (`auth.validator.js` checks `email`, `password` >= 6 chars, `full_name`, `role` in `student|mentor`)
- **Database Tables:** `auth.users`, `public.users`, `student_profiles` or `mentor_profiles`
- **Request Payload:**
  ```json
  {
    "email": "student1@nexora.com",
    "password": "Password123!",
    "full_name": "Avdhesh Dadhich",
    "role": "student"
  }
  ```
- **Response Payload:** `201 Created`
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": {
      "user": { "id": "usr_123", "email": "student1@nexora.com", "role": "student" },
      "token": "eyJhbGciOi..."
    }
  }
  ```
- **Frontend Caller:** [authService.js -> register()](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/client/src/services/authService.js) from `RegisterPage.jsx`.

#### 2. User Login
- **Method:** `POST` | **URL:** `/api/v1/auth/login`
- **Controller:** `auth.controller.js -> login`
- **Service:** `auth.service.js -> loginUser`
- **Middleware:** `authLimiter`, `sanitizerMiddleware`
- **Validation:** `validateLogin` (`email`, `password`)
- **Database Tables:** `auth.users`, `public.users`
- **Response Payload:** `200 OK` `{ "success": true, "data": { "user": {...}, "token": "..." } }`
- **Frontend Caller:** `authService.js -> login()` from `LoginPage.jsx`.

#### 3. Get Current User (`/me`)
- **Method:** `GET` | **URL:** `/api/v1/auth/me`
- **Middleware:** `authenticate` (`auth.middleware.js`)
- **Database Tables:** `public.users`, `student_profiles` or `mentor_profiles`
- **Response Payload:** `200 OK` `{ "success": true, "data": { "user": {...}, "profile": {...} } }`
- **Frontend Caller:** `AuthContext.jsx` initialization.

#### 4. Change Password
- **Method:** `POST` | **URL:** `/api/v1/auth/change-password`
- **Middleware:** `authenticate`
- **Request Payload:** `{ "oldPassword": "...", "newPassword": "..." }`
- **Response Payload:** `200 OK` `{ "success": true, "message": "Password updated successfully." }`

#### 5. Logout User
- **Method:** `POST` | **URL:** `/api/v1/auth/logout`
- **Middleware:** `authenticate`
- **Response Payload:** `200 OK` `{ "success": true, "message": "Logged out successfully." }`

---

### Module 3: Student Management (`/api/v1/student`)

#### 1. Get Student Profile
- **Method:** `GET` | **URL:** `/api/v1/student/profile`
- **Middleware:** `authenticate`, `authorizeRoles('student', 'admin')`
- **Database Tables:** `public.student_profiles`, `public.users`
- **Response Payload:** `200 OK` `{ "success": true, "data": { ...studentProfile } }`
- **Frontend Caller:** [studentService.js -> getProfile()](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/client/src/services/studentService.js) from `useStudentProfile.js`.

#### 2. Create / Update Student Profile
- **Method:** `POST` / `PUT` | **URL:** `/api/v1/student/profile`
- **Middleware:** `authenticate`, `authorizeRoles('student')`
- **Validation:** `validateStudentProfile` (`college`, `degree`, `branch`, `graduation_year`, `bio`, `skills`)
- **Database Tables:** `public.student_profiles`
- **Response Payload:** `200 OK` `{ "success": true, "data": updatedProfile }`

#### 3. Get Student Dashboard Analytics
- **Method:** `GET` | **URL:** `/api/v1/student/dashboard`
- **Middleware:** `authenticate`, `authorizeRoles('student')`
- **Database Tables:** `bookings`, `notifications`, `users`
- **Response Payload:** `200 OK` returns total bookings count, upcoming bookings list, and recent notifications.

---

### Module 4: Mentor Management (`/api/v1/mentor` & `/api/v1/mentors`)

#### 1. Get Public Mentor Directory
- **Method:** `GET` | **URL:** `/api/v1/mentors`
- **Middleware:** `apiLimiter` (Public / Authenticated)
- **Query Params:** `search`, `expertise`, `page`, `limit`
- **Database Tables:** `public.users`, `public.mentor_profiles`
- **Response Payload:** `200 OK` returns array of verified mentors with active availability slots.
- **Frontend Caller:** [mentorService.js -> getAllMentors()](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/client/src/services/mentorService.js) from `ExploreMentorsPage.jsx`.

#### 2. Get Mentor Profile by ID
- **Method:** `GET` | **URL:** `/api/v1/mentors/:id`
- **Database Tables:** `users`, `mentor_profiles`, `availability_slots`
- **Response Payload:** `200 OK` returns mentor bio, experience, skills, and open availability slots.

#### 3. Update Mentor Profile
- **Method:** `PUT` | **URL:** `/api/v1/mentor/profile`
- **Middleware:** `authenticate`, `authorizeRoles('mentor')`
- **Validation:** `validateMentorProfile` (`designation`, `company`, `bio`, `expertise`, `experience`, `hourly_rate`)
- **Database Tables:** `public.mentor_profiles`

---

### Module 5: Slot Availability (`/api/v1/availability`)

#### 1. Create Availability Slot
- **Method:** `POST` | **URL:** `/api/v1/availability`
- **Middleware:** `authenticate`, `authorizeRoles('mentor')`
- **Validation:** `validateAvailabilitySlot` (`day_of_week`, `start_time`, `end_time`)
- **Database Tables:** `public.availability_slots`
- **Response Payload:** `201 Created`

#### 2. Get Mentor Availability Slots
- **Method:** `GET` | **URL:** `/api/v1/availability/mentor/:mentorId`
- **Database Tables:** `public.availability_slots`

#### 3. Delete Availability Slot
- **Method:** `DELETE` | **URL:** `/api/v1/availability/:id`
- **Middleware:** `authenticate`, `authorizeRoles('mentor', 'admin')`

---

### Module 6: Booking Management (`/api/v1/bookings`)

#### 1. Create Booking Request
- **Method:** `POST` | **URL:** `/api/v1/bookings`
- **Middleware:** `authenticate`, `authorizeRoles('student')`
- **Validation:** `validateBooking` (`mentor_id`, `booking_date`, `start_time`, `end_time`, `notes`)
- **Database Tables:** `public.bookings`, `public.availability_slots`, `public.notifications`
- **Side Effects:** Triggers Resend email to mentor notifying them of a new booking request.
- **Frontend Caller:** [bookingService.js -> createBooking()](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/client/src/services/bookingService.js).

#### 2. Update Booking Status (Accept / Reject / Cancel / Complete)
- **Method:** `PATCH` | **URL:** `/api/v1/bookings/:id/status`
- **Middleware:** `authenticate`, `authorizeRoles('mentor', 'student', 'admin')`
- **Request Payload:** `{ "status": "confirmed" | "rejected" | "cancelled" | "completed" }`
- **Database Tables:** `public.bookings`, `public.notifications`
- **Side Effects:** Triggers Resend email notification to student.

---

### Module 7: Notifications (`/api/v1/notifications`)

#### 1. Get User Notifications
- **Method:** `GET` | **URL:** `/api/v1/notifications`
- **Middleware:** `authenticate`
- **Response Payload:** `200 OK` returns list of notifications for `req.user.id`.

#### 2. Mark Notification as Read
- **Method:** `PATCH` | **URL:** `/api/v1/notifications/:id/read`
- **Middleware:** `authenticate`

---

### Module 8: Admin Management (`/api/v1/admin`)

#### 1. Get Pending Mentor Verifications
- **Method:** `GET` | **URL:** `/api/v1/admin/mentors/pending`
- **Middleware:** `authenticate`, `authorizeRoles('admin')`
- **Database Tables:** `users`, `mentor_profiles`

#### 2. Verify or Reject Mentor
- **Method:** `PATCH` | **URL:** `/api/v1/admin/mentors/:id/verify`
- **Middleware:** `authenticate`, `authorizeRoles('admin')`
- **Request Payload:** `{ "is_verified": true | false, "status": "active" | "rejected" }`
- **Database Tables:** `public.users`

#### 3. User Management Operations
- **Method:** `GET` / `PATCH` / `DELETE` | **URL:** `/api/v1/admin/users`
- **Middleware:** `authenticate`, `authorizeRoles('admin')`

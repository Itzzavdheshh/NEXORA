# 10. React UI Components & Layout Catalog

## 1. Component Architecture & Hierarchy Overview

NEXORA’s frontend UI component tree follows an atomic design structure, separating generic UI primitives (`client/src/components/ui/`) from domain-specific cards, modals, navigation headers, and drawers.

```
App Shell (App.jsx)
 └── AppRoutes (routes/AppRoutes.jsx)
      ├── AuthLayout (layouts/AuthLayout.jsx)
      │    └── LoginPage / RegisterPage / ForgotPasswordPage
      └── DashboardLayout (layouts/DashboardLayout.jsx)
           ├── Navbar (components/Navbar.jsx)
           ├── Sidebar (components/Sidebar.jsx)
           └── Page Content (Lazy Loaded)
                ├── Student Views (ExploreMentorsPage, StudentBookingsPage, etc.)
                ├── Mentor Views (MentorAvailabilityPage, MentorBookingsPage, etc.)
                └── Admin Views (AdminDashboardPage, MentorVerificationPage, UserManagementPage)
```

---

## 2. Shared Atomic UI Primitives (`client/src/components/ui/`)

### 1. `Button` (`components/ui/Button.jsx`)
- **Purpose:** Primary interactive button supporting Framer Motion spring micro-animations, loading spinners, and variant styling.
- **Props:**
  - `children`: ReactNode — Button text or icon elements.
  - `variant`: `'primary' | 'secondary' | 'danger' | 'ghost' | 'success'` (default: `'primary'`).
  - `size`: `'sm' | 'md' | 'lg'` (default: `'md'`).
  - `loading`: Boolean (default: `false`) — Displays `lucide-react` `<Loader2>` spinner.
  - `disabled`: Boolean — Disables interaction and opacity.
  - `type`: `'button' | 'submit' | 'reset'`.
  - `className`: String — Additional Tailwind utility classes merged via `cn()`.
- **Hooks Used:** None.
- **Animations:** `whileHover={{ y: -1 }}`, `whileTap={{ scale: 0.97 }}`.

### 2. `Drawer` (`components/ui/Drawer.jsx`)
- **Purpose:** Accessible right-side slide-out drawer panel used for filters, booking drawers, and verification views.
- **Props:** `isOpen` (Boolean), `onClose` (Function), `title` (String), `children` (ReactNode).
- **Hooks Used:** `useFocusTrap` (traps tab navigation), custom keydown listener for `Escape` key.
- **Parent:** Page views (`UserManagementPage`, `MentorVerificationPage`, `MentorBookingsPage`).

### 3. `ConfirmationModal` (`components/ui/ConfirmationModal.jsx`)
- **Purpose:** Accessible modal dialog prompting user confirmation before destructive or state-changing actions (e.g. slot deletion, booking rejection).
- **Props:** `isOpen` (Boolean), `onClose` (Function), `onConfirm` (Function), `title` (String), `message` (String), `confirmText` (String), `loading` (Boolean).

### 4. `FormField` (`components/ui/FormField.jsx`)
- **Purpose:** Form input wrapper displaying label text, required indicators, input children, and validation error messages.
- **Props:** `label` (String), `error` (String), `required` (Boolean), `children` (ReactNode).

### 5. `Skeleton` (`components/ui/Skeleton.jsx`)
- **Purpose:** Animated shimmer placeholder component rendered during asynchronous data loading states.
- **Props:** `className` (String).

### 6. `EmptyState` (`components/ui/EmptyState.jsx`)
- **Purpose:** Visual placeholder rendered when list collections (bookings, slots, search results) return empty.
- **Props:** `icon` (LucideIcon), `title` (String), `description` (String), `action` (ReactNode).

### 7. `AvatarSelector` (`components/profile/AvatarSelector.jsx`)
- **Purpose:** Interactive avatar selection grid allowing students and mentors to pick profile photos from curated presets.

---

## 3. Top Navigation & Layout Components

### 1. `Navbar` (`components/Navbar.jsx`)
- **Purpose:** Global application header pinned at top of dashboard views.
- **Features:**
  - Displays NEXORA logo branding.
  - Theme toggle switch (Dark/Light mode via `useTheme()`).
  - Unread Notification Badge Counter with drop-down preview card via `useNotifications()`.
  - Authenticated user avatar menu with dropdown options for Profile, Settings, and Logout.
- **Parent Layout:** `DashboardLayout.jsx`.

### 2. `Sidebar` (`components/Sidebar.jsx`)
- **Purpose:** Left-hand navigation bar dynamically rendering links based on active user role (`STUDENT`, `MENTOR`, `ADMIN`).
- **Navigation Schemes:**
  - **Student Links:** Dashboard (`/student/dashboard`), Explore Mentors (`/student/explore`), My Bookings (`/student/bookings`), Notifications (`/student/notifications`), Profile (`/student/profile`).
  - **Mentor Links:** Dashboard (`/mentor/dashboard`), Availability (`/mentor/availability`), Bookings (`/mentor/bookings`), Notifications (`/mentor/notifications`), Profile (`/mentor/profile`).
  - **Admin Links:** Overview (`/admin/dashboard`), Verify Mentors (`/admin/verify-mentors`), User Management (`/admin/users`), Notifications (`/admin/notifications`).

---

## 4. Domain Feature Components

### 1. `BookingModal` (`components/bookings/BookingModal.jsx`)
- **Purpose:** Interactive slot booking modal launched from `StudentMentorProfilePage.jsx`.
- **Inputs:** Session meeting type, agenda notes, slot confirmation.
- **Actions:** Calls `bookingService.createBooking()` and invalidates booking queries.

### 2. `NotificationCard` (`components/notifications/NotificationCard.jsx`)
- **Purpose:** Renders individual notification alert items with unread indicators and timestamp formatting.

### 3. `VerificationDrawer` (`pages/admin/verification/VerificationDrawer.jsx`)
- **Purpose:** Slide-out drawer displaying detailed mentor background (LinkedIn, bio, company, experience) for admin audit and approval/rejection actions.

### 4. `UserDrawer` (`pages/admin/users/UserDrawer.jsx`)
- **Purpose:** Admin drawer for modifying user role, changing account status (`active`, `suspended`), or viewing user activity logs.

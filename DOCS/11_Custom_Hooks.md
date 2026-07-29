# 11. Custom React Hooks Reference

## 1. Executive Summary

NEXORA’s frontend UI components decouple data fetching and mutation logic into custom React hooks powered by **TanStack React Query** (for cache management, optimistic updates, and query invalidation) and custom state primitives.

---

## 2. Exhaustive Custom Hook Matrix (13 Hooks)

### 1. `useAuth()` (`client/src/hooks/useAuth.js`)
- **Purpose:** Convenience hook providing access to `AuthContext`.
- **Returns:** `{ user, loading, error, login, register, logout, refreshProfile }`.
- **Consumers:** Used across `Navbar.jsx`, `Sidebar.jsx`, `ProtectedRoute.jsx`, `LoginPage.jsx`, `RegisterPage.jsx`.

### 2. `useAuthActions()` (`client/src/hooks/useAuthActions.js`)
- **Purpose:** Encapsulates asynchronous authentication mutations with `react-hot-toast` notification feedback.
- **Exposed Mutations:**
  - `loginMutation`: Executes login and triggers toast notification on success/error.
  - `registerMutation`: Handles account registration workflow.
  - `logoutMutation`: Executes session cleanup and route redirection.

### 3. `useStudentProfile()` (`client/src/hooks/useStudentProfile.js`)
- **Purpose:** Fetches, caches, and updates the student academic profile.
- **React Query Key:** `["studentProfile"]`.
- **State & Derived Values:** `profile`, `isLoading`, `isUpdating`, `updateProfile`.
- **API Service:** [studentService.js](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/client/src/services/studentService.js).
- **Consumers:** `StudentProfilePage.jsx`, `StudentDashboardPage.jsx`.

### 4. `useMentorProfile()` (`client/src/hooks/useMentorProfile.js`)
- **Purpose:** Fetches and updates mentor profile credentials (hourly rate, company, bio, expertise array).
- **React Query Key:** `["mentorProfile"]`.
- **State & Mutations:** `profile`, `updateProfileMutation`, `isUpdating`.
- **API Service:** [mentorService.js](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/client/src/services/mentorService.js).
- **Consumers:** `MentorProfilePage.jsx`, `MentorDashboardPage.jsx`.

### 5. `useMentorAvailability()` (`client/src/hooks/useMentorAvailability.js`)
- **Purpose:** Comprehensive availability slot management engine supporting client-side filtering, sorting, and optimistic UI mutations.
- **React Query Key:** `["availability"]`.
- **Optimistic Mutations:**
  - `createSlot`: Creates slot and invalidates `["availability"]`.
  - `updateSlot`: Optimistically modifies slot state in cache using `onMutate`, rolling back on error via `onError`.
  - `deleteSlot`: Optimistically removes slot from query cache before server response returns.
- **Returned State:** `{ slots, filteredSlots, search, setSearch, dayFilter, setDayFilter, statusFilter, setStatusFilter, createSlot, updateSlot, deleteSlot, isLoading }`.
- **Consumers:** [MentorAvailabilityPage.jsx](file:///c:/Users/itzza/OneDrive/Desktop/NEXORA/client/src/pages/mentor/MentorAvailabilityPage.jsx).

### 6. `useMentorBookings()` (`client/src/hooks/useMentorBookings.js`)
- **Purpose:** Manages mentor's incoming booking requests, status filtering (`all`, `pending`, `confirmed`, `cancelled`, `completed`), and status transition actions.
- **React Query Key:** `["mentorBookings"]`.
- **Optimistic Mutations:** `updateStatus` (mutates booking status to `confirmed`, `cancelled`, `completed` with toast alerts and cache refetch).
- **Consumers:** `MentorBookingsPage.jsx`, `MentorDashboardPage.jsx`.

### 7. `useStudentBookings()` (`client/src/hooks/useStudentBookings.js`)
- **Purpose:** Fetches student's session bookings history and exposes cancellation action.
- **React Query Key:** `["studentBookings"]`.
- **State & Operations:** `bookings`, `filteredBookings`, `cancelBookingMutation`, `isLoading`.
- **Consumers:** `StudentBookingsPage.jsx`, `StudentDashboardPage.jsx`.

### 8. `useNotifications()` (`client/src/hooks/useNotifications.js`)
- **Purpose:** Handles user notification streams, unread count computation, and mark-as-read updates.
- **React Query Key:** `["notifications"]`.
- **Derived Values:** `unreadCount` (computed via `notifications.filter(n => !n.is_read).length`).
- **Consumers:** `Navbar.jsx`, `StudentNotificationsPage.jsx`, `MentorNotificationsPage.jsx`, `AdminNotificationsPage.jsx`.

### 9. `useAdminDashboard()` (`client/src/hooks/useAdminDashboard.js`)
- **Purpose:** Aggregates platform-wide administrative statistics (total students, total mentors, pending verifications, total sessions booked).
- **React Query Key:** `["adminDashboard"]`.
- **Consumers:** `AdminDashboardPage.jsx`.

### 10. `useUserManagement()` (`client/src/hooks/useUserManagement.js`)
- **Purpose:** Administrative user management hook providing user list searching, role filtering, status toggling (`active` <-> `suspended`), and role updates.
- **React Query Key:** `["adminUsers"]`.
- **Consumers:** `UserManagementPage.jsx`.

### 11. `useMentorVerification()` (`client/src/hooks/useMentorVerification.js`)
- **Purpose:** Administrative verification workflow hook managing pending mentor queue and approval/rejection mutations.
- **React Query Key:** `["pendingMentors"]`.
- **Mutations:** `verifyMentor({ mentorId, is_verified, status })`.
- **Consumers:** `MentorVerificationPage.jsx`.

### 12. `useTheme()` (`client/src/hooks/useTheme.js`)
- **Purpose:** Returns `ThemeContext` object `{ theme, toggleTheme, isDark }`.
- **Consumers:** `Navbar.jsx`, `SettingsPage.jsx`.

### 13. `useFocusTrap()` (`client/src/hooks/useFocusTrap.js`)
- **Purpose:** Accessibility hook trapping Tab key focus inside modal dialogs and slide-out drawers while open.
- **Parameters:** `(ref, isOpen)`.
- **Consumers:** `Drawer.jsx`, `ConfirmationModal.jsx`, `BookingModal.jsx`.

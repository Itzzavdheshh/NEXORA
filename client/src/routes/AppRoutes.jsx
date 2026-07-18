import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { USER_ROLES } from "../constants/app";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { NotFoundPage } from "../pages/shared/NotFoundPage";
import { PrivacyPolicyPage } from "../pages/shared/PrivacyPolicyPage";
import { TermsOfServicePage } from "../pages/shared/TermsOfServicePage";
import { Skeleton } from "../components/ui/Skeleton";

const StudentDashboardPage = lazy(() => import("../pages/student/StudentDashboardPage"));
const StudentProfilePage = lazy(() => import("../pages/student/StudentProfilePage"));
const StudentBookingsPage = lazy(() => import("../pages/student/StudentBookingsPage"));
const StudentNotificationsPage = lazy(() => import("../pages/student/StudentNotificationsPage"));
const ExploreMentorsPage = lazy(() => import("../pages/student/ExploreMentorsPage"));
const StudentMentorProfilePage = lazy(() => import("../pages/student/StudentMentorProfilePage"));

const MentorDashboardPage = lazy(() => import("../pages/mentor/MentorDashboardPage"));
const MentorAvailabilityPage = lazy(() => import("../pages/mentor/MentorAvailabilityPage"));
const MentorProfilePage = lazy(() => import("../pages/mentor/MentorProfilePage"));
const MentorBookingsPage = lazy(() => import("../pages/mentor/MentorBookingsPage"));
const MentorNotificationsPage = lazy(() => import("../pages/mentor/MentorNotificationsPage"));

const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage"));
const MentorVerificationPage = lazy(() => import("../pages/admin/MentorVerificationPage"));
const UserManagementPage = lazy(() => import("../pages/admin/UserManagementPage"));
const AdminNotificationsPage = lazy(() => import("../pages/admin/AdminNotificationsPage"));
const SettingsPage = lazy(() => import("../pages/shared/SettingsPage"));
const StyleGuidePage = import.meta.env.DEV ? lazy(() => import("../pages/StyleGuide")) : null;

function RouteFallback() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Skeleton className="h-56 w-full" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-36 w-full" />
        ))}
      </div>
    </div>
  );
}

function LazyRoute({ children }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

export default function AppRoutes({ location }) {
  return (
    <Routes location={location}>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]} />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/student/dashboard"
            element={
              <LazyRoute>
                <StudentDashboardPage />
              </LazyRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <LazyRoute>
                <StudentProfilePage />
              </LazyRoute>
            }
          />
          <Route
            path="/student/bookings"
            element={
              <LazyRoute>
                <StudentBookingsPage />
              </LazyRoute>
            }
          />
          <Route
            path="/student/notifications"
            element={
              <LazyRoute>
                <StudentNotificationsPage />
              </LazyRoute>
            }
          />
          <Route
            path="/student/explore"
            element={
              <LazyRoute>
                <ExploreMentorsPage />
              </LazyRoute>
            }
          />
          <Route
            path="/student/mentors/:id"
            element={
              <LazyRoute>
                <StudentMentorProfilePage />
              </LazyRoute>
            }
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.MENTOR]} />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/mentor/dashboard"
            element={
              <LazyRoute>
                <MentorDashboardPage />
              </LazyRoute>
            }
          />
          <Route
            path="/mentor/availability"
            element={
              <LazyRoute>
                <MentorAvailabilityPage />
              </LazyRoute>
            }
          />
          <Route
            path="/mentor/bookings"
            element={
              <LazyRoute>
                <MentorBookingsPage />
              </LazyRoute>
            }
          />
          <Route
            path="/mentor/profile"
            element={
              <LazyRoute>
                <MentorProfilePage />
              </LazyRoute>
            }
          />
          <Route
            path="/mentor/notifications"
            element={
              <LazyRoute>
                <MentorNotificationsPage />
              </LazyRoute>
            }
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <LazyRoute>
                <AdminDashboardPage />
              </LazyRoute>
            }
          />
          <Route
            path="/admin/verify-mentors"
            element={
              <LazyRoute>
                <MentorVerificationPage />
              </LazyRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <LazyRoute>
                <AdminNotificationsPage />
              </LazyRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <LazyRoute>
                <UserManagementPage />
              </LazyRoute>
            }
          />
        </Route>
      </Route>


      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/settings"
            element={
              <LazyRoute>
                <SettingsPage />
              </LazyRoute>
            }
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms"   element={<TermsOfServicePage />} />
      {import.meta.env.DEV && StyleGuidePage ? (
        <Route
          path="/style-guide"
          element={
            <LazyRoute>
              <StyleGuidePage />
            </LazyRoute>
          }
        />
      ) : null}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

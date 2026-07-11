import { Navigate, Outlet, useLocation } from "react-router-dom";
import { DEFAULT_AUTH_REDIRECT, ROLE_HOME } from "../constants/app";
import { useAuth } from "../hooks/useAuth";
import { Skeleton } from "../components/ui/Skeleton";

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoadingSession, role } = useAuth();
  const location = useLocation();

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-premium-radial p-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-[70vh] w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={DEFAULT_AUTH_REDIRECT} state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && role && !allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role] || "/"} replace />;
  }

  return <Outlet />;
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { DEFAULT_AUTH_REDIRECT, ROLE_HOME } from "../constants/app";
import { useAuth } from "../hooks/useAuth";
import { Skeleton } from "../components/ui/Skeleton";

const LOG = (...args) => console.log("[NEXORA-PROTECTED-ROUTE]", ...args);

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoadingSession, role } = useAuth();
  const location = useLocation();

  LOG("render — pathname:", location.pathname);
  LOG("isAuthenticated:", isAuthenticated, "isLoadingSession:", isLoadingSession, "role:", role);
  LOG("allowedRoles:", allowedRoles);

  if (isLoadingSession) {
    LOG("→ showing skeleton (loading)");
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
    LOG("→ NOT authenticated — redirecting to /login");
    return <Navigate to={DEFAULT_AUTH_REDIRECT} state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && role && !allowedRoles.includes(role)) {
    LOG("→ role mismatch — redirecting to:", ROLE_HOME[role] || "/");
    return <Navigate to={ROLE_HOME[role] || "/"} replace />;
  }

  LOG("→ authenticated & role OK — rendering Outlet");
  return <Outlet />;
}

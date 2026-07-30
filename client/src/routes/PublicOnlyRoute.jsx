import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROLE_HOME } from "../constants/app";
import { useAuth } from "../hooks/useAuth";

const LOG = (...args) => console.log("[NEXORA-PUBLIC-ONLY-ROUTE]", ...args);

export function PublicOnlyRoute() {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  LOG("render — pathname:", location.pathname, "isAuthenticated:", isAuthenticated, "role:", role);

  if (isAuthenticated) {
    const target = ROLE_HOME[role] || "/student/dashboard";
    LOG("→ isAuthenticated — redirecting to:", target);
    return <Navigate to={target} replace />;
  }

  LOG("→ not authenticated — rendering Outlet");
  return <Outlet />;
}

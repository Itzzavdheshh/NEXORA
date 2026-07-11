import { Navigate, Outlet } from "react-router-dom";
import { ROLE_HOME } from "../constants/app";
import { useAuth } from "../hooks/useAuth";

export function PublicOnlyRoute() {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[role] || "/student/dashboard"} replace />;
  }

  return <Outlet />;
}

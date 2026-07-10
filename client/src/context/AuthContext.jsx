import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { queryClient } from "../services/queryClient";
import { authStorage } from "../utils/authStorage";
import { AuthContext, normalizeAuthPayload } from "./authContextValue";
import { supabase } from "../services/supabaseClient";

const LOG = (...args) => console.log("[NEXORA-AUTH-CONTEXT]", ...args);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const t = authStorage.getToken();
    LOG("AuthProvider init — token:", t ? t.slice(0, 20) + "..." : null);
    return t;
  });
  const [user, setUser] = useState(() => {
    const u = authStorage.getUser();
    LOG("AuthProvider init — user.role:", u?.role, "user.email:", u?.email);
    return u;
  });

  const isAuthenticated = Boolean(token);
  LOG("isAuthenticated:", isAuthenticated, "pathname:", window.location.pathname);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => {
      LOG("meQuery: calling authService.me() — pathname:", window.location.pathname);
      return authService.me();
    },
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  const persistSession = useCallback((payload) => {
    LOG("persistSession called — payload keys:", Object.keys(payload || {}));
    const auth = normalizeAuthPayload(payload);
    LOG("normalizeAuthPayload result — token:", auth.token ? auth.token.slice(0, 20) + "..." : null, "user.role:", auth.user?.role);
    if (auth.token) {
      authStorage.setToken(auth.token);
      setToken(auth.token);
      LOG("Token set in state and localStorage");
    }
    if (auth.user) {
      authStorage.setUser(auth.user);
      setUser(auth.user);
      LOG("User set in state and localStorage — role:", auth.user?.role);
    }
    return auth;
  }, []);

  const logout = useCallback(() => {
    LOG("logout() called — clearing auth — pathname:", window.location.pathname);
    console.trace("[NEXORA-AUTH-CONTEXT] logout() stack trace");
    authStorage.clear();
    queryClient.clear();
    setToken(null);
    setUser(null);
  }, []);

  // ─── Global Supabase session listener ─────────────────────────────────────
  // This is the safety net: even if AuthCallbackPage doesn't mount (e.g. Supabase
  // redirects to / instead of /auth/callback), this listener fires on SIGNED_IN
  // and syncs the session directly into our own storage.
  useEffect(() => {
    LOG("Setting up supabase.auth.onAuthStateChange listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      LOG("onAuthStateChange fired — event:", event, "has session:", !!session, "pathname:", window.location.pathname);

      if (event === "SIGNED_IN" && session) {
        const existingToken = authStorage.getToken();
        LOG("SIGNED_IN — existingToken in localStorage:", existingToken ? existingToken.slice(0, 20) + "..." : null);

        if (!existingToken) {
          // No token in our storage — Supabase has a session we haven't captured yet
          // This happens when the callback page didn't mount (redirected to / instead of /auth/callback)
          LOG("⚡ No existing token — bootstrapping session from Supabase SIGNED_IN event");
          const t = session.access_token;
          const authUser = session.user;
          const requestedRole = localStorage.getItem("nexora.oauth_role") || "student";

          authStorage.setToken(t);
          setToken(t);

          const fallbackUser = {
            auth_id: authUser?.id,
            id: authUser?.id,
            full_name:
              authUser?.user_metadata?.full_name ||
              authUser?.user_metadata?.name ||
              (authUser?.email ? authUser.email.split("@")[0] : "Nexora User"),
            email: authUser?.email || `${authUser?.id}@oauth.local`,
            role: requestedRole,
            status: "active",
          };

          authStorage.setUser(fallbackUser);
          setUser(fallbackUser);
          LOG("Fallback user stored from onAuthStateChange — role:", fallbackUser.role);

          // Try to sync with backend for the real profile
          try {
            const syncRes = await authService.oauthSync({ role: requestedRole });
            LOG("oauthSync from onAuthStateChange:", JSON.stringify(syncRes));
            let finalUser = syncRes?.data || syncRes?.user || syncRes;
            if (finalUser && finalUser.data && !finalUser.role) finalUser = finalUser.data;
            if (finalUser?.role) {
              authStorage.setUser(finalUser);
              setUser(finalUser);
              LOG("Real user synced from backend — role:", finalUser.role);
            }
          } catch (syncErr) {
            LOG("oauthSync failed in onAuthStateChange:", syncErr?.message);
          }

          localStorage.removeItem("nexora.oauth_role");

          // Navigate to dashboard
          const ROLE_HOME = {
            student: "/student/dashboard",
            mentor: "/mentor/dashboard",
            admin: "/admin/dashboard",
          };
          const targetRole = authStorage.getUser()?.role || requestedRole || "student";
          const redirectPath = ROLE_HOME[targetRole] || "/student/dashboard";
          LOG("Redirecting to:", redirectPath);
          window.location.href = redirectPath;
        }
      }

      if (event === "SIGNED_OUT") {
        LOG("SIGNED_OUT — clearing auth storage");
        authStorage.clear();
        queryClient.clear();
        setToken(null);
        setUser(null);
      }
    });

    return () => {
      LOG("Cleaning up supabase.auth.onAuthStateChange listener");
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    window.addEventListener("nexora:auth-expired", logout);
    return () => window.removeEventListener("nexora:auth-expired", logout);
  }, [logout]);

  useEffect(() => {
    if (meQuery.error) {
      LOG("meQuery ERROR — status:", meQuery.error?.status, "message:", meQuery.error?.message);
      if (meQuery.error?.status === 401 || meQuery.error?.status === 404) {
        LOG("meQuery 401/404 — calling logout()");
        logout();
      }
    }
  }, [logout, meQuery.error]);

  useEffect(() => {
    if (meQuery.data) {
      LOG("meQuery SUCCESS — data:", JSON.stringify(meQuery.data));
    }
  }, [meQuery.data]);

  let resolvedUser = meQuery.data?.data || meQuery.data?.user || meQuery.data || user;
  if (resolvedUser && resolvedUser.data && typeof resolvedUser.data === "object" && !resolvedUser.role) {
    resolvedUser = resolvedUser.data;
  }
  LOG("resolvedUser.role:", resolvedUser?.role, "pathname:", window.location.pathname);

  const value = useMemo(
    () => ({
      token,
      user: resolvedUser,
      role: resolvedUser?.role,
      isAuthenticated,
      isLoadingSession: isAuthenticated && meQuery.isLoading,
      sessionError: meQuery.error,
      persistSession,
      logout,
      refetchUser: meQuery.refetch,
    }),
    [
      token,
      resolvedUser,
      isAuthenticated,
      meQuery.isLoading,
      meQuery.error,
      persistSession,
      logout,
      meQuery.refetch,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { queryClient } from "../services/queryClient";
import { authStorage } from "../utils/authStorage";
import { AuthContext, normalizeAuthPayload } from "./authContextValue";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => authStorage.getToken());
  const [user, setUser] = useState(() => authStorage.getUser());

  const isAuthenticated = Boolean(token);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.me,
    enabled: isAuthenticated,
    retry: false,
  });

  const persistSession = useCallback((payload) => {
    const auth = normalizeAuthPayload(payload);
    if (auth.token) {
      authStorage.setToken(auth.token);
      setToken(auth.token);
    }
    if (auth.user) {
      authStorage.setUser(auth.user);
      setUser(auth.user);
    }
    return auth;
  }, []);

  const logout = useCallback(() => {
    authStorage.clear();
    queryClient.clear();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener("nexora:auth-expired", logout);
    return () => window.removeEventListener("nexora:auth-expired", logout);
  }, [logout]);

  useEffect(() => {
    if (meQuery.error?.status === 401 || meQuery.error?.status === 404) {
      logout();
    }
  }, [logout, meQuery.error]);

  const resolvedUser = meQuery.data?.user || meQuery.data?.data || meQuery.data || user;

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
    }),
    [
      token,
      resolvedUser,
      isAuthenticated,
      meQuery.isLoading,
      meQuery.error,
      persistSession,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import { createContext } from "react";

export const AuthContext = createContext(null);

export function normalizeAuthPayload(payload) {
  const token =
    payload?.token ||
    payload?.accessToken ||
    payload?.data?.token ||
    payload?.data?.accessToken ||
    payload?.data?.session?.access_token ||
    payload?.session?.access_token;
  let user = payload?.user || payload?.data?.user || payload?.data || null;
  if (user && user.data && typeof user.data === "object" && !user.role) {
    user = user.data;
  }
  return { token, user };
}

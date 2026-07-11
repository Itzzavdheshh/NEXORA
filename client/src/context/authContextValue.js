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
  const user = payload?.user || payload?.data?.user || null;
  return { token, user };
}

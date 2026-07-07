import { apiClient } from "./apiClient";
import { supabase } from "./supabaseClient";

const LOG = (...args) => console.log("[NEXORA-AUTH-SERVICE]", ...args);

export const authService = {
  login(payload) {
    return apiClient.post("/auth/login", payload).then((res) => res.data);
  },
  register(payload) {
    return apiClient.post("/auth/register", payload).then((res) => res.data);
  },
  loginWithOAuth(provider, role = "student") {
    if (role) {
      localStorage.setItem("nexora.oauth_role", role);
    }
    const redirectTo = `${window.location.origin}/auth/callback`;
    LOG(`loginWithOAuth: provider=${provider} role=${role} redirectTo=${redirectTo}`);
    return supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  },
  async oauthSync(payload) {
    LOG("oauthSync() called with payload:", JSON.stringify(payload));
    try {
      const res = await apiClient.post("/auth/oauth-sync", payload);
      LOG("oauthSync() raw res.data:", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      LOG("oauthSync() FAILED — status:", err?.status, "message:", err?.message, "body:", JSON.stringify(err?.data));
      throw err;
    }
  },
  async me() {
    LOG("me() called — pathname:", window.location.pathname);
    try {
      const res = await apiClient.get("/auth/me");
      LOG("me() raw res.data:", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      LOG("me() FAILED — status:", err?.status, "message:", err?.message, "body:", JSON.stringify(err?.data));
      throw err;
    }
  },
  logout() {
    return apiClient.post("/auth/logout").then((res) => res.data);
  },
};

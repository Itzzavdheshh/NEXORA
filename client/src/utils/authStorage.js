const TOKEN_KEY = "nexora.accessToken";
const USER_KEY = "nexora.user";

const LOG = (...args) => console.log("[NEXORA-AUTH-STORAGE]", ...args);

export const authStorage = {
  getToken() {
    const val = localStorage.getItem(TOKEN_KEY);
    return val;
  },
  setToken(token) {
    LOG("setToken called — token prefix:", token?.slice(0, 20));
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    LOG("clearToken() called");
    console.trace("[NEXORA-AUTH-STORAGE] clearToken() stack trace");
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser() {
    const value = localStorage.getItem(USER_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },
  setUser(user) {
    LOG("setUser called — role:", user?.role, "email:", user?.email);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser() {
    LOG("clearUser() called");
    console.trace("[NEXORA-AUTH-STORAGE] clearUser() stack trace");
    localStorage.removeItem(USER_KEY);
  },
  clear() {
    LOG("⚠️ clear() called — BOTH token and user are being wiped");
    console.trace("[NEXORA-AUTH-STORAGE] clear() FULL STACK TRACE — this is where auth dies");
    this.clearToken();
    this.clearUser();
  },
};

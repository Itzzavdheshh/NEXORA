const TOKEN_KEY = "nexora.accessToken";
const USER_KEY = "nexora.user";

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
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
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem(USER_KEY);
  },
  clear() {
    this.clearToken();
    this.clearUser();
  },
};

import { apiClient } from "./apiClient";

export const authService = {
  login(payload) {
    return apiClient.post("/auth/login", payload).then((res) => res.data);
  },
  register(payload) {
    return apiClient.post("/auth/register", payload).then((res) => res.data);
  },
  me() {
    return apiClient.get("/auth/me").then((res) => res.data);
  },
  logout() {
    return apiClient.post("/auth/logout").then((res) => res.data);
  },
};

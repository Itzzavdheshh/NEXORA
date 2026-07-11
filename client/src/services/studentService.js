import { apiClient } from "./apiClient";

export const studentService = {
  getProfile() {
    return apiClient.get("/student").then((res) => res.data);
  },
  createProfile(payload) {
    return apiClient.post("/student", payload).then((res) => res.data);
  },
  updateProfile(payload) {
    return apiClient.patch("/student", payload).then((res) => res.data);
  },
};

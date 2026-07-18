import { apiClient } from "./apiClient";

export const mentorService = {
  getProfile() {
    return apiClient.get("/mentors/profile").then((res) => res.data);
  },
  updateProfile(payload) {
    return apiClient.put("/mentors/profile", payload).then((res) => res.data);
  },
  getPendingMentors() {
    return apiClient.get("/mentors/pending").then((res) => res.data);
  },
  verifyMentor(id) {
    return apiClient.patch(`/mentors/${id}/verify`).then((res) => res.data);
  },
  rejectMentor(id) {
    return apiClient.patch(`/mentors/${id}/reject`).then((res) => res.data);
  },
  explore(params) {
    return apiClient.get("/mentors/explore", { params }).then((res) => res.data);
  },
};

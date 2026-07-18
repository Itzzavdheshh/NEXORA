import { apiClient } from "./apiClient";

export const availabilityService = {
  list(params) {
    return apiClient.get("/availability", { params }).then((res) => res.data);
  },
  create(payload) {
    return apiClient.post("/availability", payload).then((res) => res.data);
  },
  update(id, payload) {
    return apiClient.put(`/availability/${id}`, payload).then((res) => res.data);
  },
  remove(id) {
    return apiClient.delete(`/availability/${id}`).then((res) => res.data);
  },
};

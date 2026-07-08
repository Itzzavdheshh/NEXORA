import { apiClient } from "./apiClient";

export const bookingService = {
  list() {
    return apiClient.get("/bookings").then((res) => res.data);
  },
  create(payload) {
    return apiClient.post("/bookings", payload).then((res) => res.data);
  },
  updateStatus(id, payload) {
    return apiClient.patch(`/bookings/${id}/status`, payload).then((res) => res.data);
  },
};

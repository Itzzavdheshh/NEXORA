import { apiClient } from "./apiClient";

export const notificationService = {
  list() {
    return apiClient.get("/notifications").then((res) => res.data);
  },
  markRead(id) {
    return apiClient.patch(`/notifications/${id}/read`).then((res) => res.data);
  },
  markAllRead() {
    return apiClient.patch("/notifications/mark-all-read").then((res) => res.data);
  },
};


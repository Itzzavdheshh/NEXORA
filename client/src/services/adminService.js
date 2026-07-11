import { apiClient } from "./apiClient";

export const adminService = {
  getStats() {
    return apiClient.get("/admin/dashboard/stats").then((res) => res.data);
  },
  getUsers(params) {
    return apiClient.get("/admin/users", { params }).then((res) => res.data);
  },
  updateUserStatus(id, status) {
    return apiClient.patch(`/admin/users/${id}/status`, { status }).then((res) => res.data);
  },
};

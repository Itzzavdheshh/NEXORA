import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

export function useAdminDashboard() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getStats(),
    refetchInterval: 30000, // Refresh statistics every 30 seconds
  });

  const stats = data?.data || {
    users: { total: 0, students: 0, mentors: 0, verifiedMentors: 0, pendingMentors: 0 },
    bookings: { total: 0, completed: 0, pending: 0, cancelled: 0 },
    recentActivity: [],
    health: { status: "unknown", uptime: 0, memory: "0 MB", database: "unknown" },
  };

  return {
    stats,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
}

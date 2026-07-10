import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "./useAuth";

export function useAdminDashboard() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getStats(),
    refetchInterval: 30000, // Keep 30-second fallback polling for health status/uptime
  });

  const stats = data?.data || {
    users: { total: 0, students: 0, mentors: 0, verifiedMentors: 0, pendingMentors: 0 },
    bookings: { total: 0, completed: 0, pending: 0, cancelled: 0 },
    recentActivity: [],
    health: { status: "unknown", uptime: 0, memory: "0 MB", database: "unknown" },
  };

  // Real-time synchronization of admin statistics.
  // Subscribes to changes on both 'users' and 'bookings' tables, invalidating
  // the stats query so the dashboard updates instantly.
  useEffect(() => {
    if (!token) return;

    let usersChannel;
    let bookingsChannel;

    try {
      supabase.realtime.setAuth(token);

      // Listen for any user changes (registrations, verification updates)
      usersChannel = supabase
        .channel("admin-dashboard-users")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "users" },
          () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
          }
        )
        .subscribe();

      // Listen for any booking changes
      bookingsChannel = supabase
        .channel("admin-dashboard-bookings")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "bookings" },
          () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
          }
        )
        .subscribe();
    } catch (err) {
      console.error("Realtime subscription for admin stats failed:", err);
    }

    return () => {
      if (usersChannel) supabase.removeChannel(usersChannel);
      if (bookingsChannel) supabase.removeChannel(bookingsChannel);
    };
  }, [token, queryClient]);

  return {
    stats,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
}

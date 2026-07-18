import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { notificationService } from "../services/notificationService";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "./useAuth";

// ── Helpers ──────────────────────────────────────────────────────────────────

function toTime(value) {
  return value ? new Date(value).getTime() : 0;
}

function matchesSearch(notification, query) {
  if (!query.trim()) return true;
  const text = [notification.title, notification.message]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return text.includes(query.trim().toLowerCase());
}

function applyFilters(notifications, { filter, sort, search }) {
  let list = notifications;

  // Read/Unread filter
  if (filter === "unread") list = list.filter((n) => !n.is_read);
  if (filter === "read") list = list.filter((n) => n.is_read);

  // Search
  list = list.filter((n) => matchesSearch(n, search));

  // Sort
  list = [...list].sort((a, b) =>
    sort === "oldest"
      ? toTime(a.created_at) - toTime(b.created_at)
      : toTime(b.created_at) - toTime(a.created_at),
  );

  return list;
}

// ── Query key ────────────────────────────────────────────────────────────────
export const NOTIFICATIONS_QUERY_KEY = ["notifications"];

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useNotifications() {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "read"
  const [sort, setSort] = useState("newest"); // "newest" | "oldest"

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const notificationsQuery = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: notificationService.list,
    select: (res) => res?.data ?? [],
  });

  // ── Supabase Realtime subscription ────────────────────────────────────────
  // Subscribes to INSERT events on the notifications table filtered to the
  // current user only. On any new row the React Query cache is invalidated,
  // which triggers an immediate refetch — no polling interval needed.
  //
  // The channel is removed when:
  //   • the user logs out (user becomes null/undefined)
  //   • the component/hook unmounts (cleanup function)
  // This prevents stale or duplicate subscriptions across page navigations.
  useEffect(() => {
    if (!user?.id || !token) return;

    let channel;
    try {
      // Set the JWT token directly for the Realtime connection
      supabase.realtime.setAuth(token);

      channel = supabase
        .channel(`notifications:user:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Invalidate the notifications cache — React Query will refetch
            // immediately, updating the list and unread count in real time.
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
          },
        )
        .subscribe();
    } catch (err) {
      console.error("Realtime subscription failed:", err);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id, token, queryClient]);

  // ── Mark one as read (optimistic) ─────────────────────────────────────────
  const markReadMutation = useMutation({
    mutationFn: (id) => notificationService.markRead(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const previous = queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY);

      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((n) =>
            n.id === id ? { ...n, is_read: true } : n,
          ),
        };
      });

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previous);
      }
      toast.error("Could not mark notification as read.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  // ── Mark all as read ──────────────────────────────────────────────────────
  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllRead(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const previous = queryClient.getQueryData(NOTIFICATIONS_QUERY_KEY);

      queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((n) => ({ ...n, is_read: true })),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previous);
      }
      toast.error("Could not mark all notifications as read.");
    },

    onSuccess: () => {
      toast.success("All notifications marked as read.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  // ── Derived data ──────────────────────────────────────────────────────────
  return useMemo(() => {
    const all = notificationsQuery.data ?? [];
    const unreadCount = all.filter((n) => !n.is_read).length;
    const filteredNotifications = applyFilters(all, { filter, sort, search });

    return {
      // Data
      notifications: all,
      filteredNotifications,
      unreadCount,

      // Filter state
      search,
      setSearch,
      filter,
      setFilter,
      sort,
      setSort,

      // Actions
      markRead: markReadMutation.mutate,
      markingId: markReadMutation.variables,
      isMarkingRead: markReadMutation.isPending,

      markAllRead: markAllReadMutation.mutate,
      isMarkingAllRead: markAllReadMutation.isPending,

      // Query state
      isLoading: notificationsQuery.isLoading,
      isFetching: notificationsQuery.isFetching,
      isError: notificationsQuery.isError,
      error: notificationsQuery.error,
      refetch: notificationsQuery.refetch,
    };
  }, [
    notificationsQuery,
    filter,
    sort,
    search,
    markReadMutation,
    markAllReadMutation,
  ]);
}

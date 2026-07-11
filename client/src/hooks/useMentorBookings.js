import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bookingService } from "../services/bookingService";

const BOOKINGS_QUERY_KEY = ["bookings"];

function toTime(value) {
  return value ? new Date(value).getTime() : 0;
}

function matchesSearch(booking, query) {
  if (!query.trim()) return true;
  const target = query.trim().toLowerCase();

  const studentName = booking.student?.full_name?.toLowerCase() || "";
  const studentEmail = booking.student?.email?.toLowerCase() || "";
  const notes = booking.notes?.toLowerCase() || "";
  const dateStr = booking.booking_date || "";

  return (
    studentName.includes(target) ||
    studentEmail.includes(target) ||
    notes.includes(target) ||
    dateStr.includes(target)
  );
}

function applyFilters(bookings, { filter, sort, search }) {
  let list = bookings;

  // Status Filter
  if (filter !== "all") {
    list = list.filter((b) => b.status === filter);
  }

  // Search
  list = list.filter((b) => matchesSearch(b, search));

  // Sort
  list = [...list].sort((a, b) =>
    sort === "oldest"
      ? toTime(a.booking_date) - toTime(b.booking_date)
      : toTime(b.booking_date) - toTime(a.booking_date),
  );

  return list;
}

export function useMentorBookings() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  // Fetch bookings
  const bookingsQuery = useQuery({
    queryKey: BOOKINGS_QUERY_KEY,
    queryFn: bookingService.list,
    select: (res) => res?.data ?? [],
  });

  // Update Status mutation with optimistic updates
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => bookingService.updateStatus(id, { status }),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: BOOKINGS_QUERY_KEY });
      const previous = queryClient.getQueryData(BOOKINGS_QUERY_KEY);

      queryClient.setQueryData(BOOKINGS_QUERY_KEY, (old) => {
        const list = old?.data ?? old ?? [];
        const updatedList = list.map((b) => (b.id === id ? { ...b, status } : b));
        return Array.isArray(old) ? updatedList : { ...old, data: updatedList };
      });

      return { previous };
    },

    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(BOOKINGS_QUERY_KEY, context.previous);
      }
      toast.error(error.message || "Failed to update booking status.");
    },

    onSuccess: (data, variables) => {
      toast.success(`Booking status updated to ${variables.status}.`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
    },
  });

  return useMemo(() => {
    const all = bookingsQuery.data ?? [];
    const filteredBookings = applyFilters(all, { filter, sort, search });

    const stats = all.reduce(
      (acc, b) => {
        const s = b.status || "pending";
        acc.total += 1;
        if (s === "pending") acc.pending += 1;
        if (s === "confirmed") acc.confirmed += 1;
        if (s === "completed") acc.completed += 1;
        if (s === "cancelled") acc.cancelled += 1;
        return acc;
      },
      { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
    );

    return {
      bookings: all,
      filteredBookings,
      stats,

      // Filter settings
      search,
      setSearch,
      filter,
      setFilter,
      sort,
      setSort,

      // Actions
      updateStatus: updateStatusMutation.mutateAsync,
      isUpdating: updateStatusMutation.isPending,
      updatingId: updateStatusMutation.variables?.id || null,

      // Query states
      isLoading: bookingsQuery.isLoading,
      isFetching: bookingsQuery.isFetching,
      isError: bookingsQuery.isError,
      error: bookingsQuery.error,
      refetch: bookingsQuery.refetch,
    };
  }, [bookingsQuery, filter, sort, search, updateStatusMutation]);
}

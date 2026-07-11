import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { availabilityService } from "../services/availabilityService";

export const AVAILABILITY_KEY = ["availability"];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function toTime(v) {
  return v ? new Date(`1970-01-01T${v}`).getTime() : 0;
}

function sortSlots(slots) {
  return [...slots].sort((a, b) => {
    const dayDiff = DAYS.indexOf(a.day_of_week) - DAYS.indexOf(b.day_of_week);
    if (dayDiff !== 0) return dayDiff;
    return toTime(a.start_time) - toTime(b.start_time);
  });
}

function matchesSearch(slot, query) {
  if (!query.trim()) return true;
  const text = `${slot.day_of_week} ${slot.start_time} ${slot.end_time}`.toLowerCase();
  return text.includes(query.trim().toLowerCase());
}

export function useMentorAvailability() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const slotsQuery = useQuery({
    queryKey: AVAILABILITY_KEY,
    queryFn: availabilityService.list,
    select: (res) => res?.data ?? [],
  });

  // ── Create ─────────────────────────────────────────────────────────────────
  const createSlot = useMutation({
    mutationFn: (payload) => availabilityService.create(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(AVAILABILITY_KEY, (old) => {
        const prev = old?.data ?? old ?? [];
        return [...prev, data?.data ?? data];
      });
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEY });
      toast.success("Availability slot created.");
    },
    onError: (error) => {
      toast.error(error.message || "Could not create slot.");
    },
  });

  // ── Update (optimistic) ────────────────────────────────────────────────────
  const updateSlot = useMutation({
    mutationFn: ({ id, payload }) => availabilityService.update(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: AVAILABILITY_KEY });
      const previous = queryClient.getQueryData(AVAILABILITY_KEY);
      queryClient.setQueryData(AVAILABILITY_KEY, (old) =>
        (old ?? []).map((s) => (s.id === id ? { ...s, ...payload } : s)),
      );
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(AVAILABILITY_KEY, context.previous);
      toast.error("Could not update slot.");
    },

    onSuccess: () => {
      toast.success("Slot updated.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEY });
    },
  });

  // ── Delete (optimistic) ────────────────────────────────────────────────────
  const deleteSlot = useMutation({
    mutationFn: (id) => availabilityService.remove(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: AVAILABILITY_KEY });
      const previous = queryClient.getQueryData(AVAILABILITY_KEY);
      queryClient.setQueryData(AVAILABILITY_KEY, (old) =>
        (old ?? []).filter((s) => s.id !== id),
      );
      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(AVAILABILITY_KEY, context.previous);
      toast.error("Could not delete slot.");
    },

    onSuccess: () => {
      toast.success("Slot deleted.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEY });
    },
  });

  // ── Derived state ──────────────────────────────────────────────────────────
  return useMemo(() => {
    const all = slotsQuery.data ?? [];

    const filtered = sortSlots(
      all.filter((s) => {
        if (dayFilter !== "all" && s.day_of_week !== dayFilter) return false;
        if (statusFilter === "available" && !s.is_available) return false;
        if (statusFilter === "booked" && s.is_available) return false;
        return matchesSearch(s, search);
      }),
    );

    return {
      slots: all,
      filteredSlots: filtered,
      search,
      setSearch,
      dayFilter,
      setDayFilter,
      statusFilter,
      setStatusFilter,
      createSlot,
      updateSlot,
      deleteSlot,
      isCreating: createSlot.isPending,
      isUpdating: updateSlot.isPending,
      isDeleting: deleteSlot.isPending,
      isLoading: slotsQuery.isLoading,
      isFetching: slotsQuery.isFetching,
      isError: slotsQuery.isError,
      error: slotsQuery.error,
      refetch: slotsQuery.refetch,
      DAYS,
    };
  }, [slotsQuery, search, dayFilter, statusFilter, createSlot, updateSlot, deleteSlot]);
}

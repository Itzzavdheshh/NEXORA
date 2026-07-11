import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { bookingService } from "../services/bookingService";

function asTime(value) {
  return value ? new Date(value).getTime() : 0;
}

function isUpcoming(booking) {
  if (!booking.booking_date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return asTime(booking.booking_date) >= today.getTime();
}

function matchesSearch(booking, query) {
  if (!query.trim()) return true;
  const text = [
    booking.status,
    booking.meeting_type,
    booking.notes,
    booking.booking_date,
    booking.start_time,
    booking.end_time,
    booking.mentor_id,
    booking.availability_slot_id,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return text.includes(query.trim().toLowerCase());
}

function sortBookings(bookings, sort) {
  return [...bookings].sort((a, b) => {
    if (sort === "oldest") return asTime(a.booking_date || a.created_at) - asTime(b.booking_date || b.created_at);
    if (sort === "status") return (a.status || "").localeCompare(b.status || "");
    return asTime(b.booking_date || b.created_at) - asTime(a.booking_date || a.created_at);
  });
}

export function useStudentBookings() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [timeframe, setTimeframe] = useState("all");
  const [sort, setSort] = useState("newest");

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: bookingService.list,
  });

  return useMemo(() => {
    const bookings = bookingsQuery.data?.data || [];
    const filteredBookings = sortBookings(
      bookings.filter((booking) => {
        if (status !== "all" && booking.status !== status) return false;
        if (timeframe === "upcoming" && !isUpcoming(booking)) return false;
        if (timeframe === "past" && isUpcoming(booking)) return false;
        return matchesSearch(booking, search);
      }),
      sort,
    );

    return {
      bookings,
      filteredBookings,
      upcomingBookings: filteredBookings.filter(isUpcoming),
      pastBookings: filteredBookings.filter((booking) => !isUpcoming(booking)),
      search,
      setSearch,
      status,
      setStatus,
      timeframe,
      setTimeframe,
      sort,
      setSort,
      isLoading: bookingsQuery.isLoading,
      isFetching: bookingsQuery.isFetching,
      isError: bookingsQuery.isError,
      error: bookingsQuery.error,
      refetch: bookingsQuery.refetch,
    };
  }, [bookingsQuery, search, sort, status, timeframe]);
}

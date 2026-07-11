import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { bookingService } from "../services/bookingService";
import { mentorService } from "../services/mentorService";
import { availabilityService } from "../services/availabilityService";
import { notificationService } from "../services/notificationService";

function getData(res) {
  return res?.data ?? [];
}

function toTime(v) {
  return v ? new Date(v).getTime() : 0;
}

function getUpcomingBookings(bookings) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookings
    .filter((b) => b.booking_date && toTime(b.booking_date) >= today.getTime())
    .sort((a, b) => toTime(a.booking_date) - toTime(b.booking_date))
    .slice(0, 5);
}

function getBookingStats(bookings) {
  return bookings.reduce(
    (acc, b) => {
      const s = b.status || "unknown";
      return { ...acc, total: acc.total + 1, [s]: (acc[s] || 0) + 1 };
    },
    { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
  );
}

function getCompletion(profile) {
  if (!profile) return 0;
  const fields = [
    profile.designation,
    profile.company,
    profile.experience,
    profile.expertise,
    profile.bio,
    profile.linkedin_url,
    profile.github_url,
    profile.portfolio_url,
    profile.hourly_rate,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

function getActivity(bookings, notifications) {
  const bookingItems = bookings.map((b) => ({
    id: `booking-${b.id}`,
    title: `Booking ${b.status || "received"}`,
    description: b.booking_date
      ? `Session on ${b.booking_date}`
      : "Mentorship booking activity",
    timestamp: b.created_at || b.booking_date,
    type: "booking",
  }));
  const notifItems = notifications.map((n) => ({
    id: `notif-${n.id}`,
    title: n.title || "Notification",
    description: n.message || "New update",
    timestamp: n.created_at,
    type: "notification",
  }));
  return [...bookingItems, ...notifItems]
    .filter((i) => i.timestamp)
    .sort((a, b) => toTime(b.timestamp) - toTime(a.timestamp))
    .slice(0, 6);
}

export const MENTOR_DASHBOARD_QUERY_KEYS = {
  profile: ["mentor", "profile"],
  bookings: ["bookings"],
  availability: ["availability"],
  notifications: ["notifications"],
};

export function useMentorDashboard() {
  const results = useQueries({
    queries: [
      {
        queryKey: MENTOR_DASHBOARD_QUERY_KEYS.profile,
        queryFn: mentorService.getProfile,
        retry: false,
      },
      {
        queryKey: MENTOR_DASHBOARD_QUERY_KEYS.bookings,
        queryFn: bookingService.list,
      },
      {
        queryKey: MENTOR_DASHBOARD_QUERY_KEYS.availability,
        queryFn: availabilityService.list,
      },
      {
        queryKey: MENTOR_DASHBOARD_QUERY_KEYS.notifications,
        queryFn: notificationService.list,
      },
    ],
  });

  const [profileQuery, bookingsQuery, availabilityQuery, notificationsQuery] = results;

  return useMemo(() => {
    const profile = profileQuery.data?.data ?? null;
    const bookings = getData(bookingsQuery.data);
    const slots = getData(availabilityQuery.data);
    const notifications = getData(notificationsQuery.data);
    const unreadNotifications = notifications.filter((n) => !n.is_read);

    // Only mentor's own bookings
    const mentorBookings = bookings;

    return {
      profile,
      bookings: mentorBookings,
      slots,
      notifications,
      unreadNotifications,
      upcomingBookings: getUpcomingBookings(mentorBookings),
      stats: getBookingStats(mentorBookings),
      profileCompletion: getCompletion(profile),
      isMissingProfile: profileQuery.isError,
      recentActivity: getActivity(mentorBookings, notifications),
      isLoading: results.some((q) => q.isLoading),
      isFetching: results.some((q) => q.isFetching),
      isError: bookingsQuery.isError || availabilityQuery.isError,
      error: bookingsQuery.error || availabilityQuery.error,
      refetchAll: () => results.forEach((q) => q.refetch()),
    };
  }, [results, profileQuery, bookingsQuery, availabilityQuery, notificationsQuery]);
}

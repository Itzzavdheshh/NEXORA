import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { bookingService } from "../services/bookingService";
import { notificationService } from "../services/notificationService";
import { studentService } from "../services/studentService";

function getData(response) {
  return response?.data || [];
}

function toTime(value) {
  return value ? new Date(value).getTime() : 0;
}

function getUpcomingBookings(bookings) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return bookings
    .filter((booking) => booking.booking_date && toTime(booking.booking_date) >= today.getTime())
    .sort((a, b) => toTime(a.booking_date) - toTime(b.booking_date))
    .slice(0, 4);
}

function getBookingStats(bookings) {
  return bookings.reduce(
    (stats, booking) => {
      const status = booking.status || "unknown";
      return {
        ...stats,
        total: stats.total + 1,
        [status]: (stats[status] || 0) + 1,
      };
    },
    {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    },
  );
}

function getActivity(bookings, notifications) {
  const bookingItems = bookings.map((booking) => ({
    id: `booking-${booking.id}`,
    title: `Booking ${booking.status || "created"}`,
    description: booking.booking_date
      ? `Session scheduled for ${booking.booking_date}`
      : "Mentorship booking activity",
    timestamp: booking.created_at || booking.booking_date,
  }));

  const notificationItems = notifications.map((notification) => ({
    id: `notification-${notification.id}`,
    title: notification.title || "Notification",
    description: notification.message || "New Nexora update",
    timestamp: notification.created_at,
  }));

  return [...bookingItems, ...notificationItems]
    .filter((item) => item.timestamp)
    .sort((a, b) => toTime(b.timestamp) - toTime(a.timestamp))
    .slice(0, 6);
}

export function useStudentDashboard() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["student", "profile"],
        queryFn: studentService.getProfile,
        retry: false,
      },
      {
        queryKey: ["bookings"],
        queryFn: bookingService.list,
      },
      {
        queryKey: ["notifications"],
        queryFn: notificationService.list,
      },
    ],
  });

  const [profileQuery, bookingsQuery, notificationsQuery] = results;

  return useMemo(() => {
    const bookings = getData(bookingsQuery.data);
    const notifications = getData(notificationsQuery.data);
    const unreadNotifications = notifications.filter((item) => !item.is_read);

    return {
      profile: profileQuery.data?.data || null,
      bookings,
      notifications,
      unreadNotifications,
      upcomingBookings: getUpcomingBookings(bookings),
      stats: getBookingStats(bookings),
      recentNotifications: notifications.slice(0, 4),
      activity: getActivity(bookings, notifications),
      isLoading: results.some((query) => query.isLoading),
      isFetching: results.some((query) => query.isFetching),
      isError: bookingsQuery.isError || notificationsQuery.isError,
      profileError: profileQuery.error,
      error: bookingsQuery.error || notificationsQuery.error,
      refetchAll: () => results.forEach((query) => query.refetch()),
    };
  }, [bookingsQuery, notificationsQuery, profileQuery, results]);
}

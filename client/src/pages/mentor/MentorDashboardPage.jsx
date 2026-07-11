import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpenCheck,
  CalendarCheck,
  CalendarClock,
  Clock3,
  LineChart,
  RefreshCw,
  UserRound,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../hooks/useAuth";
import { useMentorDashboard } from "../../hooks/useMentorDashboard";
import { cn } from "../../utils/cn";
import {
  DashboardHero,
  DashboardSection,
  MentorStatCard,
} from "./dashboard/DashboardComponents";

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusStyles = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-200",
  confirmed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
  completed: "bg-brand-500/10 text-brand-700 dark:text-brand-200",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-200",
};

function formatDate(value) {
  if (!value) return "Date unavailable";
  try {
    return format(new Date(value), "MMM d, yyyy");
  } catch {
    return value;
  }
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Skeleton className="h-56 w-full" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

// ── Booking item ─────────────────────────────────────────────────────────────
function BookingItem({ booking }) {
  return (
    <li className="rounded-2xl border border-ink-200/70 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-ink-300 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:border-white/20 dark:hover:bg-white/15">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-ink-950 dark:text-white">Mentorship session</p>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
            {formatDate(booking.booking_date)}
            {booking.start_time ? `, ${booking.start_time}` : ""}
            {booking.end_time ? ` – ${booking.end_time}` : ""}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold capitalize",
            statusStyles[booking.status] || "bg-ink-500/10 text-ink-600 dark:text-ink-200",
          )}
        >
          {booking.status || "unknown"}
        </span>
      </div>
    </li>
  );
}

// ── Notification item ─────────────────────────────────────────────────────────
function NotificationItem({ notification }) {
  return (
    <li className="flex gap-3 rounded-2xl p-3 transition hover:bg-ink-100/70 dark:hover:bg-white/10">
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-700 dark:bg-brand-300/10 dark:text-brand-200">
        <Bell className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-sm font-bold text-ink-950 dark:text-white">
            {notification.title || "Notification"}
          </p>
          {!notification.is_read && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-label="Unread" />
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink-500 dark:text-ink-300">
          {notification.message || "New Nexora update"}
        </p>
      </div>
    </li>
  );
}

// ── Activity item ─────────────────────────────────────────────────────────────
function ActivityItem({ item }) {
  return (
    <li className="relative pl-7">
      <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-ink-950 shadow dark:border-ink-900 dark:bg-white" />
      <p className="text-sm font-bold text-ink-950 dark:text-white">{item.title}</p>
      <p className="mt-1 text-sm leading-5 text-ink-500 dark:text-ink-300">{item.description}</p>
      <p className="mt-2 text-xs font-semibold text-ink-400 dark:text-ink-500">
        {formatDate(item.timestamp)}
      </p>
    </li>
  );
}

// ── Availability slot mini card ───────────────────────────────────────────────
function SlotItem({ slot }) {
  return (
    <li className="flex items-center justify-between rounded-2xl border border-ink-200/70 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/10">
      <div>
        <p className="text-sm font-bold text-ink-950 dark:text-white">{slot.day_of_week}</p>
        <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-300">
          {slot.start_time} – {slot.end_time}
        </p>
      </div>
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-bold",
          slot.is_available
            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
            : "bg-ink-100 text-ink-500 dark:bg-white/10 dark:text-ink-300",
        )}
      >
        {slot.is_available ? "Available" : "Booked"}
      </span>
    </li>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MentorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dashboard = useMentorDashboard();
  const displayName = user?.full_name || user?.name || "Mentor";

  const chartData = [
    { name: "Pending", value: dashboard.stats.pending },
    { name: "Confirmed", value: dashboard.stats.confirmed },
    { name: "Completed", value: dashboard.stats.completed },
    { name: "Cancelled", value: dashboard.stats.cancelled },
  ];

  if (dashboard.isLoading) return <DashboardSkeleton />;

  if (dashboard.isError) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Dashboard could not load"
          description={
            dashboard.error?.message ||
            "Could not fetch mentor data. Check that the backend is running."
          }
          actionLabel="Retry"
          onAction={dashboard.refetchAll}
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero */}
        <DashboardHero
          displayName={displayName}
          profileCompletion={dashboard.profileCompletion}
          onRefresh={dashboard.refetchAll}
          isFetching={dashboard.isFetching}
        />

        {/* Stat cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MentorStatCard
            icon={CalendarCheck}
            label="Total bookings"
            value={dashboard.stats.total}
            hint="All booking records for your mentor account."
            index={0}
          />
          <MentorStatCard
            icon={Clock3}
            label="Upcoming"
            value={dashboard.upcomingBookings.length}
            hint="Sessions scheduled from today forward."
            index={1}
          />
          <MentorStatCard
            icon={BookOpenCheck}
            label="Completed"
            value={dashboard.stats.completed}
            hint="Finished mentorship sessions."
            index={2}
          />
          <MentorStatCard
            icon={Bell}
            label="Unread"
            value={dashboard.unreadNotifications.length}
            hint="Notifications waiting for your attention."
            index={3}
            accent={dashboard.unreadNotifications.length > 0}
          />
        </div>

        {/* Upcoming + chart */}
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <DashboardSection
            title="Upcoming sessions"
            description="Your nearest booked mentorship sessions."
            action={
              <Button
                variant="secondary"
                onClick={dashboard.refetchAll}
                loading={dashboard.isFetching}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            }
          >
            {dashboard.upcomingBookings.length ? (
              <ul className="space-y-3">
                {dashboard.upcomingBookings.map((b) => (
                  <BookingItem key={b.id} booking={b} />
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No upcoming sessions"
                description="Once students book your slots, sessions will appear here."
              />
            )}
          </DashboardSection>

          <DashboardSection
            title="Booking statistics"
            description="Visual breakdown of your booking status mix."
          >
            {dashboard.stats.total ? (
              <div className="h-72 rounded-3xl border border-ink-200/70 bg-white/55 p-3 dark:border-white/10 dark:bg-white/6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(130,144,166,0.22)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: "rgba(27,145,255,0.08)" }} />
                    <Bar dataKey="value" radius={[10, 10, 4, 4]} fill="#1b91ff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                title="No booking stats yet"
                description="Chart activates after your first booking is received."
              />
            )}
          </DashboardSection>
        </div>

        {/* Notifications + Activity */}
        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardSection
            title="Recent notifications"
            description="Latest updates for your mentor account."
            action={
              <Link
                to="/mentor/notifications"
                className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-200"
              >
                View all
              </Link>
            }
          >
            {dashboard.notifications.length ? (
              <ul className="space-y-1">
                {dashboard.notifications.slice(0, 4).map((n) => (
                  <NotificationItem key={n.id} notification={n} />
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No notifications yet"
                description="Booking alerts and updates will appear here."
              />
            )}
          </DashboardSection>

          <DashboardSection
            title="Recent activity"
            description="Timeline of bookings and notifications."
          >
            {dashboard.recentActivity.length ? (
              <ol className="space-y-5 border-l border-ink-200 pl-5 dark:border-white/10">
                {dashboard.recentActivity.map((item) => (
                  <ActivityItem key={item.id} item={item} />
                ))}
              </ol>
            ) : (
              <EmptyState
                title="Activity timeline is quiet"
                description="As bookings arrive and updates come in, your activity appears here."
              />
            )}
          </DashboardSection>
        </div>

        {/* Availability summary */}
        <DashboardSection
          title="Your availability slots"
          description="A quick overview of your current schedule."
          action={
            <Button variant="secondary" onClick={() => navigate("/mentor/availability")}>
              <CalendarClock className="h-4 w-4" />
              Manage slots
            </Button>
          }
        >
          {dashboard.slots.length ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dashboard.slots.slice(0, 6).map((slot) => (
                <SlotItem key={slot.id} slot={slot} />
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No availability slots"
              description="Add your first slot so students can book sessions with you."
              actionLabel="Add slot"
              onAction={() => navigate("/mentor/availability")}
            />
          )}
        </DashboardSection>

        {/* Quick actions */}
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { icon: CalendarClock, title: "Set availability", to: "/mentor/availability" },
            { icon: UserRound, title: "Update profile", to: "/mentor/profile" },
            { icon: LineChart, title: "Review sessions", to: "/mentor/bookings" },
          ].map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="glass-panel group flex min-w-0 items-center gap-4 rounded-3xl p-5 transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-700 dark:text-brand-200">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-ink-950 dark:text-white">{item.title}</p>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Open workspace</p>
              </div>
              <motion.div
                className="ml-auto"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <CalendarCheck className="h-4 w-4 text-ink-400 dark:text-ink-500" aria-hidden="true" />
              </motion.div>
            </Link>
          ))}
        </section>
      </div>
    </PageTransition>
  );
}

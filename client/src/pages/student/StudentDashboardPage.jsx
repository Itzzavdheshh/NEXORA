import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  BookOpenCheck,
  CalendarCheck,
  Clock3,
  GraduationCap,
  LineChart,
  RefreshCw,
  Sparkles,
  Target,
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
import { useStudentDashboard } from "../../hooks/useStudentDashboard";
import { cn } from "../../utils/cn";

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

function StatCard({ icon, label, value, hint, index }) {
  const IconComponent = icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glass-panel group rounded-3xl p-5 transition duration-200 hover:-translate-y-1 hover:shadow-glow sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink-500 dark:text-ink-300">{label}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink-950 dark:text-white">
            {value}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-950 text-white shadow-sm transition group-hover:scale-105 dark:bg-brand-300 dark:text-ink-950">
          <IconComponent className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-ink-500 dark:text-ink-300">{hint}</p>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Skeleton className="h-56 w-full" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-36 w-full" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

function ErrorPanel({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-3xl">
      <EmptyState
        title="Dashboard data could not load"
        description={message || "Nexora could not fetch your bookings or notifications. Check that the backend is running and try again."}
        actionLabel="Retry"
        onAction={onRetry}
      />
    </div>
  );
}

function Section({ title, description, children, action }) {
  return (
    <section className="glass-panel rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-ink-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-ink-500 dark:text-ink-300">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function BookingItem({ booking }) {
  return (
    <li className="rounded-2xl border border-ink-200/70 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-ink-300 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:border-white/20 dark:hover:bg-white/15">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-ink-950 dark:text-white">Mentorship session</p>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
            {formatDate(booking.booking_date)}
            {booking.start_time ? `, ${booking.start_time}` : ""}
            {booking.end_time ? ` - ${booking.end_time}` : ""}
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
      {booking.meeting_type || booking.notes ? (
        <p className="mt-3 text-sm leading-6 text-ink-500 dark:text-ink-300">
          {[booking.meeting_type, booking.notes].filter(Boolean).join(" - ")}
        </p>
      ) : null}
    </li>
  );
}

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
          {!notification.is_read ? (
            <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" aria-label="Unread" />
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink-500 dark:text-ink-300">
          {notification.message || "New Nexora update"}
        </p>
      </div>
    </li>
  );
}

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

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dashboard = useStudentDashboard();
  const displayName = user?.full_name || user?.name || "Student";
  const chartData = [
    { name: "Pending", value: dashboard.stats.pending },
    { name: "Confirmed", value: dashboard.stats.confirmed },
    { name: "Completed", value: dashboard.stats.completed },
    { name: "Cancelled", value: dashboard.stats.cancelled },
  ];

  if (dashboard.isLoading) return <DashboardSkeleton />;

  if (dashboard.isError) {
    return <ErrorPanel message={dashboard.error?.message} onRetry={dashboard.refetchAll} />;
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-[#101827]/90 dark:shadow-[0_28px_90px_rgba(0,0,0,0.48)]"
      >
          <div className="relative grid gap-7 p-6 sm:p-7 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/70 to-transparent dark:via-brand-200/40" />
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-200">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Student dashboard
              </p>
              <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl lg:text-5xl dark:text-white">
                Welcome back, {displayName}. Your mentorship momentum is ready.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base dark:text-ink-200">
                Track upcoming sessions, recent updates, and booking progress from one focused workspace.
              </p>
              {dashboard.profileError ? (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                  Student profile has not been completed yet, so profile-specific insights are limited.
                </div>
              ) : null}
            </div>
            <div className="grid content-end gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link
                className="group flex items-center justify-between rounded-2xl border border-ink-200 bg-ink-950 px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 dark:border-brand-300/30 dark:bg-brand-300 dark:text-ink-950"
                to="/student/bookings"
              >
                Book a session
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                className="group flex items-center justify-between rounded-2xl border border-ink-200 bg-white/75 px-4 py-3 text-sm font-bold text-ink-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                to="/student/notifications"
              >
                View notifications
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CalendarCheck} label="Total bookings" value={dashboard.stats.total} hint="All bookings returned for your student account." index={0} />
          <StatCard icon={Clock3} label="Upcoming" value={dashboard.upcomingBookings.length} hint="Future sessions based on booking dates." index={1} />
          <StatCard icon={BookOpenCheck} label="Completed" value={dashboard.stats.completed} hint="Finished mentorship sessions." index={2} />
          <StatCard icon={Bell} label="Unread updates" value={dashboard.unreadNotifications.length} hint="Notifications waiting for your attention." index={3} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Section
            title="Upcoming sessions"
            description="Your nearest mentorship bookings from the backend."
            action={
              <Button variant="secondary" onClick={dashboard.refetchAll} loading={dashboard.isFetching}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            }
          >
            {dashboard.upcomingBookings.length ? (
              <ul className="space-y-3">
                {dashboard.upcomingBookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No upcoming sessions yet"
                description="Once you book a mentor slot, upcoming sessions will appear here with date, time, and status."
                actionLabel="Explore booking"
                onAction={() => navigate("/student/bookings")}
              />
            )}
          </Section>

          <Section title="Booking statistics" description="A compact view of your booking status mix.">
            {dashboard.stats.total ? (
              <div className="h-72 rounded-3xl border border-ink-200/70 bg-white/55 p-3 dark:border-white/10 dark:bg-white/6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(130,144,166,0.22)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: "rgba(99, 102, 241, 0.08)" }} />
                    <Bar dataKey="value" radius={[10, 10, 4, 4]} fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                title="No booking stats yet"
                description="Your chart will activate after the first session booking is created."
              />
            )}
          </Section>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Section title="Recent notifications" description="Latest backend notifications for your account.">
            {dashboard.recentNotifications.length ? (
              <ul className="space-y-1">
                {dashboard.recentNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No notifications yet"
                description="Booking confirmations, mentor updates, and status changes will appear here."
              />
            )}
          </Section>

          <Section title="Recent activity" description="A timeline blended from bookings and notifications.">
            {dashboard.activity.length ? (
              <ol className="space-y-5 border-l border-ink-200 pl-5 dark:border-white/10">
                {dashboard.activity.map((item) => (
                  <ActivityItem key={item.id} item={item} />
                ))}
              </ol>
            ) : (
              <EmptyState
                title="Your activity timeline is quiet"
                description="As you book sessions and receive updates, your latest activity will be summarized here."
              />
            )}
          </Section>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Target, title: "Plan next step", to: "/student/bookings" },
            { icon: GraduationCap, title: "Strengthen profile", to: "/student/profile" },
            { icon: LineChart, title: "Review progress", to: "/student/dashboard" },
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
              <ArrowRight className="ml-auto h-4 w-4 text-ink-400 transition group-hover:translate-x-0.5" />
            </Link>
          ))}
        </section>
      </div>
    </PageTransition>
  );
}

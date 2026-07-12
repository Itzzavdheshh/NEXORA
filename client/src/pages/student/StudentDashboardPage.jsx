import { useEffect, useState, useMemo } from "react";
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
  Calendar,
  Activity,
  User,
  Info
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton, SkeletonStat } from "../../components/ui/Skeleton";
import { useAuth } from "../../hooks/useAuth";
import { useStudentDashboard } from "../../hooks/useStudentDashboard";
import { cn } from "../../utils/cn";

// Status configuration for style classes
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    color: "bg-[var(--accent-mentor)]/10 text-[var(--accent-mentor)] border-[var(--accent-mentor)]/20",
    dot: "bg-[var(--accent-mentor)]",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-[var(--accent-danger)]/10 text-[var(--accent-danger)] border-[var(--accent-danger)]/20",
    dot: "bg-[var(--accent-danger)]",
  },
};

function formatTime(value) {
  if (!value) return "";
  return value.slice(0, 5); // HH:MM
}

// Simple CountUp helper component
function CountUp({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (typeof value !== "number") {
      setCount(value);
      return;
    }
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    const duration = 600; // ms
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
}

// Asymmetrical Custom Stat Card component
function StatCard({ icon, label, value, hint, index, className, accent }) {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.28, ease: "easeOut" }}
      className={cn(
        "rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-all duration-200 hover:border-[var(--border-strong)] hover:shadow-token-sm flex flex-col justify-between min-h-[120px]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
            {label}
          </p>
          <p className={cn("mt-2.5 tabular-nums font-extrabold tracking-tight", accent ? "text-3xl text-[var(--accent-primary)]" : "text-2xl text-[var(--text-primary)]")}>
            <CountUp value={value} />
          </p>
        </div>
        <div className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded border transition-transform duration-200",
          accent
            ? "border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
            : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]",
        )}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-tertiary)] mt-3 font-medium">
        {hint}
      </p>
    </motion.div>
  );
}

// Section wrapper component
function Section({ title, description, children, action }) {
  return (
    <section className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 flex flex-col">
      <div className="mb-4 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">{title}</h2>
          <p className="text-xs text-[var(--text-secondary)]">{description}</p>
        </div>
        {action ? <div className="mt-2 sm:mt-0">{action}</div> : null}
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}

// Custom chart tooltip
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 shadow-token-md text-xs">
      <p className="font-bold text-[var(--text-primary)]">{payload[0]?.name}</p>
      <p className="mt-0.5 text-[var(--text-secondary)]">
        {payload[0]?.value} booking{payload[0]?.value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

// Timeline layout upcoming session item
function BookingItem({ booking, index }) {
  const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const mentorName = booking.mentor?.full_name || booking.mentor?.name || "Mentor";
  const initials = mentorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = booking.booking_date
    ? format(new Date(booking.booking_date), "EEEE, MMM d, yyyy")
    : "Date TBD";

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="relative pl-6 pb-6 last:pb-0"
    >
      {/* Timeline connector and dot */}
      <span className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-[var(--border-subtle)]" aria-hidden="true" />
      <span className="absolute left-1.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-surface)] bg-[var(--accent-primary)]" aria-hidden="true" />

      <div className="flex flex-col gap-3 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 p-4 transition-all duration-150 hover:border-[var(--border-strong)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {booking.mentor?.avatar_url ? (
            <img
              src={booking.mentor.avatar_url}
              alt=""
              className="h-10 w-10 rounded object-cover border border-[var(--border-subtle)]"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-primary)]">
              {initials}
            </div>
          )}

          <div>
            <p className="text-xs font-bold text-[var(--text-primary)]">{mentorName}</p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
              <span>{formattedDate}</span>
              {booking.start_time && (
                <>
                  <span className="text-[var(--text-tertiary)]">•</span>
                  <span>{formatTime(booking.start_time)} {booking.end_time ? `- ${formatTime(booking.end_time)}` : ""}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider">
            Format: {booking.meeting_type || "Online"}
          </span>
          <span className={cn("badge text-[10px] border", config.color)}>
            <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", config.dot)} aria-hidden="true" />
            {config.label}
          </span>
        </div>
      </div>
    </motion.li>
  );
}

// Group notifications helper
function groupNotifications(notifications) {
  const groups = { Today: [], Yesterday: [], Earlier: [] };
  const todayStr = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  notifications.forEach((n) => {
    const d = new Date(n.created_at);
    const dStr = d.toDateString();
    if (dStr === todayStr) {
      groups.Today.push(n);
    } else if (dStr === yesterdayStr) {
      groups.Yesterday.push(n);
    } else {
      groups.Earlier.push(n);
    }
  });
  return groups;
}

// Dashboard skeleton loader
function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <Skeleton className="h-44 w-full rounded-md" />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => <SkeletonStat key={i} />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Skeleton className="h-96 w-full rounded-md" />
        <Skeleton className="h-96 w-full rounded-md" />
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dashboard = useStudentDashboard();
  const firstName = (user?.full_name || user?.name || "there").split(" ")[0];

  // Profile completion indicator fields count
  const profileCompletion = useMemo(() => {
    if (!dashboard.profile) return 0;
    const fields = [
      dashboard.profile.full_name,
      dashboard.profile.college,
      dashboard.profile.degree,
      dashboard.profile.branch,
      dashboard.profile.graduation_year,
      dashboard.profile.bio,
      Array.isArray(dashboard.profile.skills) && dashboard.profile.skills.length > 0,
      dashboard.profile.linkedin_url,
      dashboard.profile.github_url,
      dashboard.profile.portfolio_url,
      dashboard.profile.avatar_url,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [dashboard.profile]);

  const chartData = useMemo(() => [
    { name: "Pending", value: dashboard.stats.pending, fill: "#f59e0b" },
    { name: "Confirmed", value: dashboard.stats.confirmed, fill: "#10b981" },
    { name: "Completed", value: "#F5A623" }, // maps to accent-primary (amber)
    { name: "Cancelled", value: dashboard.stats.cancelled, fill: "#f43f5e" },
  ], [dashboard.stats]);

  const groupedNotif = useMemo(() => groupNotifications(dashboard.recentNotifications), [dashboard.recentNotifications]);

  if (dashboard.isLoading) return <DashboardSkeleton />;

  if (dashboard.isError) {
    return (
      <div className="mx-auto max-w-2xl pt-8">
        <EmptyState
          icon={Activity}
          title="Dashboard unavailable"
          description={dashboard.error?.message || "Could not load your dashboard. Check that the server is running."}
          actionLabel="Retry"
          onAction={dashboard.refetchAll}
          size="lg"
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-5">

        {/* Hero Banner Card */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="relative overflow-hidden rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-token-sm"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="badge border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] mb-4 text-[10px]">
                <GraduationCap className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Student Workspace
              </span>
              <h1 className="font-display text-display font-semibold text-[var(--text-primary)] leading-tight mt-1">
                Good to see you, {firstName}.
              </h1>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Track sessions, view updates, and manage your academic mentorship.
              </p>

              {/* Profile incomplete warning indicator */}
              {(!dashboard.profile || profileCompletion < 100) && (
                <div className="mt-5 flex flex-col gap-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 p-4 max-w-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--text-primary)]">Profile Setup Status</span>
                    <span className="font-semibold text-[var(--accent-primary)]">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-[var(--bg-elevated)] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[var(--accent-primary)] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                  <Link
                    to="/student/profile"
                    className="text-[11px] font-bold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition w-fit mt-1"
                  >
                    Complete your profile info →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col justify-end gap-2.5 sm:flex-row lg:flex-col lg:items-end">
              <Link
                to="/student/bookings"
                className="group inline-flex items-center justify-center gap-2 rounded border border-[var(--accent-primary)] bg-[var(--accent-primary)] px-4 py-2 text-xs font-bold text-[var(--bg-base)] transition duration-token-standard hover:bg-[var(--accent-primary-hover)]"
              >
                <span>Book a session</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                to="/student/notifications"
                className="inline-flex items-center justify-center gap-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2 text-xs font-bold text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition"
              >
                <span>Notifications</span>
                {dashboard.unreadNotifications.length > 0 && (
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[9px] font-bold text-[var(--bg-base)]">
                    {dashboard.unreadNotifications.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Stats Row — Asymmetrical varied sizes grid */}
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          <StatCard
            icon={CalendarCheck}
            label="Total sessions"
            value={dashboard.stats.total}
            hint="All booked slots"
            index={0}
            className="md:col-span-2 xl:col-span-2"
            accent={true}
          />
          <StatCard
            icon={Clock3}
            label="Upcoming"
            value={dashboard.upcomingBookings.length}
            hint="Active bookings"
            index={1}
          />
          <StatCard
            icon={BookOpenCheck}
            label="Completed"
            value={dashboard.stats.completed}
            hint="Archived slots"
            index={2}
          />
          <StatCard
            icon={Bell}
            label="Unread Alerts"
            value={dashboard.unreadNotifications.length}
            hint="Direct updates"
            index={3}
            accent={dashboard.unreadNotifications.length > 0}
          />
        </div>

        {/* Upcoming Timeline + Booking Chart */}
        <div className="grid gap-5 xl:grid-cols-[1.22fr_0.78fr]">
          <Section
            title="Upcoming timeline"
            description="Your next scheduled mentorship engagements"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={dashboard.refetchAll}
                loading={dashboard.isFetching}
                aria-label="Refresh dashboard data"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Refresh
              </Button>
            }
          >
            {dashboard.upcomingBookings.length ? (
              <ul className="mt-4">
                {dashboard.upcomingBookings.map((booking, i) => (
                  <BookingItem key={booking.id} booking={booking} index={i} />
                ))}
              </ul>
            ) : (
              <div className="h-full flex items-center justify-center py-10">
                <EmptyState
                  icon={Calendar}
                  title="No sessions scheduled"
                  description="Start booking mentorship slots to populate your calendar timeline."
                  actionLabel="Browse bookings"
                  onAction={() => navigate("/student/bookings")}
                  size="sm"
                />
              </div>
            )}
          </Section>

          <Section
            title="Booking status mix"
            description="Status breakdown of bookings"
          >
            {dashboard.stats.total > 0 ? (
              <div className="h-60 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 p-4 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barCategoryGap="40%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                      width={20}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "rgba(255,255,255,0.02)" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center py-10">
                <EmptyState
                  icon={LineChart}
                  title="Chart inactive"
                  description="Breakdown graphics activate after scheduling your first slot."
                  size="sm"
                />
              </div>
            )}
          </Section>
        </div>

        {/* Recent Notifications grouped by Today / Yesterday */}
        <div className="grid gap-5 xl:grid-cols-2">
          <Section
            title="Recent updates"
            description="Direct account updates and bookings activity logs"
            action={
              <Link
                to="/student/notifications"
                className="text-xs font-bold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] transition"
              >
                View all
              </Link>
            }
          >
            {dashboard.recentNotifications.length ? (
              <div className="divide-y divide-[var(--border-subtle)]/50 mt-2">
                {["Today", "Yesterday", "Earlier"].map((groupName) => {
                  const list = groupedNotif[groupName] || [];
                  if (list.length === 0) return null;
                  return (
                    <div key={groupName} className="py-3 first:pt-1 last:pb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-tertiary)] block mb-2">{groupName}</span>
                      <ul className="space-y-1.5">
                        {list.map((n, i) => (
                          <motion.li
                            key={n.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.035 }}
                            className={cn(
                              "relative flex gap-3 rounded p-2.5 transition duration-150",
                              !n.is_read ? "bg-[var(--bg-elevated)]/40" : "hover:bg-[var(--bg-elevated)]/20"
                            )}
                          >
                            {!n.is_read && (
                              <span className="absolute left-0 top-3.5 bottom-3.5 w-0.5 bg-[var(--accent-primary)]" aria-hidden="true" />
                            )}
                            <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                              <Info className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={cn("text-xs font-bold truncate", !n.is_read ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]")}>
                                {n.title}
                              </p>
                              <p className="mt-0.5 text-xs text-[var(--text-secondary)] line-clamp-1">{n.message}</p>
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center py-10">
                <EmptyState
                  icon={Bell}
                  title="No recent alerts"
                  description="Activity updates and session requests will show here when sent."
                  size="sm"
                />
              </div>
            )}
          </Section>
        </div>

      </div>
    </PageTransition>
  );
}

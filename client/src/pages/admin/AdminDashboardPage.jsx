import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CalendarCheck,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  Server,
  Database,
  Cpu,
  RefreshCw,
  UserCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
} from "recharts";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { Button } from "../../components/ui/Button";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton, SkeletonStat } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { cn } from "../../utils/cn";

const PIE_COLORS = ["#f59e0b", "#10b981", "#1b91ff", "#f43f5e"];

// Custom chart tooltip
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-ink-200/60 bg-white px-3 py-2 shadow-elevation-2 text-xs dark:border-white/8 dark:bg-[#0d1526]">
      <p className="font-semibold text-ink-900 dark:text-white">{label || payload[0]?.name}</p>
      <p className="mt-0.5 text-ink-500 dark:text-ink-400">{payload[0]?.value}</p>
    </div>
  );
}

// Stat card — real backend data only
function StatCard({ label, value, icon, text, accentColor, index }) {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.26 }}
      className="glass-panel flex flex-col justify-between rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
          {label}
        </p>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", accentColor)}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-4">
        <p className="tabular-nums text-3xl font-extrabold tracking-tight text-ink-950 dark:text-white">
          {value ?? "—"}
        </p>
        {text && (
          <p className="mt-1 text-xs text-ink-400 dark:text-ink-500">{text}</p>
        )}
      </div>
    </motion.div>
  );
}

// Activity timeline item
function ActivityLogItem({ log, index }) {
  const isUser = log.type === "user";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      className="relative pl-8"
    >
      <span className={cn(
        "absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white",
        isUser ? "bg-brand-500" : "bg-emerald-500",
      )}>
        {isUser ? "U" : "B"}
      </span>
      <p className="text-xs font-semibold text-ink-900 dark:text-ink-100">{log.title}</p>
      <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">{log.description}</p>
      <time className="mt-1 block text-[10px] text-ink-400 dark:text-ink-600">
        {new Date(log.timestamp).toLocaleDateString()} · {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </time>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const { stats, isLoading, isError, error, refetch, isFetching } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-5" aria-busy="true">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <SkeletonStat key={i} />)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <SkeletonStat key={i} />)}
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <Skeleton className="h-80 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl pt-8">
        <EmptyState
          icon={AlertCircle}
          title="Dashboard unavailable"
          description={error?.message || "Failed to load admin statistics."}
          actionLabel="Retry"
          onAction={refetch}
          size="lg"
        />
      </div>
    );
  }

  const bookingStatsData = [
    { name: "Pending", value: stats.bookings.pending },
    { name: "Confirmed", value: Math.max(0, stats.bookings.total - stats.bookings.pending - stats.bookings.completed - stats.bookings.cancelled) },
    { name: "Completed", value: stats.bookings.completed },
    { name: "Cancelled", value: stats.bookings.cancelled },
  ];

  const barChartData = [
    { name: "Total", count: stats.users.total, fill: "#8b5cf6" },
    { name: "Students", count: stats.users.students, fill: "#1b91ff" },
    { name: "Mentors", count: stats.users.mentors, fill: "#10b981" },
    { name: "Verified", count: stats.users.verifiedMentors, fill: "#3b82f6" },
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-5">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-ink-200/60 bg-white/90 p-6 shadow-elevation-2 dark:border-white/6 dark:bg-[#0d1526]/90"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent dark:via-violet-300/20" aria-hidden="true" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="badge badge-brand">
                <Activity className="h-3 w-3" aria-hidden="true" />
                Admin control center
              </span>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl dark:text-white">
                Platform overview
              </h1>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
                Real-time user analytics, booking health, and system diagnostics.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              loading={isFetching}
              disabled={isFetching}
              aria-label="Refresh dashboard statistics"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Sync data
            </Button>
          </div>
        </motion.div>

        {/* User stats — 4 cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard index={0} label="Total users" value={stats.users.total} icon={Users} text="All registered accounts" accentColor="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
          <StatCard index={1} label="Students" value={stats.users.students} icon={GraduationCap} text="Active student learners" accentColor="bg-brand-500/10 text-brand-600 dark:text-brand-400" />
          <StatCard index={2} label="Mentors" value={stats.users.mentors} icon={Briefcase} text="All registered mentors" accentColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
          <StatCard
            index={3}
            label="Pending review"
            value={stats.users.pendingMentors}
            icon={ShieldCheck}
            text="Awaiting verification"
            accentColor={stats.users.pendingMentors > 0 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-ink-100 text-ink-500 dark:bg-white/8 dark:text-ink-400"}
          />
        </div>

        {/* Booking stats — 4 cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard index={4} label="Total bookings" value={stats.bookings.total} icon={CalendarCheck} text="" accentColor="bg-brand-500/10 text-brand-600 dark:text-brand-400" />
          <StatCard index={5} label="Completed" value={stats.bookings.completed} icon={CheckCircle} text="" accentColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
          <StatCard index={6} label="Pending" value={stats.bookings.pending} icon={Clock} text="" accentColor="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
          <StatCard index={7} label="Cancelled" value={stats.bookings.cancelled} icon={XCircle} text="" accentColor="bg-red-500/10 text-red-600 dark:text-red-400" />
        </div>

        {/* Charts */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* User distribution bar chart */}
          <div className="glass-panel rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-100">User distribution</h3>
            <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">Platform user counts by role and verification status</p>
            <div className="mt-5 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} barCategoryGap="40%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(130,144,166,0.12)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} className="text-ink-400" />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} allowDecimals={false} width={28} className="text-ink-400" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(27,145,255,0.05)" }} />
                  <Bar dataKey="count" radius={[6, 6, 3, 3]}>
                    {barChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booking mix pie */}
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-100">Session mix</h3>
            <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">Booking status breakdown</p>
            <div className="relative mt-4 h-44 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatsData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={66}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {bookingStatsData.filter((d) => d.value > 0).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.88} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {stats.bookings.total === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-ink-400">
                  No bookings yet
                </div>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {bookingStatsData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} aria-hidden="true" />
                  <span className="text-xs text-ink-600 dark:text-ink-400 truncate">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity + System diagnostics */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Activity log */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 lg:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-100">Recent platform activity</h3>
              <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">User registrations and booking events</p>
            </div>
            {stats.recentActivity.length ? (
              <div className="relative space-y-5 border-l border-ink-200/60 pl-4 dark:border-white/6">
                {stats.recentActivity.map((log, i) => (
                  <ActivityLogItem key={log.id} log={log} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Activity}
                title="No activity logged"
                description="Platform events will appear here as users register and book sessions."
                size="sm"
              />
            )}
          </div>

          {/* System health + quick actions */}
          <div className="space-y-4">
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-100">System diagnostics</h3>
                <p className="mt-0.5 text-xs text-ink-400 dark:text-ink-500">Live server health status</p>
              </div>
              {[
                { label: "Database", value: stats.health.database, icon: Database, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
                { label: "Memory", value: stats.health.memory, icon: Cpu, color: "bg-brand-500/10 text-brand-600 dark:text-brand-400" },
                {
                  label: "Uptime",
                  value: `${Math.floor(stats.health.uptime / 3600)}h ${Math.floor((stats.health.uptime % 3600) / 60)}m`,
                  icon: Server,
                  color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-ink-200/60 bg-white/60 px-3 py-2.5 dark:border-white/6 dark:bg-white/3">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", item.color)}>
                      <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-medium text-ink-600 dark:text-ink-300">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-ink-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">Quick actions</h4>
              <Link
                to="/admin/verify-mentors"
                className="flex items-center justify-between rounded-xl bg-ink-950 px-4 py-3 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-glow dark:bg-brand-500"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Pending verifications
                </span>
                {stats.users.pendingMentors > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-ink-950 dark:bg-ink-950 dark:text-white">
                    {stats.users.pendingMentors}
                  </span>
                )}
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-2 rounded-xl border border-ink-200/60 bg-white px-4 py-3 text-xs font-semibold text-ink-800 transition hover:bg-ink-50 dark:border-white/8 dark:bg-white/6 dark:text-ink-100 dark:hover:bg-white/10"
              >
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                User management
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

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
  Search,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { Button } from "../../components/ui/Button";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";

const PIE_COLORS = ["#1b91ff", "#10b981", "#f59e0b", "#ef4444"];

export default function AdminDashboardPage() {
  const { stats, isLoading, isError, error, refetch, isFetching } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6" aria-busy="true">
        <Skeleton className="h-44 w-full rounded-[2rem]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Dashboard could not load"
          description={error?.message || "Failed to load admin statistics."}
          actionLabel="Retry"
          onAction={refetch}
        />
      </div>
    );
  }

  // Prepping charts data
  const bookingStatsData = [

    { name: "Pending", value: stats.bookings.pending },
    { name: "Confirmed", value: stats.bookings.total - stats.bookings.pending - stats.bookings.completed - stats.bookings.cancelled },
    { name: "Completed", value: stats.bookings.completed },
    { name: "Cancelled", value: stats.bookings.cancelled },
  ];

  const barChartData = [
    { name: "Total Users", count: stats.users.total, fill: "#8b5cf6" },
    { name: "Students", count: stats.users.students, fill: "#1b91ff" },
    { name: "Mentors", count: stats.users.mentors, fill: "#10b981" },
    { name: "Verified Mentors", count: stats.users.verifiedMentors, fill: "#3b82f6" },
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="glass-panel flex flex-col gap-4 rounded-[2rem] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3. py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-200">
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
              Administrative Control Center
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl dark:text-white">
              Platform Health & Overview.
            </h1>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">
              Real-time analytics, user validation workspace, and system statistics logs.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => refetch()}
              loading={isFetching}
              disabled={isFetching}
              aria-label="Refresh Dashboard stats"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Sync Data
            </Button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Users", value: stats.users.total, icon: Users, text: "Platform registered accounts" },
            { label: "Students", value: stats.users.students, icon: GraduationCap, text: "Active student learners" },
            { label: "Mentors (Total)", value: stats.users.mentors, icon: Briefcase, text: "Verified + unverified mentors" },
            { label: "Pending Verifications", value: stats.users.pendingMentors, icon: ShieldCheck, text: "Mentors awaiting validation review", alert: stats.users.pendingMentors > 0 },
          ].map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel flex flex-col justify-between rounded-3xl p-5"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-300">
                  {card.label}
                </p>
                <div className={className(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-brand-700 dark:text-brand-300",
                  card.alert ? "bg-amber-500/10 text-amber-600 dark:text-amber-300" : "bg-brand-500/10"
                )}>
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <p className={className(
                  "text-3xl font-extrabold tracking-tight",
                  card.alert && card.value > 0 ? "text-amber-600 dark:text-amber-300" : "text-ink-950 dark:text-white"
                )}>
                  {card.value}
                </p>
                <p className="mt-1 text-xxs font-semibold text-ink-400 dark:text-ink-500">
                  {card.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bookings mix stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Bookings", value: stats.bookings.total, icon: CalendarCheck, style: "bg-brand-500/10 text-brand-700" },
            { label: "Completed Sessions", value: stats.bookings.completed, icon: CheckCircle, style: "bg-emerald-500/10 text-emerald-700" },
            { label: "Pending Requests", value: stats.bookings.pending, icon: Clock, style: "bg-amber-500/10 text-amber-700" },
            { label: "Cancelled Sessions", value: stats.bookings.cancelled, icon: XCircle, style: "bg-red-500/10 text-red-700" },
          ].map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx + 4) * 0.05 }}
              className="glass-panel flex flex-col justify-between rounded-3xl p-5"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-300">
                  {card.label}
                </p>
                <div className={className("flex h-8 w-8 items-center justify-center rounded-lg", card.style)}>
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-extrabold text-ink-950 dark:text-white tracking-tight">
                  {card.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts & System log splits */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* User distribution chart */}
          <div className="glass-panel flex flex-col justify-between rounded-3xl p-6 lg:col-span-2">
            <div>
              <h3 className="font-extrabold text-ink-950 dark:text-white">User Statistics</h3>
              <p className="text-xs text-ink-500 dark:text-ink-300 mt-1">Platform user distributions and verified mentor volumes.</p>
            </div>
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(130,144,166,0.15)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" allowDecimals={false} />
                  <Tooltip cursor={{ fill: "rgba(27,145,255,0.06)" }} />
                  <Bar dataKey="count" radius={[8, 8, 4, 4]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart bookings */}
          <div className="glass-panel flex flex-col justify-between rounded-3xl p-6">
            <div>
              <h3 className="font-extrabold text-ink-950 dark:text-white">Sessions Mix</h3>
              <p className="text-xs text-ink-500 dark:text-ink-300 mt-1">Status breakdown of all platform bookings.</p>
            </div>
            <div className="relative h-48 mt-6 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatsData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {bookingStatsData.filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {stats.bookings.total === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-ink-400">
                  No bookings logged
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
              {bookingStatsData.map((d, index) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }} />
                  <span className="text-ink-600 dark:text-ink-300 truncate">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity timelines and platform health log */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity Log */}
          <div className="glass-panel rounded-3xl p-6 lg:col-span-2 space-y-4">
            <div>
              <h3 className="font-extrabold text-ink-950 dark:text-white">Recent Platform Activity</h3>
              <p className="text-xs text-ink-500 dark:text-ink-300 mt-1">Logs of user registrations and session bookings.</p>
            </div>

            {stats.recentActivity.length ? (
              <div className="relative border-l border-ink-200 dark:border-white/10 pl-5 space-y-5">
                {stats.recentActivity.map((log) => (
                  <div key={log.id} className="relative">
                    <span className={className(
                      "absolute -left-[1.625rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white dark:border-ink-950 text-[10px] font-bold text-white",
                      log.type === "user" ? "bg-brand-500" : "bg-emerald-500"
                    )}>
                      {log.type === "user" ? "U" : "B"}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-950 dark:text-white">
                        {log.title}
                      </p>
                      <p className="text-xs text-ink-600 dark:text-ink-300 mt-0.5">
                        {log.description}
                      </p>
                      <p className="text-[10px] text-ink-400 dark:text-ink-500 mt-1">
                        {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-400 italic">No activity logs recorded today.</p>
            )}
          </div>

          {/* System Health Panel */}
          <div className="glass-panel rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="font-extrabold text-ink-950 dark:text-white">System Diagnostics</h3>
              <p className="text-xs text-ink-500 dark:text-ink-300 mt-1">Server health check states.</p>
            </div>

            <div className="grid gap-3">
              {[
                { label: "Database Connection", value: stats.health.database, icon: Database, color: "text-emerald-500 bg-emerald-500/10" },
                { label: "Memory Footprint", value: stats.health.memory, icon: Cpu, color: "text-brand-500 bg-brand-500/10" },
                { label: "Server Uptime", value: `${Math.floor(stats.health.uptime / 3600)}h ${Math.floor((stats.health.uptime % 3600) / 60)}m`, icon: Server, color: "text-violet-500 bg-violet-500/10" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-2xl border border-ink-200/50 bg-white/50 dark:border-white/5 dark:bg-white/4">
                  <div className="flex items-center gap-3">
                    <div className={className("p-2 rounded-xl", item.color)}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-ink-600 dark:text-ink-300">{item.label}</span>
                  </div>
                  <span className="text-xs font-extrabold text-ink-950 dark:text-white uppercase tracking-wider">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-3 pt-3 border-t border-ink-200/50 dark:border-white/5">
              <h4 className="text-xs font-extrabold text-ink-500 dark:text-ink-400 uppercase tracking-wider">Quick actions</h4>
              <div className="grid gap-2">
                <Link
                  to="/admin/verify-mentors"
                  className="flex items-center justify-between p-3 rounded-2xl border border-ink-200 bg-brand-500 text-white hover:bg-brand-600 transition text-xs font-bold shadow-md"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Pending Verification
                  </span>
                  {stats.users.pendingMentors > 0 && (
                    <span className="bg-white text-brand-600 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      {stats.users.pendingMentors}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center gap-2 p-3 rounded-2xl border border-ink-200 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10 hover:bg-ink-50 transition text-xs font-bold shadow-sm"
                >
                  <Search className="h-4 w-4" />
                  Search User Profiles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Helpers
function className(...classes) {
  return classes.filter(Boolean).join(" ");
}

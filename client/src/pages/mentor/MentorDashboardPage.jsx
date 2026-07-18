import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  RefreshCw,
  Star,
  Users,
  XCircle,
  Activity,
  CalendarRange,
  Bell,
  BookOpenCheck,
  Video,
} from "lucide-react";
import {
  BarChart,
  Bar,
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
import { useMentorDashboard } from "../../hooks/useMentorDashboard";
import { cn } from "../../utils/cn";

// ── Helpers ────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: "Pending",   dot: "bg-amber-400",   pill: "bg-amber-500/12 text-amber-300"  },
  confirmed: { label: "Confirmed", dot: "bg-accent-mentor", pill: "bg-emerald-500/12 text-emerald-300" },
  completed: { label: "Completed", dot: "bg-accent-primary", pill: "bg-amber-500/12 text-amber-300"    },
  cancelled: { label: "Cancelled", dot: "bg-accent-danger",  pill: "bg-red-500/12 text-red-400"        },
};

const CHART_COLORS = {
  Pending:   "#f59e0b",
  Confirmed: "#10b981",
  Completed: "#F5A623",
  Cancelled: "#f43f5e",
};

function fmt(v) {
  if (!v) return "—";
  try { return format(new Date(v), "MMM d"); } catch { return v; }
}
function fmtTime(v) { return v ? v.slice(0, 5) : ""; }

// ── CountUp ────────────────────────────────────────────────────────────────
function CountUp({ target, duration = 900 }) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const t = Number(target) || 0;
    if (t === 0) { setVal(0); return; }
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(p * t));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return <>{val}</>;
}

// ── Loading skeleton ───────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0,1,2,3].map(i => <SkeletonStat key={i} />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, hint, index, accent, wide }) {
  const MotionIcon = Icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.28 }}
      className={cn(
        "group rounded-2xl border border-border-subtle bg-bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5",
        wide && "md:col-span-2",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">{label}</p>
          <p className={cn(
            "mt-2 tabular-nums text-3xl font-extrabold tracking-tight",
            accent ? "text-accent-mentor" : "text-text-primary",
          )}>
            <CountUp target={value ?? 0} />
          </p>
          {hint && <p className="mt-1.5 text-xs text-text-tertiary">{hint}</p>}
        </div>
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
          accent
            ? "bg-emerald-500/12 text-accent-mentor"
            : "bg-bg-elevated text-text-secondary",
        )}>
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Chart Tooltip ──────────────────────────────────────────────────────────
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-floating px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-text-primary">{payload[0]?.name}</p>
      <p className="mt-0.5 text-text-secondary">{payload[0]?.value} session{payload[0]?.value !== 1 ? "s" : ""}</p>
    </div>
  );
}

// ── Today's Schedule Agenda Cards ──────────────────────────────────────────
function AgendaItem({ booking, index }) {
  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const studentName = booking.student?.full_name || "Student";
  const initials = studentName.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between gap-4 rounded-xl border border-border-subtle bg-bg-elevated p-4 mb-3 last:mb-0 transition duration-150 hover:border-border-strong"
    >
      <div className="flex items-center gap-3">
        {/* time block */}
        <div className="rounded-lg bg-bg-floating px-2.5 py-1.5 text-center min-w-[70px]">
          <p className="text-xs font-bold text-text-primary">{fmtTime(booking.start_time)}</p>
          <p className="text-[9px] font-semibold text-text-tertiary">{fmt(booking.booking_date)}</p>
        </div>
        {/* Avatar/Initials */}
        {booking.student?.avatar_url ? (
          <img src={booking.student.avatar_url} alt="" className="h-8 w-8 rounded-lg object-cover border border-border-subtle" />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-floating text-[10px] font-bold text-text-primary">
            {initials}
          </div>
        )}
        <div>
          <p className="text-xs font-bold text-text-primary">{studentName}</p>
          <p className="text-[10px] text-text-tertiary">{booking.meeting_type || "Virtual Session"}</p>
        </div>
      </div>
      <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold", cfg.pill)}>
        {cfg.label}
      </span>
    </motion.li>
  );
}

// ── Pending Request Row ────────────────────────────────────────────────────
function PendingRow({ booking, index, onApprove, onDecline, isUpdating }) {
  const studentName = booking.student?.full_name || "Student";
  const initials = studentName.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-3"
    >
      {/* Avatar */}
      {booking.student?.avatar_url ? (
        <img src={booking.student.avatar_url} alt="" className="h-9 w-9 rounded-xl object-cover border border-border-subtle" />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-bg-floating text-xs font-bold text-text-primary">
          {initials}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-text-primary">{studentName}</p>
        <p className="mt-0.5 text-[10px] text-text-tertiary">{fmt(booking.booking_date)} · {fmtTime(booking.start_time)}–{fmtTime(booking.end_time)}</p>
      </div>
      <div className="flex shrink-0 gap-1.5" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onApprove(booking.id)}
          title="Confirm"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/12 text-accent-mentor transition hover:bg-accent-mentor hover:text-[var(--bg-base)] disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onDecline(booking.id)}
          title="Decline"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </motion.li>
  );
}

// ── Section ────────────────────────────────────────────────────────────────
function Section({ title, subtitle, action, children }) {
  return (
    <section className="rounded-2xl border border-border-subtle bg-bg-surface p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-text-primary">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-text-tertiary">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
// ── Dashboard subtext typewriter ──────────────────────────────────────────────
const SUBTEXT_PHRASES = [
  "Manage your sessions, review incoming requests, and keep schedule current.",
  "Configure availability slots to allow student bookings.",
  "Check for new pending requests in your inbox.",
];

const TYPING_SPEED = 40;
const ERASING_SPEED = 20;
const PAUSE_AFTER = 2500;
const PAUSE_BEFORE = 300;

function DashboardTypewriter() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    const target = SUBTEXT_PHRASES[phraseIndex];

    if (phase === "typing") {
      if (displayed.length < target.length) {
        const t = setTimeout(() => {
          setDisplayed(target.slice(0, displayed.length + 1));
        }, TYPING_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("erasing"), PAUSE_AFTER);
        return () => clearTimeout(t);
      }
    }

    if (phase === "erasing") {
      if (displayed.length > 0) {
        const t = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, ERASING_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % SUBTEXT_PHRASES.length);
          setPhase("typing");
        }, PAUSE_BEFORE);
        return () => clearTimeout(t);
      }
    }
  }, [displayed, phase, phraseIndex]);

  return (
    <span className="text-accent-mentor">
      {displayed}
      <span
        className="inline-block w-[1.5px] h-[1em] bg-accent-mentor align-middle ml-[2px] animate-blink"
        aria-hidden="true"
      />
    </span>
  );
}

export default function MentorDashboardPage() {
  const { user, refetchUser } = useAuth();
  const navigate = useNavigate();
  const dashboard = useMentorDashboard();
  const firstName = (user?.full_name || user?.name || "Mentor").split(" ")[0];

  // Today's sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);
  const todaySessions = dashboard.bookings.filter(b => {
    const d = b.booking_date ? new Date(b.booking_date).toISOString().slice(0, 10) : null;
    return d === todayStr && b.status !== "cancelled";
  });
  const pendingBookings = dashboard.bookings.filter(b => b.status === "pending").slice(0, 5);
  
  // Verification check on user directly (from supabase auth / users table)
  const isVerified = Boolean(user?.is_verified);

  // Bar chart data
  const chartData = [
    { name: "Pending",   value: dashboard.stats.pending,   fill: CHART_COLORS.Pending   },
    { name: "Confirmed", value: dashboard.stats.confirmed, fill: CHART_COLORS.Confirmed },
    { name: "Completed", value: dashboard.stats.completed, fill: CHART_COLORS.Completed },
    { name: "Cancelled", value: dashboard.stats.cancelled, fill: CHART_COLORS.Cancelled },
  ];

  function goToBookings() { navigate("/mentor/bookings"); }

  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  const handleRefresh = async () => {
    await Promise.all([
      dashboard.refetchAll(),
      refetchUser(),
    ]);
  };

  if (dashboard.isLoading) return <DashboardSkeleton />;

  if (dashboard.isError) {
    return (
      <div className="mx-auto max-w-2xl pt-8">
        <EmptyState
          icon={Activity}
          title="Dashboard unavailable"
          description={dashboard.error?.message || "Could not fetch mentor data."}
          actionLabel="Retry"
          onAction={handleRefresh}
          size="lg"
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-5">

        {/* ── Hero ── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6"
        >
          {/* emerald top shimmer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent-mentor), transparent)" }}
          />
          {/* soft glow orb */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)" }}
          />

          <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <div>
              {/* badge row */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{ background: "rgba(16,185,129,0.12)", color: "var(--accent-mentor)" }}
                >
                  <CalendarClock className="h-3 w-3" aria-hidden="true" />
                  Mentor workspace
                </span>
                {isVerified ? (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: "rgba(16,185,129,0.08)", color: "var(--accent-mentor)" }}
                  >
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Verified mentor
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: "rgba(245,166,35,0.12)", color: "var(--accent-primary)" }}
                  >
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    Verification Pending
                  </span>
                )}
                {todaySessions.length > 0 && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: "rgba(245,166,35,0.12)", color: "var(--accent-primary)" }}
                  >
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {todaySessions.length} session{todaySessions.length !== 1 ? "s" : ""} today
                  </span>
                )}
              </div>

              <h1 className="font-display text-display font-semibold text-text-primary leading-tight mt-4">
                Good to see you, {firstName}.
              </h1>
              <p className="mt-2 text-sm leading-6 text-text-secondary min-h-[2.5rem] md:min-h-[1.5rem]">
                <DashboardTypewriter />
              </p>

              {/* Profile incomplete warning indicator */}
              {dashboard.profileCompletion < 100 && (
                <div className="mt-5 flex flex-col gap-3 rounded border border-border-subtle bg-bg-elevated/30 p-4 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text-primary">Profile Setup Status</span>
                    <span className="font-semibold text-accent-mentor">{dashboard.profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-bg-elevated rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "var(--accent-mentor)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${dashboard.profileCompletion}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <Link
                    to="/mentor/profile"
                    className="text-[11px] font-bold text-accent-mentor hover:underline transition w-fit mt-1"
                  >
                    Complete your profile info →
                  </Link>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={dashboard.isFetching}
                className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", dashboard.isFetching && "animate-spin")} aria-hidden="true" />
                {dashboard.isFetching ? "Refreshing…" : "Refresh"}
              </button>
              <Link
                to="/mentor/availability"
                className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-bg-elevated px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:-translate-y-0.5"
              >
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                Manage slots
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ── Asymmetric Stats Grid ── */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatCard icon={BookOpenCheck} label="Total sessions"  value={dashboard.stats.total}                      hint="All time records"                    index={0} wide />
          <StatCard icon={Clock}         label="Upcoming"        value={dashboard.upcomingBookings.length}          hint="Future sessions"                    index={1} />
          <StatCard icon={Users}         label="Pending"         value={dashboard.stats.pending}                    hint="Awaiting your approval"             index={2} accent={dashboard.stats.pending > 0} />
          <StatCard icon={Star}          label="Completed"       value={dashboard.stats.completed}                  hint="Successfully finished"              index={3} accent />
          <StatCard icon={Bell}          label="Notifications"   value={dashboard.unreadNotifications.length}       hint="Unread"                             index={4} accent={dashboard.unreadNotifications.length > 0} />
        </div>

        {/* ── Today's Schedule + Chart ── */}
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Section
            title="Today's schedule"
            subtitle={todaySessions.length ? `${todaySessions.length} session${todaySessions.length !== 1 ? "s" : ""} scheduled` : "No sessions scheduled for today"}
            action={
              <Link to="/mentor/bookings" className="text-xs font-semibold" style={{ color: "var(--accent-mentor)" }}>
                All bookings →
              </Link>
            }
          >
            {todaySessions.length ? (
              <ul className="flex flex-col">
                {todaySessions.map((b, i) => <AgendaItem key={b.id} booking={b} index={i} />)}
              </ul>
            ) : (
              <EmptyState
                icon={CalendarRange}
                title="Free day ahead"
                description="No sessions today. Upcoming sessions will appear below."
                size="sm"
              />
            )}
            {/* Upcoming beyond today */}
            {dashboard.upcomingBookings.filter(b => {
              const d = b.booking_date ? new Date(b.booking_date).toISOString().slice(0, 10) : null;
              return d !== todayStr;
            }).slice(0, 3).length > 0 && (
              <div className="mt-5 border-t border-border-subtle/50 pt-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Upcoming sessions</p>
                <ul className="flex flex-col">
                  {dashboard.upcomingBookings
                    .filter(b => {
                      const d = b.booking_date ? new Date(b.booking_date).toISOString().slice(0, 10) : null;
                      return d !== todayStr;
                    })
                    .slice(0, 3)
                    .map((b, i) => <AgendaItem key={b.id} booking={b} index={i} />)}
                </ul>
              </div>
            )}
          </Section>

          <Section title="Session statistics" subtitle="Status distribution">
            {dashboard.stats.total > 0 ? (
              <div className="h-64 rounded-xl border border-border-subtle bg-bg-elevated p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barCategoryGap="36%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} width={24} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(16,185,129,0.05)" }} />
                    <Bar dataKey="value" radius={[6, 6, 3, 3]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} fillOpacity={0.9} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState icon={Activity} title="No stats yet" description="Chart activates after your first booking." size="sm" />
            )}
          </Section>
        </div>

        {/* ── Pending Requests ── */}
        <Section
          title="Pending requests"
          subtitle="Students waiting for your confirmation"
          action={
            pendingBookings.length > 0 && (
              <button
                type="button"
                onClick={goToBookings}
                className="text-xs font-semibold"
                style={{ color: "var(--accent-mentor)" }}
              >
                Manage all →
              </button>
            )
          }
        >
          {pendingBookings.length ? (
            <ul className="space-y-2">
              {pendingBookings.map((b, i) => (
                <PendingRow
                  key={b.id}
                  booking={b}
                  index={i}
                  onApprove={goToBookings}
                  onDecline={goToBookings}
                  isUpdating={false}
                />
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="All clear"
              description="No pending booking requests at the moment."
              size="sm"
            />
          )}
        </Section>

        {/* ── Quick actions ── */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: CalendarClock, title: "Set availability",  desc: "Define bookable time slots",  to: "/mentor/availability" },
            { icon: CalendarRange, title: "Review bookings",   desc: "Manage all student sessions", to: "/mentor/bookings"     },
            { icon: Star,          title: "Update profile",    desc: "Keep credentials current",    to: "/mentor/profile"      },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <Link
                to={item.to}
                className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-bg-surface px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
                  style={{ background: "rgba(16,185,129,0.10)", color: "var(--accent-mentor)" }}
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-tertiary">{item.desc}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-text-tertiary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}

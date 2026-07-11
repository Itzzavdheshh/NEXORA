import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../utils/cn";

// ── Stat card ─────────────────────────────────────────────────────────────────
export const MentorStatCard = memo(function MentorStatCard({
  icon,
  label,
  value,
  hint,
  index,
  accent,
}) {
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
          <p
            className={cn(
              "mt-3 text-3xl font-extrabold tracking-tight",
              accent
                ? "text-brand-600 dark:text-brand-200"
                : "text-ink-950 dark:text-white",
            )}
          >
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
});

// ── Dashboard hero header ─────────────────────────────────────────────────────
export function DashboardHero({ displayName, profileCompletion, onRefresh, isFetching }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-[#101827]/90 dark:shadow-[0_28px_90px_rgba(0,0,0,0.48)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-300/70 to-transparent dark:via-brand-200/40" />

      <div className="relative grid gap-7 p-6 sm:p-7 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Mentor workspace
          </p>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl lg:text-5xl dark:text-white">
            Welcome back, {displayName}. Your mentorship impact starts here.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base dark:text-ink-200">
            Manage your schedule, track bookings, and build real impact for students you mentor.
          </p>

          {profileCompletion < 100 && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-ink-950 dark:text-white">
                  Profile completion
                </p>
                <p className="text-sm font-extrabold text-brand-700 dark:text-brand-200">
                  {profileCompletion}%
                </p>
              </div>
              <div className="h-2 rounded-full bg-ink-200 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-mint-500 transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
                Complete your profile to increase student trust.
              </p>
            </div>
          )}
        </div>

        <div className="grid content-end gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Link
            className="group flex items-center justify-between rounded-2xl border border-ink-200 bg-ink-950 px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 dark:border-brand-300/30 dark:bg-brand-300 dark:text-ink-950"
            to="/mentor/availability"
          >
            Manage availability
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Button variant="secondary" onClick={onRefresh} loading={isFetching}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh dashboard
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

// ── Reusable section wrapper ──────────────────────────────────────────────────
export function DashboardSection({ title, description, children, action }) {
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

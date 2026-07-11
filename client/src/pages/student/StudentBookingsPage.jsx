import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Video,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton } from "../../components/ui/Skeleton";
import { useStudentBookings } from "../../hooks/useStudentBookings";
import { cn } from "../../utils/cn";

const statusStyles = {
  pending: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
  completed: "border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-100",
  cancelled: "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-100",
};

function formatDate(value) {
  if (!value) return "Date unavailable";

  try {
    return format(new Date(value), "MMM d, yyyy");
  } catch {
    return value;
  }
}

function BookingsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Skeleton className="h-52 w-full" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-56 w-full" />
        ))}
      </div>
    </div>
  );
}

function BookingCard({ booking, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="glass-panel rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-glow sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-200">
            Booking #{String(booking.id || "").slice(0, 8) || "session"}
          </p>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-ink-950 dark:text-white">
            Mentorship session
          </h2>
        </div>
        <span
          className={cn(
            "inline-flex w-fit rounded-full border px-3 py-1 text-xs font-extrabold capitalize",
            statusStyles[booking.status] || "border-ink-200 bg-ink-50 text-ink-700 dark:border-white/10 dark:bg-white/10 dark:text-ink-100",
          )}
        >
          {booking.status || "unknown"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8">
          <div className="flex items-center gap-2 text-sm font-bold text-ink-950 dark:text-white">
            <CalendarDays className="h-4 w-4 text-brand-700 dark:text-brand-200" aria-hidden="true" />
            {formatDate(booking.booking_date)}
          </div>
          <p className="mt-2 text-xs leading-5 text-ink-500 dark:text-ink-300">Booking date</p>
        </div>
        <div className="rounded-2xl border border-ink-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8">
          <div className="flex items-center gap-2 text-sm font-bold text-ink-950 dark:text-white">
            <Clock3 className="h-4 w-4 text-brand-700 dark:text-brand-200" aria-hidden="true" />
            {booking.start_time || "Start"} {booking.end_time ? `- ${booking.end_time}` : ""}
          </div>
          <p className="mt-2 text-xs leading-5 text-ink-500 dark:text-ink-300">Session time</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center gap-2 text-ink-600 dark:text-ink-300">
          <Video className="h-4 w-4" aria-hidden="true" />
          <span className="font-semibold text-ink-950 dark:text-white">
            {booking.meeting_type || "Meeting type not provided"}
          </span>
        </div>
        <p className="rounded-2xl border border-ink-200/80 bg-white/55 p-4 leading-6 text-ink-600 dark:border-white/10 dark:bg-white/8 dark:text-ink-300">
          {booking.notes || "No notes were added to this booking."}
        </p>
      </div>

      <div className="mt-5 grid gap-2 border-t border-ink-200/70 pt-4 text-xs text-ink-500 dark:border-white/10 dark:text-ink-300 sm:grid-cols-2">
        <p className="truncate">Mentor ID: {booking.mentor_id || "Not provided"}</p>
        <p className="truncate">Slot ID: {booking.availability_slot_id || "Not provided"}</p>
      </div>
    </motion.article>
  );
}

function BookingGroup({ title, description, bookings }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-ink-950 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-ink-600 dark:text-ink-300">{description}</p>
      </div>
      {bookings.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {bookings.map((booking, index) => (
            <BookingCard key={booking.id || `${title}-${index}`} booking={booking} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${title.toLowerCase()}`}
          description="Bookings returned by your backend will appear here when they match this section."
        />
      )}
    </section>
  );
}

export default function StudentBookingsPage() {
  const bookings = useStudentBookings();
  const [detailsOpen, setDetailsOpen] = useState(true);
  const stats = useMemo(
    () => ({
      total: bookings.bookings.length,
      visible: bookings.filteredBookings.length,
      upcoming: bookings.upcomingBookings.length,
      past: bookings.pastBookings.length,
    }),
    [bookings],
  );

  if (bookings.isLoading) return <BookingsSkeleton />;

  if (bookings.isError) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Bookings could not load"
          description={bookings.error?.message || "Nexora could not fetch your bookings."}
          actionLabel="Retry"
          onAction={bookings.refetch}
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2rem] p-6 sm:p-7"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-100">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                Student bookings
              </p>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl dark:text-white">
                Manage every mentorship booking with clarity.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-200">
                Search, filter, and review booking data exactly as returned by the backend.
              </p>
            </div>
            <Button variant="secondary" onClick={bookings.refetch} loading={bookings.isFetching}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Refresh
            </Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Total", stats.total],
              ["Visible", stats.visible],
              ["Upcoming", stats.upcoming],
              ["Past", stats.past],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-ink-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">{label}</p>
                <p className="mt-2 text-2xl font-extrabold text-ink-950 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <section className="glass-panel rounded-3xl p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <input
                value={bookings.search}
                onChange={(event) => bookings.setSearch(event.target.value)}
                placeholder="Search status, notes, meeting type, IDs..."
                className="h-12 w-full rounded-2xl border border-ink-200 bg-white/80 pl-11 pr-4 text-sm font-medium text-ink-900 shadow-sm transition placeholder:text-ink-400 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-ink-400"
              />
            </label>

            <select
              value={bookings.status}
              onChange={(event) => bookings.setStatus(event.target.value)}
              className="h-12 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-800 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={bookings.timeframe}
              onChange={(event) => bookings.setTimeframe(event.target.value)}
              className="h-12 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-800 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
              aria-label="Filter by timeframe"
            >
              <option value="all">All dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            <select
              value={bookings.sort}
              onChange={(event) => bookings.setSort(event.target.value)}
              className="h-12 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-800 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
              aria-label="Sort bookings"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="status">Status</option>
            </select>

            <button
              type="button"
              onClick={() => setDetailsOpen((value) => !value)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-800 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              aria-pressed={detailsOpen}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Details
            </button>
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink-500 dark:text-ink-300">
            <Filter className="h-3.5 w-3.5" aria-hidden="true" />
            Showing {stats.visible} of {stats.total} bookings.
          </p>
        </section>

        {!stats.visible ? (
          <EmptyState
            title="No bookings match your filters"
            description="Try clearing search, status, or date filters to see more backend booking records."
            actionLabel="Clear search"
            onAction={() => {
              bookings.setSearch("");
              bookings.setStatus("all");
              bookings.setTimeframe("all");
            }}
          />
        ) : detailsOpen ? (
          <div className="space-y-8">
            <BookingGroup
              title="Upcoming bookings"
              description="Future dated mentorship sessions returned by the booking API."
              bookings={bookings.upcomingBookings}
            />
            <BookingGroup
              title="Past bookings"
              description="Older or undated sessions kept available for review."
              bookings={bookings.pastBookings}
            />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {bookings.filteredBookings.map((booking, index) => (
              <BookingCard key={booking.id || index} booking={booking} index={index} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

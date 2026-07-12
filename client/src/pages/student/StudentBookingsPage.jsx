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
  X,
  FileText,
  User,
  Hash,
  Info,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton, SkeletonCard, SkeletonStat } from "../../components/ui/Skeleton";
import { useStudentBookings } from "../../hooks/useStudentBookings";
import { cn } from "../../utils/cn";
import { Drawer } from "../../components/ui/Drawer";

// Status configuration matching the design tokens
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    style: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    style: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  completed: {
    label: "Completed",
    style: "bg-[var(--accent-mentor)]/10 text-[var(--accent-mentor)] border-[var(--accent-mentor)]/20",
    dot: "bg-[var(--accent-mentor)]",
  },
  cancelled: {
    label: "Cancelled",
    style: "bg-[var(--accent-danger)]/10 text-[var(--accent-danger)] border-[var(--accent-danger)]/20",
    dot: "bg-[var(--accent-danger)]",
  },
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
      <Skeleton className="h-52 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <SkeletonCard key={item} />
        ))}
      </div>
    </div>
  );
}

function BookingCard({ booking, index, onOpen }) {
  const config = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
  const mentorName = booking.mentor?.full_name || booking.mentor?.name || "Mentor";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      onClick={onOpen}
      className="cursor-pointer rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition duration-150 hover:border-[var(--border-strong)] hover:shadow-token-sm flex flex-col justify-between"
    >
      <div>
        {/* Card Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
              <Hash className="h-3 w-3" />
              ID: {String(booking.id || "").slice(0, 8)}
            </div>
            <h2 className="mt-1.5 text-sm font-bold text-[var(--text-primary)]">
              Mentorship session with {mentorName}
            </h2>
          </div>
          <span className={cn("badge text-[10px] w-fit border", config.style)}>
            <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", config.dot)} aria-hidden="true" />
            {config.label}
          </span>
        </div>

        {/* Schedule grid */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
              <CalendarDays className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
              {formatDate(booking.booking_date)}
            </div>
            <p className="mt-1 text-[9px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider">Date</p>
          </div>
          <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
              <Clock3 className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
              {booking.start_time?.slice(0, 5) || "Start"} {booking.end_time ? `- ${booking.end_time.slice(0, 5)}` : ""}
            </div>
            <p className="mt-1 text-[9px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider">Time (Local)</p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between">
        <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider flex items-center gap-1.5">
          <Video className="h-3.5 w-3.5" />
          Format: {booking.meeting_type || "Online"}
        </span>
        <span className="text-[11px] font-bold text-[var(--accent-primary)] flex items-center gap-1 group">
          View Details
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.article>
  );
}

function BookingGroup({ title, description, bookings, onOpenCard }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">{title}</h2>
        <p className="text-xs text-[var(--text-secondary)]">{description}</p>
      </div>
      {bookings.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {bookings.map((booking, index) => (
            <BookingCard
              key={booking.id || `${title}-${index}`}
              booking={booking}
              index={index}
              onOpen={() => onOpenCard(booking)}
            />
          ))}
        </div>
      ) : (
        <div className="py-6">
          <EmptyState
            icon={CalendarDays}
            title={`No ${title.toLowerCase()}`}
            description={`Your schedule does not contain any ${title.toLowerCase()} currently.`}
            size="sm"
          />
        </div>
      )}
    </section>
  );
}

export default function StudentBookingsPage() {
  const bookings = useStudentBookings();
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);

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
      <div className="mx-auto max-w-2xl pt-8">
        <EmptyState
          icon={CalendarDays}
          title="Bookings could not load"
          description={bookings.error?.message || "Nexora could not fetch your bookings."}
          actionLabel="Retry"
          onAction={bookings.refetch}
          size="lg"
        />
      </div>
    );
  }

  // Active booking detail formatting parameters
  const activeConfig = activeBooking ? (STATUS_CONFIG[activeBooking.status] || STATUS_CONFIG.pending) : null;
  const activeMentorName = activeBooking ? (activeBooking.mentor?.full_name || activeBooking.mentor?.name || "Mentor") : "";
  const activeInitials = activeMentorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-5">
        
        {/* Header Hero Banner */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="badge border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px]">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Student Bookings
              </p>
              <h1 className="font-display text-display font-semibold text-[var(--text-primary)] leading-tight mt-4">
                Mentorship schedule overview.
              </h1>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                Browse upcoming sessions, complete logs, and review previous mentorship engagements.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={bookings.refetch} loading={bookings.isFetching}>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Refresh
            </Button>
          </div>

          {/* Stats strip */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Total booked", stats.total, "All time"],
              ["Matches", stats.visible, "Filtered count"],
              ["Upcoming", stats.upcoming, "Active scheduled"],
              ["Completed/Past", stats.past, "Archived logs"],
            ].map(([label, value, desc]) => (
              <div key={label} className="rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">{label}</p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums text-[var(--text-primary)]">{value}</p>
                <p className="mt-1 text-[10px] text-[var(--text-tertiary)]">{desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Search & Filters */}
        <section className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" aria-hidden="true" />
              <input
                type="search"
                value={bookings.search}
                onChange={(event) => bookings.setSearch(event.target.value)}
                placeholder="Search notes, format, IDs..."
                aria-label="Search bookings"
                className="h-11 w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] pl-11 pr-4 text-xs font-semibold text-[var(--text-primary)] shadow-token-sm transition placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)] focus:outline-none focus:ring-0"
              />
            </label>

            <select
              value={bookings.status}
              onChange={(event) => bookings.setStatus(event.target.value)}
              className="h-11 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-xs font-semibold text-[var(--text-secondary)] shadow-token-sm focus:border-[var(--border-strong)] focus:outline-none focus:ring-0"
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
              className="h-11 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-xs font-semibold text-[var(--text-secondary)] shadow-token-sm focus:border-[var(--border-strong)] focus:outline-none focus:ring-0"
              aria-label="Filter by timeframe"
            >
              <option value="all">All dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>

            <select
              value={bookings.sort}
              onChange={(event) => bookings.setSort(event.target.value)}
              className="h-11 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-xs font-semibold text-[var(--text-secondary)] shadow-token-sm focus:border-[var(--border-strong)] focus:outline-none focus:ring-0"
              aria-label="Sort bookings"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="status">Status</option>
            </select>

            <button
              type="button"
              onClick={() => setDetailsOpen((value) => !value)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 text-xs font-bold text-[var(--text-secondary)] shadow-token-sm transition hover:bg-[var(--bg-elevated)]"
              aria-pressed={detailsOpen}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              {detailsOpen ? "Hide groups" : "Show groups"}
            </button>
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)]">
            <Filter className="h-3.5 w-3.5 text-[var(--text-tertiary)]" aria-hidden="true" />
            Showing {stats.visible} of {stats.total} bookings.
          </p>
        </section>

        {/* Results grid / groups */}
        {!stats.visible ? (
          <EmptyState
            icon={CalendarDays}
            title="No matches found"
            description="Adjust or clear search filters to view your bookings."
            actionLabel="Reset filters"
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
              description="Future scheduled sessions."
              bookings={bookings.upcomingBookings}
              onOpenCard={setActiveBooking}
            />
            <BookingGroup
              title="Past bookings"
              description="Older session records."
              bookings={bookings.pastBookings}
              onOpenCard={setActiveBooking}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {bookings.filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking.id || index}
                booking={booking}
                index={index}
                onOpen={() => setActiveBooking(booking)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Slide-over details drawer (reusable shared layout pattern) */}
      <Drawer
        open={!!activeBooking}
        onClose={() => setActiveBooking(null)}
        title="Booking Details"
      >
        {activeBooking && (
          <div className="space-y-6 text-[var(--text-primary)]">
            
            {/* Status card */}
            <div className="rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] block mb-2">Session Status</span>
              <span className={cn("badge text-xs border inline-flex items-center", activeConfig.style)}>
                <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", activeConfig.dot)} />
                {activeConfig.label}
              </span>
            </div>

            {/* Mentor info */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] block">Assigned Mentor</span>
              <div className="flex items-center gap-3 p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/20">
                {activeBooking.mentor?.avatar_url ? (
                  <img
                    src={activeBooking.mentor.avatar_url}
                    alt=""
                    className="h-12 w-12 rounded object-cover border border-[var(--border-subtle)]"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm font-bold">
                    {activeInitials}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">{activeMentorName}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{activeBooking.mentor?.email || "No email available"}</p>
                </div>
              </div>
            </div>

            {/* Schedule details */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] block">Schedule details</span>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/20">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--text-tertiary)] block">Date</span>
                  <span className="text-xs font-bold mt-1 block">{formatDate(activeBooking.booking_date)}</span>
                </div>
                <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/20">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--text-tertiary)] block">Time Slot</span>
                  <span className="text-xs font-bold mt-1 block">
                    {activeBooking.start_time?.slice(0, 5) || "Start"} {activeBooking.end_time ? `- ${activeBooking.end_time.slice(0, 5)}` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Location / meeting type */}
            <div className="p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-4.5 w-4.5 text-[var(--accent-primary)]" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[var(--text-tertiary)] block">Meeting Format</span>
                  <span className="text-xs font-semibold mt-0.5 block capitalize">{activeBooking.meeting_type || "Online Call"}</span>
                </div>
              </div>
            </div>

            {/* Student logs/notes */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)] block">Student notes</span>
              <div className="p-4 rounded border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/20">
                <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
                  {activeBooking.notes || "No notes provided for this session."}
                </p>
              </div>
            </div>

            {/* Identifiers */}
            <div className="border-t border-[var(--border-subtle)] pt-4 space-y-2 text-[10px] text-[var(--text-tertiary)] font-medium">
              <div className="flex justify-between">
                <span>Booking ID:</span>
                <span className="font-mono">{activeBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Mentor ID:</span>
                <span className="font-mono">{activeBooking.mentor_id || "None"}</span>
              </div>
              <div className="flex justify-between">
                <span>Slot ID:</span>
                <span className="font-mono">{activeBooking.availability_slot_id || "None"}</span>
              </div>
            </div>

          </div>
        )}
      </Drawer>
    </PageTransition>
  );
}

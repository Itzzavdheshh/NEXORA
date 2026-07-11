import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarRange, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageTransition } from "../../components/ui/PageTransition";
import { useMentorBookings } from "../../hooks/useMentorBookings";
import { BookingCard } from "./bookings/BookingCard";
import { BookingFilters } from "./bookings/BookingFilters";
import { BookingSkeleton } from "./bookings/BookingSkeleton";
import { BookingDrawer } from "./bookings/BookingDrawer";

// ── HeaderStats ──────────────────────────────────────────────────────────────
function BookingHeaderStats({ stats, isFetching, onRefresh }) {
  return (
    <div className="glass-panel rounded-[2rem] p-6 sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-200">
            <CalendarRange className="h-3.5 w-3.5" aria-hidden="true" />
            Booking Management
          </p>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl dark:text-white">
            Manage your student sessions.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-200">
            Confirm incoming session requests, mark active sessions completed, or manage student cancellations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            onClick={onRefresh}
            loading={isFetching}
            disabled={isFetching}
            aria-label="Refresh bookings"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Pending request", value: stats.pending, key: "pending" },
          { label: "Confirmed session", value: stats.confirmed, key: "confirmed", accent: true },
          { label: "Completed", value: stats.completed, key: "completed" },
          { label: "Total history", value: stats.total, key: "total" },
        ].map(({ label, value, key, accent }) => (
          <div
            key={key}
            className="rounded-2xl border border-ink-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">
              {label}
            </p>
            <p
              className={className(
                "mt-2 text-2xl font-extrabold",
                accent && value > 0
                  ? "text-brand-600 dark:text-brand-200"
                  : "text-ink-950 dark:text-white",
              )}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper to handle helper className
function className(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ── Empty States ──────────────────────────────────────────────────────────────
function BookingsEmptyState({ filter, onClear }) {
  if (filter === "pending") {
    return (
      <EmptyState
        title="No pending requests"
        description="Great! You have cleared all student booking requests. No actions needed."
      />
    );
  }

  if (filter === "confirmed") {
    return (
      <EmptyState
        title="No confirmed sessions"
        description="Once you accept pending requests, they'll show up in this view."
      />
    );
  }

  if (filter === "completed") {
    return (
      <EmptyState
        title="No completed sessions yet"
        description="Completed sessions will be logged here once you wrap them up."
      />
    );
  }

  if (filter === "cancelled") {
    return (
      <EmptyState
        title="No cancelled sessions"
        description="No sessions have been cancelled by you or your students."
      />
    );
  }

  if (filter === "all") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-3xl p-8 text-center sm:p-10"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 shadow-sm dark:bg-brand-300/10 dark:text-brand-200">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-ink-950 dark:text-white">
          No bookings logged
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500 dark:text-ink-300">
          Set up your availability slots to allow students to find you and book your sessions.
        </p>
      </motion.div>
    );
  }

  return (
    <EmptyState
      title="No bookings match filters"
      description="Adjust your query search, sort direction, or status selectors."
      actionLabel="Clear all filters"
      onAction={onClear}
    />
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function MentorBookingsPage() {
  const mb = useMentorBookings();
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  function handleClearFilters() {
    mb.setSearch("");
    mb.setFilter("all");
    mb.setSort("newest");
  }

  if (mb.isLoading) {
    return <BookingSkeleton />;
  }

  if (mb.isError) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Bookings could not load"
          description={mb.error?.message || "Failed to fetch student booking records."}
          actionLabel="Retry"
          onAction={mb.refetch}
        />
      </div>
    );
  }

  const isEmpty = mb.filteredBookings.length === 0;

  // Reactively track current status of the active booking in the drawer
  const activeBooking = selectedBookingId
    ? mb.bookings.find((b) => b.id === selectedBookingId)
    : null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BookingHeaderStats
            stats={mb.stats}
            isFetching={mb.isFetching}
            onRefresh={mb.refetch}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
        >
          <BookingFilters
            search={mb.search}
            onSearchChange={mb.setSearch}
            filter={mb.filter}
            onFilterChange={mb.setFilter}
            sort={mb.sort}
            onSortChange={mb.setSort}
            stats={mb.stats}
            visibleCount={mb.filteredBookings.length}
          />
        </motion.div>

        {/* Bookings List or Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isEmpty ? (
            <BookingsEmptyState
              filter={mb.filter}
              onClear={handleClearFilters}
            />
          ) : (
            <ul
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
              aria-label="Student bookings"
            >
              {mb.filteredBookings.map((booking, idx) => (
                <li key={booking.id}>
                  <BookingCard
                    booking={booking}
                    index={idx}
                    onStatusUpdate={(id, status) => mb.updateStatus({ id, status })}
                    isUpdating={mb.isUpdating && mb.updatingId === booking.id}
                    onSelect={(b) => setSelectedBookingId(b.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Fetching hint */}
        {mb.isFetching && !mb.isLoading && (
          <p
            aria-live="polite"
            className="text-center text-xs font-semibold text-ink-400 dark:text-ink-500"
          >
            Updating list…
          </p>
        )}

        {/* Side Detail Drawer Overlay */}
        <BookingDrawer
          isOpen={Boolean(activeBooking)}
          onClose={() => setSelectedBookingId(null)}
          booking={activeBooking}
          onStatusUpdate={(id, status) => mb.updateStatus({ id, status })}
          isUpdating={mb.isUpdating}
        />
      </div>
    </PageTransition>
  );
}

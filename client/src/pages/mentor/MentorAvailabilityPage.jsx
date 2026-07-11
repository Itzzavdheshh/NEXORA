import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton } from "../../components/ui/Skeleton";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import { useMentorAvailability } from "../../hooks/useMentorAvailability";
import { cn } from "../../utils/cn";
import {
  SlotCard,
  SlotForm,
} from "./availability/AvailabilityComponents";

// ── Loading skeleton ──────────────────────────────────────────────────────────
function AvailabilitySkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-44 w-full" />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MentorAvailabilityPage() {
  const av = useMentorAvailability();
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [slotToDelete, setSlotToDelete] = useState(null);

  function openCreate() {
    setEditingSlot(null);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("availability-form")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function openEdit(slot) {
    setEditingSlot(slot);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("availability-form")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function closeForm() {
    setEditingSlot(null);
    setShowForm(false);
  }

  async function handleFormSubmit(values) {
    // Helper to convert time format (HH:MM) to total minutes
    const toMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const parts = timeStr.split(":");
      const h = parseInt(parts[0] || "0", 10);
      const m = parseInt(parts[1] || "0", 10);
      return h * 60 + m;
    };

    const newStart = toMinutes(values.start_time);
    const newEnd = toMinutes(values.end_time);

    // Client-side overlap validation
    const hasOverlap = av.slots.some((s) => {
      // If editing, skip comparing the slot with itself
      if (editingSlot && s.id === editingSlot.id) return false;
      if (s.day_of_week !== values.day_of_week) return false;

      const existStart = toMinutes(s.start_time);
      const existEnd = toMinutes(s.end_time);

      // Overlap condition: startA < endB AND endA > startB
      return newStart < existEnd && newEnd > existStart;
    });

    if (hasOverlap) {
      toast.error("This slot overlaps with an existing slot on the same day.");
      return;
    }

    try {
      if (editingSlot) {
        await av.updateSlot.mutateAsync({ id: editingSlot.id, payload: values });
      } else {
        await av.createSlot.mutateAsync(values);
      }
      closeForm();
    } catch {
      // Error handled by mutation toast
    }
  }

  const hasActiveFilters =
    av.search.trim() || av.dayFilter !== "all" || av.statusFilter !== "all";

  if (av.isLoading) return <AvailabilitySkeleton />;

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl space-y-5">
        {/* ── Header ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2rem] p-6 sm:p-7"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-200">
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                Availability management
              </p>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl dark:text-white">
                Define when students can book you.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink-600 dark:text-ink-200">
                Add your available time slots for each day of the week. Students will see these when booking mentorship sessions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={openCreate} disabled={showForm && !editingSlot}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add slot
              </Button>
              <Button variant="secondary" onClick={av.refetch} loading={av.isFetching}>
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Total slots", value: av.slots.length },
              { label: "Available", value: av.slots.filter((s) => s.is_available).length, accent: true },
              { label: "Booked", value: av.slots.filter((s) => !s.is_available).length },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className="rounded-2xl border border-ink-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-300">
                  {label}
                </p>
                <p
                  className={cn(
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
        </motion.section>

        {/* ── Create/Edit form ── */}
        <AnimatePresence>
          {showForm && (
            <div id="availability-form">
              <SlotForm
                editSlot={editingSlot}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
                isSubmitting={av.isCreating || av.isUpdating}
              />
            </div>
          )}
        </AnimatePresence>

        {/* ── Filters ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="glass-panel rounded-3xl p-4 sm:p-5"
          aria-label="Availability filters"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <label className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={av.search}
                onChange={(e) => av.setSearch(e.target.value)}
                placeholder="Search by day or time…"
                aria-label="Search slots"
                className="h-11 w-full rounded-2xl border border-ink-200 bg-white/80 pl-11 pr-4 text-sm font-medium text-ink-900 shadow-sm transition placeholder:text-ink-400 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-ink-400"
              />
            </label>

            {/* Day filter */}
            <select
              value={av.dayFilter}
              onChange={(e) => av.setDayFilter(e.target.value)}
              aria-label="Filter by day"
              className="h-11 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-800 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              <option value="all">All days</option>
              {av.DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={av.statusFilter}
              onChange={(e) => av.setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="h-11 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-800 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              <option value="all">All statuses</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  av.setSearch("");
                  av.setDayFilter("all");
                  av.setStatusFilter("all");
                }}
                aria-label="Clear filters"
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-ink-100 dark:hover:bg-white/20"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink-500 dark:text-ink-300">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Showing {av.filteredSlots.length} of {av.slots.length} slots
          </p>
        </motion.section>

        {/* ── Slot list ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {av.isError ? (
            <EmptyState
              title="Could not load slots"
              description={av.error?.message || "Failed to fetch availability data."}
              actionLabel="Retry"
              onAction={av.refetch}
            />
          ) : av.filteredSlots.length === 0 ? (
            <EmptyState
              title={hasActiveFilters ? "No slots match your filters" : "No availability slots yet"}
              description={
                hasActiveFilters
                  ? "Try clearing your search or changing the filters."
                  : "Add your first slot using the button above. Students will see available slots when booking."
              }
              actionLabel={hasActiveFilters ? "Clear filters" : "Add slot"}
              onAction={
                hasActiveFilters
                  ? () => {
                      av.setSearch("");
                      av.setDayFilter("all");
                      av.setStatusFilter("all");
                    }
                  : openCreate
              }
            />
          ) : (
            <ul
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
              aria-label="Availability slots"
            >
              {av.filteredSlots.map((slot, index) => (
                <li key={slot.id}>
                  <SlotCard
                    slot={slot}
                    index={index}
                    onEdit={openEdit}
                    onDelete={(s) => setSlotToDelete(s)}
                    isDeleting={av.isDeleting}
                  />
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={Boolean(slotToDelete)}
          onClose={() => setSlotToDelete(null)}
          onConfirm={async () => {
            if (slotToDelete) {
              await av.deleteSlot.mutateAsync(slotToDelete.id);
              setSlotToDelete(null);
            }
          }}
          title="Delete availability slot"
          message={
            slotToDelete
              ? `Are you sure you want to delete the slot on ${slotToDelete.day_of_week} from ${slotToDelete.start_time?.slice(
                  0,
                  5,
                )} to ${slotToDelete.end_time?.slice(0, 5)}? This action cannot be undone.`
              : ""
          }
          confirmLabel="Delete slot"
          isLoading={av.isDeleting}
        />
      </div>
    </PageTransition>
  );
}

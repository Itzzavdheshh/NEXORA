import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton } from "../../components/ui/Skeleton";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import { useMentorAvailability } from "../../hooks/useMentorAvailability";
import { SlotForm } from "./availability/AvailabilityComponents";
import { cn } from "../../utils/cn";

// ── Constants ─────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun"
};

// Hour rows for the weekly planner
const HOURS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
];

function calculateEndTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const newH = (h + 1) % 24;
  return `${String(newH).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
}

// ── Loading skeleton ───────────────────────────────────────────────────────
function AvailabilitySkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-[520px] w-full rounded-2xl" />
    </div>
  );
}

// ── Slot Pill (inside calendar cell) ──────────────────────────────────────
function SlotPill({ slot, onEdit, onDelete, isDeleting }) {
  const isAvailable = slot.is_available;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onEdit(slot);
      }}
      className={cn(
        "group relative flex cursor-pointer items-center justify-between rounded-lg border px-2 py-1 text-[10px] font-bold leading-tight transition duration-150",
        isAvailable
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
          : "border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20",
      )}
      title={`${slot.start_time?.slice(0, 5)} – ${slot.end_time?.slice(0, 5)}`}
    >
      <span>{slot.start_time?.slice(0, 5)} – {slot.end_time?.slice(0, 5)}</span>
      
      <button
        type="button"
        disabled={isDeleting}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(slot);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-[var(--accent-danger)] hover:bg-red-500/20 rounded transition-opacity duration-150"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

// ── Weekly Calendar ────────────────────────────────────────────────────────
function WeeklyCalendar({ slots, onAddSlot, onEdit, onDelete, isDeleting }) {
  // Group slots by day
  const byDay = {};
  DAYS.forEach(d => { byDay[d] = []; });
  slots.forEach(s => {
    if (byDay[s.day_of_week]) byDay[s.day_of_week].push(s);
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
        {/* Header Row */}
        <div className="grid border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
          <div className="flex items-center justify-center p-3 border-r border-[var(--border-subtle)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Time</span>
          </div>
          {DAYS.map(day => (
            <div key={day} className="p-3 text-center border-r border-[var(--border-subtle)] last:border-r-0">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{DAY_SHORT[day]}</span>
              <span className="mt-1 inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-mentor)]">
                {byDay[day].length} slot{byDay[day].length !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>

        {/* Hour Rows */}
        <div className="divide-y divide-[var(--border-subtle)]/50">
          {HOURS.map(hr => (
            <div key={hr} className="grid" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
              {/* Hour Label */}
              <div className="flex items-center justify-center p-2 bg-[var(--bg-elevated)]/20 border-r border-[var(--border-subtle)]">
                <span className="text-[10px] font-semibold text-[var(--text-tertiary)]">{hr}</span>
              </div>

              {/* Day Cells */}
              {DAYS.map(day => {
                const hrPrefix = hr.slice(0, 2);
                const cellSlots = byDay[day].filter(s => s.start_time?.startsWith(hrPrefix));

                return (
                  <div
                    key={day}
                    className="relative min-h-[48px] border-r border-[var(--border-subtle)]/50 last:border-r-0 p-1 flex flex-col justify-center gap-1"
                  >
                    {cellSlots.length > 0 ? (
                      <div className="flex flex-col gap-1 w-full">
                        {cellSlots.map(slot => (
                          <SlotPill
                            key={slot.id}
                            slot={slot}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isDeleting={isDeleting}
                          />
                        ))}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddSlot(day, hr)}
                        className="absolute inset-0 w-full h-full flex items-center justify-center group hover:bg-[var(--bg-elevated)]/30 transition-colors"
                        title={`Add slot on ${day} at ${hr}`}
                      >
                        <Plus className="h-3.5 w-3.5 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MentorAvailabilityPage() {
  const av = useMentorAvailability();
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [defaultDay, setDefaultDay] = useState("Monday");
  const [defaultStartTime, setDefaultStartTime] = useState("");
  const [defaultEndTime, setDefaultEndTime] = useState("");
  const [slotToDelete, setSlotToDelete] = useState(null);

  function openCreate(day = "Monday", time = "") {
    setDefaultDay(day);
    setDefaultStartTime(time);
    setDefaultEndTime(time ? calculateEndTime(time) : "");
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
    const toMin = t => { if (!t) return 0; const [h, m] = t.split(":"); return Number(h) * 60 + Number(m || 0); };
    const newStart = toMin(values.start_time);
    const newEnd   = toMin(values.end_time);

    const hasOverlap = av.slots.some(s => {
      if (editingSlot && s.id === editingSlot.id) return false;
      if (s.day_of_week !== values.day_of_week) return false;
      return newStart < toMin(s.end_time) && newEnd > toMin(s.start_time);
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
    } catch { /* handled by mutation */ }
  }

  if (av.isLoading) return <AvailabilitySkeleton />;

  const totalAvailable = av.slots.filter(s => s.is_available).length;
  const totalBooked    = av.slots.filter(s => !s.is_available).length;

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-5">

        {/* ── Header ── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6"
        >
          {/* emerald shimmer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent-mentor), transparent)" }}
          />

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                style={{ background: "rgba(16,185,129,0.12)", color: "var(--accent-mentor)" }}
              >
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                Availability management
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Define when students can book you.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                Click any cell with a `+` in the calendar to add a slot for that day and hour, or click an existing slot to edit it. Hover a slot to reveal the remove button.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => openCreate()} disabled={showForm && !editingSlot}>
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
              { label: "Total slots",  value: av.slots.length,  accent: false },
              { label: "Available",    value: totalAvailable,   accent: true  },
              { label: "Booked",       value: totalBooked,      accent: false },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">{label}</p>
                <p className={cn(
                  "mt-2 text-2xl font-extrabold tabular-nums",
                  accent && value > 0 ? "text-[var(--accent-mentor)]" : "text-[var(--text-primary)]",
                )}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Create / Edit form ── */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="slot-form"
              id="availability-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <SlotForm
                editSlot={editingSlot}
                defaultDay={!editingSlot ? defaultDay : undefined}
                defaultStartTime={!editingSlot ? defaultStartTime : undefined}
                defaultEndTime={!editingSlot ? defaultEndTime : undefined}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
                isSubmitting={av.isCreating || av.isUpdating}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Weekly Calendar ── */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Weekly planner</h2>
            <div className="flex items-center gap-4 text-[10px] font-semibold text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20" />
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-500/10 border border-amber-500/20" />
                Booked
              </span>
            </div>
          </div>

          {av.isError ? (
            <EmptyState
              title="Could not load slots"
              description={av.error?.message || "Failed to fetch availability data."}
              actionLabel="Retry"
              onAction={av.refetch}
            />
          ) : (
            <WeeklyCalendar
              slots={av.slots}
              onAddSlot={openCreate}
              onEdit={openEdit}
              onDelete={slot => setSlotToDelete(slot)}
              isDeleting={av.isDeleting}
            />
          )}
        </motion.section>

        {/* ── Confirmation Modal ── */}
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
              ? `Delete the ${slotToDelete.day_of_week} slot from ${slotToDelete.start_time?.slice(0, 5)} to ${slotToDelete.end_time?.slice(0, 5)}? This cannot be undone.`
              : ""
          }
          confirmLabel="Delete slot"
          isLoading={av.isDeleting}
        />
      </div>
    </PageTransition>
  );
}

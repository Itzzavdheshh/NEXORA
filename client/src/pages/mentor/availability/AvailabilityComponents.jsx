import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";

import { z } from "zod";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  Edit3,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { FormField } from "../../../components/ui/FormField";
import { cn } from "../../../utils/cn";
import { createZodResolver } from "../../../utils/zodForm";

const DAYS = [
  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
];

const slotSchema = z
  .object({
    day_of_week: z.enum(
      ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      { required_error: "Day is required." },
    ),
    start_time: z
      .string()
      .min(1, "Start time is required.")
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Use HH:MM format."),
    end_time: z
      .string()
      .min(1, "End time is required.")
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Use HH:MM format."),
  })
  .refine(
    (v) => {
      const start = v.start_time.slice(0, 5);
      const end = v.end_time.slice(0, 5);
      return start < end;
    },
    { message: "End time must be after start time.", path: ["end_time"] },
  );

// ── Slot form (create / edit) ─────────────────────────────────────────────────
export function SlotForm({ editSlot, defaultDay, defaultStartTime, defaultEndTime, onSubmit, onCancel, isSubmitting }) {
  const defaults = editSlot
    ? {
        day_of_week: editSlot.day_of_week,
        start_time: editSlot.start_time?.slice(0, 5) ?? "",
        end_time: editSlot.end_time?.slice(0, 5) ?? "",
      }
    : {
        day_of_week: defaultDay || "Monday",
        start_time: defaultStartTime || "",
        end_time: defaultEndTime || "",
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: createZodResolver(slotSchema),
    defaultValues: defaults,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-extrabold tracking-tight text-ink-950 dark:text-white">
          {editSlot ? "Edit slot" : "Add availability slot"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close form"
          className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100 dark:hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          id="slot-day"
          label="Day of week"
          as="select"
          error={errors.day_of_week}
          {...register("day_of_week")}
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="slot-start"
            label="Start time"
            type="time"
            error={errors.start_time}
            helper="24-hour format, e.g. 09:00"
            {...register("start_time")}
          />
          <FormField
            id="slot-end"
            label="End time"
            type="time"
            error={errors.end_time}
            helper="Must be after start time"
            {...register("end_time")}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {editSlot ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Update slot
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add slot
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

// ── Slot card ─────────────────────────────────────────────────────────────────
export function SlotCard({ slot, index, onEdit, onDelete, isDeleting }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className={cn(
        "glass-panel group relative rounded-2xl p-4 transition sm:p-5",
        "hover:-translate-y-0.5 hover:shadow-glow",
      )}
      aria-label={`Slot: ${slot.day_of_week} ${slot.start_time} – ${slot.end_time}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl",
              slot.is_available
                ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
                : "bg-ink-200/70 text-ink-500 dark:bg-white/10 dark:text-ink-300",
            )}
          >
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="font-extrabold text-ink-950 dark:text-white">{slot.day_of_week}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-300">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {slot.start_time?.slice(0, 5)} – {slot.end_time?.slice(0, 5)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold",
              slot.is_available
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
                : "border border-ink-200 bg-ink-50 text-ink-500 dark:border-white/10 dark:bg-white/10 dark:text-ink-300",
            )}
          >
            {slot.is_available ? "Available" : "Booked"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-ink-200/70 pt-3 dark:border-white/10">
        <button
          type="button"
          onClick={() => onEdit(slot)}
          aria-label={`Edit ${slot.day_of_week} slot`}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-ink-200 bg-white/80 px-3 text-sm font-semibold text-ink-700 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-ink-100 dark:hover:bg-white/20"
        >
          <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(slot)}
          disabled={isDeleting}
          aria-label={`Delete ${slot.day_of_week} slot`}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-red-200/70 bg-red-50/50 px-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-400/20 dark:bg-red-500/8 dark:text-red-300 dark:hover:bg-red-500/16"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Delete
        </button>
      </div>
    </motion.article>
  );
}


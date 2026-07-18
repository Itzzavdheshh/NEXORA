import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Video,
  FileText,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "../../services/bookingService";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { createZodResolver } from "../../utils/zodForm";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Calculates the date of the next occurrence of a given weekday
function getNextDateForDay(dayName) {
  if (!dayName) return new Date().toISOString().split("T")[0];
  const targetDay = DAYS_OF_WEEK.findIndex(
    (d) => d.toLowerCase() === dayName.toLowerCase()
  );
  if (targetDay === -1) return new Date().toISOString().split("T")[0];

  const result = new Date();
  const currentDay = result.getDay();
  let steps = targetDay - currentDay;
  if (steps <= 0) steps += 7; // get next occurrence (next week if today or past)
  result.setDate(result.getDate() + steps);
  return result.toISOString().split("T")[0];
}

const bookingSchema = z.object({
  meetingType: z.string().min(1, "Select a meeting type."),
  notes: z.string().trim().min(5, "Include notes for the mentor (at least 5 chars).").max(1000),
});

export function BookingModal({ isOpen, onClose, slot, mentor, onSuccess }) {
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const nextDate = getNextDateForDay(slot.day_of_week);
  const formattedDate = new Date(nextDate).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: createZodResolver(bookingSchema),
    defaultValues: {
      meetingType: "Virtual Google Meet",
      notes: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: (values) =>
      bookingService.create({
        mentor_id: mentor.id,
        availability_slot_id: slot.id,
        booking_date: nextDate,
        start_time: slot.start_time,
        end_time: slot.end_time,
        meeting_type: values.meetingType,
        notes: values.notes,
      }),
    onSuccess: (data) => {
      // Invalidate queries so dashboards, booking lists, and notifications sync immediately
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability", "mentor", mentor.id] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      
      setBookingDetails(data.data);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    },
  });

  const onSubmit = (values) => {
    bookingMutation.mutate(values);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={bookingMutation.isPending ? undefined : onClose}
        className="absolute inset-0 bg-[#080e1c]/80 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-surface p-6 shadow-token-lg focus:outline-none"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-border-subtle/50 pb-4">
                <div>
                  <span className="badge badge-primary">
                    <Sparkles className="h-3 w-3" />
                    Confirm Booking Details
                  </span>
                  <h3 className="text-base font-extrabold text-text-primary mt-2">
                    Schedule with {mentor.full_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={bookingMutation.isPending}
                  className="rounded-xl border border-border-subtle bg-bg-elevated/40 p-2 text-text-tertiary hover:text-text-primary transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Slot Details Summary */}
              <div className="rounded-2xl border border-border-subtle bg-bg-elevated/30 p-4 space-y-3.5 text-xs text-text-secondary">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-accent-primary" />
                  <div>
                    <p className="font-bold text-text-primary">{formattedDate}</p>
                    <p className="text-[10px] text-text-tertiary">Calculated next slot date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-accent-primary" />
                  <div>
                    <p className="font-bold text-text-primary">
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </p>
                    <p className="text-[10px] text-text-tertiary">Session time slot</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="meetingType" className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    Meeting Type
                  </label>
                  <select
                    id="meetingType"
                    className="w-full rounded-2xl border border-border-subtle bg-bg-elevated/40 py-2.5 px-3 text-xs font-semibold text-text-primary outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30"
                    {...register("meetingType")}
                  >
                    <option value="Virtual Google Meet">Virtual Google Meet</option>
                    <option value="Zoom Meeting">Zoom Meeting</option>
                    <option value="Discord Audio / Video">Discord Audio / Video</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                  </select>
                  {errors.meetingType && (
                    <p className="text-[10px] font-bold text-accent-danger">{errors.meetingType.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="notes" className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    Booking Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Include details about your query, topics you want to review, or code links..."
                    className="w-full rounded-2xl border border-border-subtle bg-bg-elevated/40 py-2.5 px-4 text-xs font-semibold text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30"
                    {...register("notes")}
                  />
                  {errors.notes && (
                    <p className="text-[10px] font-bold text-accent-danger">{errors.notes.message}</p>
                  )}
                </div>

                {bookingMutation.isError && (
                  <p className="text-[11px] font-bold text-accent-danger text-center bg-accent-danger/10 border border-accent-danger/25 rounded-xl p-3">
                    {bookingMutation.error?.message || "Booking submission failed."}
                  </p>
                )}

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-4 border-t border-border-subtle/50">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    disabled={bookingMutation.isPending}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    loading={bookingMutation.isPending}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="booking-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-6"
            >
              {/* Success Check Animation */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-primary/10 text-accent-primary ring-4 ring-accent-primary/20 animate-bounce">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold text-text-primary">
                  Booking Confirmed!
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Your mentorship session request has been logged. {mentor.full_name} has been notified.
                </p>
              </div>

              {/* Booking Details Summary */}
              <div className="rounded-2xl border border-border-subtle bg-bg-elevated/40 p-4 space-y-2 text-xs text-text-secondary text-left max-w-md mx-auto">
                <div className="flex justify-between">
                  <span>Mentor</span>
                  <span className="font-bold text-text-primary">{mentor.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="font-bold text-text-primary">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time</span>
                  <span className="font-bold text-text-primary">
                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform</span>
                  <span className="font-bold text-text-primary">{bookingDetails?.meeting_type || "Google Meet"}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full justify-center group"
                  onClick={onClose}
                >
                  Continue Workspace
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

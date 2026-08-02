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
  CreditCard,
  Lock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  DollarSign
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
  const [step, setStep] = useState(1); // 1: details, 2: payment, 3: success
  const [bookingDetails, setBookingDetails] = useState(null);

  // Robust hourly rate fallback extraction
  const hourlyRate = Number(mentor?.hourly_rate ?? mentor?.profile?.hourly_rate ?? 10);
  const inrRate = Math.round(hourlyRate * 95.69);

  // Card details state for Payment step
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

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
    getValues,
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
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      
      setBookingDetails(data.data);
      setStep(3); // Go to success step
      if (onSuccess) onSuccess();
    },
  });

  const handleProceedToPayment = () => {
    // Validate Step 1 form fields
    handleSubmit(() => {
      setStep(2);
    })();
  };

  const handleFinalPaymentSubmit = (e) => {
    e.preventDefault();
    const values = getValues();
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

      {/* Modal Dialog with Scrollable Viewport */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative z-10 w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-[2rem] border border-border-subtle bg-bg-surface p-6 shadow-token-lg focus:outline-none custom-scrollbar"
      >
        <AnimatePresence mode="wait">
          {/* STEP 1: Session Details & Topic Prompts */}
          {step === 1 && (
            <motion.div
              key="booking-step-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-border-subtle/50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-primary">Step 1 of 2</span>
                    <span className="text-[10px] font-bold text-text-tertiary">Booking Details</span>
                  </div>
                  <h3 className="text-base font-extrabold text-text-primary mt-2">
                    Schedule with {mentor.full_name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-border-subtle bg-bg-elevated/40 p-2 text-text-tertiary hover:text-text-primary transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Slot Details & Pricing Summary */}
              <div className="rounded-2xl border border-border-subtle bg-bg-elevated/30 p-4 space-y-3.5 text-xs text-text-secondary">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-accent-primary shrink-0" />
                  <div>
                    <p className="font-bold text-text-primary">{formattedDate}</p>
                    <p className="text-[10px] text-text-tertiary">Calculated next slot date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-accent-primary shrink-0" />
                  <div>
                    <p className="font-bold text-text-primary">
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </p>
                    <p className="text-[10px] text-text-tertiary">Session time slot</p>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="pt-2 border-t border-border-subtle/50 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span>Mentor Hourly Rate</span>
                    <span className="font-extrabold text-text-primary">${hourlyRate}/hr (₹{inrRate.toLocaleString("en-IN")})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nexora Platform Service Fee</span>
                    <span className="font-extrabold text-emerald-400">$0 (Free Pitch Tier)</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-border-subtle/40 text-xs font-black text-amber-300">
                    <span>Total Session Fee</span>
                    <span>${hourlyRate} USD</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
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
                    <option value="Jitsi Instant Video Call">Jitsi Instant Video Call</option>
                    <option value="Zoom Meeting">Zoom Meeting</option>
                    <option value="Discord Audio / Video">Discord Audio / Video</option>
                  </select>
                  {errors.meetingType && (
                    <p className="text-[10px] font-bold text-accent-danger">{errors.meetingType.message}</p>
                  )}
                </div>

                {/* Topic Prompt Chips */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    Quick Topic Prompts
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "System Design Mock",
                      "Resume & Portfolio Review",
                      "Coding Interview Prep",
                      "Career Transition Advice"
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("notes");
                          if (el) {
                            el.value = prompt + " - ";
                            el.focus();
                          }
                        }}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-bg-elevated text-text-secondary hover:text-text-primary hover:bg-accent-primary/10 hover:border-accent-primary/20 border border-border-subtle/50 transition-all"
                      >
                        + {prompt}
                      </button>
                    ))}
                  </div>
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

                {/* Step 1 Actions */}
                <div className="flex gap-3 pt-3 border-t border-border-subtle/50">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1 bg-amber-400 text-black hover:bg-amber-300 font-extrabold shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
                    onClick={handleProceedToPayment}
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Payment Checkout Page */}
          {step === 2 && (
            <motion.div
              key="booking-step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-border-subtle/50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-primary">Step 2 of 2</span>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Secure Checkout
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-text-primary mt-2">
                    Complete Payment
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

              {/* Order Summary Header */}
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Session with <strong className="text-text-primary">{mentor.full_name}</strong></span>
                  <span className="font-mono text-[10px] text-amber-300 font-bold">{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-amber-400/20">
                  <span className="font-extrabold text-text-primary">Total Amount Due</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-300">${hourlyRate} USD</span>
                    <span className="block text-[10px] text-text-tertiary">≈ ₹{inrRate.toLocaleString("en-IN")} INR</span>
                  </div>
                </div>
              </div>

              {/* Payment Card Input Form */}
              <form onSubmit={handleFinalPaymentSubmit} className="space-y-4">
                <div className="space-y-3 rounded-2xl border border-border-subtle bg-bg-elevated/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-accent-primary" />
                      Credit / Debit Card Details
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit Encrypted
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-text-tertiary">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Johnson"
                      defaultValue="Nexora Student"
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-xl border border-border-subtle bg-bg-elevated/60 py-2 px-3 text-xs font-bold text-text-primary outline-none focus:border-accent-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase text-text-tertiary">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full rounded-xl border border-border-subtle bg-bg-elevated/60 py-2 pl-3 pr-10 text-xs font-mono font-bold text-text-primary outline-none focus:border-accent-primary"
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase text-text-tertiary">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-xl border border-border-subtle bg-bg-elevated/60 py-2 px-3 text-xs font-mono font-bold text-text-primary outline-none focus:border-accent-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase text-text-tertiary">CVC / CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full rounded-xl border border-border-subtle bg-bg-elevated/60 py-2 px-3 text-xs font-mono font-bold text-text-primary outline-none focus:border-accent-primary"
                      />
                    </div>
                  </div>
                </div>

                {bookingMutation.isError && (
                  <p className="text-[11px] font-bold text-accent-danger text-center bg-accent-danger/10 border border-accent-danger/25 rounded-xl p-3">
                    {bookingMutation.error?.message || "Payment authorization failed."}
                  </p>
                )}

                {/* Footer Payment Actions */}
                <div className="flex gap-3 pt-3 border-t border-border-subtle/50">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={bookingMutation.isPending}
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20"
                    loading={bookingMutation.isPending}
                  >
                    {bookingMutation.isPending ? "Processing Payment…" : `Pay $${hourlyRate} & Confirm`}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 3: Booking Success Confirmation */}
          {step === 3 && (
            <motion.div
              key="booking-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-5"
            >
              {/* Success Check Animation */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400 ring-4 ring-emerald-500/20 animate-bounce">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-lg font-bold text-text-primary">
                  Booking Request Submitted! ⏳
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
                  Your session request and payment authorization of <strong>${hourlyRate} USD</strong> have been submitted. Awaiting confirmation from {mentor.full_name}.
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
                  <span>Booking Status</span>
                  <span className="font-extrabold text-amber-300">Pending Mentor Confirmation</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span className="font-extrabold text-emerald-400">Paid / Authorized (${hourlyRate} USD)</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform</span>
                  <span className="font-bold text-emerald-400 font-extrabold">{bookingDetails?.meeting_type || "Virtual Google Meet"}</span>
                </div>
              </div>

              {/* Action Buttons: Add to Google Calendar & Return to Dashboard */}
              <div className="space-y-2 pt-2">
                {bookingDetails?.id && (
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nexora+Mentorship+with+${encodeURIComponent(mentor.full_name)}&details=Join+call:+${encodeURIComponent(bookingDetails?.meeting_link || `https://meet.jit.si/nexora-${bookingDetails.id}`)}&dates=${nextDate.replace(/-/g,"")}T100000Z/${nextDate.replace(/-/g,"")}T110000Z`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Add to Google Calendar</span>
                  </a>
                )}

                <Button
                  variant="secondary"
                  className="w-full justify-center group"
                  onClick={onClose}
                >
                  Return to Dashboard
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


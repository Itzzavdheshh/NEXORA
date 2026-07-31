import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Calendar,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Plus,
  Lock,
  Unlock,
  Check,
  UserCheck,
  Building2,
  BellRing
} from "lucide-react";

export function HeroPreviewCard({ activeRole = "student" }) {
  // Student Mode State
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [isBooked, setIsBooked] = useState(false);

  // Mentor Mode State
  const [mentorSlots, setMentorSlots] = useState([
    { id: 101, time: "Today, 5:00 PM", type: "1-on-1 Code Review", active: true },
    { id: 102, time: "Tomorrow, 3:30 PM", type: "System Design Mock", active: true },
    { id: 103, time: "Thu, 6:00 PM", type: "Career Roadmap", active: false }
  ]);
  const [slotCreatedNotice, setSlotCreatedNotice] = useState(false);

  // Admin Mode State
  const [pendingMentors, setPendingMentors] = useState([
    { id: 201, name: "David Vance", company: "Meta", role: "Senior AI Engineer", status: "pending" },
    { id: 202, name: "Anita Roy", company: "Amazon", role: "Sr. Product Manager", status: "pending" }
  ]);

  // Actions
  const handleStudentBook = () => {
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 3500);
  };

  const toggleMentorSlot = (id) => {
    setMentorSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleAddSlotDemo = () => {
    setSlotCreatedNotice(true);
    setTimeout(() => setSlotCreatedNotice(false), 2500);
  };

  const handleApproveAdmin = (id) => {
    setPendingMentors((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "approved" } : m))
    );
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Outer aura glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-emerald-500/20 to-sky-500/30 blur-xl opacity-75 animate-aurora pointer-events-none" />

      {/* Card Shell */}
      <motion.div
        layout
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12141B]/95 p-6 backdrop-blur-xl shadow-2xl"
      >
        {/* Card Header with Role Indicator & Realtime Pulse */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
              {activeRole === "student" && "Live Student Booking Sync"}
              {activeRole === "mentor" && "Mentor Slot Control Active"}
              {activeRole === "admin" && "Admin Verification Console"}
            </span>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-amber-300 border border-white/5">
            {activeRole === "student" && "🎓 Student View"}
            {activeRole === "mentor" && "👨‍🏫 Mentor View"}
            {activeRole === "admin" && "🏛️ Admin View"}
          </span>
        </div>

        {/* ── 1. STUDENT VIEW CONTENT ────────────────────────────────────── */}
        {activeRole === "student" && (
          <motion.div
            key="student-preview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="mt-4 space-y-4"
          >
            {/* Mentor Brief Info (Clean thumbnail layout) */}
            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                  alt="Sarah Jenkins"
                  className="h-14 w-14 aspect-square rounded-2xl object-cover shrink-0 ring-2 ring-amber-500/30 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-0.5 ring-2 ring-[#12141B]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white truncate">Sarah Jenkins</h4>
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 shrink-0">
                    ★ 4.98
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Staff Engineer @ Google</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-[var(--text-tertiary)]">System Design</span>
                  <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-[var(--text-tertiary)]">Mock Interviews</span>
                </div>
              </div>
            </div>

            {/* Interactive Slot Selector */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-[var(--text-secondary)] flex items-center justify-between">
                <span>Select Slot:</span>
                <span className="text-amber-400 text-[11px]">Click slot to test 👇</span>
              </p>

              {[
                { id: 1, time: "Today, 5:00 PM", type: "1-on-1 Code Review (45m)" },
                { id: 2, time: "Tomorrow, 3:30 PM", type: "System Design Mock (60m)" },
                { id: 3, time: "Thu, 6:00 PM", type: "Career Roadmap (30m)" }
              ].map((slot) => {
                const isSelected = selectedSlot === slot.id;
                return (
                  <motion.button
                    key={slot.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/10 text-white shadow-[0_0_15px_rgba(245,166,35,0.15)]"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-[var(--text-secondary)]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className={`h-4 w-4 ${isSelected ? "text-amber-400" : "text-[var(--text-tertiary)]"}`} />
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? "text-amber-300" : "text-white"}`}>
                          {slot.time}
                        </p>
                        <p className="text-[10px] text-[var(--text-tertiary)]">{slot.type}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isSelected ? "bg-amber-400 text-black" : "bg-emerald-500/10 text-emerald-400"}`}>
                      {isSelected ? "Selected" : "Open"}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Action CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStudentBook}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="h-4 w-4 fill-black" />
              <span>Confirm Demo Booking</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>

            {/* Success Overlay */}
            <AnimatePresence>
              {isBooked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-[#0B0D12]/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20"
                >
                  <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-2 animate-bounce" />
                  <h4 className="text-base font-bold text-white">Booking Confirmed!</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Email invite & calendar link sent via Resend API.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── 2. MENTOR VIEW CONTENT ─────────────────────────────────────── */}
        {activeRole === "mentor" && (
          <motion.div
            key="mentor-preview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="mt-4 space-y-4"
          >
            <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <div>
                <h4 className="text-xs font-bold text-white">Weekly Availability Manager</h4>
                <p className="text-[11px] text-[var(--text-tertiary)]">Toggle open time slots for students</p>
              </div>
              <button
                type="button"
                onClick={handleAddSlotDemo}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1 border border-emerald-500/30"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Slot</span>
              </button>
            </div>

            <div className="space-y-2">
              {mentorSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white">{slot.time}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)]">{slot.type}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleMentorSlot(slot.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      slot.active
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {slot.active ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    <span>{slot.active ? "Published" : "Locked"}</span>
                  </button>
                </div>
              ))}
            </div>

            {slotCreatedNotice && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>New slot published instantly via Supabase Realtime!</span>
              </motion.div>
            )}

            <div className="pt-2 text-center text-[11px] text-[var(--text-tertiary)] flex items-center justify-center gap-1.5">
              <BellRing className="h-3.5 w-3.5 text-amber-400" />
              <span>Mentors get automated email & calendar reminders on booking.</span>
            </div>
          </motion.div>
        )}

        {/* ── 3. ADMIN VIEW CONTENT ──────────────────────────────────────── */}
        {activeRole === "admin" && (
          <motion.div
            key="admin-preview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="mt-4 space-y-4"
          >
            <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold text-white">Mentor Verification Queue</h4>
              <p className="text-[11px] text-[var(--text-tertiary)]">Review & issue verified mentor badges</p>
            </div>

            <div className="space-y-2.5">
              {pendingMentors.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-xs border border-sky-500/30">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)]">
                        {m.role} • {m.company}
                      </p>
                    </div>
                  </div>

                  {m.status === "approved" ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/20 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApproveAdmin(m.id)}
                      className="px-2.5 py-1 rounded-lg bg-sky-500 text-black hover:bg-sky-400 text-xs font-bold flex items-center gap-1 transition-all shadow"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-[11px] text-[var(--text-tertiary)] flex items-center justify-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-sky-400" />
              <span>Institutions track active rosters & student engagement stats.</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default HeroPreviewCard;

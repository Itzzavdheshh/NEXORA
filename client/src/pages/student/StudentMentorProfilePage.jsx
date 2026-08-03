import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import {
  Calendar,
  Briefcase,
  DollarSign,
  Star,
  ExternalLink,
  ChevronLeft,
  Mail,
  Linkedin,
  Github,
  Globe,
  Award,
  Video,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { mentorService } from "../../services/mentorService";
import { availabilityService } from "../../services/availabilityService";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";
import { BookingModal } from "../../components/bookings/BookingModal";
import { cn } from "../../utils/cn";
import { formatHourlyRate } from "../../utils/currency";

// 12-hour AM/PM Time Format Helper
function formatSlotTime(timeStr) {
  if (!timeStr) return "";
  try {
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1] || "00";
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  } catch {
    return timeStr.slice(0, 5);
  }
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function StudentMentorProfilePage() {
  const { id: mentorId } = useParams();
  const [selectedSlot, setSelectedSlot] = useState(null);


  // Fetch verified mentors list to extract the specific mentor profile
  const mentorsQuery = useQuery({
    queryKey: ["mentors", "explore"],
    queryFn: () => mentorService.explore(),
    refetchInterval: 3000,
  });

  // Fetch the mentor's availability slots
  const slotsQuery = useQuery({
    queryKey: ["availability", "mentor", mentorId],
    queryFn: () => availabilityService.list({ mentorId }),
    refetchInterval: 3000,
  });


  const mentor = (mentorsQuery.data?.data || []).find((m) => m.id === mentorId);
  const slots = slotsQuery.data?.data || [];


  const isLoading = mentorsQuery.isLoading || slotsQuery.isLoading;
  const isError = mentorsQuery.isError || slotsQuery.isError;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-48 w-full rounded-[2rem]" />
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Skeleton className="h-[28rem] w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !mentor) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Mentor profile not found"
          description="The requested profile could not be loaded or the mentor is not verified."
          actionLabel="Return to Discovery"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  // Group slots by day of week
  const slotsByDay = DAYS.reduce((acc, day) => {
    acc[day] = slots
      .filter((s) => s.day_of_week && s.day_of_week.toLowerCase() === day.toLowerCase())
      .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
    return acc;
  }, {});

  const initials = (mentor.full_name || "M")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const skills = Array.isArray(mentor.profile?.skills) ? mentor.profile.skills : [];

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6 pb-20 lg:pb-0">
        {/* Back Link */}
        <div>
          <Link
            to="/student/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-accent-primary transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to exploration
          </Link>
        </div>

        {/* Profile Card banner */}
        <section className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {mentor.avatar_url ? (
              <img
                src={mentor.avatar_url}
                alt=""
                className="h-24 w-24 rounded-3xl border border-border-subtle object-cover shadow-token-md"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-accent-primary/10 text-3xl font-extrabold text-accent-primary ring-4 ring-accent-primary/20">
                {initials}
              </div>
            )}
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-primary">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Professional
                </span>
                <span className="text-xs font-bold text-text-tertiary">Joined {mentor.created_at ? new Date(mentor.created_at).toLocaleDateString() : "N/A"}</span>
              </div>
              <h1 className="font-display text-display font-semibold text-text-primary leading-tight">
                {mentor.full_name}
              </h1>
              <p className="text-sm font-bold text-text-secondary flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-text-tertiary" />
                {mentor.profile?.job_title || "Mentor"} at {mentor.profile?.company || "Independent"}
              </p>
            </div>
          </div>
        </section>

        {/* Layout Column split */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          
          {/* Availability Grid Card */}
          <section className="rounded-3xl border border-border-subtle bg-bg-surface p-5 sm:p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent-primary" />
                  Weekly Availability Grid
                </h2>
                {/* #6 Timezone label */}
                <span className="text-[10px] font-semibold text-text-tertiary bg-bg-elevated border border-border-subtle rounded-full px-2 py-0.5">
                  🕐 Times in your local timezone
                </span>
              </div>
              <p className="mt-1.5 text-xs text-text-secondary">
                Select an available slot below to launch the booking creation dialog. Times are displayed in standard 12-hour format.
              </p>
              {/* #7 Visual slot color legend */}
              <div className="mt-3 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-text-tertiary">
                  <span className="inline-block h-2.5 w-2.5 rounded border border-accent-primary/30 bg-accent-primary/10" />
                  Available
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-text-tertiary">
                  <span className="inline-block h-2.5 w-2.5 rounded border border-border-subtle bg-bg-elevated/40" />
                  Booked
                </span>
              </div>
            </div>

            {/* #8 Inline empty state when no slots at all */}
            {slots.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-strong bg-bg-elevated/20 p-8 text-center">
                <Calendar className="h-8 w-8 text-text-tertiary mx-auto mb-3" />
                <p className="text-sm font-bold text-text-primary">No availability set yet</p>
                <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
                  This mentor hasn't configured any weekly slots yet. Check back later or explore other mentors.
                </p>
              </div>
            ) : (
            <div className="space-y-4">
              {DAYS.map((day) => {
                const daySlots = slotsByDay[day] || [];
                return (
                  <div key={day} className="grid md:grid-cols-[110px_1fr] gap-3 border-b border-border-subtle/40 pb-4 last:border-b-0 last:pb-0">
                    <span className="text-xs font-bold text-text-primary self-center">{day}</span>
                    
                    {daySlots.length === 0 ? (
                      <span className="text-xs font-medium text-text-tertiary italic py-1.5">No hours set.</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {daySlots.map((slot) => {
                          const formattedTime = `${formatSlotTime(slot.start_time)} - ${formatSlotTime(slot.end_time)}`;
                          const isAvailable = slot.is_available;

                          return (
                            <button
                              key={slot.id}
                              onClick={() => isAvailable && setSelectedSlot(slot)}
                              disabled={!isAvailable}
                              className={cn(
                                "rounded-xl border px-3 py-1.5 text-[11px] font-bold transition-all duration-200 outline-none text-left",
                                isAvailable
                                  ? "border-accent-primary/30 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 hover:border-accent-primary/60 focus:ring-2 focus:ring-accent-primary/20 shadow-sm"
                                  : "border-border-subtle bg-bg-elevated/40 text-text-tertiary cursor-not-allowed opacity-60"
                              )}
                              id={`slot-btn-${slot.id}`}
                            >
                              <span className="block font-extrabold">{formattedTime}</span>
                              <span className="block text-[9px] uppercase tracking-wider mt-0.5 opacity-80">
                                {isAvailable ? "Available" : "Booked"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            )}
          </section>

          {/* Details Sidebar Card */}
          <aside className="rounded-3xl border border-border-subtle bg-bg-surface p-5 sm:p-6 flex flex-col gap-6 h-fit">
            
            {/* Rates & experience row */}
            <div className="grid grid-cols-2 gap-4 border-b border-border-subtle/50 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Hourly rate</span>
                <p className="text-sm font-extrabold text-text-primary flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-text-secondary shrink-0" />
                  <span>{formatHourlyRate(mentor.profile?.hourly_rate)}</span>
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Experience</span>
                <p className="text-lg font-extrabold text-text-primary flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-text-secondary" />
                  {mentor.profile?.experience_years || 0} years
                </p>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">About Me</span>
              <p className="text-xs leading-relaxed text-text-secondary whitespace-pre-line">
                {mentor.profile?.bio || "This mentor hasn't added a biography yet."}
              </p>
            </div>

            {/* Skills chips */}
            {skills.length > 0 && (
              <div className="space-y-2.5 border-t border-border-subtle/50 pt-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Expertise Areas</span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-bg-elevated px-2.5 py-1 text-xs font-bold text-text-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social linkages */}
            {(mentor.profile?.linkedin_url || mentor.profile?.github_url || mentor.profile?.website_url) && (
              <div className="space-y-3 border-t border-border-subtle/50 pt-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Social Connections</span>
                <div className="flex flex-col gap-2">
                  {mentor.profile?.linkedin_url && (
                    <a
                      href={mentor.profile?.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-accent-primary transition"
                    >
                      <Linkedin className="h-4 w-4 text-accent-primary/80" />
                      LinkedIn Profile
                      <ExternalLink className="h-3 w-3 text-text-tertiary" />
                    </a>
                  )}
                  {mentor.profile?.github_url && (
                    <a
                      href={mentor.profile?.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-accent-primary transition"
                    >
                      <Github className="h-4 w-4 text-accent-primary/80" />
                      GitHub Profile
                      <ExternalLink className="h-3 w-3 text-text-tertiary" />
                    </a>
                  )}
                  {mentor.profile?.website_url && (
                    <a
                      href={mentor.profile?.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-accent-primary transition"
                    >
                      <Globe className="h-4 w-4 text-accent-primary/80" />
                      Portfolio / Website
                      <ExternalLink className="h-3 w-3 text-text-tertiary" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Modal Booking Form */}
        <AnimatePresence>
          {selectedSlot && (
            <BookingModal
              isOpen={Boolean(selectedSlot)}
              onClose={() => setSelectedSlot(null)}
              slot={selectedSlot}
              mentor={mentor}
              onSuccess={() => slotsQuery.refetch()}
            />
          )}
        </AnimatePresence>

        {/* #9 Sticky mobile CTA bar */}
        {!selectedSlot && slots.some(s => s.is_available) && (
          <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-border-subtle bg-bg-base/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-text-primary">Ready to book?</p>
              <p className="text-[10px] text-text-secondary">Select an available slot above ↑</p>
            </div>
            <span className="badge badge-primary text-xs">
              {slots.filter(s => s.is_available).length} slot{slots.filter(s => s.is_available).length !== 1 ? "s" : ""} open
            </span>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

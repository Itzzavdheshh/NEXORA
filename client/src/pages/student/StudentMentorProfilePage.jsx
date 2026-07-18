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

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function StudentMentorProfilePage() {
  const { id: mentorId } = useParams();
  const [selectedSlot, setSelectedSlot] = useState(null);


  // Fetch verified mentors list to extract the specific mentor profile
  const mentorsQuery = useQuery({
    queryKey: ["mentors", "explore"],
    queryFn: () => mentorService.explore(),
  });

  // Fetch the mentor's availability slots
  const slotsQuery = useQuery({
    queryKey: ["availability", "mentor", mentorId],
    queryFn: () => availabilityService.list({ mentorId }),
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
      <div className="mx-auto max-w-7xl space-y-6">
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
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent-primary" />
                Weekly Availability Grid
              </h2>
              <p className="mt-1.5 text-xs text-text-secondary">
                Select an available slot below to launch the booking creation dialog. All times are listed in standard time formats.
              </p>
            </div>

            <div className="space-y-4">
              {DAYS.map((day) => {
                const daySlots = slotsByDay[day] || [];
                return (
                  <div key={day} className="grid md:grid-cols-[110px_1fr] gap-3 border-b border-border-subtle/40 pb-4 last:border-b-0 last:pb-0">
                    <span className="text-xs font-bold text-text-primary self-center">{day}</span>
                    
                    {daySlots.length === 0 ? (
                      <span className="text-xs font-medium text-text-tertiary italic py-1.5">No hours scheduled for this day.</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {daySlots.map((slot) => {
                          const formattedTime = `${(slot.start_time || "").slice(0, 5)} - ${(slot.end_time || "").slice(0, 5)}`;
                          const isAvailable = slot.is_available;

                          return (
                            <button
                              key={slot.id}
                              onClick={() => isAvailable && setSelectedSlot(slot)}
                              disabled={!isAvailable}
                              className={cn(
                                "rounded-xl border px-3 py-1.5 text-[11px] font-bold transition-all duration-200 outline-none text-left",
                                isAvailable
                                  ? "border-accent-primary/20 bg-accent-primary/5 text-accent-primary hover:bg-accent-primary/10 hover:border-accent-primary/40 focus:ring-2 focus:ring-accent-primary/20"
                                  : "border-border-subtle bg-bg-elevated/40 text-text-tertiary cursor-not-allowed"
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
          </section>

          {/* Details Sidebar Card */}
          <aside className="rounded-3xl border border-border-subtle bg-bg-surface p-5 sm:p-6 flex flex-col gap-6 h-fit">
            
            {/* Rates & experience row */}
            <div className="grid grid-cols-2 gap-4 border-b border-border-subtle/50 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Hourly rate</span>
                <p className="text-lg font-extrabold text-text-primary flex items-center gap-0.5">
                  <DollarSign className="h-4 w-4 text-text-secondary" />
                  {mentor.profile?.hourly_rate > 0 ? `${mentor.profile?.hourly_rate}/hr` : "Free"}
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
      </div>
    </PageTransition>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Users,
  Compass,
  Star,
  DollarSign,
  Briefcase,
  ChevronRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { mentorService } from "../../services/mentorService";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

function ExploreSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-44 w-full rounded-[2rem]" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, idx) => (
          <Skeleton key={idx} className="h-72 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export default function ExploreMentorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [maxRate, setMaxRate] = useState("");

  const mentorsQuery = useQuery({
    queryKey: ["mentors", "explore", searchQuery],
    queryFn: () => mentorService.explore({ search: searchQuery }),
    placeholderData: (previousData) => previousData,
  });

  const mentors = mentorsQuery.data?.data || [];

  // Local filtering for skills and rates to make UI interactions instant
  const filteredMentors = mentors.filter((m) => {
    if (selectedSkill) {
      const skills = m.profile?.skills || [];
      const hasSkill = skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());
      if (!hasSkill) return false;
    }
    if (maxRate) {
      const rate = m.profile?.hourly_rate || 0;
      if (rate > Number(maxRate)) return false;
    }
    return true;
  });

  // Extract all unique skills across all available mentors for filters
  const availableSkills = Array.from(
    new Set(
      mentors.flatMap((m) => m.profile?.skills || []).map((s) => s.trim())
    )
  ).filter(Boolean);

  function resetFilters() {
    setSearchQuery("");
    setSelectedSkill("");
    setMaxRate("");
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Banner header card */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-surface p-6 sm:p-8"
        >
          {/* Accent radial glow */}
          <div
            className="absolute -right-10 -top-10 h-40 w-40 opacity-20 blur-3xl pointer-events-none rounded-full"
            style={{ backgroundColor: "var(--accent-primary)" }}
          />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <span className="badge badge-primary">
                <Compass className="h-3 w-3" />
                Discovery Portal
              </span>
              <h1 className="font-display text-display font-semibold text-text-primary leading-tight">
                Find your perfect mentor.
              </h1>
              <p className="max-w-xl text-xs leading-5 text-text-secondary">
                Connect with industry veterans, university professors, and engineering leads for 1-on-1 virtual sessions.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 self-start lg:self-center border-l border-border-subtle/60 pl-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Verified Mentors</p>
                <p className="text-2xl font-extrabold text-text-primary mt-1">{mentorsQuery.isLoading ? "..." : mentors.length}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Filter controls */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid gap-4 rounded-3xl border border-border-subtle bg-bg-surface p-5 md:grid-cols-[1.5fr_1fr_1fr_auto] items-end"
        >
          <div className="space-y-1.5">
            <label htmlFor="search" className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Search name or keyword
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentors..."
                className="w-full rounded-2xl border border-border-subtle bg-bg-elevated/40 py-2.5 pl-10 pr-4 text-xs font-semibold text-text-primary placeholder:text-text-tertiary focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="skill" className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Expertise Area
            </label>
            <select
              id="skill"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full rounded-2xl border border-border-subtle bg-bg-elevated/40 py-2.5 px-3 text-xs font-semibold text-text-primary outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30"
            >
              <option value="">All expertise</option>
              {availableSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="rate" className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Max Hourly Rate ($)
            </label>
            <select
              id="rate"
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              className="w-full rounded-2xl border border-border-subtle bg-bg-elevated/40 py-2.5 px-3 text-xs font-semibold text-text-primary outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30"
            >
              <option value="">Any price</option>
              <option value="0">Free sessions ($0)</option>
              <option value="50">Under $50/hr</option>
              <option value="100">Under $100/hr</option>
              <option value="150">Under $150/hr</option>
            </select>
          </div>

          <Button
            variant="secondary"
            onClick={resetFilters}
            className="w-full md:w-auto h-[41px]"
            disabled={!searchQuery && !selectedSkill && !maxRate}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </motion.section>

        {/* Results grid */}
        {mentorsQuery.isLoading ? (
          <ExploreSkeleton />
        ) : filteredMentors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <EmptyState
              title="No mentors found"
              description="Try adjusting your keyword searches or clearing filter constraints."
              actionLabel="Clear Filters"
              onAction={resetFilters}
            />
          </motion.div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredMentors.map((mentor, index) => {
                const initials = (mentor.full_name || "M")
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                const skills = mentor.profile?.skills || [];

                return (
                  <motion.div
                    key={mentor.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-primary/30 hover:shadow-accent/15"
                  >
                    <div>
                      {/* Avatar Row */}
                      <div className="flex items-center gap-4">
                        {mentor.avatar_url ? (
                          <img
                            src={mentor.avatar_url}
                            alt=""
                            className="h-14 w-14 rounded-2xl border border-border-subtle object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-primary/10 text-base font-extrabold text-accent-primary ring-2 ring-accent-primary/20">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-extrabold text-text-primary">
                            {mentor.full_name}
                          </h3>
                          <p className="mt-0.5 truncate text-[11px] font-bold text-text-secondary flex items-center gap-1">
                            <Briefcase className="h-3 w-3 text-text-tertiary" />
                            {mentor.profile?.job_title || "Expert Mentor"}
                          </p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="mt-4 text-xs leading-relaxed text-text-secondary line-clamp-3">
                        {mentor.profile?.bio || "Experienced mentor offering targeted tutoring, technical reviews, and strategic guidance."}
                      </p>

                      {/* Experience and Pricing metadata */}
                      <div className="mt-4 grid grid-cols-2 gap-2 border-y border-border-subtle/50 py-3 text-[11px]">
                        <div className="flex items-center gap-1.5 text-text-secondary font-semibold">
                          <Star className="h-3.5 w-3.5 text-text-tertiary" />
                          <span>{mentor.profile?.experience_years || 0} years exp</span>
                        </div>
                        <div className="flex items-center gap-1 text-text-primary font-bold justify-end">
                          <DollarSign className="h-3.5 w-3.5 text-text-tertiary" />
                          <span>{mentor.profile?.hourly_rate > 0 ? `${mentor.profile?.hourly_rate}/hr` : "Free sessions"}</span>
                        </div>
                      </div>

                      {/* Skills expertise area */}
                      {skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          {skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="rounded px-2 py-0.5 text-[10px] font-bold bg-bg-elevated text-text-secondary"
                            >
                              {skill}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="rounded px-2 py-0.5 text-[10px] font-bold bg-bg-elevated text-text-tertiary">
                              +{skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Booking button */}
                    <div className="mt-5 pt-1">
                      <Link to={`/student/mentors/${mentor.id}`} className="w-full">
                        <Button variant="primary" className="w-full group/btn" id={`mentor-card-btn-${mentor.id}`}>
                          View Availability
                          <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

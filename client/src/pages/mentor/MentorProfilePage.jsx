import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Link as LinkIcon,
  Loader2,
  RotateCcw,
  Save,
  Sparkles,
  UserRound,
  BadgeCheck,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { AvatarSelector } from "../../components/profile/AvatarSelector";
import { FormField } from "../../components/ui/FormField";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../hooks/useAuth";
import { useMentorProfile } from "../../hooks/useMentorProfile";
import { createZodResolver } from "../../utils/zodForm";
import { cn } from "../../utils/cn";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  designation: z.string().trim().min(2, "Designation is required."),
  company: z.string().trim().min(2, "Company is required."),
  experience: z.coerce
    .number({ invalid_type_error: "Experience must be a number." })
    .int("Experience must be a whole number.")
    .min(0, "Experience must be 0 or greater.")
    .max(100, "Experience must be 100 or less."),
  hourly_rate: z.coerce
    .number({ invalid_type_error: "Hourly rate must be a number." })
    .min(0, "Hourly rate must be 0 or greater."),
  bio: z.string().trim().max(1000, "Bio must stay under 1000 characters.").optional(),
  expertiseText: z.string().trim().optional(),
  linkedin_url: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
  github_url: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
  portfolio_url: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
  avatar_url: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
});

function getDefaultValues(user, profile) {
  return {
    fullName: profile?.full_name || user?.full_name || "",
    designation: profile?.designation || "",
    company: profile?.company || "",
    experience: profile?.experience || 0,
    hourly_rate: profile?.hourly_rate || 0,
    bio: profile?.bio || "",
    expertiseText: Array.isArray(profile?.expertise) ? profile.expertise.join(", ") : "",
    linkedin_url: profile?.linkedin_url || "",
    github_url: profile?.github_url || "",
    portfolio_url: profile?.portfolio_url || "",
    avatar_url: profile?.avatar_url || user?.avatar_url || "",
  };
}

function toPayload(values) {
  return {
    fullName: values.fullName,
    designation: values.designation,
    company: values.company,
    experience: values.experience,
    hourly_rate: values.hourly_rate,
    bio: values.bio || null,
    expertise: values.expertiseText
      ? values.expertiseText.split(",").map((item) => item.trim()).filter(Boolean)
      : [],
    linkedin_url: values.linkedin_url || null,
    github_url: values.github_url || null,
    portfolio_url: values.portfolio_url || null,
    avatar_url: values.avatar_url || null,
  };
}

function getCompletion(values) {
  const fields = [
    values.fullName,
    values.designation,
    values.company,
    values.experience,
    values.hourly_rate,
    values.bio,
    values.expertiseText,
    values.linkedin_url,
    values.github_url,
    values.portfolio_url,
    values.avatar_url,
  ];

  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Skeleton className="h-56 w-full rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-[34rem] w-full rounded-2xl" />
      </div>
    </div>
  );
}

function ProfileSummary({ user, values, completion, isVerified, setValue }) {
  const initials = (values.fullName || user?.full_name || "M")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const expertiseChips = useMemo(() => {
    return (values.expertiseText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [values.expertiseText]);

  return (
    <aside className="h-fit rounded-2xl border border-border-subtle bg-bg-surface p-5 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <AvatarSelector
          avatarUrl={values.avatar_url}
          onChange={(url) => setValue("avatar_url", url, { shouldDirty: true })}
          initials={initials}
        />
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-text-primary">
            {values.fullName || "Mentor"}
          </p>
          <p className="mt-0.5 truncate text-xs text-text-secondary">
            {user?.email || ""}
          </p>
        </div>
      </div>

      {/* Completion score indicator */}
      <div className="rounded-xl border border-border-subtle bg-bg-elevated/30 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Profile completion</p>
          <p className="text-xs font-bold tabular-nums text-accent-mentor">
            {completion}%
          </p>
        </div>
        <div className="w-full bg-bg-elevated rounded-full h-1.5 overflow-hidden mt-2.5">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "var(--accent-mentor)" }}
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Details summary */}
      <div className="space-y-3">
        {[
          ["Designation", values.designation],
          ["Company", values.company],
          ["Experience", values.experience ? `${values.experience} years` : ""],
          ["Hourly Rate", values.hourly_rate ? `$${values.hourly_rate}/hr` : ""],
          ["Verified", isVerified ? "Yes" : "Pending"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-3 border-b border-border-subtle/40 pb-2 last:border-b-0 last:pb-0">
            <span className="shrink-0 text-xs text-text-secondary">{label}</span>
            <span className="text-right text-xs font-semibold text-text-primary">
              {value || <span className="text-text-tertiary font-normal italic">Not set</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Live interactive expertise chips */}
      {expertiseChips.length > 0 && (
        <div className="border-t border-border-subtle pt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-2.5">Expertise Areas</p>
          <div className="flex flex-wrap gap-1.5">
            {expertiseChips.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded px-2.5 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "var(--accent-mentor)" }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export default function MentorProfilePage() {
  const { user, refetchUser } = useAuth();
  const { profile, isMissingProfile, isLoading, isError, error, refetch, saveProfile } =
    useMentorProfile();

  const defaults = useMemo(() => getDefaultValues(user, profile), [profile, user]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: createZodResolver(profileSchema),
    values: defaults,
  });

  const values = watch();
  const completion = getCompletion(values);
  const isSaving = saveProfile.isPending || isSubmitting;
  const isVerified = Boolean(profile?.is_verified);

  // Tab State
  const [activeTab, setActiveTab] = useState("general"); // "general" | "professional" | "links"

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = async (formValues) => {
    await saveProfile.mutateAsync(toPayload(formValues));
    reset(formValues);
    // Immediately refresh auth user so navbar avatar updates without waiting for the 30s poll
    refetchUser?.();
  };

  if (isLoading) return <ProfileSkeleton />;

  if (isError && !isMissingProfile) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Profile could not load"
          description={error?.message || "Nexora could not fetch your mentor profile."}
          actionLabel="Retry"
          onAction={refetch}
        />
      </div>
    );
  }

  const tabOptions = [
    { id: "general", label: "General details", icon: UserRound },
    { id: "professional", label: "Professional stats", icon: Briefcase },
    { id: "links", label: "Social linkages", icon: LinkIcon },
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Header section */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6"
        >
          {/* emerald shimmer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent-mentor), transparent)" }}
          />

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                style={{ background: "rgba(16,185,129,0.12)", color: "var(--accent-mentor)" }}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Mentor Profile Setup
              </p>
              <h1 className="font-display text-display font-semibold text-text-primary mt-4 leading-tight">
                Share your expertise with others.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                Keep your details complete so students can discover your skills and schedule booking requests with confidence.
              </p>
            </div>
            
            <div className="flex shrink-0 items-center gap-3">
              {isVerified && (
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: "rgba(16,185,129,0.12)", color: "var(--accent-mentor)" }}
                >
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  Verified
                </div>
              )}
              <AnimatePresence mode="wait" initial={false}>
                {isDirty ? (
                  <motion.div
                    key="unsaved"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="badge border border-accent-danger/20 bg-accent-danger/10 text-accent-danger text-[10px] uppercase font-bold tracking-wider"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                    Unsaved changes
                  </motion.div>
                ) : (
                  <motion.div
                    key="saved"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="badge border border-accent-mentor/20 bg-accent-mentor/10 text-accent-mentor text-[10px] uppercase font-bold tracking-wider"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                    Saved
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* Layout Grid */}
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.35fr]">
          <ProfileSummary user={user} values={values} completion={completion} isVerified={isVerified} setValue={setValue} />

          {/* Form */}
          <form className="rounded-2xl border border-border-subtle bg-bg-surface p-5 sm:p-6 flex flex-col justify-between" onSubmit={handleSubmit(onSubmit)}>
            <div>
              {isMissingProfile && (
                <div className="mb-5 rounded border border-accent-mentor/20 bg-accent-mentor/10 px-4 py-3 text-xs font-semibold text-accent-mentor">
                  Welcome to NEXORA! Complete your profile setup below to start connecting with students.
                </div>
              )}

              {/* Animated sliding tab header */}
              <div className="flex border-b border-border-subtle mb-6 gap-2">
                {tabOptions.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "relative pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 transition duration-150",
                        isActive ? "text-accent-mentor" : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="profile-tab-indicator"
                          className="absolute bottom-0 inset-x-0 h-0.5"
                          style={{ backgroundColor: "var(--accent-mentor)" }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="mt-4 min-h-[300px]">
                <AnimatePresence mode="wait">
                  {activeTab === "general" && (
                    <motion.div
                      key="general"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-5"
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <FormField id="fullName" label="Full name" error={errors.fullName} {...register("fullName")} />
                        <FormField id="email" label="Email" value={user?.email || ""} disabled helper="Email is managed by authentication." />
                      </div>
                      <FormField
                        id="bio"
                        label="Bio"
                        as="textarea"
                        rows={4}
                        error={errors.bio}
                        helper="A clean summary of your professional journey and mentoring focus."
                        {...register("bio")}
                      />
                      <FormField
                        id="expertiseText"
                        label="Expertise / Skills"
                        error={errors.expertiseText}
                        helper="Separate skills with commas (e.g. JavaScript, System Design, Career Growth)"
                        {...register("expertiseText")}
                      />
                    </motion.div>
                  )}

                  {activeTab === "professional" && (
                    <motion.div
                      key="professional"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="grid gap-5 md:grid-cols-2"
                    >
                      <FormField id="designation" label="Designation" error={errors.designation} {...register("designation")} />
                      <FormField id="company" label="Company" error={errors.company} {...register("company")} />
                      <FormField id="experience" label="Experience (years)" type="number" error={errors.experience} {...register("experience")} />
                      <FormField id="hourly_rate" label="Hourly rate ($)" type="number" error={errors.hourly_rate} {...register("hourly_rate")} />
                    </motion.div>
                  )}

                  {activeTab === "links" && (
                    <motion.div
                      key="links"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 border-b border-border-subtle/40 pb-2">
                        <LinkIcon className="h-4 w-4" style={{ color: "var(--accent-mentor)" }} aria-hidden="true" />
                        <span className="text-xs font-bold uppercase tracking-wider text-text-primary">Social links</span>
                      </div>
                      <div className="grid gap-5 md:grid-cols-2">
                        <FormField id="linkedin_url" label="LinkedIn URL" error={errors.linkedin_url} {...register("linkedin_url")} />
                        <FormField id="github_url" label="GitHub URL" error={errors.github_url} {...register("github_url")} />
                        <FormField id="portfolio_url" label="Portfolio URL" error={errors.portfolio_url} {...register("portfolio_url")} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Alert constraint */}
              <div className="mt-8 rounded border border-border-subtle bg-bg-elevated/30 p-4 text-xs text-text-secondary leading-relaxed">
                Certificates and specific verifications are stored by admin reviews. To preserve database schemas, this console updates standard users profile values.
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => reset(defaults)} disabled={!isDirty || isSaving}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Cancel changes
              </Button>
              <Button type="submit" loading={isSaving} disabled={!isDirty && !isMissingProfile}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
                Save profile
              </Button>
            </div>
          </form>
        </div>

        {/* Informative cards */}
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Professional clarity", "Designation and company build credibility with students.", Briefcase],
            ["Trusted connections", "Social links let students verify your experience offline.", ExternalLink],
            ["Skills matchmaking", "Expertise helps student dashboards recommend you.", Sparkles],
          ].map(([title, text, icon], i) => {
            const IconComponent = icon;
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="rounded-2xl border border-border-subtle bg-bg-surface p-5"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "var(--accent-mentor)" }}
                >
                  <IconComponent className="h-4 w-4" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-text-primary">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-text-secondary">{text}</p>
              </motion.div>
            );
          })}
        </section>
      </div>
    </PageTransition>
  );
}

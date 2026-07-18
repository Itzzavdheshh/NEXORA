import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Link as LinkIcon,
  Loader2,
  RotateCcw,
  Save,
  Sparkles,
  UserRound,
  Briefcase,
  BookOpen
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { AvatarSelector } from "../../components/profile/AvatarSelector";
import { FormField } from "../../components/ui/FormField";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../hooks/useAuth";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import { createZodResolver } from "../../utils/zodForm";
import { cn } from "../../utils/cn";

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  college: z.string().trim().min(2, "College is required."),
  degree: z.string().trim().min(2, "Degree is required."),
  branch: z.string().trim().min(2, "Branch is required."),
  graduation_year: z.coerce
    .number({ invalid_type_error: "Graduation year must be a number." })
    .int("Graduation year must be a whole number.")
    .min(2000, "Graduation year must be 2000 or later.")
    .max(2100, "Graduation year must be 2100 or earlier."),
  bio: z.string().trim().max(600, "Bio must stay under 600 characters.").optional(),
  skillsText: z.string().trim().optional(),
  linkedin_url: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
  github_url: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
  portfolio_url: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
  avatar_url: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
});

function getDefaultValues(user, profile) {
  return {
    fullName: profile?.full_name || user?.full_name || "",
    college: profile?.college || "",
    degree: profile?.degree || "",
    branch: profile?.branch || "",
    graduation_year: profile?.graduation_year || new Date().getFullYear(),
    bio: profile?.bio || "",
    skillsText: Array.isArray(profile?.skills) ? profile.skills.join(", ") : "",
    linkedin_url: profile?.linkedin_url || "",
    github_url: profile?.github_url || "",
    portfolio_url: profile?.portfolio_url || "",
    avatar_url: profile?.avatar_url || user?.avatar_url || "",
  };
}

function toPayload(values) {
  return {
    fullName: values.fullName,
    college: values.college,
    degree: values.degree,
    branch: values.branch,
    graduation_year: values.graduation_year,
    bio: values.bio || null,
    skills: values.skillsText
      ? values.skillsText.split(",").map((skill) => skill.trim()).filter(Boolean)
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
    values.college,
    values.degree,
    values.branch,
    values.graduation_year,
    values.bio,
    values.skillsText,
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
      <Skeleton className="h-56 w-full rounded-md" />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <Skeleton className="h-96 w-full rounded-md" />
        <Skeleton className="h-[34rem] w-full rounded-md" />
      </div>
    </div>
  );
}

function ProfileSummary({ user, values, completion, setValue }) {
  const initials = (values.fullName || user?.full_name || "S")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const skillChips = useMemo(() => {
    return (values.skillsText || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [values.skillsText]);

  return (
    <aside className="rounded-md border border-border-subtle bg-bg-surface p-5 h-fit flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <AvatarSelector
          avatarUrl={values.avatar_url}
          onChange={(url) => setValue("avatar_url", url, { shouldDirty: true })}
          initials={initials}
        />
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-text-primary">
            {values.fullName || "Student"}
          </p>
          <p className="mt-0.5 truncate text-xs text-text-secondary">
            {user?.email || ""}
          </p>
        </div>
      </div>

      {/* Completion score indicator */}
      <div className="rounded border border-border-subtle bg-bg-elevated/30 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Profile completion</p>
          <p className="text-xs font-bold tabular-nums text-accent-primary">
            {completion}%
          </p>
        </div>
        <div className="w-full bg-bg-elevated rounded-full h-1.5 overflow-hidden mt-2.5">
          <motion.div
            className="bg-accent-primary h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {[
          ["College", values.college],
          ["Degree", values.degree],
          ["Branch", values.branch],
          ["Graduation", values.graduation_year],
        ].map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-3 border-b border-border-subtle/40 pb-2 last:border-b-0 last:pb-0">
            <span className="shrink-0 text-xs text-text-secondary">{label}</span>
            <span className="text-right text-xs font-semibold text-text-primary">
              {value || <span className="text-text-tertiary font-normal italic">Not set</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Real-time interactive skill chips display */}
      {skillChips.length > 0 && (
        <div className="border-t border-border-subtle pt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-2.5">Identified Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skillChips.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded border border-accent-primary/20 bg-accent-primary/10 px-2 py-0.5 text-[10px] font-bold text-accent-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export default function StudentProfilePage() {
  const { user, refetchUser } = useAuth();
  const { profile, isMissingProfile, isLoading, isError, error, refetch, saveProfile } =
    useStudentProfile();
  
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
  
  // Custom Tabs state for the editable sections
  const [activeTab, setActiveTab] = useState("general"); // "general" | "education" | "links"

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
    await saveProfile.mutateAsync({
      mode: profile || !isMissingProfile ? "update" : "create",
      payload: toPayload(formValues),
    });
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
          description={error?.message || "Nexora could not fetch your student profile."}
          actionLabel="Retry"
          onAction={refetch}
        />
      </div>
    );
  }

  const tabOptions = [
    { id: "general", label: "General details", icon: Briefcase },
    { id: "education", label: "Education stats", icon: BookOpen },
    { id: "links", label: "Social linkages", icon: LinkIcon }
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Hero Header Banner */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-md border border-border-subtle bg-bg-surface p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded border border-accent-primary/20 bg-accent-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Student Profile Setup
              </p>
              <h1 className="font-display text-display font-semibold text-text-primary leading-tight mt-4">
                Shape your profile credentials.
              </h1>
              <p className="mt-2 text-xs text-text-secondary max-w-xl">
                Keep your details complete so mentors can understand your context and prepare for session topics.
              </p>
            </div>
            
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
                  Profile saved
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Layout Grid */}
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.35fr]">
          
          {/* Summary Sidebar Card */}
          <ProfileSummary user={user} values={values} completion={completion} setValue={setValue} />

          {/* Tabbed Form Panel */}
          <form className="rounded-md border border-border-subtle bg-bg-surface p-5 sm:p-6 flex flex-col justify-between" onSubmit={handleSubmit(onSubmit)}>
            <div>
              {isMissingProfile ? (
                <div className="mb-5 rounded border border-accent-primary/20 bg-accent-primary/10 px-4 py-3 text-xs font-semibold text-accent-primary">
                  Welcome to NEXORA! Complete your profile details below to get personalized mentor recommendations.
                </div>
              ) : null}

              {/* Custom Animated Sliding Tab Header */}
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
                        isActive ? "text-accent-primary" : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="profile-tab-indicator"
                          className="absolute bottom-0 inset-x-0 h-0.5 bg-accent-primary"
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
                        <FormField id="email" label="Email" value={user?.email || ""} disabled helper="Email cannot be modified directly." />
                      </div>
                      <FormField
                        id="bio"
                        label="Bio"
                        as="textarea"
                        rows={4}
                        error={errors.bio}
                        helper="A clear summary of academic goals and mentorship expectations."
                        {...register("bio")}
                      />
                      <FormField
                        id="skillsText"
                        label="Skills"
                        error={errors.skillsText}
                        helper="Separate skills with commas (e.g. JavaScript, Python, Algorithm Design)"
                        {...register("skillsText")}
                      />
                    </motion.div>
                  )}

                  {activeTab === "education" && (
                    <motion.div
                      key="education"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="grid gap-5 md:grid-cols-2"
                    >
                      <FormField id="college" label="College" error={errors.college} {...register("college")} />
                      <FormField id="degree" label="Degree" error={errors.degree} {...register("degree")} />
                      <FormField id="branch" label="Branch" error={errors.branch} {...register("branch")} />
                      <FormField id="graduation_year" label="Graduation year" type="number" error={errors.graduation_year} {...register("graduation_year")} />
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
                        <LinkIcon className="h-4 w-4 text-accent-primary" aria-hidden="true" />
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

              {/* Schema Constraint Information Alert */}
              <div className="mt-8 rounded border border-border-subtle bg-bg-elevated/30 p-4 text-xs text-text-secondary leading-relaxed">
                Interests are not supported by the current backend schema. To preserve database contracts, this console does not insert placeholder fields.
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

        {/* Informative Grid Footer */}
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Education details", "College, degree, and graduation stats keep your profile searchable.", GraduationCap],
            ["Social links", "Portfolio and socials help mentors prepare context for sessions.", ExternalLink],
            ["Verified profile", "Frictionless setup guarantees higher acceptance on booking calls.", Sparkles],
          ].map(([title, text, icon], i) => {
            const IconComponent = icon;
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="rounded-md border border-border-subtle bg-bg-surface p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded border border-border-subtle bg-bg-elevated text-accent-primary">
                  <IconComponent className="h-4 w-4" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-text-primary">{title}</h3>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">{text}</p>
              </motion.div>
            );
          })}
        </section>
      </div>
    </PageTransition>
  );
}

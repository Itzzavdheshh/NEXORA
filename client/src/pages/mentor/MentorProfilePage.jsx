import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { FormField } from "../../components/ui/FormField";
import { PageTransition } from "../../components/ui/PageTransition";
import { Skeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../hooks/useAuth";
import { useMentorProfile } from "../../hooks/useMentorProfile";
import { createZodResolver } from "../../utils/zodForm";

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
      <Skeleton className="h-56 w-full" />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-[34rem] w-full" />
      </div>
    </div>
  );
}

function ProfileSummary({ user, values, completion }) {
  const initials = (values.fullName || user?.full_name || "M")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="glass-panel h-fit rounded-3xl p-6">
      <div className="flex items-start gap-4">
        {values.avatar_url ? (
          <img
            src={values.avatar_url}
            alt=""
            className="h-16 w-16 rounded-3xl border border-ink-200 object-cover dark:border-white/10"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-ink-950 text-xl font-extrabold text-white shadow-glow dark:bg-brand-300 dark:text-ink-950">
            {initials || <UserRound className="h-6 w-6" aria-hidden="true" />}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-extrabold tracking-tight text-ink-950 dark:text-white">
            {values.fullName || "Mentor"}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-ink-600 dark:text-ink-300">
            {user?.email || "Email from account"}
          </p>
        </div>
      </div>

      <div className="mt-7 rounded-3xl border border-ink-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-ink-950 dark:text-white">Profile completion</p>
          <p className="text-sm font-extrabold text-brand-700 dark:text-brand-200">
            {completion}%
          </p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-ink-200 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 to-mint-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        {[
          ["Designation", values.designation],
          ["Company", values.company],
          ["Experience", `${values.experience} years`],
          ["Hourly Rate", `$${values.hourly_rate}/hr`],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <span className="text-ink-500 dark:text-ink-300">{label}</span>
            <span className="truncate font-bold text-ink-950 dark:text-white">
              {value || "Not set"}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function MentorProfilePage() {
  const { user } = useAuth();
  const { profile, isMissingProfile, isLoading, isError, error, refetch, saveProfile } =
    useMentorProfile();
  const defaults = useMemo(() => getDefaultValues(user, profile), [profile, user]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    resolver: createZodResolver(profileSchema),
    values: defaults,
  });
  const values = watch();
  const completion = getCompletion(values);
  const isSaving = saveProfile.isPending || isSubmitting;

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

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-[2rem] p-6 sm:p-7"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-100">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Mentor profile
              </p>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl dark:text-white">
                Share your expertise with the next generation.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 dark:text-ink-200">
                Keep your details up to date so students can find you and book mentorship sessions with confidence.
              </p>
            </div>
            {isDirty ? (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Unsaved changes
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Saved state
              </div>
            )}
          </div>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.35fr]">
          <ProfileSummary user={user} values={values} completion={completion} />

          <form className="glass-panel rounded-3xl p-5 sm:p-6" onSubmit={handleSubmit(onSubmit)}>
            {isMissingProfile ? (
              <div className="mb-5 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-100">
                No mentor profile exists yet. Save this form once to create it.
              </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <FormField id="fullName" label="Full name" error={errors.fullName} {...register("fullName")} />
              <FormField id="email" label="Email" value={user?.email || ""} disabled helper="Email is managed by authentication." />
              <FormField id="designation" label="Designation" error={errors.designation} {...register("designation")} />
              <FormField id="company" label="Company" error={errors.company} {...register("company")} />
              <FormField id="experience" label="Experience (years)" type="number" error={errors.experience} {...register("experience")} />
              <FormField id="hourly_rate" label="Hourly rate ($)" type="number" error={errors.hourly_rate} {...register("hourly_rate")} />
            </div>

            <div className="mt-5 grid gap-5">
              <FormField
                id="bio"
                label="Bio"
                as="textarea"
                rows={5}
                error={errors.bio}
                helper="Share your journey, topics you cover, and how you help students succeed."
                {...register("bio")}
              />
              <FormField
                id="expertiseText"
                label="Expertise / Skills"
                error={errors.expertiseText}
                helper="Comma separated, for example: Frontend, System Design, Career Growth"
                {...register("expertiseText")}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-ink-200/80 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8">
              <div className="mb-4 flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-brand-700 dark:text-brand-200" aria-hidden="true" />
                <h2 className="font-extrabold text-ink-950 dark:text-white">Professional & social links</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <FormField id="linkedin_url" label="LinkedIn URL" error={errors.linkedin_url} {...register("linkedin_url")} />
                <FormField id="github_url" label="GitHub URL" error={errors.github_url} {...register("github_url")} />
                <FormField id="portfolio_url" label="Portfolio URL" error={errors.portfolio_url} {...register("portfolio_url")} />
                <FormField id="avatar_url" label="Avatar URL" error={errors.avatar_url} helper="Supported by backend through users.avatar_url." {...register("avatar_url")} />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Professional clarity", "Designation and company build credibility with students.", Briefcase],
            ["Trusted connections", "Social links let students verify your experience offline.", ExternalLink],
            ["Skills matchmaking", "Expertise helps student dashboards recommend you.", Sparkles],
          ].map(([title, text, icon]) => {
            const IconComponent = icon;

            return (
              <div key={title} className="glass-panel rounded-3xl p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-700 dark:bg-brand-300/10 dark:text-brand-100">
                  <IconComponent className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-extrabold text-ink-950 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{text}</p>
              </div>
            );
          })}
        </section>
      </div>
    </PageTransition>
  );
}

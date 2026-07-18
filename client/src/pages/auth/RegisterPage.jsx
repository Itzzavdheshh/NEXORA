import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, UserPlus, User, GraduationCap, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "../../components/ui/PageTransition";
import { Button } from "../../components/ui/Button";
import { FormField, PasswordToggle } from "../../components/ui/FormField";
import { ROLE_HOME, USER_ROLES } from "../../constants/app";
import { useRegister } from "../../hooks/useAuthActions";
import { createZodResolver } from "../../utils/zodForm";
import { cn } from "../../utils/cn";

// ── Register subtext typewriter ──────────────────────────────────────────────
const REGISTER_PHRASES = [
  "and gain access to your workspace.",
  "and connect with verified mentors.",
  "and track your academic progress.",
];

const TYPING_SPEED = 45;
const ERASING_SPEED = 20;
const PAUSE_AFTER = 2000;
const PAUSE_BEFORE = 300;

function RegisterTypewriter() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    const target = REGISTER_PHRASES[phraseIndex];

    if (phase === "typing") {
      if (displayed.length < target.length) {
        const t = setTimeout(() => {
          setDisplayed(target.slice(0, displayed.length + 1));
        }, TYPING_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("erasing"), PAUSE_AFTER);
        return () => clearTimeout(t);
      }
    }

    if (phase === "erasing") {
      if (displayed.length > 0) {
        const t = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, ERASING_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % REGISTER_PHRASES.length);
          setPhase("typing");
        }, PAUSE_BEFORE);
        return () => clearTimeout(t);
      }
    }
  }, [displayed, phase, phraseIndex]);

  return (
    <span className="text-accent-primary">
      {displayed}
      <span
        className="inline-block w-[1.5px] h-[1em] bg-accent-primary align-middle ml-[2px] animate-blink"
        aria-hidden="true"
      />
    </span>
  );
}

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
  role: z.enum([USER_ROLES.STUDENT, USER_ROLES.MENTOR, USER_ROLES.ADMIN], {
    required_error: "Choose your role.",
  }),
});

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const registerAccount = useRegister();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: createZodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: USER_ROLES.STUDENT,
    },
  });

  const onSubmit = async (values) => {
    const data = await registerAccount.mutateAsync(values);
    const role = data?.data?.user?.role || values.role;
    navigate(ROLE_HOME[role] || "/student/dashboard", { replace: true });
  };

  const isLoading = registerAccount.isPending || isSubmitting;
  const selectedRole = watch("role");
  const passwordVal = watch("password") || "";

  // Rules checked in real-time
  const rules = [
    { key: "length",  label: "At least 8 characters",          pass: passwordVal.length >= 8 },
    { key: "upper",   label: "One uppercase letter (A–Z)",      pass: /[A-Z]/.test(passwordVal) },
    { key: "number",  label: "One number (0–9)",                pass: /[0-9]/.test(passwordVal) },
    { key: "special", label: "One special character (!@#$…)",   pass: /[^A-Za-z0-9]/.test(passwordVal) },
  ];

  // Required rules (first 3) — form blocks submit if any of these fail
  const requiredMet = rules.slice(0, 3).filter((r) => r.pass).length;
  const hasSpecial  = rules[3].pass;

  const getStrengthMeta = () => {
    if (!passwordVal) return { score: 0, color: "", label: "" };
    if (requiredMet === 0) return { score: 1, color: "bg-accent-danger",  label: "Weak" };
    if (requiredMet === 1) return { score: 1, color: "bg-accent-danger",  label: "Weak" };
    if (requiredMet === 2) return { score: 2, color: "bg-accent-warning", label: "Medium" };
    // All 3 required rules pass
    if (!hasSpecial)       return { score: 3, color: "bg-amber-400",      label: "Good" };
    return                        { score: 4, color: "bg-accent-mentor",  label: "Strong" };
  };

  const strength = getStrengthMeta();

  return (
    <PageTransition>
      <div className="w-full">
        <div 
          className="rounded-lg p-6 sm:p-8 border border-[var(--border-subtle)] shadow-md"
          style={{ backgroundColor: "var(--bg-elevated)", backdropFilter: "none" }}
        >
          {/* Header */}
          <div className="mb-6">
            <div className="badge badge-brand mb-4">
              <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
              Onboarding
            </div>
            <h1 className="font-display text-section font-semibold text-text-primary tracking-tight">
              Create your account
            </h1>
            {/* Desktop static subtext */}
            <p className="mt-2 text-sm text-text-secondary leading-relaxed hidden lg:block">
              Choose your role and gain access to your workspace.
            </p>
            {/* Mobile dynamic typewriter subtext */}
            <p className="mt-2 text-sm text-text-secondary leading-relaxed lg:hidden min-h-[2.5rem]">
              Choose your role <RegisterTypewriter />
            </p>
          </div>

          {/* Error Banner */}
          {registerAccount.isError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-md border border-accent-danger/20 bg-accent-danger/10 px-4 py-3 text-xs font-semibold text-accent-danger"
              role="alert"
            >
              {registerAccount.error.message}
            </motion.div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField
              id="fullName"
              label="Full name"
              type="text"
              autoComplete="name"
              placeholder="Avdhesh Sharma"
              error={errors.fullName}
              {...register("fullName")}
            />

            <FormField
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@nexora.dev"
              error={errors.email}
              {...register("email")}
            />

            {/* Selectable Cards for Role Selection (Student / Mentor) */}
            <div className="space-y-1.5">
              <label className="block text-caption font-medium uppercase tracking-token-caption text-text-secondary">
                Select profile role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Student Selectable Card */}
                <button
                  type="button"
                  onClick={() => setValue("role", USER_ROLES.STUDENT, { shouldValidate: true })}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-md border text-center transition-all duration-token-standard",
                    selectedRole === USER_ROLES.STUDENT
                      ? "border-accent-primary bg-bg-surface ring-2 ring-accent-primary/20 text-text-primary"
                      : "border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-strong hover:bg-bg-floating"
                  )}
                >
                  <GraduationCap className={cn(
                    "h-6 w-6 mb-2 transition-colors",
                    selectedRole === USER_ROLES.STUDENT ? "text-accent-primary" : "text-text-tertiary"
                  )} />
                  <span className="text-xs font-bold uppercase tracking-wide">Student</span>
                </button>

                {/* Mentor Selectable Card */}
                <button
                  type="button"
                  onClick={() => setValue("role", USER_ROLES.MENTOR, { shouldValidate: true })}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-md border text-center transition-all duration-token-standard",
                    selectedRole === USER_ROLES.MENTOR
                      ? "border-accent-mentor bg-bg-surface ring-2 ring-accent-mentor/20 text-text-primary"
                      : "border-border-subtle bg-bg-elevated text-text-secondary hover:border-border-strong hover:bg-bg-floating"
                  )}
                >
                  <User className={cn(
                    "h-6 w-6 mb-2 transition-colors",
                    selectedRole === USER_ROLES.MENTOR ? "text-accent-mentor" : "text-text-tertiary"
                  )} />
                  <span className="text-xs font-bold uppercase tracking-wide">Mentor</span>
                </button>
              </div>
              {errors.role && (
                <p className="text-xs font-medium text-accent-danger mt-1">{errors.role.message}</p>
              )}
            </div>

            {/* Hidden Input to hold RHF value */}
            <input type="hidden" {...register("role")} />

            <div className="space-y-2">
              <FormField
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.password}
                rightSlot={
                  <PasswordToggle
                    visible={showPassword}
                    onClick={() => setShowPassword((v) => !v)}
                  />
                }
                {...register("password")}
              />

              {/* Password strength + live requirements */}
              {passwordVal.length > 0 && (
                <div className="space-y-2 pt-1">
                  {/* Strength bar */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-text-tertiary">
                    <span>Password Strength:</span>
                    <span className={cn(
                      strength.score === 1 && "text-accent-danger",
                      strength.score === 2 && "text-accent-warning",
                      strength.score === 3 && "text-amber-400",
                      strength.score === 4 && "text-accent-mentor",
                    )}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1">
                    {[1, 2, 3, 4].map((val) => (
                      <div
                        key={val}
                        className={cn(
                          "h-full rounded-full transition-colors duration-300",
                          strength.score >= val ? strength.color : "bg-border-subtle"
                        )}
                      />
                    ))}
                  </div>

                  {/* Live requirements checklist */}
                  <ul className="space-y-1 pt-0.5">
                    {rules.map((rule) => (
                      <li key={rule.key} className={cn(
                        "flex items-center gap-1.5 text-[11px] font-medium transition-colors duration-150",
                        rule.pass ? "text-accent-mentor" : "text-text-tertiary"
                      )}>
                        {rule.pass
                          ? <Check className="h-3 w-3 shrink-0" />
                          : <X     className="h-3 w-3 shrink-0 text-accent-danger" />}
                        {rule.label}
                        {rule.key === "special" && !rule.pass && (
                          <span className="text-text-tertiary/60 ml-0.5">(optional — boosts to Strong)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button
              className="w-full mt-2"
              size="lg"
              loading={isLoading}
              type="submit"
            >
              {isLoading ? "Creating account…" : "Create account"}
              {!isLoading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </form>

          <div className="mt-6 border-t border-border-subtle pt-5 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              className="font-semibold text-text-primary hover:text-accent-primary transition duration-token-micro"
              to="/login"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

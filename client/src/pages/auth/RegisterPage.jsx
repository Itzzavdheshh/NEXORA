import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, UserPlus, User, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "../../components/ui/PageTransition";
import { Button } from "../../components/ui/Button";
import { FormField, PasswordToggle } from "../../components/ui/FormField";
import { ROLE_HOME, USER_ROLES } from "../../constants/app";
import { useRegister } from "../../hooks/useAuthActions";
import { createZodResolver } from "../../utils/zodForm";
import { cn } from "../../utils/cn";

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
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

  // Purely visual strength calculation matching existing schema validation
  const getPasswordStrength = () => {
    if (!passwordVal) return { score: 0, color: "", label: "" };
    if (passwordVal.length < 8) return { score: 1, color: "bg-accent-danger", label: "Weak" };
    
    // Check if it has a number and uppercase letter for 'Strong'
    const hasNumber = /[0-9]/.test(passwordVal);
    const hasUpper = /[A-Z]/.test(passwordVal);
    if (hasNumber && hasUpper) {
      return { score: 3, color: "bg-accent-mentor", label: "Strong" };
    }
    
    return { score: 2, color: "bg-accent-warning", label: "Medium" };
  };

  const strength = getPasswordStrength();

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
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Choose your role and gain access to your workspace.
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

              {/* Password strength indicator (purely visual) */}
              {passwordVal.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-text-tertiary">
                    <span>Password Strength:</span>
                    <span className={cn(
                      strength.score === 1 && "text-accent-danger",
                      strength.score === 2 && "text-accent-warning",
                      strength.score === 3 && "text-accent-mentor"
                    )}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 h-1">
                    {[1, 2, 3].map((val) => (
                      <div
                        key={val}
                        className={cn(
                          "h-full rounded-full transition-colors duration-token-standard",
                          strength.score >= val ? strength.color : "bg-border-subtle"
                        )}
                      />
                    ))}
                  </div>
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

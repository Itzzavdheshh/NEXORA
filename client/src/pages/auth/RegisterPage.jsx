import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Sparkles } from "lucide-react";
import { PageTransition } from "../../components/ui/PageTransition";
import { Button } from "../../components/ui/Button";
import { FormField, PasswordToggle } from "../../components/ui/FormField";
import { ROLE_HOME, USER_ROLES } from "../../constants/app";
import { useRegister } from "../../hooks/useAuthActions";
import { createZodResolver } from "../../utils/zodForm";

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

  return (
    <PageTransition>
      <div className="glass-panel w-full max-w-lg rounded-3xl p-7 shadow-glow sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-200">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Guided onboarding
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-950 dark:text-white">
          Create your Nexora account
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-200">
          Pick the role your backend will authorize, then we will sign you in with the issued JWT.
        </p>

        {registerAccount.isError ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
            {registerAccount.error.message}
          </div>
        ) : null}

        <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <FormField
            id="role"
            label="Role"
            as="select"
            error={errors.role}
            helper="Your dashboard route is selected from this backend role."
            {...register("role")}
          >
            <option value={USER_ROLES.STUDENT}>Student</option>
            <option value={USER_ROLES.MENTOR}>Mentor</option>
            <option value={USER_ROLES.ADMIN}>Admin</option>
          </FormField>

          <FormField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
            error={errors.password}
            helper="Use at least 8 characters to match backend validation."
            rightSlot={
              <PasswordToggle
                visible={showPassword}
                onClick={() => setShowPassword((value) => !value)}
              />
            }
            {...register("password")}
          />

          <Button className="h-12 w-full rounded-2xl" loading={isLoading} type="submit">
            {isLoading ? "Creating account" : "Create account"}
          </Button>
        </form>

        <div className="mt-7 border-t border-ink-200/70 pt-5 text-center text-sm text-ink-600 dark:border-white/10 dark:text-ink-300">
          Already have an account?{" "}
          <Link
            className="font-bold text-ink-950 hover:text-brand-700 dark:text-white dark:hover:text-brand-200"
            to="/login"
          >
            Sign in
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, ShieldCheck } from "lucide-react";
import { PageTransition } from "../../components/ui/PageTransition";
import { Button } from "../../components/ui/Button";
import { FormField, PasswordToggle } from "../../components/ui/FormField";
import { ROLE_HOME } from "../../constants/app";
import { useLogin } from "../../hooks/useAuthActions";
import { createZodResolver } from "../../utils/zodForm";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

function getRedirectPath(data, fallback) {
  const role = data?.data?.user?.role || data?.user?.role;
  return fallback || ROLE_HOME[role] || "/student/dashboard";
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: createZodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const data = await login.mutateAsync(values);
    navigate(getRedirectPath(data, location.state?.from?.pathname), { replace: true });
  };

  const isLoading = login.isPending || isSubmitting;

  return (
    <PageTransition>
      <div className="glass-panel w-full max-w-md rounded-3xl p-7 shadow-glow sm:p-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-200">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Secure access
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-950 dark:text-white">
              Sign in to Nexora
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-200">
              Continue to your role-based workspace using your registered email and password.
            </p>
          </div>
        </div>

        {login.isError ? (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
            {login.error.message}
          </div>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormField
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@nexora.dev"
            error={errors.email}
            helper="Use the email connected to your Nexora account."
            rightSlot={
              <Mail
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                aria-hidden="true"
              />
            }
            {...register("email")}
          />

          <FormField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password}
            rightSlot={
              <PasswordToggle
                visible={showPassword}
                onClick={() => setShowPassword((value) => !value)}
              />
            }
            {...register("password")}
          />

          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-ink-600 dark:text-ink-300">JWT sessions are remembered securely.</span>
            <Link
              className="font-semibold text-brand-700 hover:text-brand-900 dark:text-brand-200 dark:hover:text-white"
              to="/forgot-password"
            >
              Forgot?
            </Link>
          </div>

          <Button className="h-12 w-full rounded-2xl" loading={isLoading} type="submit">
            {isLoading ? "Signing in" : "Sign in"}
          </Button>
        </form>

        <div className="mt-7 border-t border-ink-200/70 pt-5 text-center text-sm text-ink-500 dark:border-white/10 dark:text-ink-300">
          New to Nexora?{" "}
          <Link
            className="font-bold text-ink-950 hover:text-brand-700 dark:text-white dark:hover:text-brand-200"
            to="/register"
          >
            Create an account
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}

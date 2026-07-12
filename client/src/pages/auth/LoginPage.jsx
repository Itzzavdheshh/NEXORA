import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Lock } from "lucide-react";
import { motion } from "framer-motion";
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
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    const data = await login.mutateAsync(values);
    navigate(getRedirectPath(data, location.state?.from?.pathname), { replace: true });
  };

  const isLoading = login.isPending || isSubmitting;

  return (
    <PageTransition>
      <div className="w-full">
        {/* Card Panel */}
        <div 
          className="rounded-lg p-6 sm:p-8 border border-[var(--border-subtle)] shadow-md"
          style={{ backgroundColor: "var(--bg-elevated)", backdropFilter: "none" }}
        >
          {/* Header */}
          <div className="mb-6">
            <div className="badge badge-brand mb-4">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Secure sign-in
            </div>
            <h1 className="font-display text-section font-semibold text-text-primary tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              Sign in to your role-based workspace.
            </p>
          </div>

          {/* Error Banner */}
          {login.isError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mb-5 rounded-md border border-accent-danger/20 bg-accent-danger/10 px-4 py-3 text-xs font-semibold text-accent-danger"
              role="alert"
            >
              {login.error.message}
            </motion.div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
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

            <div className="flex items-center justify-end">
              <Link
                className="text-xs font-semibold text-accent-primary hover:text-accent-primary-hover transition duration-token-micro"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              className="w-full mt-2"
              size="lg"
              loading={isLoading}
              type="submit"
            >
              {isLoading ? "Signing in…" : "Sign in"}
              {!isLoading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 border-t border-border-subtle pt-5 text-center text-sm text-text-secondary">
            New to NEXORA?{" "}
            <Link
              className="font-semibold text-text-primary hover:text-accent-primary transition duration-token-micro"
              to="/register"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SlidersHorizontal, Lock, ShieldCheck, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { PageTransition } from "../../components/ui/PageTransition";
import { Button } from "../../components/ui/Button";
import { FormField, PasswordToggle } from "../../components/ui/FormField";
import { createZodResolver } from "../../utils/zodForm";
import { cn } from "../../utils/cn";
import { apiClient } from "../../services/apiClient";

const settingsPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required to verify identity."),
  newPassword: z
    .string()
    .min(10, "New password must be at least 10 characters long.")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Must contain at least one digit.")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character."),
  confirmPassword: z.string().min(1, "Confirm new password."),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});

export default function SettingsPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: createZodResolver(settingsPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordVal = watch("newPassword") || "";

  const rules = [
    { key: "length",  label: "At least 10 characters",           pass: newPasswordVal.length >= 10 },
    { key: "upper",   label: "One uppercase letter (A–Z)",       pass: /[A-Z]/.test(newPasswordVal) },
    { key: "lower",   label: "One lowercase letter (a–z)",       pass: /[a-z]/.test(newPasswordVal) },
    { key: "number",  label: "One number (0–9)",                 pass: /[0-9]/.test(newPasswordVal) },
    { key: "special", label: "One special character (!@#$…)",    pass: /[^A-Za-z0-9]/.test(newPasswordVal) },
  ];

  const metCount = rules.filter((r) => r.pass).length;

  const getPasswordStrength = () => {
    if (!newPasswordVal) return { score: 0, color: "", label: "" };
    if (metCount <= 1) return { score: 1, color: "bg-accent-danger",  label: "Weak" };
    if (metCount === 2) return { score: 2, color: "bg-accent-danger",  label: "Weak" };
    if (metCount === 3) return { score: 3, color: "bg-accent-warning", label: "Fair" };
    if (metCount === 4) return { score: 4, color: "bg-amber-400",      label: "Good" };
    return                     { score: 5, color: "bg-accent-mentor",  label: "Strong" };
  };

  const strength = getPasswordStrength();

  const onSubmit = async (values) => {
    setIsSaving(true);
    try {
      await apiClient.post("/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Security password changed successfully!");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Block */}
        <div className="border border-border-subtle bg-bg-surface shadow-token-md rounded-3xl p-6">
          <div className="flex flex-col gap-4">
            <div>
              <p className="badge badge-primary">
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                Settings & Safety
              </p>
              <h1 className="font-display text-display font-semibold text-text-primary mt-4 leading-tight">
                Account Security Settings
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Configure your authentication credentials, update security keys, and manage password policies.
              </p>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
          {/* Password update form */}
          <div className="border border-border-subtle bg-bg-surface shadow-token-md rounded-3xl p-6">
            <h2 className="text-base font-bold text-text-primary mb-5 flex items-center gap-2">
              <Lock className="h-4 w-4 text-accent-primary" />
              Update Password
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                id="currentPassword"
                label="Current Password"
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                error={errors.currentPassword}
                rightSlot={
                  <PasswordToggle
                    visible={showCurrent}
                    onClick={() => setShowCurrent((v) => !v)}
                  />
                }
                {...register("currentPassword")}
              />

              <div className="space-y-2">
                <FormField
                  id="newPassword"
                  label="New Password"
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  error={errors.newPassword}
                  rightSlot={
                    <PasswordToggle
                      visible={showNew}
                      onClick={() => setShowNew((v) => !v)}
                    />
                  }
                  {...register("newPassword")}
                />

                {/* Password strength + live requirements */}
                {newPasswordVal.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {/* Strength bar */}
                    <div className="flex items-center justify-between text-[11px] font-semibold text-text-tertiary">
                      <span>Password Strength:</span>
                      <span className={cn(
                        strength.score <= 2 && "text-accent-danger",
                        strength.score === 3 && "text-accent-warning",
                        strength.score === 4 && "text-amber-400",
                        strength.score === 5 && "text-accent-mentor",
                      )}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 h-1">
                      {[1, 2, 3, 4, 5].map((val) => (
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
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <FormField
                id="confirmPassword"
                label="Confirm New Password"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                error={errors.confirmPassword}
                rightSlot={
                  <PasswordToggle
                    visible={showConfirm}
                    onClick={() => setShowConfirm((v) => !v)}
                  />
                }
                {...register("confirmPassword")}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  loading={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="border border-border-subtle bg-bg-surface shadow-token-md rounded-3xl p-6 h-fit space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-accent-mentor" />
              Password Policy Rules
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
                Minimum length of 10 characters
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
                At least one uppercase letter (A–Z)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
                At least one lowercase letter (a–z)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
                At least one numeric digit (0–9)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
                At least one special character (e.g. !@#$)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

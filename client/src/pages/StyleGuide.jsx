import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { fadeUp, staggerContainer } from "../styles/motion";

const colors = [
  ["bg-base", "#0B0D12", "App background"],
  ["bg-surface", "#12141B", "Page sections, panels"],
  ["bg-elevated", "#1A1D26", "Cards"],
  ["bg-floating", "#20232E", "Modals, dropdowns, popovers"],
  ["border-subtle", "#262A35", "Default borders"],
  ["border-strong", "#363B49", "Hover/focus borders"],
  ["text-primary", "#F2F3F5", "Headings, primary text"],
  ["text-secondary", "#9CA0AD", "Body/supporting text"],
  ["text-tertiary", "#6B7080", "Captions, placeholders"],
  ["accent-primary", "#F5A623", "Student role, CTAs, focus rings"],
  ["accent-primary-hover", "#FFB84D", "Primary hover"],
  ["accent-mentor", "#10B981", "Mentor role accent"],
  ["accent-admin", "#38BDF8", "Admin role accent"],
  ["accent-danger", "#F43F5E", "Errors, destructive actions"],
  ["accent-warning", "#FB923C", "Warnings"],
];

const typeScale = [
  ["Display", "font-display text-display font-semibold", "Fraunces 44px"],
  ["Section heading", "text-section font-semibold", "Inter 30px"],
  ["Card heading", "text-card font-semibold", "Inter 20px"],
  ["Body", "text-body font-normal", "Inter 15px"],
  ["Caption / label", "text-caption font-medium uppercase tracking-token-caption", "Inter 13px"],
];

const buttonVariants = {
  primary: "border-accent-primary bg-accent-primary text-bg-base hover:bg-accent-primary-hover hover:shadow-accent",
  secondary: "border-border-strong bg-bg-elevated text-text-primary hover:border-text-tertiary hover:bg-bg-floating",
  ghost: "border-transparent bg-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
  danger: "border-accent-danger/40 bg-accent-danger/10 text-accent-danger hover:bg-accent-danger/15",
};

const badgeVariants = [
  ["Student", "border-accent-primary/40 bg-accent-primary/10 text-accent-primary"],
  ["Mentor", "border-accent-mentor/40 bg-accent-mentor/10 text-accent-mentor"],
  ["Admin", "border-accent-admin/40 bg-accent-admin/10 text-accent-admin"],
  ["Warning", "border-accent-warning/40 bg-accent-warning/10 text-accent-warning"],
  ["Danger", "border-accent-danger/40 bg-accent-danger/10 text-accent-danger"],
];

function Section({ title, children }) {
  return (
    <motion.section variants={fadeUp} className="rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-token-md">
      <h2 className="font-sans text-card font-semibold text-text-primary">{title}</h2>
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

function ButtonSample({ variant, state }) {
  const isDisabled = state === "disabled";
  const isLoading = state === "loading";
  const hoverClass = state === "hover" ? "translate-y-[-1px] shadow-accent" : "";

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`inline-flex h-11 min-w-32 items-center justify-center gap-2 rounded-md border px-4 font-sans text-body font-semibold transition-token-micro ${buttonVariants[variant]} ${hoverClass} disabled:cursor-not-allowed disabled:opacity-45`}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {state}
    </button>
  );
}

function InputSample({ state }) {
  const classes = {
    default: "border-border-subtle",
    focus: "border-accent-primary ring-2 ring-accent-primary/20",
    error: "border-accent-danger ring-2 ring-accent-danger/15",
    success: "border-accent-mentor ring-2 ring-accent-mentor/15",
  };

  return (
    <label className="block">
      <span className="font-sans text-caption font-medium uppercase tracking-token-caption text-text-tertiary">
        {state}
      </span>
      <input
        className={`mt-2 h-11 w-full rounded-md bg-bg-elevated px-3 font-sans text-body text-text-primary placeholder:text-text-tertiary outline-none transition-token-micro ${classes[state]}`}
        value={state === "error" ? "Invalid value" : state === "success" ? "Ready to save" : ""}
        placeholder="Type something thoughtful"
        readOnly
      />
    </label>
  );
}

export default function StyleGuide() {
  return (
    <main className="min-h-screen bg-bg-base px-6 py-10 text-text-primary">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl space-y-8"
      >
        <motion.header variants={fadeUp} className="max-w-3xl">
          <p className="font-sans text-caption font-medium uppercase tracking-token-caption text-accent-primary">
            Nexora design system
          </p>
          <h1 className="mt-3 font-display text-display font-semibold text-text-primary">
            Foundation Style Guide
          </h1>
          <p className="mt-4 font-sans text-body text-text-secondary">
            Dev-only route for reviewing tokens, typography, controls, badges, and elevation before screen redesign begins.
          </p>
        </motion.header>

        <Section title="Color Tokens">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colors.map(([name, hex, usage]) => (
              <div key={name} className="overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated">
                <div className="h-24" style={{ backgroundColor: hex }} />
                <div className="space-y-1 p-4">
                  <p className="font-sans text-body font-semibold text-text-primary">--{name}</p>
                  <p className="font-mono text-sm text-text-secondary">{hex}</p>
                  <p className="font-sans text-caption text-text-tertiary">{usage}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typography">
          <div className="space-y-6">
            {typeScale.map(([label, className, meta]) => (
              <div key={label} className="rounded-lg border border-border-subtle bg-bg-elevated p-4">
                <p className="mb-3 font-sans text-caption uppercase tracking-token-caption text-text-tertiary">
                  {label} · {meta}
                </p>
                <p className={`${className} text-text-primary`}>
                  Mentorship that feels deliberate, focused, and trustworthy.
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons">
          <div className="space-y-5">
            {Object.keys(buttonVariants).map((variant) => (
              <div key={variant}>
                <p className="mb-3 font-sans text-caption uppercase tracking-token-caption text-text-tertiary">
                  {variant}
                </p>
                <div className="flex flex-wrap gap-3">
                  {["default", "hover", "loading", "disabled"].map((state) => (
                    <ButtonSample key={state} variant={variant} state={state} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {["default", "focus", "error", "success"].map((state) => (
              <InputSample key={state} state={state} />
            ))}
          </div>
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap gap-3">
            {badgeVariants.map(([label, className]) => (
              <span
                key={label}
                className={`inline-flex rounded-full border px-3 py-1 font-sans text-caption font-medium uppercase tracking-token-caption ${className}`}
              >
                {label}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Elevation">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["sm", "shadow-token-sm", "Subtle lift"],
              ["md", "shadow-token-md", "Cards"],
              ["lg", "shadow-token-lg", "Modals and drawers"],
              ["accent glow", "shadow-accent", "Primary hover only"],
            ].map(([label, shadow, usage]) => (
              <div key={label} className={`rounded-xl border border-border-subtle bg-bg-elevated p-5 ${shadow}`}>
                <p className="font-sans text-card font-semibold text-text-primary">{label}</p>
                <p className="mt-2 font-sans text-body text-text-secondary">{usage}</p>
              </div>
            ))}
          </div>
        </Section>
      </motion.div>
    </main>
  );
}

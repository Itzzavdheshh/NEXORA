import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { APP_NAME } from "../constants/app";
import { Shield, Users, Calendar, Sparkles } from "lucide-react";

// ── Typewriter component ───────────────────────────────────────────────────
const PHRASES = [
  "for ambitious students.",
  "for future engineers.",
  "for curious minds.",
  "for career builders.",
  "for dream chasers.",
];

const TYPING_SPEED   = 60;   // ms per character while typing
const ERASING_SPEED  = 35;   // ms per character while erasing
const PAUSE_AFTER    = 1800; // ms pause after fully typed
const PAUSE_BEFORE   = 300;  // ms pause before starting to type next phrase

function TypewriterText() {
  const [phraseIndex, setPhraseIndex]   = useState(0);
  const [displayed,   setDisplayed]     = useState("");
  const [phase,       setPhase]         = useState("typing"); // typing | pausing | erasing | waiting

  useEffect(() => {
    const target = PHRASES[phraseIndex];

    if (phase === "typing") {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), TYPING_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("erasing"), PAUSE_AFTER);
        return () => clearTimeout(t);
      }
    }

    if (phase === "erasing") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), ERASING_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setPhraseIndex((i) => (i + 1) % PHRASES.length);
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
        className="inline-block w-[2px] h-[1em] bg-accent-primary align-middle ml-[2px] animate-blink"
        aria-hidden="true"
      />
    </span>
  );
}

export function AuthLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-base text-text-primary">
      <div className="relative z-10 mx-auto grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        {/* Left panel — Value Proposition (Desktop only) */}
        <section
          className="relative hidden flex-col justify-between p-12 lg:flex bg-bg-surface border-r border-border-subtle overflow-hidden"
          aria-label="Platform overview"
        >
          {/* Exactly one background atmosphere element: 600px radial gradient (accent-primary at ~8% opacity) */}
          <div
            className="pointer-events-none absolute rounded-full bg-accent-primary/10 blur-[100px]"
            style={{
              width: "600px",
              height: "600px",
              top: "25%",
              left: "40%",
              transform: "translate(-50%, -50%)",
            }}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full"
          >
            {/* Logo */}
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-primary shadow-token-md">
                <Sparkles className="h-5 w-5 text-bg-base" aria-hidden="true" />
              </div>
              <span className="font-display text-3xl font-semibold tracking-tight text-text-primary">
                {APP_NAME}
              </span>
            </div>

            {/* Headline with typewriter */}
            <h1 className="font-display text-display font-semibold text-text-primary leading-tight min-h-[4rem]">
              Structured mentorship
              <br />
              <TypewriterText />
            </h1>
            <p className="mt-6 text-body font-normal text-text-secondary">
              Connect with verified mentors, book focused sessions, and track your progress through a purposeful academic workspace.
            </p>

            {/* Feature Highlights */}
            <div className="mt-12 space-y-4">
              {[
                { label: "Verified Mentors", desc: "Every profile manually reviewed by administrators", icon: Shield },
                { label: "Role-Based Access", desc: "Dedicated student, mentor, and admin spaces", icon: Users },
                { label: "Smart Bookings", desc: "Frictionless scheduling with real availability", icon: Calendar },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex gap-4 rounded-[var(--radius-lg)] border border-border-subtle bg-bg-surface p-4 shadow-token-sm transition duration-token-standard hover:border-border-strong"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-bg-elevated border border-border-subtle text-accent-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-caption font-semibold uppercase tracking-token-caption text-text-primary">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Right panel — auth form */}
        <section className="flex flex-col items-center justify-center px-6 py-12 sm:px-12 bg-bg-base overflow-y-auto">
          {/* Logo only on mobile */}
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-primary shadow-token-md">
              <Sparkles className="h-5 w-5 text-bg-base" aria-hidden="true" />
            </div>
            <span className="font-display text-3xl font-semibold tracking-tight text-text-primary">
              {APP_NAME}
            </span>
          </div>

          {/* Render form directly to prevent browser 3D rasterization blur issues */}
          <div className="w-full max-w-[480px] mx-auto py-4">
            <Outlet />
          </div>

          {/* Footer links */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-tertiary">
            <Link to="/privacy" className="hover:text-text-secondary transition-colors">Privacy Policy</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-text-secondary transition-colors">Terms of Service</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

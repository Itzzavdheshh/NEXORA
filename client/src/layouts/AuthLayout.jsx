import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { APP_NAME } from "../constants/app";

export function AuthLayout() {
  return (
    <main className="min-h-screen overflow-hidden bg-premium-radial dark:bg-[#050812]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-[1fr_0.86fr]">
        <section className="hidden flex-col justify-between p-10 lg:flex">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <div className="mb-12 inline-flex rounded-full border border-ink-200 bg-white/75 px-4 py-2 text-sm font-semibold text-ink-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-ink-100">
              AI mentorship for ambitious students
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-ink-950 dark:text-white">
              {APP_NAME} turns career uncertainty into guided momentum.
            </h1>
            <p className="mt-6 text-lg leading-8 text-ink-600 dark:text-ink-200">
              Students find verified mentors, book sessions, and stay on track
              through one focused product experience.
            </p>
          </motion.div>
          <div className="glass-panel grid grid-cols-3 gap-4 rounded-3xl p-5">
            {["Verified mentors", "Smart bookings", "Progress clarity"].map((label) => (
              <div key={label} className="rounded-2xl border border-ink-200/70 bg-white/65 p-4 dark:border-white/10 dark:bg-white/8">
                <p className="text-sm font-bold text-ink-950 dark:text-white">{label}</p>
                <p className="mt-2 text-xs leading-5 text-ink-600 dark:text-ink-200">
                  Designed for trust, speed, and thoughtful guidance.
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="flex items-center justify-center px-4 py-8">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

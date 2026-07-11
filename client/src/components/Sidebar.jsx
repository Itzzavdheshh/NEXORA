import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { APP_NAME } from "../constants/app";
import { mainNavigation, sharedNavigation } from "../constants/navigation";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "../hooks/useAuthActions";
import { cn } from "../utils/cn";

export function Sidebar({ open, onClose }) {
  const { role = "student", user } = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const items = [...(mainNavigation[role] || mainNavigation.student), ...sharedNavigation];

  const handleLogout = async () => {
    await logoutMutation.mutateAsync().catch(() => null);
    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-ink-200 bg-white/90 p-4 shadow-panel backdrop-blur-2xl lg:static lg:z-auto lg:translate-x-0 dark:border-white/10 dark:bg-ink-950/90"
      >
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-950 text-white shadow-glow dark:bg-white dark:text-ink-950">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-extrabold tracking-tight">{APP_NAME}</p>
            <p className="text-xs font-medium text-ink-500 dark:text-ink-300">
              AI mentorship workspace
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-xl p-2 text-ink-500 hover:bg-ink-100 lg:hidden dark:hover:bg-white/10"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 space-y-1" aria-label="Primary navigation">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-ink-600 transition hover:bg-ink-100 hover:text-ink-950 dark:text-ink-200 dark:hover:bg-white/10 dark:hover:text-white",
                  isActive &&
                    "bg-ink-950 text-white shadow-glow hover:bg-ink-950 hover:text-white dark:bg-white dark:text-ink-950 dark:hover:bg-white dark:hover:text-ink-950",
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl border border-ink-200 bg-ink-50 p-4 dark:border-white/10 dark:bg-white/10">
          <p className="text-sm font-bold">{user?.full_name || user?.name || "Your workspace"}</p>
          <p className="mt-1 text-xs capitalize text-ink-500 dark:text-ink-300">
            {role} account
          </p>
          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            aria-label="Logout from Nexora"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-100 dark:hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

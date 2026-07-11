import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Sun, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "../hooks/useAuthActions";
import { notificationService } from "../services/notificationService";
import { cn } from "../utils/cn";

function NotificationBell({ role }) {
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.list,
    select: (res) => (res?.data ?? []).filter((n) => !n.is_read).length,
    enabled: role === "student",
  });

  const unreadCount = notificationsQuery.data ?? 0;

  if (role !== "student") return null;

  return (
    <Link
      to="/student/notifications"
      aria-label={
        unreadCount > 0
          ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
          : "Notifications"
      }
      className="relative rounded-xl border border-ink-200 bg-white/80 p-2 text-ink-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-ink-100 dark:hover:bg-white/20"
    >
      <Bell className="h-5 w-5" aria-hidden="true" />

      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={cn(
              "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-extrabold text-white shadow",
              unreadCount > 9 ? "w-6 px-1" : "",
            )}
            aria-hidden="true"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export function Navbar({ onMenuClick }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const displayName = user?.full_name || user?.name || "Nexora User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync().catch(() => null);
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/82 backdrop-blur-2xl dark:border-white/10 dark:bg-[#07101d]/86">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-ink-600 hover:bg-ink-100 lg:hidden dark:text-ink-200 dark:hover:bg-white/10"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-ink-200 bg-white/75 px-4 py-2 text-sm text-ink-500 shadow-sm md:flex dark:border-white/10 dark:bg-white/10 dark:text-ink-200">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="truncate">Search mentors, bookings, notifications...</span>
        </div>

        {/* Notification bell — students only */}
        <NotificationBell role={role} />

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={toggleTheme}
          className="rounded-xl border border-ink-200 bg-white/80 p-2 text-ink-700 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-ink-100 dark:hover:bg-white/20"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 items-center gap-2 rounded-2xl border border-ink-200 bg-white/80 px-2.5 text-sm font-bold text-ink-800 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open user menu"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-ink-950 text-xs text-white dark:bg-brand-300 dark:text-ink-950">
              {initials || <UserRound className="h-4 w-4" aria-hidden="true" />}
            </span>
            <span className="hidden max-w-32 truncate sm:inline">{displayName}</span>
            <ChevronDown className="h-4 w-4 text-ink-500 dark:text-ink-300" aria-hidden="true" />
          </button>

          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 mt-3 w-64 rounded-3xl border border-ink-200 bg-white/95 p-2 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-[#101827]/95"
              role="menu"
            >
              <div className="px-3 py-3">
                <p className="truncate text-sm font-extrabold text-ink-950 dark:text-white">
                  {displayName}
                </p>
                <p className="mt-1 truncate text-xs font-medium capitalize text-ink-500 dark:text-ink-300">
                  {user?.role || "workspace"} account
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-50 dark:text-red-100 dark:hover:bg-red-500/10"
                role="menuitem"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {logoutMutation.isPending ? "Signing out..." : "Logout"}
              </button>
            </motion.div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { APP_NAME } from "../constants/app";
import { mainNavigation, sharedNavigation } from "../constants/navigation";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "../hooks/useAuthActions";
import { cn } from "../utils/cn";

function NavItem({ item, onClick, role }) {
  const roleAccent = {
    student: "bg-[var(--accent-primary)]",
    mentor: "bg-[var(--accent-mentor)]",
    admin: "bg-[var(--accent-admin)]",
  };

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150",
          isActive
            ? "text-[var(--bg-base)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Animated active background */}
          {isActive && (
            <motion.span
              layoutId="sidebar-active-pill"
              className={cn("absolute inset-0 rounded-md", roleAccent[role] ?? "bg-[var(--accent-primary)]")}
              style={{ zIndex: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
            />
          )}

          <span className="relative z-10 flex items-center gap-3">
            <item.icon
              className={cn(
                "h-4.5 w-4.5 shrink-0 transition-transform duration-150",
                isActive
                  ? "text-[var(--bg-base)]"
                  : "text-[var(--text-tertiary)]",
              )}
              aria-hidden="true"
            />
            <span className="font-semibold">{item.label}</span>
          </span>
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ open, onClose }) {
  const { role = "student", user } = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const items = [...(mainNavigation[role] || mainNavigation.student), ...sharedNavigation];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initials = (user?.full_name || user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync().catch(() => null);
    onClose();
    navigate("/login", { replace: true });
  };

  const roleLabels = {
    student: "Student Workspace",
    mentor: "Mentor Workspace",
    admin: "Admin Console",
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[var(--bg-base)]/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        animate={{ x: isMobile ? (open ? 0 : "-100%") : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col",
          "border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]",
          "lg:static lg:z-auto lg:translate-x-0 lg:w-64",
          "px-4 py-6",
        )}
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 pb-5 pt-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[var(--accent-primary)] shadow-token-md">
            <Sparkles className="h-4.5 w-4.5 text-[var(--bg-base)]" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
              {APP_NAME}
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              {roleLabels[role] ?? "Workspace"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-sm p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 space-y-1 mt-6">
          {items.map((item) => (
            <NavItem key={item.path} item={item} onClick={onClose} role={role} />
          ))}
        </nav>

        {/* User footer */}
        <div className="mt-auto border-t border-[var(--border-subtle)] pt-4">
          <div className="flex items-center gap-3 rounded-md px-2 py-2 bg-[var(--bg-surface)]">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)]"
              aria-hidden="true"
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                {user?.full_name || user?.name || "Workspace"}
              </p>
              <p className="truncate text-[10px] uppercase font-semibold tracking-wider text-[var(--text-tertiary)]">
                {role}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              aria-label="Sign out"
              className="rounded-sm p-1.5 text-[var(--text-tertiary)] hover:bg-[var(--accent-danger)]/10 hover:text-[var(--accent-danger)] transition disabled:cursor-not-allowed disabled:opacity-50"
              title={logoutMutation.isPending ? "Signing out…" : "Sign out"}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

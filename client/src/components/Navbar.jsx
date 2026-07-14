import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, UserRound, Search, Check, Command, Sparkles, X, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useLogout } from "../hooks/useAuthActions";
import { useNotifications } from "../hooks/useNotifications";
import { cn } from "../utils/cn";
import { formatDistanceToNow } from "date-fns";

// Relative time formatting helper
function TimeAgo({ dateStr }) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    const dist = formatDistanceToNow(date, { addSuffix: true });
    return <span className="text-[10px] font-semibold text-text-tertiary">{dist}</span>;
  } catch {
    return null;
  }
}

// Group notifications helper
function groupNotifications(notifications) {
  const groups = { Today: [], Yesterday: [], Earlier: [] };
  const todayStr = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  notifications.forEach((n) => {
    const d = new Date(n.created_at);
    const dStr = d.toDateString();
    if (dStr === todayStr) {
      groups.Today.push(n);
    } else if (dStr === yesterdayStr) {
      groups.Yesterday.push(n);
    } else {
      groups.Earlier.push(n);
    }
  });
  return groups;
}

export function Navbar({ onMenuClick }) {
  const { user, role = "student" } = useAuth();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const roleTextColors = {
    student: "text-accent-primary hover:text-accent-primary-hover",
    mentor: "text-accent-mentor hover:text-accent-mentor-hover",
    admin: "text-accent-admin hover:text-accent-admin-hover",
  };

  const roleBgColors = {
    student: "bg-accent-primary",
    mentor: "bg-accent-mentor",
    admin: "bg-accent-admin",
  };

  const roleHoverStyles = {
    student: "hover:border-accent-primary hover:text-accent-primary",
    mentor: "hover:border-accent-mentor hover:text-accent-mentor",
    admin: "hover:border-accent-admin hover:text-accent-admin",
  };
  
  // Custom hooks
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    isLoading
  } = useNotifications();

  // Component state
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const displayName = user?.full_name || user?.name || "Nexora User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Search items list
  const searchOptions = useMemo(() => {
    const options = [
      { name: "Dashboard", path: `/${role}/dashboard`, category: "Navigation" },
      { name: "Profile", path: `/${role}/profile`, category: "Navigation" },
      { name: "Notifications", path: `/${role}/notifications`, category: "Navigation" },
    ];

    if (role === "student") {
      options.push({ name: "Explore Mentors", path: "/student/explore", category: "Navigation" });
      options.push({ name: "Bookings & Sessions", path: "/student/bookings", category: "Navigation" });
    } else if (role === "mentor") {
      options.push({ name: "Availability Calendar", path: "/mentor/availability", category: "Navigation" });
      options.push({ name: "Manage Bookings", path: "/mentor/bookings", category: "Navigation" });
    } else if (role === "admin") {
      options.push({ name: "Verify Mentors", path: "/admin/verify-mentors", category: "Navigation" });
      options.push({ name: "User Directory Management", path: "/admin/users", category: "Navigation" });
    }

    options.push({ name: "Sign Out", action: "logout", category: "System Actions" });
    return options;
  }, [role]);

  // Filter search matches
  const filteredSearch = useMemo(() => {
    if (!searchQuery.trim()) return searchOptions;
    return searchOptions.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [searchQuery, searchOptions]);

  // Close drop-downs on click outside
  useEffect(() => {
    const handler = (e) => {
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen, notifOpen]);

  // Keyboard shortcut listener for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
        setSearchQuery("");
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync().catch(() => null);
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  const handleSearchAction = (item) => {
    setSearchOpen(false);
    if (item.action === "logout") {
      handleLogout();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const grouped = groupNotifications(notifications);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border-subtle bg-bg-base text-text-primary">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          
          {/* Left panel triggers */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="rounded-sm p-1.5 text-text-secondary hover:bg-bg-elevated hover:text-text-primary lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global search trigger */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setSearchQuery("");
              }}
              className="flex h-9 w-44 sm:w-56 items-center gap-2 rounded-md border border-border-subtle bg-bg-surface px-3 text-left text-xs text-text-tertiary hover:border-border-strong hover:text-text-secondary transition duration-token-micro"
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 truncate">Search pages...</span>
              <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border-subtle bg-bg-elevated px-1.5 font-mono text-[9px] font-semibold text-text-tertiary">
                <span>⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Right panel triggers */}
          <div className="flex items-center gap-3">
            
            {/* Notification trigger dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                className={cn(
                  "relative rounded-sm border p-2 text-text-secondary bg-bg-surface border-border-subtle hover:border-border-strong hover:text-text-primary transition",
                  notifOpen && "border-border-strong text-text-primary"
                )}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={cn("absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full", roleBgColors[role] || "bg-accent-primary")}
                    />
                  )}
                </AnimatePresence>
              </button>

              {/* Notification dropdown details */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-md border border-border-subtle bg-bg-surface shadow-token-lg z-40"
                  >
                    <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
                      <span className="text-xs font-bold text-text-primary">Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => markAllRead()}
                          className={cn("text-[11px] font-semibold transition", roleTextColors[role] || "text-accent-primary hover:text-accent-primary-hover")}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                      {isLoading ? (
                        <div className="px-4 py-6 text-center text-xs text-text-tertiary">Loading updates...</div>
                      ) : notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-text-tertiary">No notifications yet.</div>
                      ) : (
                        ["Today", "Yesterday", "Earlier"].map((groupName) => {
                          const items = grouped[groupName] || [];
                          if (items.length === 0) return null;
                          return (
                            <div key={groupName} className="p-2">
                              <span className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">{groupName}</span>
                              <div className="space-y-1 mt-1">
                                {items.map((n) => (
                                  <div
                                    key={n.id}
                                    className={cn(
                                      "group flex gap-3 rounded px-2 py-2 transition",
                                      !n.is_read ? "bg-bg-elevated/40" : "hover:bg-bg-elevated/25"
                                    )}
                                  >
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-bg-elevated border border-border-subtle text-text-secondary">
                                      <Info className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-1">
                                        <p className={cn("text-xs font-semibold truncate", !n.is_read ? "text-text-primary" : "text-text-secondary")}>
                                          {n.title}
                                        </p>
                                        <TimeAgo dateStr={n.created_at} />
                                      </div>
                                      <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                                    </div>
                                    {!n.is_read && (
                                      <button
                                        type="button"
                                        onClick={() => markRead(n.id)}
                                        className={cn("h-5 w-5 shrink-0 flex items-center justify-center rounded border border-border-subtle text-text-tertiary transition", roleHoverStyles[role] || "hover:border-accent-primary hover:text-accent-primary")}
                                        title="Mark as read"
                                      >
                                        <Check className="h-3 w-3" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile menu dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-sm border px-2.5 text-xs font-medium bg-bg-surface border-border-subtle hover:border-border-strong hover:text-text-primary transition duration-token-micro",
                  profileOpen && "border-border-strong text-text-primary"
                )}
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-bg-elevated text-[10px] font-bold border border-border-subtle"
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <span className="hidden max-w-24 truncate sm:inline">{displayName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border border-border-subtle bg-bg-surface shadow-token-lg z-40"
                  >
                    <div className="border-b border-border-subtle px-4 py-3">
                      <p className="truncate text-xs font-bold text-text-primary">
                        {displayName}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">
                        {role} account
                      </p>
                    </div>

                    <div className="p-1 border-b border-border-subtle/50">
                      {user?.role !== "admin" ? (
                        <Link
                          to={`/${user?.role}/profile`}
                          onClick={() => setProfileOpen(false)}
                          className="flex w-full items-center gap-2 rounded px-3 py-2 text-xs font-medium text-text-secondary hover:bg-bg-elevated hover:text-text-primary transition"
                        >
                          <UserRound className="h-3.5 w-3.5 text-text-tertiary" />
                          <span>My Profile</span>
                        </Link>
                      ) : (
                        <div className="px-3 py-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                          Admin Management
                        </div>
                      )}
                    </div>

                    <div className="p-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="flex w-full items-center gap-2 rounded px-3 py-2 text-xs font-medium text-accent-danger hover:bg-accent-danger/10 transition"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </header>

      {/* Global Command Palette Overlay (Cmd+K) */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-bg-base/75 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />

            {/* Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border-subtle bg-bg-surface shadow-token-lg z-10 flex flex-col"
            >
              {/* Input header */}
              <div className="flex h-12 items-center gap-3 border-b border-border-subtle px-4 bg-bg-surface">
                <Search className="h-4.5 w-4.5 text-text-tertiary shrink-0" />
                <input
                  type="text"
                  placeholder="Type a command or page search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-tertiary border-0 focus:ring-0 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="rounded-sm p-1 text-text-tertiary hover:bg-bg-elevated hover:text-text-primary transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Options list */}
              <div className="max-h-72 overflow-y-auto p-2 divide-y divide-[var(--border-subtle)]/40">
                {filteredSearch.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-text-tertiary">No matching results found.</div>
                ) : (
                  // Group results by category
                  ["Navigation", "System Actions"].map((category) => {
                    const categoryItems = filteredSearch.filter((item) => item.category === category);
                    if (categoryItems.length === 0) return null;
                    return (
                      <div key={category} className="py-1">
                        <span className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-text-tertiary block">
                          {category}
                        </span>
                        <div className="space-y-0.5 mt-1">
                          {categoryItems.map((item) => (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => handleSearchAction(item)}
                              className="w-full flex items-center justify-between rounded px-3 py-2 text-left text-xs font-semibold text-text-primary hover:bg-bg-elevated transition"
                            >
                              <div className="flex items-center gap-2">
                                <Command className="h-3.5 w-3.5 text-text-tertiary" />
                                <span>{item.name}</span>
                              </div>
                              {item.path && (
                                <span className="text-[10px] font-semibold text-text-tertiary tracking-tight">
                                  {item.path}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Palette footer info */}
              <div className="border-t border-border-subtle px-4 py-2 text-center text-[10px] font-medium text-text-tertiary bg-bg-elevated/30">
                Use <kbd className="font-semibold px-1 py-0.5 rounded border border-border-subtle bg-bg-surface">Esc</kbd> to exit · Select command with mouse or click
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

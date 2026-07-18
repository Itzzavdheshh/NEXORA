import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Eye, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserManagement } from "../../hooks/useUserManagement";
import { UserFilters } from "./users/UserFilters";
import { UserSkeleton } from "./users/UserSkeleton";
import { UserDrawer } from "./users/UserDrawer";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageTransition } from "../../components/ui/PageTransition";
import { cn } from "../../utils/cn";

const statusStyles = {
  active: "badge-success",
  inactive: "badge-muted",
  suspended: "badge-warning",
  rejected: "badge-danger",
};

const roleStyles = {
  student: "badge-primary",
  mentor: "badge-mentor",
  admin: "badge-admin",
};

export default function UserManagementPage() {
  const um = useUserManagement();
  const [selectedUser, setSelectedUser] = useState(null);

  if (um.isLoading) {
    return <UserSkeleton />;
  }

  if (um.isError) {
    return (
      <div className="mx-auto max-w-2xl pt-8">
        <EmptyState
          icon={Users}
          title="Failed to load users list"
          description={um.error?.message || "Could not retrieve platform user list."}
          actionLabel="Retry"
          onAction={um.refetch}
          size="lg"
        />
      </div>
    );
  }

  const totalPages = Math.ceil(um.pagination.total / um.pagination.limit) || 1;

  // Reactively track status changes for the active user in the drawer
  const activeUser = selectedUser
    ? um.users.find((u) => u.id === selectedUser.id) || selectedUser
    : null;

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="border border-border-subtle bg-bg-surface shadow-token-md flex flex-col gap-4 rounded-3xl p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="badge badge-primary">
              <Users className="h-3.5 w-3.5" />
              Identity Management
            </p>
            <h1 className="font-display text-display font-semibold text-ink-950 dark:text-white mt-4 leading-tight">
              User profiles
            </h1>
            <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
              Manage accounts list, review verification state, and activate or deactivate memberships.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={um.refetch}
              loading={um.isFetching}
              disabled={um.isFetching}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <UserFilters
          search={um.search}
          onSearchChange={um.setSearch}
          role={um.role}
          onRoleChange={um.setRole}
          status={um.status}
          onStatusChange={um.setStatus}
          verified={um.verified}
          onVerifiedChange={um.setVerified}
          sort={um.sort}
          onSortChange={um.setSort}
          totalCount={um.pagination.total}
        />

        {/* User Card List */}
        {um.users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No matching users"
            description="Adjust search tags or filter choices to find matching accounts."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {um.users.map((user, idx) => {
              const { id, full_name, email, avatar_url, role, status, is_verified } = user;
              const initials = (full_name || "U")
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              // Role-based custom card borders and interactive glow tokens
              const roleThemes = {
                student: {
                  borderHover: "hover:border-accent-primary/40",
                  shadowHover: "hover:shadow-[0_0_24px_rgba(245,166,35,0.08)]",
                  avatarRing: "group-hover:ring-accent-primary/30",
                  textHover: "group-hover:text-accent-primary",
                  glowColor: "from-accent-primary/4 to-transparent",
                },
                mentor: {
                  borderHover: "hover:border-accent-mentor/40",
                  shadowHover: "hover:shadow-[0_0_24px_rgba(16,185,129,0.08)]",
                  avatarRing: "group-hover:ring-accent-mentor/30",
                  textHover: "group-hover:text-accent-mentor",
                  glowColor: "from-accent-mentor/4 to-transparent",
                },
                admin: {
                  borderHover: "hover:border-accent-admin/40",
                  shadowHover: "hover:shadow-[0_0_24px_rgba(14,165,233,0.08)]",
                  avatarRing: "group-hover:ring-accent-admin/30",
                  textHover: "group-hover:text-accent-admin",
                  glowColor: "from-accent-admin/4 to-transparent",
                },
              };

              const theme = roleThemes[role] || roleThemes.student;

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: idx * 0.03 }}
                  whileHover={{ y: -5, scale: 1.015 }}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    "relative overflow-hidden border border-border-subtle bg-bg-surface shadow-token-md group flex flex-col justify-between rounded-2xl p-5",
                    "transition-all duration-300 cursor-pointer",
                    theme.borderHover,
                    theme.shadowHover
                  )}
                >
                  {/* Subtle top corner gradient glow on card hover */}
                  <div className={cn("absolute right-0 top-0 h-28 w-28 bg-gradient-to-bl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-tr-2xl", theme.glowColor)} aria-hidden="true" />

                  <div className="relative">
                    {/* Top profile row */}
                    <div className="flex items-center gap-3.5">
                      {avatar_url ? (
                        <img
                          src={avatar_url}
                          alt=""
                          className={cn(
                            "h-11 w-11 rounded-xl object-cover border border-ink-200 dark:border-white/10 shrink-0",
                            "ring-4 ring-transparent transition-all duration-300",
                            theme.avatarRing
                          )}
                        />
                      ) : (
                        <div className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 text-xs font-bold text-white border border-border-subtle shrink-0",
                          "dark:bg-bg-elevated dark:text-text-primary ring-4 ring-transparent transition-all duration-300",
                          theme.avatarRing
                        )}>
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-ink-950 dark:text-white transition-colors duration-250">
                          {full_name}
                        </h3>
                        <p className="truncate text-xxs font-medium text-ink-500 dark:text-ink-400">
                          {email}
                        </p>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="mt-4.5 flex flex-wrap gap-2">
                      <span className={cn("badge text-[10px] py-0.5 px-2.5 font-bold uppercase tracking-wider capitalize border border-transparent shadow-sm", roleStyles[role] || "badge-muted")}>
                        {role}
                      </span>
                      <span className={cn("badge text-[10px] py-0.5 px-2.5 font-semibold capitalize border border-transparent", statusStyles[status] || "badge-muted")}>
                        {status}
                      </span>
                      {is_verified && (
                        <span className="badge badge-success text-[10px] py-0.5 px-2.5 font-semibold border border-transparent">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions preview */}
                  <div className={cn(
                    "relative mt-5 border-t border-ink-200/50 pt-3 dark:border-white/10 flex items-center justify-between text-xxs font-bold text-ink-400 dark:text-ink-500 transition-colors duration-200",
                    theme.textHover
                  )}>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
                      View Details
                    </span>
                    <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200 text-sm font-normal">→</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="secondary"
              size="sm"
              disabled={um.page === 1}
              onClick={() => um.setPage((prev) => Math.max(prev - 1, 1))}
              aria-label="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-xs font-bold text-ink-700 dark:text-ink-300">
              Page {um.page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={um.page === totalPages}
              onClick={() => um.setPage((prev) => Math.min(prev + 1, totalPages))}
              aria-label="Next Page"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Side Details Drawer */}
        <UserDrawer
          isOpen={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          user={activeUser}
          onStatusUpdate={(id, status) => um.updateUserStatus({ id, status })}
          isUpdating={um.isUpdatingStatus && um.updatingId === activeUser?.id}
        />
      </div>
    </PageTransition>
  );
}

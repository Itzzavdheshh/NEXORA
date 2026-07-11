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
  active: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-200 dark:border-emerald-400/20",
  inactive: "bg-ink-50 text-ink-700 border-ink-200 dark:bg-white/5 dark:text-ink-300 dark:border-white/10",
  suspended: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:border-amber-400/20",
  rejected: "bg-red-50 text-red-800 border-red-200 dark:bg-red-400/10 dark:text-red-200 dark:border-red-400/20",
};

const roleStyles = {
  student: "bg-brand-500/10 text-brand-700 dark:text-brand-200",
  mentor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
  admin: "bg-violet-500/10 text-violet-700 dark:text-violet-200",
};

export default function UserManagementPage() {
  const um = useUserManagement();
  const [selectedUser, setSelectedUser] = useState(null);

  if (um.isLoading) {
    return <UserSkeleton />;
  }

  if (um.isError) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Failed to load users list"
          description={um.error?.message || "Could not retrieve platform user list."}
          actionLabel="Retry"
          onAction={um.refetch}
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
        <div className="glass-panel flex flex-col gap-4 rounded-[2rem] p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-200">
              <Users className="h-3.5 w-3.5" />
              Identity Management
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl dark:text-white">
              User profiles.
            </h1>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">
              Manage accounts list, review verification state, and activate or deactivate memberships.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="secondary"
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
            title="No matching users"
            description="Adjust search tags or filter choices to find matching accounts."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {um.users.map((user, idx) => {
              const { id, full_name, email, avatar_url, role, status, is_verified } = user;
              const initials = (full_name || "U")
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => setSelectedUser(user)}
                  className="glass-panel group flex flex-col justify-between rounded-3xl p-5 hover:shadow-glow hover:-translate-y-0.5 transition duration-200 cursor-pointer"
                >
                  <div>
                    {/* Top profile row */}
                    <div className="flex items-center gap-3">
                      {avatar_url ? (
                        <img
                          src={avatar_url}
                          alt=""
                          className="h-10 w-10 rounded-xl object-cover border border-ink-200 dark:border-white/10"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950 text-xs font-extrabold text-white dark:bg-brand-300 dark:text-ink-950">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-extrabold text-ink-950 dark:text-white">
                          {full_name}
                        </h3>
                        <p className="truncate text-xxs font-semibold text-ink-500 dark:text-ink-300">
                          {email}
                        </p>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xxs font-bold capitalize", roleStyles[role] || "bg-ink-100 text-ink-600")}>
                        {role}
                      </span>
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-xxs font-extrabold capitalize tracking-[0.04em]", statusStyles[status] || "border-ink-200 bg-ink-50 text-ink-700")}>
                        {status}
                      </span>
                      {is_verified && (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-700 px-2.5 py-0.5 text-xxs font-bold dark:text-emerald-300">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions preview */}
                  <div className="mt-5 border-t border-ink-200/50 pt-3 dark:border-white/10 flex items-center justify-between text-xxs font-bold text-brand-600 dark:text-brand-300">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      View Details
                    </span>
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

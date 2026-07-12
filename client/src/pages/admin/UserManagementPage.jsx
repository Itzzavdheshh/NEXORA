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
  student: "badge-brand",
  mentor: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-200", // Violet accent for mentors in Admin view
  admin: "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-300/20 dark:bg-brand-300/10 dark:text-brand-100",
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
        <div className="glass-panel flex flex-col gap-4 rounded-3xl p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="badge badge-brand">
              <Users className="h-3.5 w-3.5" />
              Identity Management
            </p>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl dark:text-white">
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
                  className="glass-panel group flex flex-col justify-between rounded-2xl p-5 hover:shadow-elevation-2 hover:-translate-y-0.5 transition duration-200 cursor-pointer"
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
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950 text-xs font-bold text-white dark:bg-brand-300 dark:text-ink-950">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-ink-950 dark:text-white">
                          {full_name}
                        </h3>
                        <p className="truncate text-xxs font-medium text-ink-500 dark:text-ink-400">
                          {email}
                        </p>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <span className={cn("badge text-[10px] capitalize", roleStyles[role] || "badge-muted")}>
                        {role}
                      </span>
                      <span className={cn("badge text-[10px] capitalize", statusStyles[status] || "badge-muted")}>
                        {status}
                      </span>
                      {is_verified && (
                        <span className="badge badge-success text-[10px]">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions preview */}
                  <div className="mt-5 border-t border-ink-200/60 pt-3 dark:border-white/6 flex items-center justify-between text-xxs font-bold text-brand-600 dark:text-brand-300">
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

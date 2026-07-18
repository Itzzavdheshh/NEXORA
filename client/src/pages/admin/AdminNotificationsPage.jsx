import { memo } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageTransition } from "../../components/ui/PageTransition";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationCard } from "../../components/notifications/NotificationCard";
import { NotificationFilters } from "../../components/notifications/NotificationFilters";
import { NotificationHeaderStats } from "../../components/notifications/NotificationHeader";
import { NotificationSkeleton } from "../../components/notifications/NotificationSkeleton";

// ── Memoised list ─────────────────────────────────────────────────────────────
const NotificationList = memo(function NotificationList({ notifications, onMarkRead, markingId, isMarkingRead, role }) {
  return (
    <ul
      className="space-y-3"
      role="list"
      aria-label="Notifications list"
      aria-live="polite"
    >
      {notifications.map((notification, index) => (
        <li key={notification.id}>
          <NotificationCard
            notification={notification}
            index={index}
            onMarkRead={onMarkRead}
            isMarking={markingId === notification.id && isMarkingRead}
            role={role}
          />
        </li>
      ))}
    </ul>
  );
});

// ── Empty state variants ──────────────────────────────────────────────────────
function NotificationsEmptyState({ filter, onClear }) {
  if (filter === "unread") {
    return (
      <EmptyState
        title="No pending notifications"
        description="All clear! There are no unread administrative notifications."
      />
    );
  }

  if (filter === "read") {
    return (
      <EmptyState
        title="No read logs"
        description="Administrative notifications you mark as read will show up here."
      />
    );
  }

  if (filter === "all") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-border-subtle bg-bg-surface shadow-token-md rounded-3xl p-8 text-center sm:p-10"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-admin/10 text-accent-admin shadow-sm dark:bg-accent-admin/10 dark:text-accent-admin">
          <Bell className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-ink-950 dark:text-white">
          No logs recorded
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500 dark:text-ink-300">
          Important admin updates, user signups, and system alerts will be listed here.
        </p>
      </motion.div>
    );
  }

  return (
    <EmptyState
      title="No matches found"
      description="Try resetting your filters or search keywords."
      actionLabel="Clear filters"
      onAction={onClear}
    />
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function NotificationsErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto max-w-3xl">
      <EmptyState
        title="Failed to fetch logs"
        description={message || "An error occurred while loading administrative notifications."}
        actionLabel="Retry"
        onAction={onRetry}
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminNotificationsPage() {
  const ns = useNotifications();

  function clearFilters() {
    ns.setSearch("");
    ns.setFilter("all");
    ns.setSort("newest");
  }

  if (ns.isLoading) {
    return <NotificationSkeleton />;
  }

  if (ns.isError) {
    return (
      <NotificationsErrorState
        message={ns.error?.message}
        onRetry={ns.refetch}
      />
    );
  }

  const isEmpty = ns.filteredNotifications.length === 0;

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl space-y-5" aria-label="Admin notifications console">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <NotificationHeaderStats
            total={ns.notifications.length}
            unreadCount={ns.unreadCount}
            isFetching={ns.isFetching}
            isMarkingAllRead={ns.isMarkingAllRead}
            onRefresh={ns.refetch}
            onMarkAllRead={ns.markAllRead}
            role="admin"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
        >
          <NotificationFilters
            search={ns.search}
            onSearchChange={ns.setSearch}
            filter={ns.filter}
            onFilterChange={ns.setFilter}
            sort={ns.sort}
            onSortChange={ns.setSort}
            visible={ns.filteredNotifications.length}
            total={ns.notifications.length}
          />
        </motion.div>

        {/* List */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isEmpty ? (
            <NotificationsEmptyState filter={ns.filter} onClear={clearFilters} />
          ) : (
            <NotificationList
              notifications={ns.filteredNotifications}
              onMarkRead={ns.markRead}
              markingId={ns.markingId}
              isMarkingRead={ns.isMarkingRead}
              role="admin"
            />
          )}
        </motion.div>

        {ns.isFetching && !ns.isLoading && (
          <p className="text-center text-xs font-semibold text-ink-400 dark:text-ink-500">
            Syncing logs…
          </p>
        )}
      </div>
    </PageTransition>
  );
}

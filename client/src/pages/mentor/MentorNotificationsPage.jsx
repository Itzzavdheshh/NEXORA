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
        title="You're all caught up!"
        description="No unread notifications right now. New updates will land here the moment they arrive."
      />
    );
  }

  if (filter === "read") {
    return (
      <EmptyState
        title="No read notifications yet"
        description="Once you read or mark notifications as read, they'll appear in this view."
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
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-mentor/10 text-accent-mentor shadow-sm dark:bg-accent-mentor/10 dark:text-accent-mentor">
          <Bell className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-ink-950 dark:text-white">
          No notifications yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500 dark:text-ink-300">
          Booking alerts, slot confirmations, and student updates will appear here in real time.
        </p>
      </motion.div>
    );
  }

  return (
    <EmptyState
      title="No notifications match your filters"
      description="Try adjusting your search, filter, or sort options."
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
        title="Notifications could not load"
        description={
          message ||
          "Nexora could not fetch your notifications. Please check that the backend is running and try again."
        }
        actionLabel="Retry"
        onAction={onRetry}
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MentorNotificationsPage() {
  const ns = useNotifications();

  function clearFilters() {
    ns.setSearch("");
    ns.setFilter("all");
    ns.setSort("newest");
  }

  // Loading state
  if (ns.isLoading) {
    return <NotificationSkeleton />;
  }

  // Error state
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
      <div
        className="mx-auto max-w-3xl space-y-5"
        aria-label="Mentor notification center"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <NotificationHeaderStats
            total={ns.notifications.length}
            unreadCount={ns.unreadCount}
            isFetching={ns.isFetching}
            isMarkingAllRead={ns.isMarkingAllRead}
            onRefresh={ns.refetch}
            onMarkAllRead={ns.markAllRead}
            role="mentor"
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

        {/* Notification list or empty state */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isEmpty ? (
            <NotificationsEmptyState
              filter={ns.filter}
              onClear={clearFilters}
            />
          ) : (
            <NotificationList
              notifications={ns.filteredNotifications}
              onMarkRead={ns.markRead}
              markingId={ns.markingId}
              isMarkingRead={ns.isMarkingRead}
              role="mentor"
            />
          )}
        </motion.div>

        {/* Faint refresh hint at bottom when background-fetching */}
        {ns.isFetching && !ns.isLoading && (
          <p
            aria-live="polite"
            className="text-center text-xs font-medium text-ink-400 dark:text-ink-500"
          >
            Refreshing…
          </p>
        )}
      </div>
    </PageTransition>
  );
}

import { Search, X, SlidersHorizontal } from "lucide-react";

export function UserFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  verified,
  onVerifiedChange,
  sort,
  onSortChange,
  totalCount,
}) {
  const hasActiveFilters =
    search.trim() ||
    role !== "all" ||
    status !== "all" ||
    verified !== "all" ||
    sort !== "newest";

  function handleClear() {
    onSearchChange("");
    onRoleChange("all");
    onStatusChange("all");
    onVerifiedChange("all");
    onSortChange("newest");
  }

  return (
    <section className="glass-panel rounded-3xl p-4 sm:p-5 space-y-4" aria-label="User search filters">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <label className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users by name or email…"
            className="h-11 w-full rounded-2xl border border-ink-200 bg-white/80 pl-11 pr-4 text-sm font-medium text-ink-900 shadow-sm transition placeholder:text-ink-400 dark:border-white/10 dark:bg-white/10 dark:text-white"
          />
        </label>

        {/* Sorting */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-11 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-800 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
          aria-label="Sort users list"
        >
          <option value="newest">Newest registered</option>
          <option value="oldest">Oldest registered</option>
        </select>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-ink-100 dark:hover:bg-white/20"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-3 border-t border-ink-200/50 pt-4 dark:border-white/5">
        <span className="flex items-center gap-1.5 text-xs font-bold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter:
        </span>

        {/* Role filter */}
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="h-9 rounded-xl border border-ink-200 bg-white/80 px-3 text-xs font-bold text-ink-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
          aria-label="Filter by role"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="mentor">Mentors</option>
          <option value="admin">Admins</option>
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-9 rounded-xl border border-ink-200 bg-white/80 px-3 text-xs font-bold text-ink-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Verification filter */}
        <select
          value={verified}
          onChange={(e) => onVerifiedChange(e.target.value)}
          className="h-9 rounded-xl border border-ink-200 bg-white/80 px-3 text-xs font-bold text-ink-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
          aria-label="Filter by verification state"
        >
          <option value="all">All Verification</option>
          <option value="true">Verified Only</option>
          <option value="false">Unverified Only</option>
        </select>

        <span className="ml-auto text-xxs font-bold text-ink-400 dark:text-ink-500 uppercase tracking-wider">
          Found {totalCount} matching accounts
        </span>
      </div>
    </section>
  );
}

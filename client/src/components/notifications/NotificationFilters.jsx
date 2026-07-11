import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "../../utils/cn";

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

export function NotificationFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  visible,
  total,
}) {
  const hasActiveFilters = search.trim() || filter !== "all" || sort !== "newest";

  function handleClear() {
    onSearchChange("");
    onFilterChange("all");
    onSortChange("newest");
  }

  return (
    <section
      className="glass-panel rounded-3xl p-4 sm:p-5"
      aria-label="Notification filters"
    >
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
            placeholder="Search notifications…"
            aria-label="Search notifications"
            className="h-11 w-full rounded-2xl border border-ink-200 bg-white/80 pl-11 pr-4 text-sm font-medium text-ink-900 shadow-sm transition placeholder:text-ink-400 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-ink-400"
          />
        </label>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort notifications"
          className="h-11 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-800 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear all filters"
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-ink-100 dark:hover:bg-white/20"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div
        className="mt-4 flex gap-2"
        role="tablist"
        aria-label="Filter by read status"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={filter === tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={cn(
              "rounded-xl px-4 py-1.5 text-sm font-semibold transition",
              filter === tab.value
                ? "bg-ink-950 text-white shadow-glow dark:bg-white dark:text-ink-950"
                : "text-ink-600 hover:bg-ink-100 hover:text-ink-950 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-white",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Result summary */}
      <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink-500 dark:text-ink-300">
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        Showing {visible} of {total} notifications
      </p>
    </section>
  );
}

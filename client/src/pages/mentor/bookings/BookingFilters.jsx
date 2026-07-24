import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "../../../utils/cn";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest date" },
  { value: "oldest", label: "Oldest date" },
];

export function BookingFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  stats,
  visibleCount,
}) {
  const hasActiveFilters = search.trim() || filter !== "all" || sort !== "newest";

  const tabs = [
    { value: "all", label: "All", count: stats.total },
    { value: "pending", label: "Pending", count: stats.pending },
    { value: "confirmed", label: "Confirmed", count: stats.confirmed },
    { value: "completed", label: "Completed", count: stats.completed },
    { value: "cancelled", label: "Cancelled", count: stats.cancelled },
  ];

  function handleClear() {
    onSearchChange("");
    onFilterChange("all");
    onSortChange("newest");
  }

  return (
    <section
      className="border border-border-subtle bg-bg-surface shadow-token-md rounded-3xl p-4 sm:p-5"
      aria-label="Booking filters"
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
            placeholder="Search by student name, notes or date…"
            aria-label="Search bookings"
            className="h-11 w-full rounded-2xl border border-ink-200 bg-white/80 pl-11 pr-4 text-sm font-medium text-ink-900 shadow-sm transition placeholder:text-ink-400 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-ink-400"
          />
        </label>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort bookings"
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

      {/* Filter Tabs */}
      <div
        className="mt-4 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter by booking status"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={filter === tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-1.5 text-sm font-semibold transition",
              filter === tab.value
                ? "bg-ink-950 text-white shadow-accent dark:bg-white dark:text-ink-950"
                : "text-ink-600 hover:bg-ink-100 hover:text-ink-950 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-white",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-md px-1.5 py-0.5 text-xxs font-bold",
                filter === tab.value
                  ? "bg-white/20 text-white dark:bg-ink-950/10 dark:text-ink-950"
                  : "bg-ink-100 text-ink-500 dark:bg-white/10 dark:text-ink-300",
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Result Summary */}
      <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink-500 dark:text-ink-300">
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        Showing {visibleCount} of {stats.total} bookings
      </p>
    </section>
  );
}

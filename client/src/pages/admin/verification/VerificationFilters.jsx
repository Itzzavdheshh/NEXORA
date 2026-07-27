import { Search, X } from "lucide-react";

export function VerificationFilters({ search, onSearchChange, sort, onSortChange, totalCount }) {
  const hasActiveFilters = search.trim() || sort !== "newest";

  function handleClear() {
    onSearchChange("");
    onSortChange("newest");
  }

  return (
    <section className="border border-border-subtle bg-bg-surface shadow-token-md flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:p-5">
      {/* Search Input */}
      <label className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by mentor name or email…"
          className="h-11 w-full rounded-2xl border border-ink-200 bg-white/80 pl-11 pr-4 text-sm font-medium text-ink-900 shadow-sm transition placeholder:text-ink-400 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-ink-400"
        />
      </label>

      {/* Sort Select */}
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-11 rounded-2xl border border-ink-200 bg-white/80 px-4 text-sm font-bold text-ink-800 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white"
        aria-label="Sort pending applications"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>

      {/* Clear Filters */}
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

      {/* Count Indicator */}
      <div className="shrink-0 text-xs font-bold text-ink-500 dark:text-ink-300 sm:pl-2">
        {totalCount} pending applications
      </div>
    </section>
  );
}

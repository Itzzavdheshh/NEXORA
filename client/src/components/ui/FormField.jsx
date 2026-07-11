import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

export function FormField({
  id,
  label,
  error,
  helper,
  className,
  rightSlot,
  as = "input",
  children,
  ...props
}) {
  const Component = as;

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-semibold text-ink-800 dark:text-ink-100" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {as === "select" ? (
          <select
            id={id}
            className="h-12 w-full rounded-2xl border border-ink-200 bg-white/85 px-4 text-sm font-medium text-ink-900 shadow-sm transition hover:border-ink-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:border-white/20"
            aria-invalid={Boolean(error)}
            {...props}
          >
            {children}
          </select>
        ) : (
          <Component
            id={id}
            className={cn(
              "w-full rounded-2xl border border-ink-200 bg-white/85 px-4 text-sm font-medium text-ink-900 shadow-sm transition placeholder:text-ink-400 hover:border-ink-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder:text-ink-400 dark:hover:border-white/20",
              as === "textarea" ? "min-h-32 py-3" : "h-12 pr-12",
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
            {...props}
          />
        )}
        {rightSlot}
      </div>
      {error ? (
        <p className="text-sm font-medium text-red-600 dark:text-red-300" id={`${id}-error`}>
          {error.message}
        </p>
      ) : helper ? (
        <p className="text-xs leading-5 text-ink-500 dark:text-ink-400" id={`${id}-helper`}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export function PasswordToggle({ visible, onClick }) {
  const Icon = visible ? EyeOff : Eye;

  return (
    <button
      type="button"
      aria-label={visible ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-white"
      onClick={onClick}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

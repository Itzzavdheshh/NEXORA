import {
  Mail,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Drawer } from "../../../components/ui/Drawer";
import { cn } from "../../../utils/cn";

const roleColors = {
  student: "badge-primary",
  mentor: "badge-mentor",
  admin: "badge-admin",
};

const roleTextColors = {
  student: "text-accent-primary",
  mentor: "text-accent-mentor",
  admin: "text-accent-admin",
};

const statusColors = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
  inactive:
    "border-border-subtle bg-bg-elevated text-text-secondary",
  suspended:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
  rejected:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200",
};

export function UserDrawer({ isOpen, onClose, user, onStatusUpdate, isUpdating }) {
  if (!user) return null;

  const { id, full_name, email, avatar_url, role, status, is_verified, created_at } = user;

  const initials = (full_name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  const isActive = status === "active";

  return (
    <Drawer
      open={isOpen}
      onClose={isUpdating ? undefined : onClose}
      title="User account details"
      className="max-w-lg"
    >
      {/* Avatar & Basic Info */}
      <div className="flex items-center gap-4 mb-6">
        {avatar_url ? (
          <img
            src={avatar_url}
            alt=""
            className="h-16 w-16 rounded-3xl border border-border-subtle object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-bg-elevated text-lg font-extrabold text-text-primary ring-2 ring-border-subtle">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-extrabold text-text-primary">
            {full_name}
          </h3>
          <a
            href={`mailto:${email}`}
            className={cn("mt-1 flex items-center gap-1.5 text-sm font-semibold hover:underline", roleTextColors[role] || "text-accent-primary")}
          >
            <Mail className="h-4 w-4" />
            {email}
          </a>
        </div>
      </div>

      {/* Role & status badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span
          className={cn(
            "badge border border-transparent capitalize",
            roleColors[role] || "badge-muted"
          )}
        >
          Role: {role}
        </span>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-extrabold capitalize tracking-[0.04em]",
            statusColors[status] ||
              "border-border-subtle bg-bg-elevated text-text-secondary"
          )}
        >
          Status: {status}
        </span>
      </div>

      {/* Account metadata card */}
      <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-4 space-y-4 mb-5">
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-4 w-4 text-text-tertiary" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Registration Date
            </p>
            <p className="mt-1 text-sm font-extrabold text-text-primary">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User className="mt-0.5 h-4 w-4 text-text-tertiary" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Account ID
            </p>
            <code className="mt-1 block text-[11px] font-bold text-text-secondary font-mono break-all">
              {id}
            </code>
          </div>
        </div>

        <div className="flex items-start gap-3">
          {is_verified ? (
            <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-500" />
          ) : (
            <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-500" />
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              Verification Status
            </p>
            <p className="mt-1 text-sm font-extrabold text-text-primary">
              {is_verified
                ? "Verified Professional"
                : "Unverified / Awaiting validation"}
            </p>
          </div>
        </div>
      </div>

      {/* Admin warning */}
      {role === "admin" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-400/10 dark:bg-amber-400/5 mb-5">
          <p className="text-xs leading-5 text-amber-800 dark:text-amber-200">
            <strong>Notice:</strong> Administrative accounts cannot be
            deactivated from this dashboard to prevent self-lockout.
          </p>
        </div>
      )}

      {/* Action footer — only for non-admins */}
      {role !== "admin" && (
        <div className="mt-4 border-t border-border-subtle pt-5">
          {isActive ? (
            <Button
              variant="danger"
              loading={isUpdating}
              onClick={() => onStatusUpdate(id, "inactive")}
              className="w-full"
              id="user-drawer-deactivate-btn"
            >
              <XCircle className="h-4 w-4" />
              Deactivate Account
            </Button>
          ) : (
            <Button
              variant="primary"
              loading={isUpdating}
              onClick={() => onStatusUpdate(id, "active")}
              className="w-full"
              id="user-drawer-activate-btn"
            >
              <CheckCircle2 className="h-4 w-4" />
              Activate Account
            </Button>
          )}
        </div>
      )}
    </Drawer>
  );
}

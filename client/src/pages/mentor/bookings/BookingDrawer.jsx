import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Mail,
  Video,
  FileText,
  Check,
  X,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/Button";
import { Drawer } from "../../../components/ui/Drawer";
import { cn } from "../../../utils/cn";

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_TIMELINE = {
  pending:   { label: "Pending",   color: "text-amber-300",            icon: AlertCircle,   bg: "bg-amber-500/12"   },
  confirmed: { label: "Confirmed", color: "text-accent-mentor", icon: CheckCircle2, bg: "bg-emerald-500/12" },
  completed: { label: "Completed", color: "text-accent-primary", icon: Sparkles,    bg: "bg-amber-500/12"   },
  cancelled: { label: "Cancelled", color: "text-accent-danger",  icon: X,           bg: "bg-red-500/12"     },
};

function InfoRow({ icon: Icon, label, value }) {
  const MotionIcon = Icon;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-bg-floating">
        <Icon className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-text-primary">{value || "—"}</p>
      </div>
    </div>
  );
}

export function BookingDrawer({ isOpen, onClose, booking, onStatusUpdate, isUpdating }) {
  const [meetingLink, setMeetingLink] = useState("");
  const [savedLink, setSavedLink] = useState("");
  const [editLink, setEditLink] = useState("");

  useEffect(() => {
    if (booking?.id) {
      const link = booking.meeting_link || "";
      setSavedLink(link);
      setEditLink(link);
      setMeetingLink("");
    }
  }, [booking]);

  if (!booking) return null;

  const { id, status, booking_date, start_time, end_time, meeting_type, notes, student } = booking;

  const initials = (student?.full_name || "S")
    .split(" ")
    .map(p => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = booking_date
    ? format(new Date(booking_date), "EEEE, MMMM d, yyyy")
    : "Date not specified";

  const statusCfg = STATUS_TIMELINE[status] || STATUS_TIMELINE.pending;
  const StatusIcon = statusCfg.icon;

  // Build a mini timeline of status states
  const FLOW = ["pending", "confirmed", "completed"];
  const isCancelled = status === "cancelled";

  return (
    <Drawer
      open={isOpen}
      onClose={() => { if (!isUpdating) onClose(); }}
      title="Booking details"
      className="max-w-lg"
    >
      {/* ── Student summary ── */}
      <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-elevated p-4">
        {student?.avatar_url ? (
          <img
            src={student.avatar_url}
            alt=""
            className="h-14 w-14 rounded-xl border border-border-subtle object-cover"
          />
        ) : (
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-base font-extrabold text-[var(--bg-base)]"
            style={{ background: "var(--accent-mentor)" }}
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-base font-extrabold text-text-primary">
            {student?.full_name || "Student User"}
          </h3>
          {student?.email && (
            <a
              href={`mailto:${student.email}`}
              className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-accent-mentor hover:underline"
            >
              <Mail className="h-3 w-3" />
              {student.email}
            </a>
          )}
        </div>
        {/* Status badge */}
        <span className={cn(
          "ml-auto shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold",
          statusCfg.bg, statusCfg.color,
        )}>
          <StatusIcon className="h-3.5 w-3.5" />
          {statusCfg.label}
        </span>
      </div>

      {/* ── Status timeline ── */}
      {!isCancelled && (
        <div className="mt-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Session progress</p>
          <div className="relative flex items-center justify-between">
            {/* connector line */}
            <div className="absolute left-[10px] right-[10px] top-[10px] h-px bg-border-subtle" />
            {FLOW.map((s, i) => {
              const passed = FLOW.indexOf(status) >= i;
              const isActive = status === s;
              const cfg = STATUS_TIMELINE[s];
              const Ic = cfg.icon;
              return (
                <div key={s} className="relative flex flex-col items-center gap-1.5">
                  <div className={cn(
                    "z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                    passed
                      ? "border-accent-mentor bg-accent-mentor"
                      : "border-border-strong bg-bg-elevated",
                  )}>
                    {passed && <Ic className="h-3 w-3 text-[var(--bg-base)]" />}
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-wider",
                    isActive ? "text-accent-mentor" : "text-text-tertiary",
                  )}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Session details ── */}
      <div className="mt-5 space-y-3 rounded-xl border border-border-subtle bg-bg-elevated p-4">
        <InfoRow icon={Calendar} label="Date"         value={formattedDate} />
        <InfoRow icon={Clock}    label="Time"         value={`${start_time?.slice(0, 5)} – ${end_time?.slice(0, 5)}`} />
        <InfoRow icon={Video}    label="Session type" value={meeting_type || "Virtual Session"} />

        {/* Meeting Link row */}
        {status === "confirmed" && (
          <div className="border-t border-border-subtle pt-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Meeting Link</p>
                <p className="mt-0.5 text-xs font-semibold text-accent-mentor truncate">
                  {savedLink || "No link set yet."}
                </p>
              </div>
              {savedLink && (
                <a
                  href={savedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-accent-mentor/10 hover:bg-accent-mentor/20 text-accent-mentor px-2.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Video className="h-3.5 w-3.5" />
                  Join
                </a>
              )}
            </div>
            
            {/* Editable meeting link */}
            <div className="mt-1 flex gap-2">
              <input
                type="url"
                placeholder="Update meeting link..."
                className="flex-1 rounded-lg border border-border-subtle bg-bg-floating px-2.5 py-1 text-xs text-text-primary outline-none focus:border-accent-mentor focus:ring-1 focus:ring-accent-mentor"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
              />
              <Button
                size="sm"
                loading={isUpdating}
                onClick={async () => {
                  try {
                    await onStatusUpdate(id, "confirmed", editLink);
                    setSavedLink(editLink);
                    toast.success("Meeting link updated successfully!");
                  } catch (err) {
                    toast.error(err.message || "Failed to update meeting link.");
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Notes ── */}
      {notes && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
            <FileText className="h-3.5 w-3.5" />
            Student notes
          </div>
          <div className="rounded-xl border border-border-subtle bg-bg-elevated p-4 text-sm leading-6 italic text-text-secondary">
            "{notes}"
          </div>
        </div>
      )}

      {/* ── Student profile metadata ── */}
      {student?.profile && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
            <GraduationCap className="h-3.5 w-3.5" />
            Student academic profile
          </div>
          <div className="space-y-3 rounded-xl border border-border-subtle bg-bg-elevated p-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ["College", student.profile.college],
                ["Degree",  student.profile.degree ],
                ["Branch",  student.profile.branch ],
              ].map(([lbl, val]) => val ? (
                <div key={lbl} className={lbl === "Branch" ? "col-span-2" : ""}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">{lbl}</p>
                  <p className="mt-0.5 font-semibold text-text-primary">{val}</p>
                </div>
              ) : null)}
            </div>
            {Array.isArray(student.profile.skills) && student.profile.skills.length > 0 && (
              <div className="border-t border-border-subtle pt-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {student.profile.skills.map(skill => (
                    <span
                      key={skill}
                      className="rounded-md px-2.5 py-0.5 text-xs font-bold"
                      style={{ background: "rgba(16,185,129,0.12)", color: "var(--accent-mentor)" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Spacer so content clears sticky footer ── */}
      <div className="h-4" />

      {/* ── Sticky footer actions ── */}
      {(status === "pending" || status === "confirmed") && (
        <div className="sticky bottom-0 mt-6 bg-bg-surface pt-4 border-t border-border-subtle flex flex-col gap-3">
          {status === "pending" && (
            <div className="flex flex-col gap-3 w-full">
              {/* Meeting link prompt */}
              <div className="rounded-xl border border-border-subtle bg-bg-elevated p-3">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-text-tertiary mb-1">
                  Video Call / Meeting Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full rounded-lg border border-border-subtle bg-bg-floating px-3 py-1.5 text-xs text-text-primary outline-none focus:border-accent-mentor focus:ring-1 focus:ring-accent-mentor"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  loading={isUpdating}
                  onClick={async () => {
                    await onStatusUpdate(id, "confirmed", meetingLink);
                  }}
                >
                  <Check className="h-4 w-4" />
                  Confirm
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  loading={isUpdating}
                  onClick={() => onStatusUpdate(id, "cancelled")}
                >
                  <X className="h-4 w-4" />
                  Decline
                </Button>
              </div>
            </div>
          )}
          {status === "confirmed" && (
            <div className="flex gap-3 w-full">
              <Button
                className="flex-1"
                loading={isUpdating}
                onClick={() => onStatusUpdate(id, "completed")}
              >
                <Sparkles className="h-4 w-4" />
                Mark completed
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                loading={isUpdating}
                onClick={() => onStatusUpdate(id, "cancelled")}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Briefcase,
  ExternalLink,
  GraduationCap,
  Award,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useFocusTrap } from "../../../hooks/useFocusTrap";

export function VerificationDrawer({ isOpen, onClose, mentor, onVerify, onReject, isMutating }) {
  const drawerRef = useRef(null);

  // Trap focus inside drawer
  useFocusTrap(drawerRef, isOpen);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isMutating) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isMutating]);


  if (!isOpen || !mentor) return null;

  const { full_name, email, avatar_url, profile } = mentor;
  const initials = (full_name || "M")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm"
          onClick={() => {
            if (!isMutating) onClose();
          }}
        />

        {/* Drawer Panel */}
        <motion.div
          ref={drawerRef}
          initial={{ x: "100%" }}

          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          role="dialog"
          aria-modal="true"
          className="relative z-50 flex h-full w-full max-w-lg flex-col border-l border-ink-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#101827]/95"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-ink-200/60 px-6 py-5 dark:border-white/10">
            <h2 className="text-lg font-extrabold tracking-tight text-ink-950 dark:text-white">
              Mentor Application Profile
            </h2>
            <button
              type="button"
              disabled={isMutating}
              onClick={onClose}
              className="rounded-xl p-2 text-ink-500 hover:bg-ink-100 dark:hover:bg-white/10"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-4">
              {avatar_url ? (
                <img
                  src={avatar_url}
                  alt=""
                  className="h-16 w-16 rounded-3xl border border-ink-200 object-cover dark:border-white/10"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-ink-950 text-lg font-extrabold text-white shadow-glow dark:bg-brand-300 dark:text-ink-950">
                  {initials}
                </div>
              )}
              <div>
                <h3 className="text-lg font-extrabold text-ink-950 dark:text-white">
                  {full_name}
                </h3>
                <a
                  href={`mailto:${email}`}
                  className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
                >
                  <Mail className="h-4 w-4" />
                  {email}
                </a>
              </div>
            </div>

            {/* Profile content */}
            {profile ? (
              <div className="space-y-5">
                {/* Professional summary */}
                <div className="rounded-3xl border border-ink-200/60 bg-white/50 p-5 dark:border-white/5 dark:bg-white/5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="mt-0.5 h-4 w-4 text-ink-400" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">Professional details</p>
                      <p className="mt-1 text-sm font-extrabold text-ink-900 dark:text-white">
                        {profile.job_title || "Mentor"} at {profile.company || "Independent"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="mt-0.5 h-4 w-4 text-ink-400" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">Experience</p>
                      <p className="mt-1 text-sm font-extrabold text-ink-900 dark:text-white">
                        {profile.experience_years ? `${profile.experience_years} years` : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">Bio</p>
                    <p className="rounded-2xl border border-ink-200/50 bg-white/50 p-4 text-sm leading-6 italic text-ink-700 dark:border-white/5 dark:bg-white/4 dark:text-ink-200">
                      "{profile.bio}"
                    </p>
                  </div>
                )}

                {/* Skills */}
                {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">Skills / Expertise</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-700 dark:text-brand-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* URLs */}
                {(profile.linkedin_url || profile.website_url) && (
                  <div className="space-y-2 border-t border-ink-200/60 pt-5 dark:border-white/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">External Links</p>
                    <div className="grid gap-2">
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-2xl border border-ink-200/60 bg-white/40 hover:bg-white dark:border-white/5 dark:bg-white/4 dark:hover:bg-white/8 text-xs font-bold text-ink-700 dark:text-ink-300"
                        >
                          <span className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4 text-brand-600 dark:text-brand-300" />
                            LinkedIn Profile
                          </span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {profile.website_url && (
                        <a
                          href={profile.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-2xl border border-ink-200/60 bg-white/40 hover:bg-white dark:border-white/5 dark:bg-white/4 dark:hover:bg-white/8 text-xs font-bold text-ink-700 dark:text-ink-300"
                        >
                          <span className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-brand-600 dark:text-brand-300" />
                            Website / Portfolio
                          </span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-ink-200 p-6 text-center text-xs font-medium text-ink-500 dark:border-white/10 dark:text-ink-400">
                This mentor has not filled out their profile details yet.
              </div>
            )}
          </div>

          {/* Action buttons inside drawer */}
          <div className="border-t border-ink-200/60 bg-ink-50/50 px-6 py-5 dark:border-white/10 dark:bg-white/2">
            <div className="flex gap-3">
              <Button
                variant="primary"
                loading={isMutating}
                onClick={onVerify}
                className="flex-1"
              >
                Verify Profile
              </Button>
              <Button
                variant="danger"
                loading={isMutating}
                onClick={onReject}
                className="flex-1"
              >
                Reject Profile
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}

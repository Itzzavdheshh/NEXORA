import {
  Mail,
  Briefcase,
  ExternalLink,
  GraduationCap,
  Award,
  Link as LinkIcon,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Drawer } from "../../../components/ui/Drawer";

export function VerificationDrawer({
  isOpen,
  onClose,
  mentor,
  onVerify,
  onReject,
  isMutating,
}) {
  if (!mentor) return null;

  const { full_name, email, avatar_url, profile } = mentor;
  const initials = (full_name || "M")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Drawer
      open={isOpen}
      onClose={isMutating ? undefined : onClose}
      title="Mentor Application Profile"
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
        <div className="min-w-0">
          <h3 className="truncate text-lg font-extrabold text-text-primary">
            {full_name}
          </h3>
          <a
            href={`mailto:${email}`}
            className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-accent-mentor hover:underline"
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
          <div className="rounded-2xl border border-border-subtle bg-bg-elevated p-4 space-y-4">
            <div className="flex items-start gap-3">
              <Briefcase className="mt-0.5 h-4 w-4 text-text-tertiary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                  Professional details
                </p>
                <p className="mt-1 text-sm font-extrabold text-text-primary">
                  {profile.job_title || "Mentor"} at{" "}
                  {profile.company || "Independent"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="mt-0.5 h-4 w-4 text-text-tertiary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                  Experience
                </p>
                <p className="mt-1 text-sm font-extrabold text-text-primary">
                  {profile.experience_years
                    ? `${profile.experience_years} years`
                    : "Not specified"}
                </p>
              </div>
            </div>

            {profile.hourly_rate && (
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 h-4 w-4 text-text-tertiary" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                    Hourly rate
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-text-primary">
                    ${profile.hourly_rate}/hr
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                Bio
              </p>
              <p className="rounded-2xl border border-border-subtle bg-bg-elevated p-4 text-sm leading-6 italic text-text-secondary">
                &ldquo;{profile.bio}&rdquo;
              </p>
            </div>
          )}

          {/* Skills */}
          {Array.isArray(profile.skills) && profile.skills.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                Skills / Expertise
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-accent-mentor/10 px-2.5 py-1 text-xs font-bold text-accent-mentor"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          {(profile.linkedin_url || profile.website_url || profile.github_url) && (
            <div className="space-y-2 border-t border-border-subtle pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                External Links
              </p>
              <div className="grid gap-2">
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-bg-elevated hover:bg-bg-base text-xs font-bold text-text-secondary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-accent-mentor" />
                      LinkedIn Profile
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-bg-elevated hover:bg-bg-base text-xs font-bold text-text-secondary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-accent-mentor" />
                      GitHub
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-bg-elevated hover:bg-bg-base text-xs font-bold text-text-secondary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-accent-mentor" />
                      Portfolio / Website
                    </span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border-subtle p-6 text-center text-xs font-medium text-text-tertiary">
          This mentor has not filled out their profile details yet.
        </div>
      )}

      {/* Action buttons — pinned to bottom */}
      <div className="mt-8 flex gap-3 border-t border-border-subtle pt-5">
        <Button
          variant="primary"
          loading={isMutating}
          onClick={onVerify}
          className="flex-1"
          id="drawer-verify-btn"
        >
          <ShieldCheck className="h-4 w-4" />
          Verify Profile
        </Button>
        <Button
          variant="danger"
          loading={isMutating}
          onClick={onReject}
          className="flex-1"
          id="drawer-reject-btn"
        >
          <ShieldX className="h-4 w-4" />
          Reject Profile
        </Button>
      </div>
    </Drawer>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, Check, X, RefreshCw } from "lucide-react";
import { useMentorVerification } from "../../hooks/useMentorVerification";
import { VerificationFilters } from "./verification/VerificationFilters";
import { VerificationSkeleton } from "./verification/VerificationSkeleton";
import { VerificationDrawer } from "./verification/VerificationDrawer";
import { VerificationModal } from "./verification/VerificationModal";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageTransition } from "../../components/ui/PageTransition";

export default function MentorVerificationPage() {
  const mv = useMentorVerification();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Modal control states
  const [modalMode, setModalMode] = useState(null); // 'verify' | 'reject' | null
  const [targetMentor, setTargetMentor] = useState(null);

  if (mv.isLoading) {
    return <VerificationSkeleton />;
  }

  if (mv.isError) {
    return (
      <div className="mx-auto max-w-3xl">
        <EmptyState
          title="Failed to load workspace"
          description={mv.error?.message || "Could not retrieve pending mentor list."}
          actionLabel="Retry"
          onAction={mv.refetch}
        />
      </div>
    );
  }

  // Frontend filter/sort mappings
  let filtered = mv.pendingMentors.filter((m) => {
    const text = `${m.full_name} ${m.email}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  if (sort === "oldest") {
    filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  function handleVerifyClick(mentor) {
    setModalMode("verify");
    setTargetMentor(mentor);
  }

  function handleRejectClick(mentor) {
    setModalMode("reject");
    setTargetMentor(mentor);
  }

  function handleConfirmAction() {
    if (!targetMentor) return;

    if (modalMode === "verify") {
      mv.verifyMentor(targetMentor.id, {
        onSuccess: () => {
          setModalMode(null);
          setTargetMentor(null);
          setSelectedMentor(null);
        },
      });
    } else {
      mv.rejectMentor(targetMentor.id, {
        onSuccess: () => {
          setModalMode(null);
          setTargetMentor(null);
          setSelectedMentor(null);
        },
      });
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="border border-border-subtle bg-bg-surface shadow-token-md flex flex-col gap-4 rounded-[2rem] p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent-admin/20 bg-accent-admin/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent-admin">
              <ShieldCheck className="h-3.5 w-3.5" />
              Credentials Review
            </p>
            <h1 className="font-display text-display font-semibold text-ink-950 dark:text-white mt-4 leading-tight">
              Mentor verification.
            </h1>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-200">
              Review professional profiles, social credentials, and verify incoming mentor registrations.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="secondary"
              onClick={mv.refetch}
              loading={mv.isFetching}
              disabled={mv.isFetching}
            >
              <RefreshCw className="h-4 w-4" />
              Sync Queue
            </Button>
          </div>
        </div>

        {/* Filters */}
        <VerificationFilters
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          totalCount={filtered.length}
        />

        {/* Listing Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            title={search.trim() ? "No pending matches" : "Verification queue empty"}
            description={search.trim() ? "Try searching for a different name or email." : "Excellent! All registered mentors have been successfully processed."}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((mentor, idx) => {
              const { full_name, email, avatar_url, profile, created_at } = mentor;
              const initials = (full_name || "M")
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border border-border-subtle bg-bg-surface shadow-token-md group flex flex-col justify-between rounded-3xl p-5 hover:shadow-accent hover:-translate-y-0.5 transition duration-200"
                >
                  <div>
                    {/* Head */}
                    <div className="flex items-center gap-3">
                      {avatar_url ? (
                        <img
                          src={avatar_url}
                          alt=""
                          className="h-11 w-11 rounded-xl object-cover border border-ink-200 dark:border-white/10"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 text-xs font-extrabold text-white border border-border-subtle dark:bg-bg-elevated dark:text-text-primary">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-extrabold text-ink-950 dark:text-white">
                          {full_name}
                        </h3>
                        <p className="truncate text-xxs font-semibold text-ink-500 dark:text-ink-300">
                          {email}
                        </p>
                      </div>
                    </div>

                    {/* Meta info preview */}
                    <div className="mt-4 border-t border-ink-200/50 pt-3 dark:border-white/5 text-xs font-semibold text-ink-700 dark:text-ink-300 space-y-1">
                      {profile ? (
                        <p className="truncate text-ink-800 dark:text-ink-200 font-bold">
                          {profile.job_title || "Mentor"} at {profile.company || "Independent"}
                        </p>
                      ) : (
                        <p className="italic text-ink-400">No professional details set yet.</p>
                      )}
                      <p className="text-[10px] text-ink-400 dark:text-ink-500">
                        Registered: {new Date(created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex gap-2 border-t border-ink-200/50 pt-4 dark:border-white/10">
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedMentor(mentor)}
                      className="flex-1 text-xs"
                      aria-label={`View details of ${full_name}`}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleVerifyClick(mentor)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500 hover:text-white transition dark:text-emerald-300"
                      title="Verify mentor"
                      aria-label={`Verify ${full_name}`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectClick(mentor)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-700 hover:bg-red-500 hover:text-white transition dark:text-red-300"
                      title="Reject mentor"
                      aria-label={`Reject ${full_name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Drawer overlay */}
        <VerificationDrawer
          isOpen={Boolean(selectedMentor)}
          onClose={() => setSelectedMentor(null)}
          mentor={selectedMentor}
          onVerify={() => handleVerifyClick(selectedMentor)}
          onReject={() => handleRejectClick(selectedMentor)}
          isMutating={mv.isVerifying || mv.isRejecting}
        />

        {/* Confirmation Modal */}
        <VerificationModal
          isOpen={Boolean(modalMode)}
          onClose={() => {
            setModalMode(null);
            setTargetMentor(null);
          }}
          mode={modalMode}
          mentorName={targetMentor?.full_name || ""}
          onConfirm={handleConfirmAction}
          isMutating={mv.isVerifying || mv.isRejecting}
        />
      </div>
    </PageTransition>
  );
}

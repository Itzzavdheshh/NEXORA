import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ArrowLeft } from "lucide-react";

export function TermsOfServicePage() {
  return (
    <main className="relative min-h-screen bg-bg-base px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Back */}
          <Link
            to="/login"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Nexora
          </Link>

          {/* Header */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary/10 border border-accent-primary/20">
              <FileText className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Terms of Service</h1>
              <p className="text-xs text-text-tertiary mt-0.5">Last updated: July 2026</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
              <p>By creating an account on Nexora, you agree to these Terms of Service. If you do not agree, you must not use the platform. Nexora reserves the right to update these terms at any time.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">2. User Accounts</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>You must provide accurate and complete registration information.</li>
                <li>You are responsible for maintaining the confidentiality of your password.</li>
                <li>One person may not maintain multiple accounts.</li>
                <li>Mentor accounts require admin verification before they become active.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">3. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Use the platform for any unlawful purpose</li>
                <li>Impersonate any person or entity</li>
                <li>Submit false or misleading information in your profile</li>
                <li>Attempt to gain unauthorized access to other accounts or the admin panel</li>
                <li>Disrupt or interfere with the security or performance of the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">4. Booking & Sessions</h2>
              <p>Students may book available sessions with verified mentors. Both parties are expected to honour confirmed bookings. Nexora does not mediate disputes between students and mentors but may suspend accounts that violate platform norms.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">5. Account Suspension</h2>
              <p>Nexora administrators reserve the right to suspend or permanently ban any account that violates these terms, without prior notice. Suspended users will lose access to all platform features.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">6. Disclaimer</h2>
              <p>Nexora is provided "as is" without warranties of any kind. We are not liable for any loss or damage arising from use of the platform, including but not limited to session cancellations, mentor unavailability, or data loss.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">7. Contact</h2>
              <p>For questions about these terms, contact the Nexora administration team through the platform.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

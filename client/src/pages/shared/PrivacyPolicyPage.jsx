import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";

export function PrivacyPolicyPage() {
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
              <Shield className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Privacy Policy</h1>
              <p className="text-xs text-text-tertiary mt-0.5">Last updated: July 2026</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">1. Information We Collect</h2>
              <p>When you register on Nexora, we collect your full name, email address, and chosen role (student or mentor). Mentor profiles may additionally include biography, expertise, and availability information you voluntarily provide.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To create and manage your Nexora account</li>
                <li>To facilitate session bookings between students and mentors</li>
                <li>To send booking confirmations and platform notifications</li>
                <li>To display your profile to other users within the platform</li>
                <li>To allow administrators to verify mentor identities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">3. Data Storage & Security</h2>
              <p>Your data is stored securely using Supabase (PostgreSQL) with row-level security enabled. Passwords are hashed by Supabase Auth and are never stored in plain text. We use HTTPS for all data transmission.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">4. Data Sharing</h2>
              <p>We do not sell your personal data. Your profile information is shared only within the Nexora platform (e.g., your name is visible to mentors/students you book with). We do not share data with third-party advertisers.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">5. Your Rights</h2>
              <p>You may request deletion of your account and all associated data at any time by contacting the platform administrator. You may also update your profile information from your settings page.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">6. Contact</h2>
              <p>For privacy-related questions, please contact the Nexora admin team via the platform's contact page or through your registered email.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

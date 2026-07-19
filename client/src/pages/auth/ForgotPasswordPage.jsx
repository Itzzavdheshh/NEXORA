import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { PageTransition } from "../../components/ui/PageTransition";

export function ForgotPasswordPage() {
  return (
    <PageTransition>
      <div className="w-full">
        <div 
          className="rounded-lg p-6 sm:p-8 border border-border-subtle shadow-md"
          style={{ backgroundColor: "var(--bg-elevated)", backdropFilter: "none" }}
        >
          {/* Header */}
          <div className="mb-6">
            <div className="badge badge-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Account recovery
            </div>
            <h1 className="text-section font-semibold text-text-primary tracking-tight">
              Forgot password?
            </h1>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Password recovery is currently disabled on the backend. Please contact your Nexora administrator for support in restoring access to your workspace.
            </p>
          </div>

          <div className="mt-8 border-t border-border-subtle pt-5">
            <Link
              className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-accent-primary transition duration-token-micro"
              to="/login"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

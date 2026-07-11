import { Link } from "react-router-dom";
import { PageTransition } from "../../components/ui/PageTransition";

export function ForgotPasswordPage() {
  return (
    <PageTransition>
      <div className="glass-panel w-full max-w-md rounded-3xl p-8">
        <p className="text-sm font-semibold text-brand-600 dark:text-brand-300">Account recovery</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Forgot password</h1>
        <p className="mt-3 text-sm leading-6 text-ink-500 dark:text-ink-300">
          Password recovery is not enabled by the backend yet. Return to sign in
          or contact your Nexora administrator for help restoring access.
        </p>
        <Link
          className="mt-8 block text-sm font-semibold text-ink-950 hover:text-brand-600 dark:text-white dark:hover:text-brand-300"
          to="/login"
        >
          Back to login
        </Link>
      </div>
    </PageTransition>
  );
}

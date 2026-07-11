import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { PageTransition } from "../../components/ui/PageTransition";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-premium-radial px-4">
      <PageTransition>
        <div className="glass-panel max-w-lg rounded-3xl p-8 text-center">
          <p className="text-sm font-semibold text-brand-600 dark:text-brand-300">404</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">This page does not exist</h1>
          <p className="mt-3 text-sm leading-6 text-ink-500 dark:text-ink-300">
            The route may have moved, or you may not have access to it yet.
          </p>
          <Link to="/login" className="mt-6 inline-block">
            <Button variant="primary">Return to Nexora</Button>
          </Link>
        </div>
      </PageTransition>
    </main>
  );
}

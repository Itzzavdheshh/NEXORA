import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/Button";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-base px-6">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute rounded-full bg-accent-primary/8 blur-[120px]"
        style={{ width: 600, height: 600, top: "30%", left: "50%", transform: "translate(-50%, -50%)" }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg"
      >
        {/* Logo mark */}
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/10 border border-accent-primary/20">
          <Sparkles className="h-6 w-6 text-accent-primary" aria-hidden="true" />
        </div>

        {/* 404 number */}
        <p className="text-[7rem] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text"
          style={{ backgroundImage: "linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 60%, var(--accent-primary-hover) 100%)" }}
        >
          404
        </p>

        {/* Heading */}
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
          Page not found
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-text-secondary max-w-sm">
          The page you're looking for doesn't exist or has been moved. It might also require authentication to access.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go back
          </Button>
          <Link to="/login">
            <Button variant="primary" className="flex items-center gap-2">
              <Home className="h-4 w-4" aria-hidden="true" />
              Return to Nexora
            </Button>
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-10 text-xs text-text-tertiary">
          If you think this is a mistake, contact your admin.
        </p>
      </motion.div>
    </main>
  );
}

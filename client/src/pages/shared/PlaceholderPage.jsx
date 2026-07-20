import { PageTransition } from "../../components/ui/PageTransition";
import { EmptyState } from "../../components/ui/EmptyState";

export function PlaceholderPage({ title }) {
  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-accent-primary dark:text-accent-primary">Nexora workspace</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-950 dark:text-white">
            {title}
          </h1>
        </div>
        <EmptyState
          title={`${title} is ready for its module phase`}
          description="Phase 1 has installed the authenticated layout, protected routing, navigation, theme system, and API foundation. This screen will become a production feature page in its dedicated phase."
        />
      </div>
    </PageTransition>
  );
}

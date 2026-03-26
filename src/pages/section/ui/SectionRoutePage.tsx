import { useLocation } from '@tanstack/react-router';

import { ProtectedRoute } from '@/features/auth';
import { ErrorBoundary } from '@/shared/ui';
import { getNavTitle } from '@/shared/config';
import { AppLayout } from '@/widgets/app-layout';

/**
 * Route-level page for sidebar sections that are not implemented yet.
 * Renders a placeholder inside the standard AppLayout.
 */
export function SectionRoutePage(): React.JSX.Element {
  const location = useLocation();
  const pathname = location.pathname;
  const title = getNavTitle(pathname);

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <AppLayout navTitle={title}>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">
              You are viewing the <span className="font-medium">{pathname}</span>{' '}
              section. Replace this text with the real module when it is ready.
            </p>
          </div>
        </AppLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}


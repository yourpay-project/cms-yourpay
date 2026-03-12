import { ErrorBoundary } from '@/shared/ui';
import { ProtectedRoute } from '@/features/auth';
import { AppLayout } from '@/widgets/app-layout';

import DashboardPage from './DashboardPage';

/**
 * Route-level page for `/`.
 *
 * - Applies auth gating via `ProtectedRoute`
 * - Uses the shared AppLayout widget
 * - Keeps widget subtree isolated with an ErrorBoundary
 */
export function DashboardRoutePage(): JSX.Element {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}


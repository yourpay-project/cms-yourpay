import { ErrorBoundary } from '@/shared/ui';
import { ProtectedRoute } from '@/features/auth';
import { getNavTitle } from '@/shared/config';
import { AppLayout } from '@/widgets/app-layout';

import UserListPage from './UserListPage';

/**
 * Route-level page for `/customers`.
 * Uses AppLayout + ProtectedRoute and renders the user list feature page.
 */
export function UserListRoutePage(): React.JSX.Element {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <AppLayout navTitle={getNavTitle('/customers')}>
          <UserListPage />
        </AppLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}


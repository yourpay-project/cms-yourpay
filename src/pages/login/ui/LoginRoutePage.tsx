import { ErrorBoundary } from '@/shared/ui';
import { LoginRedirect } from '@/features/auth';

import LoginPage from './LoginPage';

/**
 * Route-level page for `/login`.
 * Wraps the login screen with `LoginRedirect` and an ErrorBoundary.
 */
export function LoginRoutePage(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <LoginRedirect>
        <LoginPage />
      </LoginRedirect>
    </ErrorBoundary>
  );
}


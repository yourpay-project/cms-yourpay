import { ErrorBoundary } from '@/shared/ui';

import LoginCallbackPage from './LoginCallbackPage';

/**
 * Route-level page for `/login/callback`.
 * Wraps the callback page with an ErrorBoundary.
 */
export function LoginCallbackRoutePage(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <LoginCallbackPage />
    </ErrorBoundary>
  );
}


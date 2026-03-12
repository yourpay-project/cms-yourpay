import { Loader2 } from 'lucide-react';

import { useLoginCallback } from '../model/use-login-callback';

/**
 * UI for `/login/callback`.
 * Delegates all side effects and networking to `useLoginCallback`.
 */
const LoginCallbackPage = (): JSX.Element | null => {
  const { status } = useLoginCallback();

  if (status === 'error') return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" aria-label="Signing in" />
      <p className="text-sm text-muted-foreground">Completing sign in...</p>
    </div>
  );
};

export default LoginCallbackPage;


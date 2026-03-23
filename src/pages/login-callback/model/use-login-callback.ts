import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { ApiClientError } from '@/shared/api';
import { useAuthStore } from '@/entities/session';
import { getMe, setTokenFromCallback } from '@/features/auth';

import { loginCallbackSearchSchema } from './login-callback-search-schema';

export type LoginCallbackStatus = 'loading' | 'error';

/**
 * Encapsulates the `/login/callback` flow:
 * - reads and validates query params (token)
 * - stores token in cookies
 * - fetches current user (`/auth/me`)
 * - stores user and redirects
 *
 * Aborts the `/auth/me` request on unmount.
 */
export function useLoginCallback(): { status: LoginCallbackStatus } {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const setUser = useAuthStore((s) => s.setUser);
  const [status, setStatus] = useState<LoginCallbackStatus>('loading');

  useEffect(() => {
    const raw = { token: (search as Record<string, string | undefined>).token ?? undefined };
    const parsed = loginCallbackSearchSchema.parse(raw);

    if (parsed.token) {
      // Store token into auth store for subsequent API calls.
      setTokenFromCallback(parsed.token);
    }

    const controller = new AbortController();

    getMe(controller.signal)
      .then((user) => {
        setUser(user);
        toast.success('Signed in successfully');
        // Temporary: keep user on callback page to inspect auth state instead of redirecting.
        // navigate({ to: '/', replace: true });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setStatus('error');
        const message =
          err instanceof ApiClientError
            ? err.message
            : 'Failed to complete sign in.';
        toast.error(message);
        // Temporary: do not redirect on error to simplify debugging.
        // navigate({ to: '/login', replace: true });
      });

    return () => controller.abort();
  }, [navigate, search, setUser]);

  return { status };
}


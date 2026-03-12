import { RouterProvider } from '@tanstack/react-router';

import { router } from './router-instance';

/**
 * RouterProvider wrapper for the app.
 *
 * Kept as a small component so `app/App.tsx` remains a thin providers-only facade.
 */
export const AppRouter = () => <RouterProvider router={router} />;


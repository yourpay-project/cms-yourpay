import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from '@tanstack/react-router';

import { navGroups } from '@/shared/config';

import { RootLayout } from './ui/RootLayout';
import { createSectionRoutes } from './lib/create-section-routes';

/**
 * Router instance for the application.
 *
 * - Route-level code splitting is handled via `lazyRouteComponent` and page slice public APIs
 *   (e.g. `src/pages/<slice>/index.ts`).
 * - Router depends only on `shared/config` for navigation paths (no widget imports).
 * - Sidebar-driven routes are generated from shared navigation config via a helper in `app/router/lib`.
 */
const rootRoute = createRootRoute({
  component: RootLayout,
});

const DashboardRoutePage = lazyRouteComponent(
  () => import('@/pages/dashboard'),
  'DashboardRoutePage',
);
const LoginRoutePage = lazyRouteComponent(() => import('@/pages/login'), 'LoginRoutePage');
const LoginCallbackRoutePage = lazyRouteComponent(
  () => import('@/pages/login-callback'),
  'LoginCallbackRoutePage',
);
const UserListRoutePage = lazyRouteComponent(
  () => import('@/pages/user-list'),
  'UserListRoutePage',
);
const SectionRoutePage = lazyRouteComponent(
  () => import('@/pages/section'),
  'SectionRoutePage',
);

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardRoutePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginRoutePage,
});

const loginCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login/callback',
  component: LoginCallbackRoutePage,
});

const sectionRoutes = createSectionRoutes({
  rootRoute,
  navGroups,
  customersComponent: UserListRoutePage,
  sectionComponent: SectionRoutePage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  loginRoute,
  loginCallbackRoute,
  ...sectionRoutes,
]);

/**
 * Application router instance.
 *
 * @returns Configured TanStack Router that powers navigation and route matching.
 */
export const router = createRouter({
  routeTree,
  defaultPendingComponent: lazyRouteComponent(
    () => import('@/shared/ui').then((m) => ({ default: m.RouteFallback })),
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}


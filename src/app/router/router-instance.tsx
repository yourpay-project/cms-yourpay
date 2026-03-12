import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from '@tanstack/react-router';

import { navGroups } from '@/shared/config';

import { RootLayout, createSectionRoutes } from '@/app/router';

/**
 * Router instance for the application.
 *
 * - Route-level code splitting is handled via `lazyRouteComponent` and page slice public APIs
 *   (e.g. `src/pages/<slice>/index.ts`).
 * - Router depends only on `shared/config` for navigation paths (no widget imports).
 * - Sidebar-driven routes are generated from shared navigation config via a helper in `app/router/lib`.
 */
/**
 * Root route definition for the application.
 */
const rootRoute = createRootRoute({
  component: RootLayout,
});

/**
 * Lazy-loaded page components via page slice public APIs.
 */
const DashboardRoutePage = lazyRouteComponent(
  () => import('@/pages/dashboard'),
  'DashboardRoutePage',
);
/** Lazy-loaded route for the login page. */
const LoginRoutePage = lazyRouteComponent(() => import('@/pages/login'), 'LoginRoutePage');
/** Lazy-loaded route for the login callback page. */
const LoginCallbackRoutePage = lazyRouteComponent(
  () => import('@/pages/login-callback'),
  'LoginCallbackRoutePage',
);
/** Lazy-loaded route for the user list page. */
const UserListRoutePage = lazyRouteComponent(
  () => import('@/pages/user-list'),
  'UserListRoutePage',
);
/** Lazy-loaded route for generic sections. */
const SectionRoutePage = lazyRouteComponent(
  () => import('@/pages/section'),
  'SectionRoutePage',
);

/**
 * Static route for the main dashboard.
 */
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardRoutePage,
});

/**
 * Route for user authentication.
 */
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginRoutePage,
});

/**
 * Route for OAuth or auth callback processing.
 */
const loginCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login/callback',
  component: LoginCallbackRoutePage,
});

/**
 * Dynamic routes generated from shared navigation configuration.
 */
const sectionRoutes = createSectionRoutes({
  rootRoute,
  navGroups,
  customersComponent: UserListRoutePage,
  sectionComponent: SectionRoutePage,
});

/**
 * Combined route tree for the router instance.
 */
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


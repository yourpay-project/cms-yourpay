import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from "@tanstack/react-router";

import { navGroups } from "@/shared/config";

import { RootLayout, createSectionRoutes } from "@/app/router";

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
  () => import("@/pages/dashboard"),
  "DashboardRoutePage",
);

/** Lazy-loaded route for the login page. */
const LoginRoutePage = lazyRouteComponent(
  () => import("@/pages/login"),
  "LoginRoutePage",
);

/** Lazy-loaded route for the login callback page. */
const LoginCallbackRoutePage = lazyRouteComponent(
  () => import("@/pages/login-callback"),
  "LoginCallbackRoutePage",
);

/** Lazy-loaded route for the user list page. */
const UserListRoutePage = lazyRouteComponent(
  () => import("@/pages/user-list"),
  "UserListRoutePage",
);

const UserDetailRoutePage = lazyRouteComponent(
  () => import("@/pages/user-detail"),
  "UserDetailRoutePage",
);

/** Lazy-loaded route for generic sections. */
const SectionRoutePage = lazyRouteComponent(
  () => import("@/pages/section"),
  "SectionRoutePage",
);

/** Lazy-loaded route for KYC Submission list. */
const KycSubmissionRoutePage = lazyRouteComponent(
  () => import("@/pages/kyc-submission").then((m) => ({ default: m.KycSubmissionRoutePage })),
  "default",
);

/** Lazy-loaded route for KYC submission detail page. */
const KycSubmissionDetailRoutePage = lazyRouteComponent(
  () =>
    import("@/pages/kyc-submission-detail").then((m) => ({
      default: m.KycSubmissionDetailRoutePage,
    })),
  "default",
);

/** Lazy-loaded route for Countries (Master Data) page. */
const CountriesRoutePage = lazyRouteComponent(
  () =>
    import("@/pages/countries").then((m) => ({ default: m.CountriesRoutePage })),
  "default",
);

/** Lazy-loaded route for Fee Config (Exchange & Fee Management) page. */
const FeeConfigRoutePage = lazyRouteComponent(
  () => import("@/pages/fee-config").then((m) => ({ default: m.FeeConfigRoutePage })),
  "default",
);

const TransactionsRoutePage = lazyRouteComponent(
  () => import("@/pages/transactions").then((m) => ({ default: m.TransactionsRoutePage })),
  "default",
);

const TransactionDetailRoutePage = lazyRouteComponent(
  () =>
    import("@/pages/transaction-detail").then((m) => ({
      default: m.TransactionDetailRoutePage,
    })),
  "default",
);

/**
 * Static route for the main dashboard.
 */
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardRoutePage,
});

/**
 * Route for user authentication.
 */
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginRoutePage,
});

/**
 * Route for OAuth or auth callback processing.
 */
const loginCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login/callback",
  component: LoginCallbackRoutePage,
});

const userDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customers/$customerId",
  component: UserDetailRoutePage,
});

const kycSubmissionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kyc-submission/$id",
  component: KycSubmissionDetailRoutePage,
});

const transactionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/transactions/$id",
  component: TransactionDetailRoutePage,
});

/**
 * Dynamic routes generated from shared navigation configuration.
 */
const sectionRoutes = createSectionRoutes({
  rootRoute,
  navGroups,
  customersComponent: UserListRoutePage,
  sectionComponent: SectionRoutePage,
  sectionOverrides: {
    "/kyc-submission": KycSubmissionRoutePage,
    "/transactions": TransactionsRoutePage,
    "/countries": CountriesRoutePage,
    "/fee-config": FeeConfigRoutePage,
  },
});

/**
 * Combined route tree for the router instance.
 */
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  loginRoute,
  loginCallbackRoute,
  userDetailRoute,
  kycSubmissionDetailRoute,
  transactionDetailRoute,
  ...sectionRoutes,
]);

/**
 * Application router instance.
 */
export const router = createRouter({
  routeTree,
});


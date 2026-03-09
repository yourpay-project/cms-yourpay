import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useThemeEffect } from "@/shared/lib";
import { AppLayout } from "@/widgets/app-layout";
import { LoginRedirect, ProtectedRoute } from "@/features/auth";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { LoginCallbackPage } from "@/pages/login-callback";
import { navGroups } from "@/widgets/app-layout/model/nav-config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
});

/**
 * Mounts the theme effect once and wires up global theme + toast UI.
 */
const ThemeProvider = () => {
  useThemeEffect();
  return null;
};

/**
 * Root layout for all routes.
 *
 * - Applies global theme and toast provider.
 * - Renders the current route via `<Outlet />`.
 */
const RootLayout = () => (
  <>
    <ThemeProvider />
    <Toaster position="top-right" richColors />
    <Outlet />
  </>
);

const rootRoute = createRootRoute({
  component: RootLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <ProtectedRoute>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </ProtectedRoute>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <LoginRedirect>
      <LoginPage />
    </LoginRedirect>
  ),
});

const loginCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login/callback",
  component: LoginCallbackPage,
});

/**
 * Generic placeholder content for sidebar-driven sections.
 *
 * Uses the current pathname to look up the matching nav item and renders
 * a simple heading + description, while keeping the shared app layout.
 */
const SectionPage = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const section = navGroups
    .flatMap((group) => group.items)
    .find((item) => item.to === pathname);

  const title = section?.label ?? "YourPay CMS";

  return (
    <ProtectedRoute>
      <AppLayout navTitle={title}>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            You are viewing the <span className="font-medium">{pathname}</span>{" "}
            section. Replace this text with the real module when it is ready.
          </p>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
};

const sectionRoutes = navGroups
  .flatMap((group) => group.items)
  .filter((item) => item.to !== "/")
  .map((item) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path: item.to,
      component: SectionPage,
    })
  );

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  loginRoute,
  loginCallbackRoute,
  ...sectionRoutes,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;


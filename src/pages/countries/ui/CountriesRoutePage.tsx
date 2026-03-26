import { ErrorBoundary } from "@/shared/ui";
import { ProtectedRoute } from "@/features/auth";
import { getNavTitle } from "@/shared/config";
import { AppLayout } from "@/widgets/app-layout";

import CountriesPage from "./CountriesPage";

/**
 * Route-level page for `/countries`.
 * Wraps countries list in AppLayout and ProtectedRoute.
 */
export function CountriesRoutePage(): React.JSX.Element {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <AppLayout navTitle={getNavTitle("/countries")}>
          <CountriesPage />
        </AppLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}


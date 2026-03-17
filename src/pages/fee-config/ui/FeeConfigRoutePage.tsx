import { ErrorBoundary } from "@/shared/ui";
import { ProtectedRoute } from "@/features/auth";
import { getNavTitle } from "@/shared/config";
import { AppLayout } from "@/widgets/app-layout";

import FeeConfigPage from "./FeeConfigPage";

/**
 * Route-level page for `/fee-config`.
 * Wraps fee configuration list in AppLayout and ProtectedRoute.
 */
export function FeeConfigRoutePage(): JSX.Element {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <AppLayout navTitle={getNavTitle("/fee-config")}>
          <FeeConfigPage />
        </AppLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}


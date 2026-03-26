import { ErrorBoundary } from "@/shared/ui";
import { ProtectedRoute } from "@/features/auth";
import { getNavTitle } from "@/shared/config";
import { AppLayout } from "@/widgets/app-layout";

import KycSubmissionPage from "./KycSubmissionPage";

/**
 * Route-level page for `/kyc-submission`.
 * Wraps KYC list in AppLayout and ProtectedRoute.
 */
export function KycSubmissionRoutePage(): React.JSX.Element {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <AppLayout navTitle={getNavTitle("/kyc-submission")}>
          <KycSubmissionPage />
        </AppLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}

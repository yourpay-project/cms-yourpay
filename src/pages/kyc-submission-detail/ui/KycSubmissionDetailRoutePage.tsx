import { ErrorBoundary } from "@/shared/ui";
import { ProtectedRoute } from "@/features/auth";
import { getNavTitle } from "@/shared/config";
import { AppLayout } from "@/widgets/app-layout";

import KycSubmissionDetailPage from "./KycSubmissionDetailPage";

/**
 * Route wrapper for `/kyc-submission/$id`.
 */
export function KycSubmissionDetailRoutePage(): JSX.Element {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <AppLayout navTitle={getNavTitle("/kyc-submission")}>
          <div className="flex w-full min-w-0 max-w-full flex-col md:min-h-0 md:flex-1">
            <KycSubmissionDetailPage />
          </div>
        </AppLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}


import { ProtectedRoute } from "@/features/auth";
import { AppLayout } from "@/widgets/app-layout";
import { ErrorBoundary } from "@/shared/ui";
import { getNavTitle } from "@/shared/config";
import TransactionDetailPage from "./TransactionDetailPage";

export function TransactionDetailRoutePage(): React.JSX.Element {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <AppLayout navTitle={getNavTitle("/transactions")}>
          <TransactionDetailPage />
        </AppLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}

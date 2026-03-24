import { ErrorBoundary } from "@/shared/ui";
import { ProtectedRoute } from "@/features/auth";
import { getNavTitle } from "@/shared/config";
import { AppLayout } from "@/widgets/app-layout";
import TransactionsPage from "./TransactionsPage";

export function TransactionsRoutePage(): JSX.Element {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <AppLayout navTitle={getNavTitle("/transactions")}>
          <TransactionsPage />
        </AppLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}

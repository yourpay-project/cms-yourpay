import { ProtectedRoute } from "@/features/auth";
import { AppLayout } from "@/widgets/app-layout";
import { ErrorBoundary } from "@/shared/ui";
import { getNavTitle } from "@/shared/config";
import UserDetailPage from "./UserDetailPage";

/**
 * Route wrapper for `/customers/$customerId`.
 *
 * @returns Protected customer detail route with app layout and error boundary.
 */
export function UserDetailRoutePage(): React.JSX.Element {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <AppLayout navTitle={getNavTitle("/customers")}>
          <UserDetailPage />
        </AppLayout>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}

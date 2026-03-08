import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useThemeEffect } from "@/components/shared/useThemeEffect";
import { AppLayout } from "@/components/shared/AppLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { LoginRedirect } from "@/components/shared/LoginRedirect";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import LoginCallbackPage from "@/pages/LoginCallbackPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
});

const ThemeProvider = () => {
  useThemeEffect();
  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider />
        <Toaster position="top-right" richColors />
        <Routes>
          <Route
            path="/login"
            element={
              <LoginRedirect>
                <LoginPage />
              </LoginRedirect>
            }
          />
          <Route path="/login/callback" element={<LoginCallbackPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

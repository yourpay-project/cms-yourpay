import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useThemeEffect } from "@/shared/lib";
import { AppLayout } from "@/widgets/app-layout";
import { LoginRedirect, ProtectedRoute } from "@/features/auth";
import { DashboardPage } from "@/pages/dashboard";
import { LoginPage } from "@/pages/login";
import { LoginCallbackPage } from "@/pages/login-callback";

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


import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface LoginRedirectProps {
  children: React.ReactNode;
}

/**
 * On login page: if already authenticated, redirect to home or from state.
 */
export const LoginRedirect = ({ children }: LoginRedirectProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

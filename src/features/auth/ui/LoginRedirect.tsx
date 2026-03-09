import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../model/use-auth";

interface LoginRedirectProps {
  children: React.ReactNode;
}

export const LoginRedirect = ({ children }: LoginRedirectProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};


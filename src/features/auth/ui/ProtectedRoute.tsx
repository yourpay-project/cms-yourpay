import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../model";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Guard component that only renders its children when the user is authenticated.
 *
 * If there is no active session, it imperatively navigates to `/login` using
 * TanStack Router and renders nothing.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      void navigate({
        to: "/login",
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

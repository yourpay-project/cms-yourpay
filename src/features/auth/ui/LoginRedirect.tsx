import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../model";

export interface LoginRedirectProps {
  children: ReactNode;
}

/**
 * Helper wrapper for the `/login` page.
 *
 * - If the user is already authenticated, immediately navigates to `/`.
 * - Otherwise, renders its children (the actual login UI).
 */
export const LoginRedirect: FC<LoginRedirectProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;
    void navigate({ to: "/", replace: true });
  }, [isAuthenticated, location, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

import type { FC } from "react";
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

import { useThemeEffect } from "@/shared/lib";

/**
 * Applies the global theme effect once (light/dark/system).
 * Kept as a component so it can be mounted from the router root.
 */
export const ThemeProvider: FC = () => {
  useThemeEffect();
  return null;
};

/**
 * Root layout shared by all routes.
 * Includes theme, toast provider, and the active route outlet.
 */
export const RootLayout: FC = () => (
  <>
    <ThemeProvider />
    <Toaster position="top-right" richColors />
    <Outlet />
  </>
);


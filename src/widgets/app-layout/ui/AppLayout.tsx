import type { FC, ReactNode } from "react";
import { cn } from "@/shared/lib";
import { Nav } from "./Nav";
import { MobileSidebar } from "./MobileSidebar";
import { Sidebar } from "./Sidebar";

export interface AppLayoutProps {
  navTitle?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * Top‑level application chrome used for all authenticated routes.
 *
 * Renders:
 * - the top navigation bar,
 * - the permission‑aware sidebar,
 * - and an `Outlet` region where page content is displayed.
 */
export const AppLayout: FC<AppLayoutProps> = ({ navTitle, className, children }) => {
  return (
    <div className={cn("flex h-screen flex-col", className)}>
      <Nav title={navTitle} />
      <div className="flex flex-1 overflow-hidden">
        <MobileSidebar />
        <Sidebar className="hidden md:flex" />
        <main className="flex-1 overflow-auto bg-background p-4">
          {children}
        </main>
      </div>
    </div>
  );
};


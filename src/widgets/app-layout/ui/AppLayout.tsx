import { cn } from "@/shared/lib";
import { Nav } from "./Nav";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  navTitle?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Top‑level application chrome used for all authenticated routes.
 *
 * Renders:
 * - the top navigation bar,
 * - the permission‑aware sidebar,
 * - and an `Outlet` region where page content is displayed.
 */
export const AppLayout = ({ navTitle, className, children }: AppLayoutProps) => {
  return (
    <div className={cn("flex h-screen flex-col", className)}>
      <Nav title={navTitle} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-background p-4">
          {children}
        </main>
      </div>
    </div>
  );
};


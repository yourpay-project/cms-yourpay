import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/shared/Sidebar";
import { Nav } from "@/components/shared/Nav";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  navTitle?: string;
  className?: string;
}

export const AppLayout = ({ navTitle, className }: AppLayoutProps) => {
  return (
    <div className={cn("flex h-screen flex-col", className)}>
      <Nav title={navTitle} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-background p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

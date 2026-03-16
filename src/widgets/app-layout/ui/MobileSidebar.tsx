import type { FC } from "react";
import { cn } from "@/shared/lib";
import { useSidebarStore } from "../model";
import { Sidebar } from "./Sidebar";

export interface MobileSidebarProps {
  className?: string;
}

/**
 * Mobile‑only sidebar overlay.
 *
 * Renders the existing `Sidebar` inside a slide‑in panel with a dimmed
 * backdrop. Visibility is controlled via `useSidebarStore.mobileOpen`.
 */
export const MobileSidebar: FC<MobileSidebarProps> = ({ className }) => {
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  if (!mobileOpen) {
    return null;
  }

  return (
    <div className={cn("fixed inset-0 z-40 flex md:hidden", className)}>
      <button
        type="button"
        aria-label="Close navigation"
        className="absolute inset-0 bg-black/40"
        onClick={() => setMobileOpen(false)}
      />
      <div className="relative z-10 h-full w-64">
        <Sidebar
          forceExpanded
          className="h-full w-64 border-r bg-background shadow-lg"
        />
      </div>
    </div>
  );
};


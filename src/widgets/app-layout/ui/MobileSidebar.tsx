import type { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
 *
 * `AnimatePresence` handles mount/unmount so the exit animation runs before
 * the component is removed from the DOM. Only `opacity` and `x` (translate)
 * are animated — both are GPU-composited and run at 60fps in webviews.
 */
export const MobileSidebar: FC<MobileSidebarProps> = ({ className }) => {
  const mobileOpen = useSidebarStore((s) => s.mobileOpen);
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  return (
    <AnimatePresence>
      {mobileOpen && (
        <div className={cn("fixed inset-0 z-40 flex md:hidden", className)}>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          />
          {/* Slide-in panel — translate X only (GPU composited) */}
          <motion.div
            className="relative z-10 h-full w-64"
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 230, damping: 24 }}
          >
            <Sidebar
              forceExpanded
              className="h-full border-r bg-background shadow-lg"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

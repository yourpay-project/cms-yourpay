import type { FC } from "react";
import { animated, useTransition } from "@react-spring/web";
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
  const transitions = useTransition(mobileOpen, {
    from: { opacity: 0, x: -24 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: -24 },
    config: { tension: 230, friction: 24 },
  });

  return (
    <>
      {transitions((style, item) =>
        item ? (
          <div className={cn("fixed inset-0 z-40 flex md:hidden", className)}>
            <animated.button
              type="button"
              aria-label="Close navigation"
              className="absolute inset-0 bg-black/40"
              style={{ opacity: style.opacity }}
              onClick={() => setMobileOpen(false)}
            />
            <animated.div
              className="relative z-10 h-full w-64"
              style={{ transform: style.x.to((x) => `translate3d(${x}px,0,0)`) }}
            >
              <Sidebar
                forceExpanded
                className="h-full border-r bg-background shadow-lg"
              />
            </animated.div>
          </div>
        ) : null
      )}
    </>
  );
};


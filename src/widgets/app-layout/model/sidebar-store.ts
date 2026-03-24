import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  /**
   * Whether the sidebar is collapsed to icon-only mode.
   */
  collapsed: boolean;
  /**
   * List of pinned nav item paths (`NavItemConfig.to`). Pinned items are
   * rendered in a dedicated "Pinned" section at the top of the sidebar.
   */
  pinned: string[];
  /**
   * Whether the mobile sidebar overlay is currently open.
   */
  mobileOpen: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  togglePinned: (path: string) => void;
}

const MAX_PINNED_ITEMS = 5;

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      pinned: [],
      mobileOpen: false,
      setCollapsed: (collapsed) => set({ collapsed }),
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
      setMobileOpen: (open) => set({ mobileOpen: open }),
      toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
      togglePinned: (path) =>
        set((s) =>
          s.pinned.includes(path)
            ? { pinned: s.pinned.filter((p) => p !== path) }
            : s.pinned.length >= MAX_PINNED_ITEMS
              ? s
              : { pinned: [...s.pinned, path] }
        ),
    }),
    { name: "cms-sidebar" }
  )
);


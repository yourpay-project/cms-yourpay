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
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
  togglePinned: (path: string) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      pinned: [],
      setCollapsed: (collapsed) => set({ collapsed }),
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
      togglePinned: (path) =>
        set((s) =>
          s.pinned.includes(path)
            ? { pinned: s.pinned.filter((p) => p !== path) }
            : { pinned: [...s.pinned, path] }
        ),
    }),
    { name: "cms-sidebar" }
  )
);


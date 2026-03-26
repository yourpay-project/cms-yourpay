import type { FC } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCan } from "@/features/auth";
import { cn } from "@/shared/lib";
import { useSidebarNavigationLogic, useSidebarStore } from "../model";
import { SidebarDashboardSection } from "./sidebar/SidebarDashboardSection";
import { SidebarNavGroups } from "./sidebar/SidebarNavGroups";
import { SidebarPinnedSection } from "./sidebar/SidebarPinnedSection";
import { SidebarSearch } from "./sidebar/SidebarSearch";
import { getSidebarLayoutView } from "./sidebar/sidebar-layout";
import type { SidebarProps } from "./Sidebar.type";

/**
 * Permission‑aware navigation sidebar driven by `navGroups` configuration.
 *
 * - Collapsible via `useSidebarStore` (state is persisted).
 * - Hides items the current user does not have permission to view.
 * - Supports pinning up to 5 frequently used items to a fixed section at the top.
 *
 * Animation uses `framer-motion` `motion.aside` with `animate={{ width }}` so
 * only the `width` transform runs — GPU-friendly for 60fps in webview contexts.
 */
export const Sidebar: FC<SidebarProps> = ({ className, forceExpanded }) => {
  const { can } = useCan();
  const collapsedState = useSidebarStore((s) => s.collapsed);
  let collapsed = collapsedState;
  if (forceExpanded) {
    collapsed = false;
  }
  const pinned = useSidebarStore((s) => s.pinned);
  const togglePinned = useSidebarStore((s) => s.togglePinned);
  const [search, setSearch] = useState("");

  const {
    dashboardItem,
    pinnedItems,
    filteredGroups,
    canShowPinForItem,
    isPinned,
    dividerInsetClass,
  } = useSidebarNavigationLogic({
    collapsed,
    pinned,
    can,
    search,
  });
  const layoutView = getSidebarLayoutView(collapsed);

  return (
    <motion.aside
      animate={{ width: layoutView.width }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className={cn(
        "flex shrink-0 flex-col overflow-hidden border-r border-border bg-card/95 backdrop-blur-md text-card-foreground",
        className
      )}
    >
      <div className="flex flex-1 min-h-0 flex-col pt-3">
        <SidebarDashboardSection
          dashboardItem={dashboardItem}
          collapsed={collapsed}
          dashboardWrapPaddingClass={layoutView.dashboardWrapPaddingClass}
          dividerMarginClass={layoutView.dividerMarginClass}
          onTogglePinned={togglePinned}
        />
        <SidebarPinnedSection
          collapsed={collapsed}
          items={pinnedItems}
          dividerClassName={dividerInsetClass}
          canShowPinForItem={canShowPinForItem}
          isPinned={isPinned}
          onTogglePinned={togglePinned}
        />
        {!collapsed && (
          <SidebarSearch
            value={search}
            onChange={setSearch}
            dividerClassName={dividerInsetClass}
          />
        )}
        <div
          className={cn(
            "relative flex min-h-0 flex-1 flex-col",
            layoutView.navOuterClass
          )}
        >
          <SidebarNavGroups
            collapsed={collapsed}
            navClassName={layoutView.navClassName}
            filteredGroups={filteredGroups}
            isPinned={isPinned}
            canShowPinForItem={canShowPinForItem}
            onTogglePinned={togglePinned}
          />
        </div>
      </div>
    </motion.aside>
  );
};

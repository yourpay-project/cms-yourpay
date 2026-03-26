import type { FC } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCan } from "@/features/auth";
import { cn } from "@/shared/lib";
import { useSidebarNavigationLogic, useSidebarStore } from "../model";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarPinnedSection } from "./sidebar/SidebarPinnedSection";
import { SidebarSearch } from "./sidebar/SidebarSearch";
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
  let sidebarWidth = 256;
  if (collapsed) {
    sidebarWidth = 64;
  }

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

  let dashboardWrapPaddingClass = "px-1";
  if (collapsed) {
    dashboardWrapPaddingClass = "px-2";
  }

  let dividerMarginClass = "mx-1";
  if (collapsed) {
    dividerMarginClass = "mx-2";
  }

  let navOuterClass = "mt-2 mx-0 pt-2 pb-3";
  if (collapsed) {
    navOuterClass = "mt-1 mx-0";
  }

  let navClassName = cn(
    "flex flex-1 min-h-0 flex-col overflow-y-auto overflow-x-auto",
    !collapsed && "sidebar-scroll",
  );
  if (collapsed) {
    navClassName = cn(
      navClassName,
      "gap-1 px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    );
  } else {
    navClassName = cn(navClassName, "gap-3 px-1 pb-4");
  }

  return (
    <motion.aside
      animate={{ width: sidebarWidth }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className={cn(
        "flex shrink-0 flex-col overflow-hidden border-r border-border bg-card/95 backdrop-blur-md text-card-foreground",
        className
      )}
    >
      <div className="flex flex-1 min-h-0 flex-col pt-3">
        {dashboardItem && (
          <div
            className={cn(
              "flex flex-col gap-0.5",
              dashboardWrapPaddingClass
            )}
          >
            <SidebarItem
              item={dashboardItem}
              collapsed={collapsed}
              pinnedItem={false}
              canShowPin={false}
              onTogglePinned={togglePinned}
            />
            <div
              className={cn(
                "my-2 border-t border-border/60",
                dividerMarginClass
              )}
              aria-hidden
            />
          </div>
        )}
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
            navOuterClass
          )}
        >
          <nav className={navClassName}>
            {filteredGroups.map((group, index) => (
              <div
                key={group.group ?? "main"}
                className={cn(
                  "flex flex-col gap-0.5",
                  index > 0 && !collapsed && "mt-1"
                )}
              >
                {!collapsed && group.group && (
                  <p className="mb-1 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {group.group}
                  </p>
                )}
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.to}
                    item={item}
                    collapsed={collapsed}
                    pinnedItem={isPinned(item.to)}
                    canShowPin={canShowPinForItem(item.to)}
                    onTogglePinned={togglePinned}
                  />
                ))}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </motion.aside>
  );
};

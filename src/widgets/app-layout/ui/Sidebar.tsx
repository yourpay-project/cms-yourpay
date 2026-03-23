import type { FC } from "react";
import { useState } from "react";
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
 */
export const Sidebar: FC<SidebarProps> = ({ className, forceExpanded }) => {
  const { can } = useCan();
  const collapsedState = useSidebarStore((s) => s.collapsed);
  const collapsed = forceExpanded ? false : collapsedState;
  const pinned = useSidebarStore((s) => s.pinned);
  const togglePinned = useSidebarStore((s) => s.togglePinned);
  const [search, setSearch] = useState("");

  const {
    dashboardItem,
    pinnedItems,
    filteredGroups,
    canShowPinForItem,
    isPinned,
    sectionInsetClass,
    dividerInsetClass,
  } = useSidebarNavigationLogic({
    collapsed,
    pinned,
    can,
    search,
  });

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-border bg-background/80 backdrop-blur-md text-card-foreground transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex flex-1 min-h-0 flex-col pt-3 pb-4">
        {dashboardItem && (
          <div className={cn("flex flex-col gap-0.5", sectionInsetClass)}>
            <SidebarItem
              item={dashboardItem}
              collapsed={collapsed}
              pinnedItem={false}
              canShowPin={false}
              onTogglePinned={togglePinned}
            />
            <div className={cn("my-2 border-t border-border/60", dividerInsetClass)} aria-hidden />
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
        <nav
          className={cn(
            "sidebar-scroll flex flex-1 min-h-0 flex-col overflow-y-auto overflow-x-hidden",
            collapsed ? "gap-1 px-2" : "gap-5 px-0",
            !collapsed && "mt-0"
          )}
        >
          {filteredGroups.map((group, index) => (
            <div
              key={group.group ?? "main"}
              className={cn(
                "flex flex-col gap-0.5",
                index > 0 && !collapsed && "mt-1"
              )}
            >
              {!collapsed && group.group && (
                <p className="mb-1.5 px-3 py-0.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                  {group.group}
                </p>
              )}
              {collapsed && index > 0 && (
                <div className="mx-2 my-1 border-t border-border" />
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
    </aside>
  );
};


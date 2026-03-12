import { useCallback, useMemo, useState } from "react";
import { useCan } from "@/features/auth";
import { cn } from "@/shared/lib";
import { navGroups, useSidebarStore } from "../model";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarPinnedSection } from "./sidebar/SidebarPinnedSection";
import { SidebarSearch } from "./sidebar/SidebarSearch";

interface SidebarProps {
  className?: string;
}

/**
 * Permission‑aware navigation sidebar driven by `navGroups` configuration.
 *
 * - Collapsible via `useSidebarStore` (state is persisted).
 * - Hides items the current user does not have permission to view.
 * - Supports pinning up to 5 frequently used items to a fixed section at the top.
 */
export const Sidebar = ({ className }: SidebarProps) => {
  const { can } = useCan();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const pinned = useSidebarStore((s) => s.pinned);
  const togglePinned = useSidebarStore((s) => s.togglePinned);
  const [search, setSearch] = useState("");

  const isDashboard = useCallback((path: string) => path === "/", []);
  const sectionInsetClass = collapsed ? "px-2" : "px-0";
  const dividerInsetClass = collapsed ? "mx-2" : "mx-3";

  const isPinned = useCallback(
    (path: string): boolean => !isDashboard(path) && pinned.includes(path),
    [pinned, isDashboard]
  );
  const canPinMore = pinned.length < 5;
  const searchTerm = search.trim().toLowerCase();

  const flatItems = useMemo(
    () => navGroups.flatMap((group) => group.items),
    []
  );

  const dashboardItem = useMemo(
    () => flatItems.find((item) => isDashboard(item.to)),
    [flatItems, isDashboard]
  );

  const pinnedItems = useMemo(
    () =>
      flatItems.filter(
        (item) =>
          !isDashboard(item.to) &&
          isPinned(item.to) &&
          (!item.permission || can(item.permission))
      ),
    [flatItems, isPinned, can, isDashboard]
  );

  const filteredGroups = useMemo(
    () =>
      navGroups
        .map((group) => {
          const items = group.items.filter(
            (item) =>
              !isDashboard(item.to) &&
              !isPinned(item.to) &&
              (!item.permission || can(item.permission)) &&
              (!searchTerm ||
                item.label.toLowerCase().includes(searchTerm))
          );
          return { ...group, items };
        })
        .filter((group) => group.items.length > 0),
    [isPinned, can, searchTerm, isDashboard]
  );

  const canShowPinForItem = useCallback(
    (path: string) => {
      if (isDashboard(path)) return false;
      return isPinned(path) || canPinMore;
    },
    [canPinMore, isDashboard, isPinned]
  );

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


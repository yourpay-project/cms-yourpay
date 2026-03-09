import { useCallback, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pin, PinOff, Search } from "lucide-react";
import { useCan } from "@/features/auth";
import { cn } from "@/shared/lib";
import { navGroups } from "../model/nav-config";
import { useSidebarStore } from "../model/sidebar-store";

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

  const isPinned = useCallback(
    (path: string): boolean => pinned.includes(path),
    [pinned]
  );
  const canPinMore = pinned.length < 5;
  const searchTerm = search.trim().toLowerCase();

  const flatItems = useMemo(
    () => navGroups.flatMap((group) => group.items),
    []
  );

  const pinnedItems = useMemo(
    () =>
      flatItems.filter(
        (item) => isPinned(item.to) && (!item.permission || can(item.permission))
      ),
    [flatItems, isPinned, can]
  );

  const filteredGroups = useMemo(
    () =>
      navGroups
        .map((group) => {
          const items = group.items.filter(
            (item) =>
              !isPinned(item.to) &&
              (!item.permission || can(item.permission)) &&
              (!searchTerm ||
                item.label.toLowerCase().includes(searchTerm))
          );
          return { ...group, items };
        })
        .filter((group) => group.items.length > 0),
    [isPinned, can, searchTerm]
  );

  const renderItem = useCallback(
    (item: (typeof navGroups)[number]["items"][number]) => {
      const pinnedItem = isPinned(item.to);
      const canShowPin = pinnedItem || canPinMore;

      return (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            "group flex items-center rounded-md py-2.5 text-sm font-medium transition-colors [&_svg]:shrink-0",
            collapsed ? "justify-center px-0" : "gap-3 px-3",
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          title={item.label}
        >
          {({ isActive }) => (
            <>
              {item.icon ?? null}
              {!collapsed && (
                <>
                  <span className="min-w-0 truncate">{item.label}</span>
                  {canShowPin && (
                    <button
                      type="button"
                      aria-label={pinnedItem ? "Unpin from top" : "Pin to top"}
                      className={cn(
                        "ml-auto inline-flex h-6 w-6 items-center justify-center rounded transition-opacity hover:bg-background/40",
                        pinnedItem
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100",
                        isActive && "opacity-100"
                      )}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        togglePinned(item.to);
                      }}
                    >
                      {pinnedItem ? (
                        <PinOff className="h-3.5 w-3.5" />
                      ) : (
                        <Pin className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </Link>
      );
    },
    [collapsed, canPinMore, isPinned, togglePinned]
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
        {pinned.length > 0 && (
          <div className={cn("flex flex-col gap-0.5", collapsed ? "px-2" : "pl-3 pr-4")}>
            {!collapsed && (
              <p className="mb-1.5 px-3 py-0.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Pinned
              </p>
            )}
            {pinnedItems.map((item) => renderItem(item))}
            {!collapsed && (
              <div className="my-2 border-t border-border/60" aria-hidden />
            )}
          </div>
        )}
        {!collapsed && (
          <div className={cn("px-3", pinned.length === 0 && "pt-1", pinned.length > 0 && "mt-2")}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search menu..."
                className="h-8 w-full rounded-md border border-border bg-background pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        )}
        <nav
          className={cn(
            "sidebar-scroll flex flex-1 min-h-0 flex-col overflow-y-auto overflow-x-hidden",
            collapsed ? "gap-1 px-2" : "gap-5 pl-3 pr-4",
            !collapsed && "mt-2"
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
              {group.items.map((item) => renderItem(item))}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};


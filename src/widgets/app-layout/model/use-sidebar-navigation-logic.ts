import { useCallback, useMemo } from "react";

import { navGroups } from "./nav-config";
import type { NavGroupConfig, NavItemConfig } from "./nav-types";

export interface UseSidebarNavigationLogicParams {
  collapsed: boolean;
  pinned: string[];
  can: (permission: string) => boolean;
  search: string;
}

export interface UseSidebarNavigationLogicResult {
  dashboardItem: NavItemConfig | undefined;
  pinnedItems: NavItemConfig[];
  filteredGroups: NavGroupConfig[];
  isPinned: (path: string) => boolean;
  canShowPinForItem: (path: string) => boolean;
  sectionInsetClass: string;
  dividerInsetClass: string;
}

/**
 * Derives sidebar navigation items (pinned, filtered, and grouping metadata).
 *
 * Encapsulates RBAC checks and search filtering so the UI component stays lean.
 */
export function useSidebarNavigationLogic(
  params: UseSidebarNavigationLogicParams,
): UseSidebarNavigationLogicResult {
  const { collapsed, pinned, can, search } = params;

  const isDashboard = useCallback((path: string) => path === "/", []);
  const sectionInsetClass = collapsed ? "px-2" : "px-0";
  const dividerInsetClass = collapsed ? "mx-2" : "mx-3";

  const isPinned = useCallback(
    (path: string): boolean => !isDashboard(path) && pinned.includes(path),
    [pinned, isDashboard],
  );
  const canPinMore = pinned.length < 5;
  const searchTerm = search.trim().toLowerCase();

  const flatItems = useMemo<NavItemConfig[]>(
    () => navGroups.flatMap((group) => group.items),
    [],
  );

  const dashboardItem = useMemo(
    () => flatItems.find((item) => isDashboard(item.to)),
    [flatItems, isDashboard],
  );

  const pinnedItems = useMemo<NavItemConfig[]>(
    () =>
      flatItems.filter(
        (item) =>
          !isDashboard(item.to) &&
          isPinned(item.to) &&
          (!item.permission || can(item.permission)),
      ),
    [flatItems, isPinned, can, isDashboard],
  );

  const filteredGroups = useMemo<NavGroupConfig[]>(
    () =>
      navGroups
        .map((group) => {
          const items = group.items.filter(
            (item) =>
              !isDashboard(item.to) &&
              !isPinned(item.to) &&
              (!item.permission || can(item.permission)) &&
              (!searchTerm ||
                item.label.toLowerCase().includes(searchTerm)),
          );

          return { ...group, items };
        })
        .filter((group) => group.items.length > 0),
    [isPinned, can, searchTerm, isDashboard],
  );

  const canShowPinForItem = useCallback(
    (path: string) => {
      if (isDashboard(path)) return false;
      return isPinned(path) || canPinMore;
    },
    [canPinMore, isDashboard, isPinned],
  );

  return {
    dashboardItem,
    pinnedItems,
    filteredGroups,
    isPinned,
    canShowPinForItem,
    sectionInsetClass,
    dividerInsetClass,
  };
}


import type { FC } from "react";
import type { NavItemConfig } from "@/widgets/app-layout";
import { cn } from "@/shared/lib";
import { SidebarItem } from "./SidebarItem";

interface SidebarDashboardSectionProps {
  dashboardItem?: NavItemConfig;
  collapsed: boolean;
  dashboardWrapPaddingClass: string;
  dividerMarginClass: string;
  onTogglePinned: (path: string) => void;
}

/**
 * Renders dashboard shortcut item and its divider.
 *
 * @param props - {@link SidebarDashboardSectionProps}
 * @returns Dashboard section or null when no dashboard item exists.
 */
export const SidebarDashboardSection: FC<SidebarDashboardSectionProps> = ({
  dashboardItem,
  collapsed,
  dashboardWrapPaddingClass,
  dividerMarginClass,
  onTogglePinned,
}) => {
  if (!dashboardItem) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-0.5", dashboardWrapPaddingClass)}>
      <SidebarItem
        item={dashboardItem}
        collapsed={collapsed}
        pinnedItem={false}
        canShowPin={false}
        onTogglePinned={onTogglePinned}
      />
      <div className={cn("my-2 border-t border-border/60", dividerMarginClass)} aria-hidden />
    </div>
  );
};


import type { FC } from "react";
import { cn } from "@/shared/lib";
import type { NavGroupConfig } from "@/widgets/app-layout";
import { SidebarItem } from "./SidebarItem";

interface SidebarNavGroupsProps {
  collapsed: boolean;
  navClassName: string;
  filteredGroups: NavGroupConfig[];
  isPinned: (path: string) => boolean;
  canShowPinForItem: (path: string) => boolean;
  onTogglePinned: (path: string) => void;
}

/**
 * Renders grouped sidebar navigation items.
 *
 * @param props - {@link SidebarNavGroupsProps}
 * @returns Navigation groups list for the sidebar.
 */
export const SidebarNavGroups: FC<SidebarNavGroupsProps> = ({
  collapsed,
  navClassName,
  filteredGroups,
  isPinned,
  canShowPinForItem,
  onTogglePinned,
}) => {
  return (
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
              onTogglePinned={onTogglePinned}
            />
          ))}
        </div>
      ))}
    </nav>
  );
};


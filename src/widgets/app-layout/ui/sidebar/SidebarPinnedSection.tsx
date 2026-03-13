import type { FC } from "react";
import { cn } from "@/shared/lib";
import type { SidebarNavItem } from "./sidebar-types";
import { SidebarItem } from "./SidebarItem";

export interface SidebarPinnedSectionProps {
  collapsed: boolean;
  items: SidebarNavItem[];
  dividerClassName: string;
  canShowPinForItem: (path: string) => boolean;
  isPinned: (path: string) => boolean;
  onTogglePinned: (path: string) => void;
}

export const SidebarPinnedSection: FC<SidebarPinnedSectionProps> = ({
  collapsed,
  items,
  dividerClassName,
  canShowPinForItem,
  isPinned,
  onTogglePinned,
}) => {
  if (items.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-0.5", collapsed ? "px-2" : "px-0")}>
      {!collapsed && (
        <p className="mb-1.5 px-3 py-0.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Pinned
        </p>
      )}
      {items.map((item) => (
        <SidebarItem
          key={item.to}
          item={item}
          collapsed={collapsed}
          pinnedItem={isPinned(item.to)}
          canShowPin={canShowPinForItem(item.to)}
          onTogglePinned={onTogglePinned}
        />
      ))}
      <div className={cn("my-2 border-t border-border/60", dividerClassName)} aria-hidden />
    </div>
  );
};


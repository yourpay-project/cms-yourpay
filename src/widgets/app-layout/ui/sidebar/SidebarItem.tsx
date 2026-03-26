import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@/shared/lib";
import type { SidebarNavItem } from "./sidebar-types";

export interface SidebarItemProps {
  item: SidebarNavItem;
  collapsed: boolean;
  pinnedItem: boolean;
  canShowPin: boolean;
  onTogglePinned: (path: string) => void;
}

/**
 * Single sidebar navigation entry with optional pin/unpin affordance.
 *
 * Keeps active/inactive visuals consistent between expanded and collapsed modes
 * while reserving a fixed right-side action slot in expanded mode.
 */
export const SidebarItem: FC<SidebarItemProps> = ({
  item,
  collapsed,
  pinnedItem,
  canShowPin,
  onTogglePinned,
}) => {
  let layoutClassName = "h-9 gap-3 px-3 text-xs";
  if (collapsed) {
    layoutClassName = "mx-auto h-9 w-9 justify-center p-0 text-[0px]";
  }

  const baseItemClass = cn(
    "group flex items-center rounded-md font-medium transition-colors [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
    layoutClassName
  );

  let activeCollapsedBorderClassName = "";
  if (collapsed) {
    activeCollapsedBorderClassName = "border-l-0";
  }

  let pinAriaLabel = "Pin to top";
  let pinIconNode = <Pin className="h-3.5 w-3.5" />;
  if (pinnedItem) {
    pinAriaLabel = "Unpin from top";
    pinIconNode = <PinOff className="h-3.5 w-3.5" />;
  }

  let pinOpacityClassName = "opacity-0 group-hover:opacity-100";
  if (pinnedItem) {
    pinOpacityClassName = "opacity-100";
  }

  return (
    <Link
      to={item.to}
      inactiveProps={{
        className: cn(
          baseItemClass,
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        ),
      }}
      activeProps={{
        className: cn(
          baseItemClass,
          "border-l-2 border-primary bg-primary/10 text-foreground",
          activeCollapsedBorderClassName
        ),
      }}
      title={item.label}
    >
      {({ isActive }) => (
        <>
          <span className="inline-flex h-4 w-4 items-center justify-center">
            {item.icon ?? null}
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 truncate">{item.label}</span>
              <span className="ml-auto inline-flex h-6 w-6 items-center justify-center">
                {canShowPin && (
                  <button
                    type="button"
                    aria-label={pinAriaLabel}
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded transition-opacity hover:bg-background/40",
                      pinOpacityClassName,
                      isActive && "opacity-100"
                    )}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onTogglePinned(item.to);
                    }}
                  >
                    {pinIconNode}
                  </button>
                )}
              </span>
            </>
          )}
        </>
      )}
    </Link>
  );
};


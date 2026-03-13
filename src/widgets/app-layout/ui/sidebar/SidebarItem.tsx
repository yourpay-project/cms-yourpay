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

export const SidebarItem: FC<SidebarItemProps> = ({
  item,
  collapsed,
  pinnedItem,
  canShowPin,
  onTogglePinned,
}) => {
  const baseItemClass = cn(
    "group flex items-center rounded-md py-2.5 text-sm font-medium transition-colors [&_svg]:shrink-0",
    collapsed ? "justify-center px-0" : "gap-3 px-3"
  );

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
        className: cn(baseItemClass, "bg-accent text-accent-foreground"),
      }}
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
                    pinnedItem ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    isActive && "opacity-100"
                  )}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onTogglePinned(item.to);
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
};


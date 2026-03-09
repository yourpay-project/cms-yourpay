import { NavLink } from "react-router-dom";
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
 */
export const Sidebar = ({ className }: SidebarProps) => {
  const { can } = useCan();
  const collapsed = useSidebarStore((s) => s.collapsed);

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-border bg-background/80 backdrop-blur-md text-card-foreground transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <nav
        className={cn(
          "sidebar-scroll flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-4",
          collapsed ? "gap-1 px-2" : "gap-6 pl-3 pr-4"
        )}
      >
        {navGroups.map((group, index) => {
          const visibleItems = group.items.filter(
            (item) => !item.permission || can(item.permission)
          );
          if (visibleItems.length === 0) return null;

          return (
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
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md py-2.5 text-sm font-medium transition-colors [&_svg]:h-5 [&_svg]:w-5 [&_svg]:shrink-0",
                      collapsed ? "justify-center px-0" : "gap-3 px-3",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  {item.icon ?? null}
                  {!collapsed && (
                    <span className="min-w-0 truncate">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};


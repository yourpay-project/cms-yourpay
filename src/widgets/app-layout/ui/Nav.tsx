import { Loader2, LogOut, PanelLeft, PanelLeftClose, User } from "lucide-react";
import { useAuth, useLogout } from "@/features/auth";
import { cn, useLoadingStore } from "@/shared/lib";
import { ThemeToggle } from "@/shared/ui";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { useSidebarStore } from "../model/sidebar-store";

interface NavProps {
  title?: string;
  className?: string;
}

/**
 * Application top bar: title, global loading indicator, theme toggle and user menu.
 *
 * The nav integrates with:
 * - `useSidebarStore` to toggle the left sidebar,
 * - `useLoadingStore` to show a subtle loading spinner,
 * - and auth hooks for showing the current operator and a logout action.
 */
export const Nav = ({ title = "YourPay CMS", className }: NavProps) => {
  const { user } = useAuth();
  const logout = useLogout();
  const globalLoading = useLoadingStore((s) => s.globalLoading);
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleSidebar = useSidebarStore((s) => s.toggle);

  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
        {globalLoading && (
          <Loader2
            className="h-5 w-5 animate-spin text-muted-foreground"
            aria-hidden
          />
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="User menu">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
};


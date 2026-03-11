import { Search } from "lucide-react";
import { cn } from "@/shared/lib";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
  dividerClassName: string;
}

export const SidebarSearch = ({
  value,
  onChange,
  dividerClassName,
}: SidebarSearchProps) => {
  return (
    <>
      <div className="px-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search menu..."
            className="h-8 w-full rounded-md border border-border bg-background pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
      <div className={cn("my-2 border-t border-border/60", dividerClassName)} aria-hidden />
    </>
  );
};


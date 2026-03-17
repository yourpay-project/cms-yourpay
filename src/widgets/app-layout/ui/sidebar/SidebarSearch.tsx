import type { FC } from "react";
import { cn } from "@/shared/lib";
import { SearchInput } from "@/shared/ui";

export interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
  dividerClassName: string;
}

export const SidebarSearch: FC<SidebarSearchProps> = ({
  value,
  onChange,
  dividerClassName,
}) => {
  return (
    <>
      <div className="px-3">
        <SearchInput
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search menu..."
          containerClassName="relative"
          className="h-8 w-full rounded-md border border-border bg-background pl-7 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      <div className={cn("my-2 border-t border-border/60", dividerClassName)} aria-hidden />
    </>
  );
};


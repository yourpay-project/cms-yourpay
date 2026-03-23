import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib";

/**
 * Props for {@link DropdownFieldTrigger}.
 */
export interface DropdownFieldTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  iconOnly?: boolean;
}

/**
 * Generic field-like trigger with optional leading/trailing slots.
 * Defaults trailing content to ChevronDown and keeps icon clicks within one button hit area.
 * Applies muted hover/focus background for active state while preserving static disabled visuals.
 *
 * @param props - {@link DropdownFieldTriggerProps}
 * @returns Button-shaped trigger for dropdown/select controls
 */
export const DropdownFieldTrigger = forwardRef<HTMLButtonElement, DropdownFieldTriggerProps>(
  ({ label, leading, trailing, iconOnly = false, className, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          iconOnly
            ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-r-md border-l border-border bg-transparent px-0 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
            : "flex h-9 w-full items-center gap-2 rounded-md px-3 text-left text-sm font-normal text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus-visible:bg-muted/50 aria-[expanded=true]:bg-muted/50 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent disabled:focus-visible:bg-transparent",
          className
        )}
        {...props}
      >
        {leading}
        {!iconOnly && label ? <span className="truncate">{label}</span> : null}
        <span className={cn("shrink-0 pointer-events-none", !iconOnly && "ml-auto")}>
          {trailing ?? (
            <ChevronDown
              className="h-4 w-4 text-muted-foreground dark:text-muted-foreground"
              aria-hidden
            />
          )}
        </span>
      </button>
    );
  }
);

DropdownFieldTrigger.displayName = "DropdownFieldTrigger";



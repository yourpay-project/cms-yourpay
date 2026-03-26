import * as React from "react";
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
  /** React 19: ref is a standard prop, no forwardRef needed. */
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * Generic field-like trigger with optional leading/trailing slots.
 * Defaults trailing content to ChevronDown and keeps icon clicks within one button hit area.
 * Applies muted hover/focus background for active state while preserving static disabled visuals.
 *
 * @param props - {@link DropdownFieldTriggerProps}
 * @returns Button-shaped trigger for dropdown/select controls
 */
export const DropdownFieldTrigger: React.FC<DropdownFieldTriggerProps> = ({
  label,
  leading,
  trailing,
  iconOnly = false,
  className,
  type = "button",
  ref,
  ...props
}) => {
  const ROOT_CLASS_BY_MODE = {
    iconOnly:
      "flex h-9 w-9 shrink-0 items-center justify-center rounded-r-md border-l border-border bg-transparent px-0 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none",
    default:
      "flex h-9 w-full items-center gap-2 rounded-md px-3 text-left text-sm font-normal text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus-visible:bg-muted/50 aria-[expanded=true]:bg-muted/50 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent disabled:focus-visible:bg-transparent",
  } as const;

  let rootClassName = ROOT_CLASS_BY_MODE.default;
  if (iconOnly) {
    rootClassName = ROOT_CLASS_BY_MODE.iconOnly;
  }

  let labelNode: ReactNode = null;
  if (!iconOnly && label) {
    labelNode = <span className="truncate">{label}</span>;
  }

  let trailingNode: ReactNode = (
    <ChevronDown
      className="h-4 w-4 text-muted-foreground dark:text-muted-foreground"
      aria-hidden
    />
  );
  if (trailing !== undefined) {
    trailingNode = trailing;
  }

  const trailingWrapClassName = cn(
    "shrink-0 pointer-events-none",
    !iconOnly && "ml-auto"
  );

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        rootClassName,
        className
      )}
      {...props}
    >
      {leading}
      {labelNode}
      <span className={trailingWrapClassName}>{trailingNode}</span>
    </button>
  );
};

DropdownFieldTrigger.displayName = "DropdownFieldTrigger";

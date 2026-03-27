import type { FC } from "react";

import { cn } from "@/shared/lib";
import { Separator } from "./separator";

export interface ContentSeparatorProps {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
  lineClassName?: string;
  labelClassName?: string;
}

/**
 * Generic separator with optional centered label.
 *
 * @param props - Layout and style options for separator.
 * @returns Horizontal or vertical separator line(s) with optional text.
 */
export const ContentSeparator: FC<ContentSeparatorProps> = ({
  orientation = "horizontal",
  label,
  className,
  lineClassName,
  labelClassName,
}) => {
  if (orientation === "vertical") {
    return (
      <div className={cn("inline-flex min-h-6 items-center", className)}>
        <Separator orientation="vertical" className={cn("h-full", lineClassName)} />
        {label != null && label.length > 0 ? (
          <span className={cn("px-2 text-xs text-muted-foreground", labelClassName)}>{label}</span>
        ) : null}
      </div>
    );
  }

  if (label == null || label.length === 0) {
    return (
      <div className={cn("flex items-center", className)}>
        <Separator orientation="horizontal" className={lineClassName} />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Separator orientation="horizontal" className={cn("flex-1", lineClassName)} />
      <span className={cn("px-2 text-xs text-muted-foreground", labelClassName)}>{label}</span>
      <Separator orientation="horizontal" className={cn("flex-1", lineClassName)} />
    </div>
  );
};

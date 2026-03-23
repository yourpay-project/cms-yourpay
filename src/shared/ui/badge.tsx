import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-muted/30 text-foreground",
        success: "border-success/35 bg-success/15 text-success dark:bg-success/20",
        warning: "border-warning/35 bg-warning/15 text-warning dark:bg-warning/20",
        destructive: "border-destructive/35 bg-destructive/15 text-destructive dark:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Semantic badge with soft, low-glare variants for enterprise UI density.
 *
 * @param props - Badge visual variant and native div attributes.
 * @returns Themed badge element.
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

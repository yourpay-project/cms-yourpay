import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@/shared/lib/utils";

interface DropdownMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {
  inset?: boolean;
  ref?: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Label>>;
}

/**
 * Dropdown label row (Radix) for `DropdownMenu`.
 */
export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({
  className,
  inset,
  ref,
  ...props
}) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
);

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> {
  ref?: React.Ref<React.ElementRef<typeof DropdownMenuPrimitive.Separator>>;
}

/**
 * Dropdown separator line (Radix) for `DropdownMenu`.
 */
export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
  className,
  ref,
  ...props
}) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
);

DropdownMenuSeparator.displayName =
  DropdownMenuPrimitive.Separator.displayName;

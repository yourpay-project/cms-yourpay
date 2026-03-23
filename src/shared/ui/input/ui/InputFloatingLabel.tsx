import type { FC } from "react";

import { cn } from "@/shared/lib/utils";

import type { InputFloatingLabelProps } from "./InputFloatingLabel.type";

/**
 * Floating label overlay used by `Input`.
 */
export const InputFloatingLabel: FC<InputFloatingLabelProps> = ({ label, status, size, readOnly, inputId }) => {
  if (!label) return null;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "pointer-events-none absolute left-0 z-20 px-1 text-muted-foreground transition-all duration-200 ease-out bg-background",
        "top-1/2 -translate-y-1/2 text-base",
        "peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-focus:font-medium",
        "peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs",
        status === "error" && "peer-focus:text-destructive",
        size === "sm" && "text-sm peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden",
        readOnly && "bg-muted/20",
      )}
    >
      {label}
    </label>
  );
};


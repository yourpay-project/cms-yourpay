import type { FC } from "react";
import { cn } from "@/shared/lib/utils";

import type { InputHelperTextProps } from "./InputHelperText.type";

/**
 * Renders optional helper text below an `Input`.
 */
export const InputHelperText: FC<InputHelperTextProps> = ({ helperText, helperStatusClass }) => {
  if (!helperText) return null;

  return (
    <p className={cn("px-1 text-[11px] leading-none", helperStatusClass)}>
      {helperText}
    </p>
  );
};


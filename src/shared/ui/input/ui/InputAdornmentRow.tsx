import type { FC } from "react";
import { CircleAlert, CircleCheck, CircleHelp, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import type { InputAdornmentRowProps } from "./InputAdornmentRow.type";

type StatusIconMap = Record<"error" | "warning" | "success", JSX.Element>;

const statusIcon: StatusIconMap = {
  error: <CircleAlert className="h-4 w-4 text-destructive" aria-hidden="true" />,
  warning: <CircleHelp className="h-4 w-4 text-warning" aria-hidden="true" />,
  success: <CircleCheck className="h-4 w-4 text-success" aria-hidden="true" />,
};

/**
 * Renders the clear button + status/end icon row for `Input`.
 */
export const InputAdornmentRow: FC<InputAdornmentRowProps> = ({
  size,
  allowClear,
  hasValue,
  disabled,
  readOnly,
  status,
  endIcon,
  handleClear,
}) => {
  return (
    <div className={cn("flex items-center gap-2", size !== "sm" && "mt-2")}>
      {allowClear && hasValue && !disabled && !readOnly ? (
        <button
          type="button"
          onClick={handleClear}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}

      {endIcon || status ? (
        <span className="shrink-0 text-muted-foreground">{status ? statusIcon[status] : endIcon}</span>
      ) : null}
    </div>
  );
};


import type { FC } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface SelectDropdownClearButtonProps {
  isDisabled: boolean;
  clearButtonSizeClassName: string;
  onClear: () => void;
}

/**
 * Clear button section for {@link SelectDropdown}.
 *
 * @param props - {@link SelectDropdownClearButtonProps}
 * @returns Trailing clear button element.
 */
export const SelectDropdownClearButton: FC<SelectDropdownClearButtonProps> = ({
  isDisabled,
  clearButtonSizeClassName,
  onClear,
}) => {
  return (
    <button
      type="button"
      className={cn(
        "flex shrink-0 items-center justify-center border-l border-input bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
        clearButtonSizeClassName,
        isDisabled &&
          "cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
      )}
      disabled={isDisabled}
      onClick={onClear}
      aria-label="Clear selected option"
    >
      <X className="h-4 w-4" />
    </button>
  );
};


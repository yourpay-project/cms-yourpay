import type { FC } from "react";
import { cn, normalizeCode } from "@/shared/lib";

export interface IdentityAccessMethodItemProps {
  code: string;
  isDefault: boolean;
  selectedCodeSet: Set<string>;
  onToggleCode: (code: string) => void;
}

/**
 * Single identity access method row (checkbox + label).
 *
 * @param props - {@link IdentityAccessMethodItemProps}
 * @returns Checkbox item for identity access selection.
 */
export const IdentityAccessMethodItem: FC<IdentityAccessMethodItemProps> = ({
  code,
  isDefault,
  selectedCodeSet,
  onToggleCode,
}) => {
  const key = normalizeCode(code);
  const isChecked = selectedCodeSet.has(key) || isDefault;
  const isDisabled = isDefault;

  const rowClassName = cn(
    "flex items-start gap-2 rounded-md border border-border/70 px-2.5 py-2",
    isDisabled ? "cursor-not-allowed bg-muted/20" : "cursor-pointer hover:bg-muted/30"
  );

  const inputClassName = cn(
    "mt-0.5 h-4 w-4 accent-primary",
    isDisabled && "pointer-events-none opacity-100"
  );

  return (
    <label className={rowClassName} aria-disabled={isDisabled}>
      <input
        id={`identity-access-method-${key}`}
        name="identity_access_methods"
        value={key}
        type="checkbox"
        checked={isChecked}
        onChange={() => onToggleCode(code)}
        className={inputClassName}
      />
      <span className="text-sm text-foreground">
        {code}
        {isDefault ? " (Default)" : ""}
      </span>
    </label>
  );
};

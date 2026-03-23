import type { FC } from "react";

import { cn } from "@/shared/lib/utils";

import { SelectDropdown, type SelectDropdownProps } from "./select-dropdown";

export interface LabeledSelectFieldProps extends SelectDropdownProps {
  /** Label text rendered above the select trigger. */
  label: string;
  /** Render a red `*` next to the label. */
  required?: boolean;
  /** Wrapper class override (e.g. grid span). */
  containerClassName?: string;
  /** Label class override. */
  labelClassName?: string;
}

/**
 * Generic form row that composes a semantic label and {@link SelectDropdown}.
 *
 * @param props - {@link LabeledSelectFieldProps}
 * @returns Reusable labeled select field with optional required marker
 */
export const LabeledSelectField: FC<LabeledSelectFieldProps> = ({
  label,
  required = false,
  containerClassName,
  labelClassName,
  id,
  ...selectProps
}) => {
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      <label htmlFor={id} className={cn("text-xs font-medium text-muted-foreground", labelClassName)}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </label>
      <SelectDropdown id={id} {...selectProps} />
    </div>
  );
};

import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";

import { SelectDropdown } from "@/shared/ui/select-dropdown";
import type { SelectDropdownProps } from "@/shared/ui/select-dropdown.type";

/**
 * Props for {@link FormSelect}.
 */
export interface FormSelectProps extends Omit<SelectDropdownProps, "value" | "onChange"> {
  name: string;
  label?: string;
  description?: string;
}

/**
 * RHF-aware bridge between form context and shared `SelectDropdown` primitive.
 *
 * @param props - Select dropdown props plus field name, optional label, and description.
 * @returns Connected select field with automatic error rendering and accessibility linkage.
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  description,
  id: providedId,
  ...selectProps
}) => {
  const { control } = useFormContext<FieldValues>();
  const generatedId = React.useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <Controller
        control={control}
        name={name as Path<FieldValues>}
        render={({ field, fieldState: { error } }) => {
          const isError = error != null;

          return (
            <>
              <SelectDropdown
                {...selectProps}
                id={id}
                value={(field.value as SelectDropdownProps["value"]) ?? ""}
                onChange={field.onChange}
                status={isError ? "error" : selectProps.status}
                aria-describedby={isError || description ? descriptionId : undefined}
              />
              {isError ? (
                <p id={descriptionId} className="text-destructive text-sm" aria-live="polite">
                  {error.message}
                </p>
              ) : description ? (
                <p id={descriptionId} className="text-muted-foreground text-sm">
                  {description}
                </p>
              ) : null}
            </>
          );
        }}
      />
    </div>
  );
};

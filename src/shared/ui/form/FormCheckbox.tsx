import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";

/**
 * Props for {@link FormCheckbox}.
 */
export interface FormCheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "type" | "checked" | "onChange"> {
  name: string;
  label: string;
  description?: string;
}

/**
 * RHF-aware boolean checkbox field with inline label/description layout.
 *
 * @param props - Checkbox input props plus required form field name and label.
 * @returns Connected checkbox field with automatic error rendering.
 */
export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  description,
  id: providedId,
  disabled,
  ...checkboxProps
}) => {
  const { control } = useFormContext<FieldValues>();
  const generatedId = React.useId();
  const id = providedId ?? generatedId;

  return (
    <Controller
      control={control}
      name={name as Path<FieldValues>}
      render={({ field, fieldState: { error } }) => {
        const isError = error != null;

        return (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-row items-start space-x-3 space-y-0">
              <input
                {...checkboxProps}
                id={id}
                type="checkbox"
                checked={Boolean(field.value)}
                disabled={disabled}
                onChange={(event) => field.onChange(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              />
              <div className="space-y-1 leading-none">
                <label htmlFor={id} className="cursor-pointer text-sm font-medium text-foreground">
                  {label}
                </label>
                {description && !isError ? (
                  <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
              </div>
            </div>
            {isError ? <p className="text-destructive text-sm">{String(error.message)}</p> : null}
          </div>
        );
      }}
    />
  );
};

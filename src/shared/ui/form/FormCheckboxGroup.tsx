import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";

/**
 * Multi-select checkbox option descriptor for {@link FormCheckboxGroup}.
 */
export interface FormCheckboxGroupOption {
  label: string;
  value: string;
}

/**
 * Props for {@link FormCheckboxGroup}.
 */
export interface FormCheckboxGroupProps {
  name: string;
  label?: string;
  description?: string;
  options: FormCheckboxGroupOption[];
  disabled?: boolean;
}

/**
 * RHF-aware checkbox group for array-based string selections.
 *
 * @param props - Group field metadata and selectable options.
 * @returns Connected checkbox list that updates an array field value.
 */
export const FormCheckboxGroup: React.FC<FormCheckboxGroupProps> = ({
  name,
  label,
  description,
  options,
  disabled = false,
}) => {
  const { control } = useFormContext<FieldValues>();

  return (
    <Controller
      control={control}
      name={name as Path<FieldValues>}
      render={({ field, fieldState: { error } }) => {
        const isError = error != null;
        const currentValue: string[] = Array.isArray(field.value) ? (field.value as string[]) : [];

        return (
          <div className="flex flex-col gap-2">
            {label ? <label className="text-sm font-medium text-foreground">{label}</label> : null}
            <div className="mt-1 flex flex-col gap-3">
              {options.map((option) => {
                const optionId = `${name}-${option.value}`;
                const isChecked = currentValue.includes(option.value);

                return (
                  <div key={option.value} className="flex flex-row items-start space-x-3 space-y-0">
                    <input
                      id={optionId}
                      type="checkbox"
                      checked={isChecked}
                      disabled={disabled}
                      onChange={(event) => {
                        const nextChecked = event.target.checked;
                        const updatedValue = nextChecked
                          ? [...currentValue, option.value]
                          : currentValue.filter((val) => val !== option.value);
                        field.onChange(updatedValue);
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                    />
                    <label
                      htmlFor={optionId}
                      className="cursor-pointer leading-none text-sm font-medium text-foreground"
                    >
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
            {isError ? (
              <p className="text-destructive text-sm">{String(error.message)}</p>
            ) : description ? (
              <p className="text-muted-foreground text-sm">{description}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
};

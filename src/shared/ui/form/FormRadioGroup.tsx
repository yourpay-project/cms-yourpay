import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";

/**
 * Single radio option descriptor for {@link FormRadioGroup}.
 */
export interface FormRadioGroupOption {
  label: string;
  value: string;
  description?: string;
}

/**
 * Props for {@link FormRadioGroup}.
 */
export interface FormRadioGroupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  name: string;
  label?: string;
  description?: string;
  options: FormRadioGroupOption[];
  disabled?: boolean;
}

/**
 * RHF-aware radio group wrapper for single-selection string fields.
 *
 * @param props - Group metadata, options, and shared container props.
 * @returns Connected radio group with integrated validation messaging.
 */
export const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  name,
  label,
  description,
  options,
  disabled = false,
  className,
  ...radioGroupProps
}) => {
  const { control } = useFormContext<FieldValues>();

  return (
    <Controller
      control={control}
      name={name as Path<FieldValues>}
      render={({ field, fieldState: { error } }) => {
        const isError = error != null;

        return (
          <div className="flex flex-col gap-2">
            {label ? <label className="text-sm font-medium text-foreground">{label}</label> : null}
            <div {...radioGroupProps} className={["mt-1 flex flex-col gap-3", className].filter(Boolean).join(" ")}>
              {options.map((option) => {
                const optionId = `${name}-${option.value}`;
                return (
                  <div key={option.value} className="flex items-start space-x-3 space-y-0">
                    <input
                      id={optionId}
                      type="radio"
                      name={name}
                      value={option.value}
                      checked={(field.value as string | undefined) === option.value}
                      disabled={disabled}
                      onChange={(event) => field.onChange(event.target.value)}
                      className="mt-0.5 h-4 w-4 border-border accent-primary"
                    />
                    <div className="space-y-1 leading-none">
                      <label htmlFor={optionId} className="cursor-pointer text-sm font-medium text-foreground">
                        {option.label}
                      </label>
                      {option.description ? (
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      ) : null}
                    </div>
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

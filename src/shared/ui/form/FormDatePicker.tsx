import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";

import { DatePicker } from "@/shared/ui/date-picker";
import type { DatePickerProps } from "@/shared/ui/date-picker";

/**
 * Props for {@link FormDatePicker}.
 */
export interface FormDatePickerProps extends Omit<DatePickerProps, "value" | "onChange"> {
  name: string;
  description?: string;
}

/**
 * RHF-aware single-date wrapper for the shared `DatePicker` primitive.
 *
 * @param props - Date picker props plus bound form field name and optional description.
 * @returns Connected date picker with contextual helper/error message below the control.
 */
export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  description,
  ...datePickerProps
}) => {
  const { control } = useFormContext<FieldValues>();

  return (
    <Controller
      control={control}
      name={name as Path<FieldValues>}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col gap-1.5">
          <DatePicker
            {...datePickerProps}
            value={(field.value as DatePickerProps["value"]) ?? ""}
            onChange={field.onChange}
          />
          {error?.message ? (
            <p className="text-destructive text-sm">{error.message}</p>
          ) : description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
      )}
    />
  );
};

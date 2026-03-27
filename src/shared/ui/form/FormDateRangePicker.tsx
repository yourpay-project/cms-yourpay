import * as React from "react";
import { useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";

import {
  DateRangePicker as DateRangePickerWithPresets,
  type DateRangePickerProps as DateRangePickerWithPresetsProps,
} from "@/shared/ui/date-range-picker";

/**
 * Props for {@link FormDateRangePicker}.
 */
export interface FormDateRangePickerProps
  extends Omit<DateRangePickerWithPresetsProps, "from" | "to" | "onRangeChange"> {
  fromName: string;
  toName: string;
  description?: string;
}

/**
 * RHF-aware date range wrapper that binds two fields (`from` and `to`) to one control.
 *
 * @param props - Date range picker props with source and destination field names.
 * @returns Connected date range picker with combined error/description output.
 */
export const FormDateRangePicker: React.FC<FormDateRangePickerProps> = ({
  fromName,
  toName,
  description,
  ...dateRangePickerProps
}) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<FieldValues>();

  const fromValue = watch(fromName as Path<FieldValues>);
  const toValue = watch(toName as Path<FieldValues>);
  const fromErrorMessage = errors[fromName]?.message;
  const toErrorMessage = errors[toName]?.message;
  const errorMsg = fromErrorMessage || toErrorMessage;

  return (
    <div className="flex flex-col gap-1.5">
      <DateRangePickerWithPresets
        {...dateRangePickerProps}
        from={(fromValue as string) ?? ""}
        to={(toValue as string) ?? ""}
        onRangeChange={(from, to) => {
          setValue(fromName as Path<FieldValues>, from, { shouldValidate: true });
          setValue(toName as Path<FieldValues>, to, { shouldValidate: true });
        }}
      />
      {errorMsg ? (
        <p className="text-destructive text-sm">{String(errorMsg)}</p>
      ) : description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
  );
};

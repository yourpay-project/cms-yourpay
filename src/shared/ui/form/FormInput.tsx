import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";

import { Input } from "@/shared/ui/input";
import type { InputProps } from "@/shared/ui/input";

/**
 * Props for {@link FormInput}.
 */
export interface FormInputProps
  extends Omit<InputProps, "value" | "onChange" | "status" | "helperText" | "onBlur"> {
  name: string;
  description?: string;
  status?: InputProps["status"];
}

/**
 * RHF-aware bridge between form context and shared `Input` primitive.
 *
 * @param props - Input props plus form field name and optional helper description.
 * @returns Connected input element with automatic error-to-status mapping.
 */
export const FormInput: React.FC<FormInputProps> = ({
  name,
  description,
  status,
  ...inputProps
}) => {
  const { control } = useFormContext<FieldValues>();

  return (
    <Controller
      control={control}
      name={name as Path<FieldValues>}
      render={({ field, fieldState }) => {
        const hasError = Boolean(fieldState.error?.message);

        return (
          <Input
            {...inputProps}
            ref={field.ref}
            value={(field.value as InputProps["value"]) ?? ""}
            onBlur={field.onBlur}
            onChange={field.onChange}
            status={hasError ? "error" : status}
            helperText={hasError ? fieldState.error?.message : description}
          />
        );
      }}
    />
  );
};

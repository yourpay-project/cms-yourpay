import type { FC } from "react";
import { DatePicker } from "@/shared/ui";

import type { KycBirthDateFieldProps } from "./KycBirthDateField.type";

/**
 * Birth date field (dropdown calendar + clear button).
 */
export const KycBirthDateField: FC<KycBirthDateFieldProps> = ({ value, onChange, locked, isEditable }) => {
  const disabled = locked || !isEditable;

  return (
    <DatePicker
      label="Birth Date"
      value={value ?? ""}
      onChange={(next) => {
        if (!next) onChange(undefined);
        else onChange(next);
      }}
      disabled={disabled}
      allowClear={!disabled}
      displayFormat="dd/MM/yyyy"
      className="w-full"
    />
  );
};


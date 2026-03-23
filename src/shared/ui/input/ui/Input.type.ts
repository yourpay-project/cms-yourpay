import type * as React from "react";

import type { InputSizeProps } from "./input-variants";

export type InputStatus = "error" | "warning" | "success";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix" | "size">,
    InputSizeProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  allowClear?: boolean;
  status?: InputStatus;
  helperText?: React.ReactNode;
  label?: React.ReactNode;
}


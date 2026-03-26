import type * as React from "react";

import type { InputStatus } from "./Input.type";
import type { InputSizeProps } from "./input-variants";

/**
 * Props for internal `InputMain` (visual input shell).
 */
export interface InputMainProps {
  size?: InputSizeProps["size"];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  allowClear?: boolean;
  status?: InputStatus;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  tabIndex?: number;

  innerRef: React.RefObject<HTMLInputElement | null>;
  currentValue: string | number;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (event: React.FocusEvent<HTMLInputElement>) => void;

  inputRestProps: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onFocus" | "value" | "readOnly" | "disabled">;
  hasValue: boolean;
  handleClear: () => void;
}


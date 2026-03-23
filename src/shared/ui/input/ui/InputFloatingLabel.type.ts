import type * as React from "react";

import type { InputStatus } from "./Input.type";

import type { InputSizeProps } from "./input-variants";

/**
 * Props for `InputFloatingLabel`.
 */
export interface InputFloatingLabelProps {
  label?: React.ReactNode;
  status?: InputStatus;
  size?: InputSizeProps["size"];
  readOnly?: boolean;
  inputId?: string;
}


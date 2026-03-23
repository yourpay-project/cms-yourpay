import type * as React from "react";

import type { InputStatus } from "./Input.type";
import type { InputSizeProps } from "./input-variants";

/**
 * Props for `InputAdornmentRow`.
 */
export interface InputAdornmentRowProps {
  size?: InputSizeProps["size"];
  allowClear?: boolean;
  hasValue: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  status?: InputStatus;
  endIcon?: React.ReactNode;
  handleClear: () => void;
}


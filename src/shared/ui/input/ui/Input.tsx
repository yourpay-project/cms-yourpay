import * as React from "react";
import { useInputValue } from "./use-input-value";
import type { InputProps } from "./Input.type";
import { InputHelperText } from "./InputHelperText";
import { InputMain } from "./InputMain";

const statusTextClass: Record<NonNullable<InputProps["status"]>, string> = {
  error: "text-destructive",
  warning: "text-warning",
  success: "text-success",
};

/**
 * Floating label text input with CMS-friendly sizing, status, and adornments.
 * In React 19, `ref` is passed as a standard prop — no `forwardRef` needed.
 */
export const Input: React.FC<InputProps> = ({
  size,
  startIcon,
  endIcon,
  prefix,
  addonBefore,
  addonAfter,
  allowClear,
  status,
  helperText,
  className,
  disabled,
  value,
  defaultValue,
  onChange,
  onFocus,
  tabIndex,
  label,
  readOnly,
  ref,
  ...rest
}) => {
  const { innerRef, currentValue, handleChange, handleClear, hasValue } = useInputValue({
    value: value as string | number | undefined,
    defaultValue: defaultValue as string | number | undefined,
    disabled,
    readOnly,
    onChange,
  });

  // Bridge the external ref to the internal DOM ref maintained by useInputValue.
  React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

  let helperStatusClass = "text-muted-foreground";
  if (status) {
    helperStatusClass = statusTextClass[status];
  }
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (readOnly) {
      event.currentTarget.blur();
      return;
    }
    onFocus?.(event);
  };

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-1.5">
      <InputMain
        size={size}
        startIcon={startIcon}
        endIcon={endIcon}
        prefix={prefix}
        addonBefore={addonBefore}
        addonAfter={addonAfter}
        allowClear={allowClear}
        status={status}
        label={label}
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        tabIndex={tabIndex}
        innerRef={innerRef}
        currentValue={currentValue}
        handleChange={handleChange}
        handleFocus={handleFocus}
        inputRestProps={rest}
        hasValue={hasValue}
        handleClear={handleClear}
      />

      <InputHelperText helperText={helperText} helperStatusClass={helperStatusClass} />
    </div>
  );
};

Input.displayName = "Input";
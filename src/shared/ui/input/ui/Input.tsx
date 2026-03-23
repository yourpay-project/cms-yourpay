import * as React from "react";
import { useInputValue } from "./use-input-value";
import type { InputProps, InputStatus } from "./Input.type";
import { InputHelperText } from "./InputHelperText";
import { InputMain } from "./InputMain";

const statusTextClass: Record<InputStatus, string> = {
  error: "text-destructive",
  warning: "text-warning",
  success: "text-success",
};

/**
 * Floating label text input with CMS-friendly sizing, status, and adornments.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
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
      ...rest
    },
    ref,
  ) => {
    const { innerRef, currentValue, handleChange, handleClear, hasValue } = useInputValue({
      value: value as string | number | undefined,
      defaultValue: defaultValue as string | number | undefined,
      disabled,
      readOnly,
      onChange,
    });

    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    const helperStatusClass = status ? statusTextClass[status] : "text-muted-foreground";
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
  },
);

Input.displayName = "Input";
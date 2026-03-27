import * as React from "react";

interface UseInputValueOptions {
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface UseInputValueResult {
  innerRef: React.RefObject<HTMLInputElement | null>;
  currentValue: string | number;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  hasValue: boolean;
}

/**
 * Custom hook to handle controlled and uncontrolled input value states,
 * including logic for clearing the input field.
 *
 * This hook simplifies the process of syncing internal component state with
 * external parent state, managing edge cases where the input is disabled
 * or read-only to prevent unintended value mutations.
 *
 * @param options - Configuration options for the input value state.
 * @param options.value - The controlled external value.
 * @param options.defaultValue - The initial uncontrolled value.
 * @param options.disabled - Whether the input is visually and functionally disabled.
 * @param options.readOnly - Whether the input is functional but read-only.
 * @param options.onChange - External change handler to push state up.
 *
 * @returns The resolved current value, change/clear handlers, and a reference 
 *          to the underlying input element for DOM focus management.
 */
export function useInputValue(options: UseInputValueOptions): UseInputValueResult {
  const { value, defaultValue, disabled, readOnly, onChange } = options;

  const innerRef = React.useRef<HTMLInputElement | null>(null);
  const isControlled = value !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | number>(
    (defaultValue as string | number | undefined) ?? "",
  );

  let currentValue: string | number = uncontrolledValue;
  if (isControlled) {
    currentValue = value as string | number;
    if (currentValue === null || currentValue === undefined) {
      currentValue = "";
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    if (!isControlled) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleClear = () => {
    if (disabled || readOnly) return;

    if (isControlled) {
      onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setUncontrolledValue("");
    }

    innerRef.current?.focus();
  };

  const hasValue =
    currentValue !== "" && currentValue !== null && currentValue !== undefined;

  return {
    innerRef,
    currentValue,
    handleChange,
    handleClear,
    hasValue,
  };
}


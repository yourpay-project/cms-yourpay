import * as React from "react";

interface UseInputValueOptions {
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface UseInputValueResult {
  innerRef: React.RefObject<HTMLInputElement>;
  currentValue: string | number;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear: () => void;
  hasValue: boolean;
}

/**
 * Handles controlled and uncontrolled input value state, including clear logic.
 */
export function useInputValue(options: UseInputValueOptions): UseInputValueResult {
  const { value, defaultValue, disabled, onChange } = options;

  const innerRef = React.useRef<HTMLInputElement | null>(null);
  const isControlled = value !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | number>(
    (defaultValue as string | number | undefined) ?? "",
  );

  const currentValue = (isControlled ? value : uncontrolledValue) ?? "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setUncontrolledValue(event.target.value);
    }
    onChange?.(event);
  };

  const handleClear = () => {
    if (disabled) return;

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


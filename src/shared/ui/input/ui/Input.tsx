import * as React from "react";
import { CircleAlert, CircleCheck, CircleHelp, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { inputVariants, type InputSizeProps } from "./input-variants";
import { useInputValue } from "./use-input-value";

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

const statusIcon: Record<InputStatus, React.ReactNode> = {
  error: <CircleAlert className="h-4 w-4 text-destructive" aria-hidden="true" />,
  warning: <CircleHelp className="h-4 w-4 text-warning" aria-hidden="true" />,
  success: <CircleCheck className="h-4 w-4 text-success" aria-hidden="true" />,
};

const statusBorderClass: Record<InputStatus, string> = {
  error: "border-destructive focus-within:border-destructive focus-within:ring-destructive",
  warning: "border-warning focus-within:border-warning focus-within:ring-warning",
  success: "border-success focus-within:border-success focus-within:ring-success",
};

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
      label,
      ...rest
    },
    ref,
  ) => {
    const { innerRef, currentValue, handleChange, handleClear, hasValue } = useInputValue({
      value: value as string | number | undefined,
      defaultValue: defaultValue as string | number | undefined,
      disabled,
      onChange,
    });

    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    const helperStatusClass = status ? statusTextClass[status] : "text-muted-foreground";

    return (
      <div className="flex flex-col gap-1.5">
        <div className="group/input flex w-full items-stretch text-sm">
          {addonBefore && (
            <div className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-muted-foreground">
              {addonBefore}
            </div>
          )}

          <div
            className={cn(
              inputVariants({ size }),
              !addonBefore && "rounded-l-md",
              !addonAfter && "rounded-r-md",
              status && statusBorderClass[status],
              disabled && "cursor-not-allowed opacity-50",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0",
              "bg-background"
            )}
          >
            {startIcon && (
              <span className={cn("inline-flex shrink-0 items-center justify-center text-muted-foreground", size !== "sm" && "mt-2")}>
                {startIcon}
              </span>
            )}

            <div className="relative flex h-full flex-1 items-center">
              {prefix && (
                <span
                  className={cn(
                    "mr-1 text-muted-foreground transition-opacity duration-200",
                    size !== "sm" && "mt-4",
                    "opacity-0 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:opacity-100",
                    (!label || size === "sm") && "mt-0 opacity-100",
                  )}
                >
                  {prefix}
                </span>
              )}

              <input
                ref={innerRef}
                className={cn(
                  "peer h-full w-full bg-transparent text-sm text-foreground placeholder-transparent",
                  "border-none p-0 outline-none focus:ring-0",
                  size !== "sm" && label && "pt-4",
                  className,
                  "[&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--background))_inset]",
                  "[&:-webkit-autofill]:[transition:background-color_86400s_ease-in-out_0s]",
                  "[&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]"
                )}
                disabled={disabled}
                value={currentValue}
                onChange={handleChange}
                placeholder=" "
                {...rest}
              />

              {label && (
                <label
                  className={cn(
                    "pointer-events-none absolute left-0 z-20 px-1 text-muted-foreground transition-all duration-200 ease-out bg-background",
                    "top-1/2 -translate-y-1/2 text-base",
                    "peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary peer-focus:font-medium",
                    "peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs",
                    status === "error" && "peer-focus:text-destructive",
                    size === "sm" && "text-sm peer-focus:hidden peer-[:not(:placeholder-shown)]:hidden"
                  )}
                >
                  {label}
                </label>
              )}
            </div>

            <div className={cn("flex items-center gap-2", size !== "sm" && "mt-2")}>
              {allowClear && hasValue && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              {(endIcon || status) && (
                <span className="shrink-0 text-muted-foreground">
                  {status ? statusIcon[status] : endIcon}
                </span>
              )}
            </div>
          </div>

          {addonAfter && (
            <div className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-muted-foreground">
              {addonAfter}
            </div>
          )}
        </div>

        {helperText && (
          <p className={cn("px-1 text-[11px] leading-none", helperStatusClass)}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
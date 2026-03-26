import type { FC } from "react";
import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { inputVariants } from "./input-variants";

import { InputAdornmentRow } from "./InputAdornmentRow";
import { InputFloatingLabel } from "./InputFloatingLabel";

import type { InputMainProps } from "./InputMain.type";

const statusBorderClass = {
  error: "border-destructive focus-within:border-destructive focus-within:ring-destructive",
  warning: "border-warning focus-within:border-warning focus-within:ring-warning",
  success: "border-success focus-within:border-success focus-within:ring-success",
} satisfies Record<string, string>;

/**
 * Visual input shell used by `Input` (addons + floating label + adornments).
 */
export const InputMain: FC<InputMainProps> = ({
  size,
  startIcon,
  endIcon,
  prefix,
  addonBefore,
  addonAfter,
  allowClear,
  status,
  label,
  className,
  disabled,
  readOnly,
  tabIndex,
  innerRef,
  currentValue,
  handleChange,
  handleFocus,
  inputRestProps,
  hasValue,
  handleClear,
}) => {
  const generatedId = React.useId();
  const { id: providedId, ...restInputProps } = inputRestProps;
  const inputId = providedId ?? generatedId;

  return (
    <div className="group/input flex w-full min-w-0 items-stretch text-sm">
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
          status ? statusBorderClass[status] : undefined,
          disabled && "cursor-not-allowed opacity-50",
          readOnly && "cursor-not-allowed",
          !readOnly && "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0",
          // Match other "locked" controls (SelectDropdown/DatePicker) visual density.
          readOnly ? "bg-muted/35" : "bg-background",
        )}
      >
        {startIcon && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center justify-center text-muted-foreground",
              size !== "sm" && "mt-2",
            )}
          >
            {startIcon}
          </span>
        )}

        <div className="relative flex h-full min-w-0 flex-1 items-center">
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
              readOnly && "cursor-default pointer-events-none",
              readOnly && "text-muted-foreground",
              size !== "sm" && label && "pt-4",
              className,
              "[&:-webkit-autofill]:shadow-[0_0_0_1000px_hsl(var(--background))_inset]",
              "[&:-webkit-autofill]:[transition:background-color_86400s_ease-in-out_0s]",
              "[&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))]",
            )}
            disabled={disabled}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : tabIndex}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder=" "
            id={inputId}
            {...restInputProps}
          />

          <InputFloatingLabel label={label} status={status} size={size} readOnly={readOnly} inputId={inputId} />
        </div>

        <InputAdornmentRow
          size={size}
          allowClear={allowClear}
          hasValue={hasValue}
          disabled={disabled}
          readOnly={readOnly}
          status={status}
          endIcon={endIcon}
          handleClear={handleClear}
        />
      </div>

      {addonAfter && (
        <div className="inline-flex items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-muted-foreground">
          {addonAfter}
        </div>
      )}
    </div>
  );
};


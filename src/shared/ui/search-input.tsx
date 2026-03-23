import type { FC, InputHTMLAttributes } from "react";
import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/shared/lib/utils";

/**
 * Props for {@link SearchInput}, extending the standard HTML input props.
 *
 * @property containerClassName Optional className for the outer wrapper, useful for width and alignment.
 */
export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

/**
 * Generic search input used across list pages.
 *
 * Renders an inline search icon on the left and forwards all standard input props,
 * so it can be used as a drop‑in replacement for `<input type="search" />`.
 *
 * @param props Standard input props plus {@link SearchInputProps.containerClassName}.
 * @returns A styled search input component.
 */
export const SearchInput: FC<SearchInputProps> = ({
  containerClassName,
  className,
  ...props
}) => {
  const generatedId = React.useId();

  const { id: providedId, placeholder, ...restProps } = props;
  const resolvedId = providedId ?? generatedId;

  const ariaLabelFromProps = restProps["aria-label"];
  const resolvedAriaLabel =
    ariaLabelFromProps ??
    (typeof placeholder === "string" && placeholder.trim().length > 0 ? placeholder : undefined);

  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        id={resolvedId}
        aria-label={resolvedAriaLabel}
        className={cn(
          "h-9 w-full rounded-md border border-input bg-background/80 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring",
          className,
        )}
        {...restProps}
      />
    </div>
  );
};


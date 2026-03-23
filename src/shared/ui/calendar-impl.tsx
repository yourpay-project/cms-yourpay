import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/shared/lib/utils";
import { Button, type ButtonProps } from "./button";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { getCalendarClassNames } from "./calendar-class-names";
import { CalendarDayButton } from "./calendar-day-button";

/** Props for {@link Calendar}; extends react-day-picker DayPicker. */
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
};

/**
 * shadcn-style Calendar (react-day-picker). Use `captionLayout="dropdown"` for month/year dropdowns.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background p-2 [--cell-radius:var(--radius)] [--cell-size:2rem] [&[data-slot=card-content]]:bg-transparent [&[data-slot=popover-content]]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={getCalendarClassNames({
        defaultClassNames,
        captionLayout: String(captionLayout),
        buttonVariant: buttonVariant as NonNullable<ButtonProps["variant"]>,
        showWeekNumber: Boolean(props.showWeekNumber),
        userClassNames: classNames as Record<string, string> | undefined,
      }) as CalendarProps["classNames"]}
      components={{
        Root: ({ className: rootClassName, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(rootClassName)}
            {...rootProps}
          />
        ),
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", chevronClassName)} {...chevronProps} />
            );
          }
          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", chevronClassName)} {...chevronProps} />
            );
          }
          return <ChevronDownIcon className={cn("size-4", chevronClassName)} {...chevronProps} />;
        },
        DayButton: (dayButtonProps) => (
          <CalendarDayButton locale={locale} {...dayButtonProps} />
        ),
        WeekNumber: ({ children, ...weekProps }) => (
          <td {...weekProps}>
            <div className="flex h-[var(--cell-size)] w-[var(--cell-size)] items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  );
}

export type { DateRange } from "react-day-picker";


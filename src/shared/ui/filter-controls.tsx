import { type FC } from "react";
import { Button } from "./button";
import { FilterSelectWithClear, type FilterSelectOption } from "./filter-select-with-clear";
import { cn } from "@/shared/lib/utils";

/** Supported backend-driven filter control kinds. */
export type FilterType = "control" | "options" | "date_range";

/** Normalized filter field consumed by shared filter UI controls. */
export interface FilterField {
  key: string;
  label: string;
  type: FilterType;
  options: readonly FilterSelectOption[];
  allValue: string;
}

/** Props for rendering button-based filter controls (e.g. country tabs). */
export interface FilterControlButtonsProps {
  fields: readonly FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  uppercaseLabels?: boolean;
  className?: string;
}

/**
 * Renders control-type filters as a row of buttons, with active state derived
 * from `values[field.key]`.
 */
export const FilterControlButtons: FC<FilterControlButtonsProps> = ({
  fields,
  values,
  onChange,
  uppercaseLabels = false,
  className,
}) => {
  if (fields.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {fields.map((field) => (
        <div key={field.key} className="flex flex-wrap items-center gap-1">
          {field.options.map((option) => (
            <Button
              key={`${field.key}:${option.value || "__all__"}`}
              type="button"
              size="sm"
              variant={(values[field.key] ?? field.allValue) === option.value ? "default" : "outline"}
              onClick={() => onChange(field.key, option.value)}
            >
              {uppercaseLabels ? option.label.toUpperCase() : option.label}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
};

/** Props for rendering select-based option filters inside a grid layout. */
export interface FilterOptionsGridProps {
  fields: readonly FilterField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

/** Renders option-type filters using `FilterSelectWithClear` in a responsive grid. */
export const FilterOptionsGrid: FC<FilterOptionsGridProps> = ({ fields, values, onChange }) => {
  if (fields.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
      {fields.map((field) => (
        <FilterSelectWithClear
          key={field.key}
          label={field.label}
          value={values[field.key] ?? field.allValue}
          options={field.options}
          onChange={(value) => onChange(field.key, value)}
          onClear={() => onChange(field.key, field.allValue)}
          allValue={field.allValue}
        />
      ))}
    </div>
  );
};

import type { FC } from "react";
import type { FilterField } from "@/shared/ui";
import { DateRangePicker, FilterSelectWithClear } from "@/shared/ui";
import type { TransactionFilterDefinition } from "@/entities/transaction";
import { TRANSACTION_DATE_RANGE_PRESETS } from "../lib/date-range-presets";

export interface TransactionsFiltersGridProps {
  optionsFilterFields: readonly FilterField[];
  selectedFilterValues: Record<string, string>;
  handleChangeFilter: (key: string, value: string) => void;
  dateRangeDefinitions: readonly TransactionFilterDefinition[];
  dateRanges: Record<string, { from: string; to: string; presetLabel: string | null }>;
  setDateRange: (key: string, from: string, to: string, presetLabel?: string | null) => void;
}

/**
 * Render item model for transactions filter grid.
 * Keeps options and date-range filters in one loop + switch.
 */
type TransactionsGridItem =
  | { type: "options"; key: string; field: FilterField }
  | { type: "date_range"; key: string; definition: TransactionFilterDefinition };

interface TransactionsGridItemRowProps {
  item: TransactionsGridItem;
  selectedFilterValues: Record<string, string>;
  dateRanges: Record<string, { from: string; to: string; presetLabel: string | null }>;
  handleChangeFilter: (key: string, value: string) => void;
  setDateRange: (key: string, from: string, to: string, presetLabel?: string | null) => void;
}

const TransactionsGridItemRow: FC<TransactionsGridItemRowProps> = ({
  item,
  selectedFilterValues,
  dateRanges,
  handleChangeFilter,
  setDateRange,
}) => {
  if (item.type === "options") {
    const { field } = item;
    return (
      <FilterSelectWithClear
        label={field.label}
        value={selectedFilterValues[field.key] ?? field.allValue}
        options={field.options}
        onChange={(value) => handleChangeFilter(field.key, value)}
        onClear={() => handleChangeFilter(field.key, field.allValue)}
        allValue={field.allValue}
      />
    );
  }

  const { definition } = item;
  const slice = dateRanges[definition.key];
  const from = slice?.from ?? "";
  const to = slice?.to ?? "";
  const presetLabel = slice?.presetLabel ?? null;
  const label = definition.name?.trim() ? definition.name : definition.key;

  return (
    <DateRangePicker
      label={label}
      from={from}
      to={to}
      presetLabel={presetLabel}
      presets={TRANSACTION_DATE_RANGE_PRESETS}
      onRangeChange={(nextFrom, nextTo, nextPreset) => {
        setDateRange(definition.key, nextFrom, nextTo, nextPreset ?? null);
      }}
    />
  );
};

/**
 * SDUI-driven filter grid: option selects from API metadata + `date_range` fields.
 */
export const TransactionsFiltersGrid: FC<TransactionsFiltersGridProps> = ({
  optionsFilterFields,
  selectedFilterValues,
  handleChangeFilter,
  dateRangeDefinitions,
  dateRanges,
  setDateRange,
}) => {
  const hasAny =
    optionsFilterFields.length > 0 || dateRangeDefinitions.length > 0;
  if (!hasAny) {
    return null;
  }

  const gridItems: TransactionsGridItem[] = [
    ...optionsFilterFields.map((field) => ({
      type: "options" as const,
      key: `options:${field.key}`,
      field,
    })),
    ...dateRangeDefinitions.map((definition) => ({
      type: "date_range" as const,
      key: `date_range:${definition.key}`,
      definition,
    })),
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {gridItems.map((item) => (
        <TransactionsGridItemRow
          key={item.key}
          item={item}
          selectedFilterValues={selectedFilterValues}
          dateRanges={dateRanges}
          handleChangeFilter={handleChangeFilter}
          setDateRange={setDateRange}
        />
      ))}
    </div>
  );
};

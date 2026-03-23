import type { FeeCurrencyFilter } from "./use-fee-config-filters";

export const FEE_CONFIG_CURRENCY_OPTIONS: Array<{ label: string; value: FeeCurrencyFilter }> = [
  { label: "All", value: "ALL" },
  { label: "IDR", value: "IDR" },
  { label: "SGD", value: "SGD" },
  { label: "HKD", value: "HKD" },
  { label: "NTD", value: "NTD" },
];


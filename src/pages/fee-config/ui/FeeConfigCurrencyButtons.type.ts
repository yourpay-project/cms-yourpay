import type { FeeCurrencyFilter } from "../model/use-fee-config-filters";

/**
 * Props for `FeeConfigCurrencyButtons`.
 */
export interface FeeConfigCurrencyButtonsProps {
  currency: FeeCurrencyFilter;
  onSelectCurrency: (value: FeeCurrencyFilter) => void;
  resetPageIndex: () => void;
}


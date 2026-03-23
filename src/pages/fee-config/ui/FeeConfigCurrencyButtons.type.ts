import type { FeeCurrencyFilter } from "../model";

/**
 * Props for `FeeConfigCurrencyButtons`.
 */
export interface FeeConfigCurrencyButtonsProps {
  currency: FeeCurrencyFilter;
  onSelectCurrency: (value: FeeCurrencyFilter) => void;
  resetPageIndex: () => void;
}


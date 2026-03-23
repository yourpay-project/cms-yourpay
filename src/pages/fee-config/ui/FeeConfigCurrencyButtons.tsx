import type { FC } from "react";

import { Button } from "@/shared/ui";

import { FEE_CONFIG_CURRENCY_OPTIONS } from "../model/fee-config-currency-options";
import type { FeeConfigCurrencyButtonsProps } from "./FeeConfigCurrencyButtons.type";

/**
 * Currency quick filter buttons for the Fee Config page.
 */
export const FeeConfigCurrencyButtons: FC<FeeConfigCurrencyButtonsProps> = ({ currency, onSelectCurrency, resetPageIndex }) =>
  (
    <>
      {FEE_CONFIG_CURRENCY_OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={currency === option.value ? "default" : "outline"}
          onClick={() => {
            onSelectCurrency(option.value);
            resetPageIndex();
          }}
        >
          {option.label}
        </Button>
      ))}
    </>
  );


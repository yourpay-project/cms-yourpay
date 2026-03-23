import { useState } from "react";

import type { FeeConfig } from "@/entities/fee-config";
import { deleteFeeConfigById } from "@/shared/api/fee-config";
import type { FeeConfigFiltersState } from "./use-fee-config-filters";

export interface UseFeeConfigPageLogicResult {
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean | ((prev: boolean) => boolean)) => void;

  serviceOptions: Array<{ value: string; label: string }>;
  canCreateFeeConfig: boolean;
  handleDelete: (row: FeeConfig) => Promise<void>;
}

/**
 * Encapsulates fee-config page state + form handlers.
 */
export function useFeeConfigPageLogic(filters: FeeConfigFiltersState): UseFeeConfigPageLogicResult {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const canCreateFeeConfig = true;
  const serviceOptions = filters.serviceOptions;

  const handleDelete = async (row: FeeConfig) => {
    await deleteFeeConfigById(row.id);
    await filters.refetch();
  };

  return {
    filtersOpen,
    setFiltersOpen,
    serviceOptions,
    canCreateFeeConfig,
    handleDelete,
  };
}


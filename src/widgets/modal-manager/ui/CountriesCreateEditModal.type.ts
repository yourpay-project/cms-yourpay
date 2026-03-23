import type { Country } from "@/entities/country";

import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

export type CountriesModalMode = "create" | "edit";

/**
 * Payload for countries create/edit modal.
 */
export interface CountriesCreateEditModalData {
  mode: CountriesModalMode;
  row?: Country;
  onAfterChange?: () => void;
}

/**
 * Full props for `CountriesCreateEdit`.
 */
export type CountriesCreateEditModalProps = CountriesCreateEditModalData & BaseModalCallbacks;


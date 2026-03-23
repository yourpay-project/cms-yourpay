import type { Country } from "@/entities/country";

import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

export type CountriesMode = "create" | "edit";

/**
 * Payload for countries create/edit modal.
 */
export interface CountriesCreateEditData {
  mode: CountriesMode;
  row?: Country;
  onAfterChange?: () => void;
}

/**
 * Full props for `CountriesCreateEdit`.
 */
export type CountriesCreateEditProps = CountriesCreateEditData & BaseModalCallbacks;


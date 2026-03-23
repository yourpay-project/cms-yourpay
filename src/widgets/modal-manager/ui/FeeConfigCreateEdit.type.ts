import type { FeeConfig } from "@/entities/fee-config";
import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

export type FeeConfigMode = "create" | "edit";

/**
 * Payload for create/edit fee config modal.
 */
export interface FeeConfigCreateEditData {
  mode: FeeConfigMode;
  row?: FeeConfig;
  onSubmitted?: () => void;
}

/**
 * Full props for `FeeConfigCreateEdit`.
 */
export type FeeConfigCreateEditProps = FeeConfigCreateEditData & BaseModalCallbacks;


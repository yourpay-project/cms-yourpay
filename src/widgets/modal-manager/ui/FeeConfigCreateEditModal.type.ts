import type { FeeConfig } from "@/entities/fee-config";
import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

export type FeeConfigModalMode = "create" | "edit";

/**
 * Payload for create/edit fee config modal.
 */
export interface FeeConfigCreateEditModalData {
  mode: FeeConfigModalMode;
  row?: FeeConfig;
  onSubmitted?: () => void;
}

/**
 * Full props for `FeeConfigCreateEditModal`.
 */
export type FeeConfigCreateEditModalProps = FeeConfigCreateEditModalData & BaseModalCallbacks;


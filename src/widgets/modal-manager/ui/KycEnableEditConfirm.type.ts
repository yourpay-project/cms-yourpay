import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for `KycEnableEditConfirm` data.
 */
export interface KycEnableEditConfirmData {
  onConfirm?: () => void;
}

/**
 * Full props for `KycEnableEditConfirm`.
 */
export type KycEnableEditConfirmProps = KycEnableEditConfirmData &
  BaseModalCallbacks;


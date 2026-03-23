import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for `KycEnableEditConfirm` data.
 */
export interface KycEnableEditConfirmModalData {
  onConfirm?: () => void;
}

/**
 * Full props for `KycEnableEditConfirm`.
 */
export type KycEnableEditConfirmModalProps = KycEnableEditConfirmModalData &
  BaseModalCallbacks;


import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for `KycEnableEditConfirmModal` data.
 */
export interface KycEnableEditConfirmModalData {
  onConfirm?: () => void;
}

/**
 * Full props for `KycEnableEditConfirmModal`.
 */
export type KycEnableEditConfirmModalProps = KycEnableEditConfirmModalData &
  BaseModalCallbacks;


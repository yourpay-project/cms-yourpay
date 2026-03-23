import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for `KycGenerateOcrConfirmModal` data.
 */
export interface KycGenerateOcrConfirmModalData {
  onConfirm?: () => void;
}

/**
 * Full props for `KycGenerateOcrConfirmModal`.
 */
export type KycGenerateOcrConfirmModalProps = KycGenerateOcrConfirmModalData &
  BaseModalCallbacks;


import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for `KycGenerateOcrConfirm` data.
 */
export interface KycGenerateOcrConfirmModalData {
  onConfirm?: () => void;
}

/**
 * Full props for `KycGenerateOcrConfirm`.
 */
export type KycGenerateOcrConfirmModalProps = KycGenerateOcrConfirmModalData &
  BaseModalCallbacks;


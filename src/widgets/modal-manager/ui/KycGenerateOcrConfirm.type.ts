import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for `KycGenerateOcrConfirm` data.
 */
export interface KycGenerateOcrConfirmData {
  onConfirm?: () => void;
}

/**
 * Full props for `KycGenerateOcrConfirm`.
 */
export type KycGenerateOcrConfirmProps = KycGenerateOcrConfirmData &
  BaseModalCallbacks;


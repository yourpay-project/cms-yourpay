import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for user block confirmation modal.
 */
export interface UserBlockConfirmModalData {
  customerId: string;
  isBlocked: boolean;
  onStatusUpdated?: () => void;
}

/**
 * Full props for `UserBlockConfirm`.
 */
export type UserBlockConfirmModalProps = UserBlockConfirmModalData &
  BaseModalCallbacks;


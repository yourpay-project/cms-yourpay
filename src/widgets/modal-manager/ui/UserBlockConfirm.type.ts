import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for user block confirmation modal.
 */
export interface UserBlockConfirmData {
  customerId: string;
  isBlocked: boolean;
  onStatusUpdated?: () => void;
}

/**
 * Full props for `UserBlockConfirm`.
 */
export type UserBlockConfirmProps = UserBlockConfirmData &
  BaseModalCallbacks;


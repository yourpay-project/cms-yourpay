import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for user close confirmation modal.
 */
export interface UserCloseConfirmData {
  customerId: string;
}

/**
 * Full props for `UserCloseConfirm`.
 */
export type UserCloseConfirmProps = UserCloseConfirmData &
  BaseModalCallbacks;


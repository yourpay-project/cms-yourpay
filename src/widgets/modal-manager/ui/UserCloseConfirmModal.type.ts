import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for user close confirmation modal.
 */
export interface UserCloseConfirmModalData {
  customerId: string;
}

/**
 * Full props for `UserCloseConfirmModal`.
 */
export type UserCloseConfirmModalProps = UserCloseConfirmModalData &
  BaseModalCallbacks;


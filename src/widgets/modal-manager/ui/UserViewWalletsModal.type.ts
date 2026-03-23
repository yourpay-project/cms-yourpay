import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for view wallets modal.
 */
export interface UserViewWalletsModalData {
  customerId: string;
}

/**
 * Full props for `UserViewWallets`.
 */
export type UserViewWalletsModalProps = UserViewWalletsModalData & BaseModalCallbacks;


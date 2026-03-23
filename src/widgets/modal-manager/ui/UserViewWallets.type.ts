import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for view wallets modal.
 */
export interface UserViewWalletsData {
  customerId: string;
}

/**
 * Full props for `UserViewWallets`.
 */
export type UserViewWalletsProps = UserViewWalletsData & BaseModalCallbacks;


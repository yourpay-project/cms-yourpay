import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for editing customer identity access methods.
 */
export interface UserEditIdentityAccessModalData {
  customerId: string;
  currentIdentityAccesses: Array<{
    code: string;
    isDefault: boolean;
  }>;
}

/**
 * Full props for `UserEditIdentityAccess`.
 */
export type UserEditIdentityAccessModalProps = UserEditIdentityAccessModalData & BaseModalCallbacks;


import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for view devices modal.
 */
export interface UserViewDevicesModalData {
  customerId: string;
}

/**
 * Full props for `UserViewDevices`.
 */
export type UserViewDevicesModalProps = UserViewDevicesModalData & BaseModalCallbacks;


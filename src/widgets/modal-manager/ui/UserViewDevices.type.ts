import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Payload for view devices modal.
 */
export interface UserViewDevicesData {
  customerId: string;
}

/**
 * Full props for `UserViewDevices`.
 */
export type UserViewDevicesProps = UserViewDevicesData & BaseModalCallbacks;


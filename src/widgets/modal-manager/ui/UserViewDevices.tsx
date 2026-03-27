import type { FC } from "react";

import { useCustomerDevicesQuery } from "@/entities/user";
import { UserViewDeviceItem } from "./UserViewDeviceItem";

import type { UserViewDevicesProps } from "./UserViewDevices.type";

interface UserViewDevicesStateMessageProps {
  message: string;
  messageClassName: string;
}

/**
 * Shared state-message layout for UserViewDevices.
 *
 * @param props Message text and semantic text class.
 * @returns Scrollable modal body with one state message.
 */
const UserViewDevicesStateMessage: FC<UserViewDevicesStateMessageProps> = ({
  message,
  messageClassName,
}) => {
  return (
    <div className="-mx-6 -mr-6 max-h-[70vh] overflow-y-auto pb-2 pr-6">
      <div className="space-y-3 px-6">
        <p className={messageClassName}>{message}</p>
      </div>
    </div>
  );
};

/**
 * Read-only modal that displays registered customer devices.
 *
 * @param props Modal open state and selected customer id.
 * @returns Device list state view for loading, error, empty, or success.
 */
export const UserViewDevices: FC<UserViewDevicesProps> = ({
  open,
  customerId,
}) => {
  const query = useCustomerDevicesQuery({
    customerId,
    enabled: open,
  });

  if (query.isLoading) {
    return (
      <UserViewDevicesStateMessage
        message="Loading devices..."
        messageClassName="text-sm text-muted-foreground"
      />
    );
  }
  if (query.isError) {
    return (
      <UserViewDevicesStateMessage
        message="Failed to load devices."
        messageClassName="text-sm text-destructive"
      />
    );
  }
  if ((query.data?.length ?? 0) === 0) {
    return (
      <UserViewDevicesStateMessage
        message="No devices found for this customer."
        messageClassName="text-sm text-muted-foreground"
      />
    );
  }
  const devices = query.data ?? [];

  return (
    <div className="-mx-6 -mr-6 max-h-[70vh] overflow-y-auto pb-2 pr-6">
      <div className="space-y-3 px-6">
        {devices.map((device) => (
          <UserViewDeviceItem key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
};


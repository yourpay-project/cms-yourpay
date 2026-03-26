import type { FC } from "react";

import { useCustomerDevicesQuery } from "@/entities/user";
import { UserViewDeviceItem } from "./UserViewDeviceItem";

import type { UserViewDevicesProps } from "./UserViewDevices.type";

/**
 * Read-only modal that displays registered customer devices.
 */
export const UserViewDevices: FC<UserViewDevicesProps> = ({
  open,
  customerId,
}) => {
  const query = useCustomerDevicesQuery({
    customerId,
    enabled: open,
  });

  let content: React.ReactNode = null;
  if (query.isLoading) {
    content = <p className="text-sm text-muted-foreground">Loading devices...</p>;
  } else if (query.isError) {
    content = <p className="text-sm text-destructive">Failed to load devices.</p>;
  } else if ((query.data?.length ?? 0) === 0) {
    content = <p className="text-sm text-muted-foreground">No devices found for this customer.</p>;
  } else {
    content = query.data!.map((device) => (
      <UserViewDeviceItem key={device.id} device={device} />
    ));
  }

  return (
    <div className="-mx-6 -mr-6 max-h-[70vh] overflow-y-auto pb-2 pr-6">
      <div className="space-y-3 px-6">
        {content}
      </div>
    </div>
  );
};


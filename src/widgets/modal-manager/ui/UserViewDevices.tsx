import type { FC } from "react";

import { useCustomerDevicesQuery } from "@/entities/user";
import { formatDateTime, formatDeviceTitle, formatOperatingSystem } from "@/shared/lib";
import { UserDetailCollapsibleCard, UserDetailFieldGrid, type UserDetailFieldItem } from "@/entities/user";

import type { UserViewDevicesModalProps } from "./UserViewDevicesModal.type";

/**
 * Read-only modal that displays registered customer devices.
 */
export const UserViewDevices: FC<UserViewDevicesModalProps> = ({
  open,
  customerId,
}) => {
  const query = useCustomerDevicesQuery({
    customerId,
    enabled: open,
  });

  return (
    <div className="space-y-3 pb-2">
      {query.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading devices...</p>
      ) : query.isError ? (
        <p className="text-sm text-destructive">Failed to load devices.</p>
      ) : (query.data?.length ?? 0) === 0 ? (
        <p className="text-sm text-muted-foreground">No devices found for this customer.</p>
      ) : (
        query.data!.map((device) => {
          const fields: UserDetailFieldItem[] = [
            { label: "Device Signature", value: device.deviceSignature },
            { label: "Last Login", value: formatDateTime(device.lastLoginAt, false) },
            { label: "Status", value: device.status?.toUpperCase() },
            {
              label: "Operating System",
              value: formatOperatingSystem(device.osName, device.osVersion),
            },
            { label: "App Version", value: device.appVersion },
            {
              label: "Location",
              value:
                device.geoLat != null && device.geoLng != null ? `${device.geoLat}, ${device.geoLng}` : "-",
            },
          ];

          return (
            <UserDetailCollapsibleCard
              key={device.id}
              title={formatDeviceTitle(device.deviceBrand, device.deviceModel)}
              defaultOpen={String(device.status ?? "").toLowerCase() === "active"}
              className="border-border/80 bg-muted/20"
              headerClassName="bg-muted/35"
              contentClassName="pt-4"
            >
              <div className="mb-3 rounded-md border border-border/70 bg-background/40 px-3 py-2 text-xs text-muted-foreground">
                Signature: {device.deviceSignature || "-"}
              </div>
              <UserDetailFieldGrid items={fields} />
            </UserDetailCollapsibleCard>
          );
        })
      )}
    </div>
  );
};


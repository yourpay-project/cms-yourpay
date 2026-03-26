import type { FC } from "react";

import { useCustomerDevicesQuery } from "@/entities/user";
import { formatDateTime, formatDeviceTitle, formatOperatingSystem } from "@/shared/lib";
import { UserDetailCollapsibleCard, UserDetailFieldGrid, type UserDetailFieldItem } from "@/entities/user";
import { Badge } from "@/shared/ui";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

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

  return (
    <div className="-mx-6 -mr-6 max-h-[70vh] overflow-y-auto pb-2 pr-6">
      <div className="space-y-3 px-6">
        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading devices...</p>
        ) : query.isError ? (
          <p className="text-sm text-destructive">Failed to load devices.</p>
        ) : (query.data?.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">No devices found for this customer.</p>
        ) : (
          query.data!.map((device) => {
            const normalizedStatus = String(device.status ?? "").trim().toUpperCase();
            const statusVariant =
              normalizedStatus === "ACTIVE"
                ? "success"
                : normalizedStatus === "PENDING"
                  ? "warning"
                  : normalizedStatus === "BLOCKED" || normalizedStatus === "INACTIVE"
                    ? "destructive"
                    : "default";

            const fields: UserDetailFieldItem[] = [
              { label: "Last Login", value: formatDateTime(device.lastLoginAt, false) },
              {
                label: "Status",
                value: (
                  <div className="flex w-full justify-end">
                    <Badge variant={statusVariant} className="inline-flex uppercase">
                      {normalizedStatus || "-"}
                    </Badge>
                  </div>
                ),
              },
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

            let statusIcon = <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden />;
            if (normalizedStatus === "PENDING") {
              statusIcon = <AlertTriangle className="h-4 w-4 shrink-0 text-warning" aria-hidden />;
            } else if (normalizedStatus === "BLOCKED" || normalizedStatus === "INACTIVE") {
              statusIcon = <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden />;
            }

            return (
              <UserDetailCollapsibleCard
                key={device.id}
                title={
                  <div className="flex min-w-0 items-center gap-2">
                    {statusIcon}
                    <div className="min-w-0">
                      <div className="truncate">{formatDeviceTitle(device.deviceBrand, device.deviceModel)}</div>
                      <div className="truncate text-xs font-normal text-muted-foreground">
                        Signature: {device.deviceSignature || "-"}
                      </div>
                    </div>
                  </div>
                }
                ariaTitle={formatDeviceTitle(device.deviceBrand, device.deviceModel)}
                defaultOpen={String(device.status ?? "").toLowerCase() === "active"}
                className="border-border/80 bg-muted/20"
                headerClassName="bg-muted/35"
                contentClassName="pt-4"
              >
                <UserDetailFieldGrid items={fields} />
              </UserDetailCollapsibleCard>
            );
          })
        )}
      </div>
    </div>
  );
};


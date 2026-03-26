import type { FC } from "react";
import type { CustomerDeviceItem } from "@/entities/user";
import { formatDateTime, formatDeviceTitle, formatOperatingSystem } from "@/shared/lib";
import { UserDetailCollapsibleCard, UserDetailFieldGrid, type UserDetailFieldItem } from "@/entities/user";
import { Badge } from "@/shared/ui";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export interface UserViewDeviceItemProps {
  device: CustomerDeviceItem;
}

export const UserViewDeviceItem: FC<UserViewDeviceItemProps> = ({ device }) => {
  const normalizedStatus = String(device.status ?? "").trim().toUpperCase();
  let statusVariant: "success" | "warning" | "destructive" | "default" = "default";

  if (normalizedStatus === "ACTIVE") {
    statusVariant = "success";
  } else if (normalizedStatus === "PENDING") {
    statusVariant = "warning";
  } else if (normalizedStatus === "BLOCKED" || normalizedStatus === "INACTIVE") {
    statusVariant = "destructive";
  }

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
      value: device.geoLat != null && device.geoLng != null ? `${device.geoLat}, ${device.geoLng}` : "-",
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
      title={
        <div className="flex min-w-0 gap-2">
          <span className="pt-1.5">{statusIcon}</span>
          <div className="min-w-0">
            <div className="truncate">
              {formatDeviceTitle(device.deviceBrand, device.deviceModel)}
            </div>
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
};

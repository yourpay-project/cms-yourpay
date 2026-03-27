import type { FC, ReactNode } from "react";
import type { CustomerDeviceItem } from "@/entities/user";
import { formatDateTime, formatDeviceTitle, formatOperatingSystem } from "@/shared/lib";
import { UserDetailCollapsibleCard, UserDetailFieldGrid, type UserDetailFieldItem } from "@/entities/user";
import { Badge } from "@/shared/ui";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export interface UserViewDeviceItemProps {
  device: CustomerDeviceItem;
}

function toDeviceLocationLabel(device: CustomerDeviceItem): string {
  if (device.geoLat == null || device.geoLng == null) {
    return "-";
  }

  return `${device.geoLat}, ${device.geoLng}`;
}

const DEVICE_STATUS_VARIANT_BY_VALUE: Record<
  string,
  "success" | "warning" | "destructive" | "default"
> = {
  ACTIVE: "success",
  PENDING: "warning",
  BLOCKED: "destructive",
  INACTIVE: "destructive",
};

const DEVICE_STATUS_ICON_BY_VALUE: Record<string, ReactNode> = {
  ACTIVE: <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden />,
  PENDING: <AlertTriangle className="h-4 w-4 shrink-0 text-warning" aria-hidden />,
  BLOCKED: <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden />,
  INACTIVE: <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden />,
};

/**
 * Renders one registered device row card in the customer devices modal.
 *
 * @param props Device payload for the item card.
 * @returns Collapsible device card with normalized status and detail fields.
 */
export const UserViewDeviceItem: FC<UserViewDeviceItemProps> = ({ device }) => {
  const normalizedStatus = String(device.status ?? "").trim().toUpperCase();
  const statusVariant = DEVICE_STATUS_VARIANT_BY_VALUE[normalizedStatus] ?? "default";
  const statusIcon =
    DEVICE_STATUS_ICON_BY_VALUE[normalizedStatus] ?? (
      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden />
    );
  const statusLabel = normalizedStatus || "-";
  const signatureLabel = device.deviceSignature || "-";
  const cardAriaTitle = formatDeviceTitle(device.deviceBrand, device.deviceModel);
  const isDefaultOpen = String(device.status ?? "").toLowerCase() === "active";
  const locationLabel = toDeviceLocationLabel(device);

  const fields: UserDetailFieldItem[] = [
    { label: "Last Login", value: formatDateTime(device.lastLoginAt, false) },
    {
      label: "Status",
      value: (
        <div className="flex w-full justify-end">
          <Badge variant={statusVariant} className="inline-flex uppercase">
            {statusLabel}
          </Badge>
        </div>
      ),
    },
    {
      label: "Operating System",
      value: formatOperatingSystem(device.osName, device.osVersion),
    },
    { label: "App Version", value: device.appVersion },
    { label: "Location", value: locationLabel },
  ];

  return (
    <UserDetailCollapsibleCard
      title={
        <div className="flex min-w-0 gap-2">
          <span className="pt-1.5">{statusIcon}</span>
          <div className="min-w-0">
            <div className="truncate">
              {cardAriaTitle}
            </div>
            <div className="truncate text-xs font-normal text-muted-foreground">
              Signature: {signatureLabel}
            </div>
          </div>
        </div>
      }
      ariaTitle={cardAriaTitle}
      defaultOpen={isDefaultOpen}
      className="border-border/80 bg-muted/20"
      headerClassName="bg-muted/35"
      contentClassName="pt-4"
    >
      <UserDetailFieldGrid items={fields} />
    </UserDetailCollapsibleCard>
  );
};

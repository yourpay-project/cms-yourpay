import type { FC } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { ApiClientError } from "@/shared/api";
import { Badge, Button, PageSkeleton } from "@/shared/ui";

import { useCustomerDetailQuery, getUserDetailFieldItems } from "../model";
import { useModalStore } from "@/widgets/modal-manager";
import { UserDetailActionButtons } from "./UserDetailActionButtons";
import { UserDetailCollapsibleCard, UserDetailFieldGrid } from "@/entities/user";
import { IdentityAccessBadges } from "./IdentityAccessBadges";

type StatusVariant = "success" | "warning" | "destructive" | "default";

function toStatusVariant(normalizedStatus: string): StatusVariant {
  switch (normalizedStatus) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "warning";
    case "BLOCKED":
    case "INACTIVE":
      return "destructive";
    default:
      return "default";
  }
}

/**
 * Route-level content page for customer detail.
 */
const UserDetailPage: FC = () => {
  const { customerId } = useParams({ from: "/customers/$customerId" });
  const query = useCustomerDetailQuery({ customerId });

  const { open } = useModalStore();

  if (query.isLoading) return <PageSkeleton />;

  if (query.isError) {
    const apiError = query.error instanceof ApiClientError ? query.error : null;
    const message = apiError?.status === 404 ? "Customer detail not found." : "Failed to load customer detail. Please try again.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  const detail = query.data;
  if (!detail) return <p className="text-sm text-muted-foreground">Customer detail is unavailable.</p>;

  const identityAccessNode = <IdentityAccessBadges items={detail.identityAccess} />;
  const fieldItems = getUserDetailFieldItems({
    detail,
    identityAccessNode,
  });

  const rawStatus = String(detail.access.status ?? "").trim();
  const normalizedStatus = rawStatus.toUpperCase() || "-";
  const statusVariant = toStatusVariant(normalizedStatus);

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pb-4 pt-8 md:pt-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" type="button" className="h-8 w-8">
            <Link to="/customers" aria-label="Back to list">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-xl font-semibold">Customer Detail</h2>
        </div>

        {fieldItems.fullName !== "-" ? (
          <div className="flex w-full min-w-0 items-center justify-end gap-2 md:ml-auto md:w-auto">
            <p className="min-w-0 truncate text-sm font-medium">{fieldItems.fullName}</p>
            <span className="text-muted-foreground">-</span>
            <Badge variant={statusVariant} className="shrink-0">
              {normalizedStatus}
            </Badge>
          </div>
        ) : null}
      </div>

      <UserDetailActionButtons
        isBlocked={fieldItems.isBlocked}
        onEditIdentityAccess={() => {
          open("USER_EDIT_IDENTITY_ACCESS_MODAL", {
            customerId,
            currentIdentityAccesses: detail.identityAccess,
          });
        }}
        onViewDevices={() => {
          open("USER_VIEW_DEVICES_MODAL", { customerId });
        }}
        onViewWallets={() => {
          open("USER_VIEW_WALLETS_MODAL", { customerId });
        }}
        onOpenBlockUser={() => {
          open("USER_BLOCK_CONFIRM_MODAL", {
            customerId,
            isBlocked: fieldItems.isBlocked,
            onStatusUpdated: () => {
              void query.refetch();
            },
          });
        }}
        onOpenCloseUser={() => {
          open("USER_CLOSE_CONFIRM_MODAL", { customerId });
        }}
      />

      <div className="space-y-4 pt-2">
        <UserDetailCollapsibleCard
          title="Customer Details"
          className="border-primary/25 bg-primary/5"
          headerClassName="bg-primary/10"
          contentClassName="pt-4 md:pt-5"
        >
          <UserDetailFieldGrid items={fieldItems.customerFields} />
        </UserDetailCollapsibleCard>

        <UserDetailCollapsibleCard
          title="Personal Information"
          className="border-success/25 bg-success/5"
          headerClassName="bg-success/10"
          contentClassName="pt-4 md:pt-5"
        >
          <UserDetailFieldGrid items={fieldItems.personalInformationFields} />
        </UserDetailCollapsibleCard>

        <UserDetailCollapsibleCard
          title="Access"
          className="border-warning/30 bg-warning/5"
          headerClassName="bg-warning/10"
          contentClassName="pt-4 md:pt-5"
        >
          <UserDetailFieldGrid items={fieldItems.accessFields} />
        </UserDetailCollapsibleCard>

        <UserDetailCollapsibleCard
          title="Metadata"
          className="border-secondary/50 bg-secondary/20"
          headerClassName="bg-secondary/35"
          contentClassName="pt-4 md:pt-5"
        >
          <UserDetailFieldGrid items={fieldItems.metadataFields} />
        </UserDetailCollapsibleCard>
      </div>
    </div>
  );
};

export default UserDetailPage;


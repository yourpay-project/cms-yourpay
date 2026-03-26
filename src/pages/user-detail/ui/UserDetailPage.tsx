import type { FC } from "react";
import { useParams } from "@tanstack/react-router";

import { PageSkeleton } from "@/shared/ui";

import { useCustomerDetailQuery, getUserDetailFieldItems } from "../model";
import { useModalStore } from "@/widgets/modal-manager";
import { UserDetailActionButtons } from "./UserDetailActionButtons";
import { IdentityAccessBadges } from "./IdentityAccessBadges";
import { UserDetailPageHeader } from "./UserDetailPageHeader";
import { UserDetailCardsSection } from "./UserDetailCardsSection";
import {
  buildUserDetailCardSections,
  getUserDetailErrorMessage,
  toStatusVariant,
} from "./user-detail-page-view-model";

/**
 * Route-level content page for customer detail.
 */
const UserDetailPage: FC = () => {
  const { customerId } = useParams({ from: "/customers/$customerId" });
  const query = useCustomerDetailQuery({ customerId });

  const { open } = useModalStore();

  if (query.isLoading) return <PageSkeleton />;

  if (query.isError) {
    const message = getUserDetailErrorMessage(query.error);
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
  const cardSections = buildUserDetailCardSections(fieldItems);

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pb-4 pt-8 md:pt-10">
      <UserDetailPageHeader
        fullName={fieldItems.fullName}
        normalizedStatus={normalizedStatus}
        statusVariant={statusVariant}
      />

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

      <UserDetailCardsSection sections={cardSections} />
    </div>
  );
};

export default UserDetailPage;


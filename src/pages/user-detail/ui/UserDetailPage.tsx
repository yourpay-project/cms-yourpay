import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronLeft, Loader2 } from "lucide-react";
import { ApiClientError } from "@/shared/api";
import { Button, PageSkeleton } from "@/shared/ui";
import { useCustomerDetailQuery, useLazyModal } from "../model";
import { formatDateTime, getFullName } from "../lib";
import { UserDetailActionButtons } from "./UserDetailActionButtons";
import { UserDetailCollapsibleCard } from "./UserDetailCollapsibleCard";
import { UserDetailFieldGrid, type UserDetailFieldItem } from "./UserDetailFieldGrid";
import { IdentityAccessBadges } from "./IdentityAccessBadges";

const EditIdentityAccessDialog = lazy(() => import("./EditIdentityAccessDialog"));
const ViewDevicesDialog = lazy(() => import("./ViewDevicesDialog"));
const ViewWalletsDialog = lazy(() => import("./ViewWalletsDialog"));
const BlockUserDialog = lazy(() => import("./BlockUserDialog"));
const CloseUserDialog = lazy(() => import("./CloseUserDialog"));

/**
 * Route-level content page for customer detail.
 *
 * @returns Customer detail screen with actions and lazy-loaded modals.
 */
const UserDetailPage: FC = () => {
  const { customerId } = useParams({ from: "/customers/$customerId" });
  const query = useCustomerDetailQuery({ customerId });
  const editIdentityAccessModal = useLazyModal();
  const viewDevicesModal = useLazyModal();
  const viewWalletsModal = useLazyModal();
  const blockUserModal = useLazyModal();
  const closeUserModal = useLazyModal();

  if (query.isLoading) {
    return <PageSkeleton />;
  }

  if (query.isError) {
    const apiError = query.error instanceof ApiClientError ? query.error : null;
    const message =
      apiError?.status === 404
        ? "Customer detail not found."
        : "Failed to load customer detail. Please try again.";
    return <p className="text-sm text-destructive">{message}</p>;
  }

  const detail = query.data;
  if (!detail) {
    return <p className="text-sm text-muted-foreground">Customer detail is unavailable.</p>;
  }

  const fullName = getFullName(detail.personalInformation.firstName, detail.personalInformation.lastName);

  const customerFields: UserDetailFieldItem[] = [
    { label: "Customer ID", value: detail.id },
    { label: "User ID", value: detail.userId },
    {
      label: "Identity Access",
      value: <IdentityAccessBadges items={detail.identityAccess} />,
    },
  ];

  const personalInformationFields: UserDetailFieldItem[] = [
    { label: "First Name", value: detail.personalInformation.firstName },
    { label: "Last Name", value: detail.personalInformation.lastName },
    { label: "Email", value: detail.personalInformation.email },
    { label: "Nationality", value: detail.personalInformation.nationality },
    { label: "Phone Number", value: detail.personalInformation.phoneNumber },
    { label: "Status", value: detail.access.status },
  ];

  const accessFields: UserDetailFieldItem[] = [
    { label: "Role", value: detail.access.role },
    { label: "Preferred Language", value: detail.access.preferredLanguage },
  ];

  const metadataFields: UserDetailFieldItem[] = [
    { label: "Created At", value: formatDateTime(detail.metadata.createdAt) },
    { label: "Created By", value: detail.metadata.createdBy },
    { label: "Updated At", value: formatDateTime(detail.metadata.updatedAt) },
    { label: "Updated By", value: detail.metadata.updatedBy },
  ];

  const isBlocked = detail.access.status?.toLowerCase() === "blocked";

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pb-4 pt-8 md:pt-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" type="button" className="h-8 w-8">
            <Link to="/customers" aria-label="Back to list">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-xl font-semibold">{`Customer Detail (${fullName})`}</h2>
        </div>
      </div>

      <UserDetailActionButtons
        isBlocked={isBlocked}
        onEditIdentityAccess={editIdentityAccessModal.openModal}
        onViewDevices={viewDevicesModal.openModal}
        onViewWallets={viewWalletsModal.openModal}
        onOpenBlockUser={blockUserModal.openModal}
        onOpenCloseUser={closeUserModal.openModal}
      />

      <div className="space-y-4 pt-2">
        <UserDetailCollapsibleCard
          title="Customer Details"
          className="border-primary/25 bg-primary/5"
          headerClassName="bg-primary/10"
          contentClassName="pt-4 md:pt-5"
        >
          <UserDetailFieldGrid items={customerFields} />
        </UserDetailCollapsibleCard>

        <UserDetailCollapsibleCard
          title="Personal Information"
          defaultOpen={false}
          className="border-success/25 bg-success/5"
          headerClassName="bg-success/10"
          contentClassName="pt-4 md:pt-5"
        >
          <UserDetailFieldGrid items={personalInformationFields} />
        </UserDetailCollapsibleCard>

        <UserDetailCollapsibleCard
          title="Access"
          defaultOpen={false}
          className="border-warning/30 bg-warning/5"
          headerClassName="bg-warning/10"
          contentClassName="pt-4 md:pt-5"
        >
          <UserDetailFieldGrid items={accessFields} />
        </UserDetailCollapsibleCard>

        <UserDetailCollapsibleCard
          title="Metadata"
          defaultOpen={false}
          className="border-secondary/50 bg-secondary/20"
          headerClassName="bg-secondary/35"
          contentClassName="pt-4 md:pt-5"
        >
          <UserDetailFieldGrid items={metadataFields} />
        </UserDetailCollapsibleCard>
      </div>

      <Suspense
        fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        }
      >
        {editIdentityAccessModal.isMounted ? (
          <EditIdentityAccessDialog
            open={editIdentityAccessModal.isOpen}
            onOpenChange={editIdentityAccessModal.setOpen}
            customerId={customerId}
            currentIdentityAccesses={detail.identityAccess}
          />
        ) : null}
        {viewDevicesModal.isMounted ? (
          <ViewDevicesDialog
            open={viewDevicesModal.isOpen}
            onOpenChange={viewDevicesModal.setOpen}
            customerId={customerId}
          />
        ) : null}
        {viewWalletsModal.isMounted ? (
          <ViewWalletsDialog
            open={viewWalletsModal.isOpen}
            onOpenChange={viewWalletsModal.setOpen}
            customerId={customerId}
          />
        ) : null}
        {blockUserModal.isMounted ? (
          <BlockUserDialog
            open={blockUserModal.isOpen}
            onOpenChange={blockUserModal.setOpen}
            customerId={customerId}
            isBlocked={isBlocked}
            onStatusUpdated={() => {
              void query.refetch();
            }}
          />
        ) : null}
        {closeUserModal.isMounted ? (
          <CloseUserDialog
            open={closeUserModal.isOpen}
            onOpenChange={closeUserModal.setOpen}
            customerId={customerId}
          />
        ) : null}
      </Suspense>
    </div>
  );
};

export default UserDetailPage;

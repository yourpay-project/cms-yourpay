import type { ReactNode } from "react";

import type { UserDetail } from "@/entities/user";

import { formatDateTime, getFullName } from "../lib";

/**
 * Field-items shape required by `UserDetailFieldGrid` (label + optional React value node).
 */
export interface UserDetailFieldItemLike {
  label: string;
  value?: ReactNode;
}

export interface GetUserDetailFieldItemsParams {
  detail: UserDetail;
  identityAccessNode: ReactNode;
}

/**
 * Derives all `UserDetailFieldGrid` groups from the loaded customer detail.
 */
export function getUserDetailFieldItems({ detail, identityAccessNode }: GetUserDetailFieldItemsParams) {
  const fullName = getFullName(detail.personalInformation.firstName, detail.personalInformation.lastName);
  const isBlocked = String(detail.access.status ?? "").toLowerCase() === "blocked";

  const customerFields: UserDetailFieldItemLike[] = [
    { label: "Customer ID", value: detail.id },
    { label: "User ID", value: detail.userId },
    { label: "Identity Access", value: identityAccessNode },
  ];

  const personalInformationFields: UserDetailFieldItemLike[] = [
    { label: "First Name", value: detail.personalInformation.firstName },
    { label: "Last Name", value: detail.personalInformation.lastName },
    { label: "Email", value: detail.personalInformation.email },
    { label: "Nationality", value: detail.personalInformation.nationality },
    { label: "Phone Number", value: detail.personalInformation.phoneNumber },
    { label: "Status", value: detail.access.status },
  ];

  const accessFields: UserDetailFieldItemLike[] = [
    { label: "Role", value: detail.access.role },
    { label: "Preferred Language", value: detail.access.preferredLanguage },
  ];

  const metadataFields: UserDetailFieldItemLike[] = [
    { label: "Created At", value: formatDateTime(detail.metadata.createdAt) },
    { label: "Created By", value: detail.metadata.createdBy },
    { label: "Updated At", value: formatDateTime(detail.metadata.updatedAt) },
    { label: "Updated By", value: detail.metadata.updatedBy },
  ];

  return {
    fullName,
    isBlocked,
    customerFields,
    personalInformationFields,
    accessFields,
    metadataFields,
  };
}


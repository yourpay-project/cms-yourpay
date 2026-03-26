import * as React from "react";
import type { ReactNode } from "react";

import type { UserDetail } from "@/entities/user";
import { Badge } from "@/shared/ui";

import { formatDateTime, getFullName } from "../lib";

type StatusVariant = "success" | "warning" | "destructive" | "default";

const STATUS_VARIANT_BY_STATUS: Record<string, StatusVariant> = {
  ACTIVE: "success",
  PENDING: "warning",
  BLOCKED: "destructive",
  INACTIVE: "destructive",
};

function toStatusVariant(normalizedStatus: string): StatusVariant {
  return STATUS_VARIANT_BY_STATUS[normalizedStatus] ?? "default";
}

function normalizeNationality(value: unknown): unknown {
  if (value == null) {
    return value;
  }
  return String(value).toUpperCase();
}

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
  const rawStatus = String(detail.access.status ?? "").trim();
  const normalizedStatus = rawStatus.toUpperCase() || "-";
  const statusVariant = toStatusVariant(normalizedStatus);

  const customerFields: UserDetailFieldItemLike[] = [
    { label: "Customer ID", value: detail.id },
    { label: "User ID", value: detail.userId },
    {
      label: "Identity Access",
      value: React.createElement("div", { className: "flex w-full justify-end" }, identityAccessNode),
    },
  ];

  const personalInformationFields: UserDetailFieldItemLike[] = [
    { label: "First Name", value: detail.personalInformation.firstName },
    { label: "Last Name", value: detail.personalInformation.lastName },
    { label: "Email", value: detail.personalInformation.email },
    {
      label: "Nationality",
      value: normalizeNationality(detail.personalInformation.nationality),
    },
    { label: "Phone Number", value: detail.personalInformation.phoneNumber },
    {
      label: "Status",
      value: React.createElement(
        "div",
        { className: "flex w-full justify-end" },
        React.createElement(
          Badge,
          { variant: statusVariant, className: "inline-flex uppercase" },
          normalizedStatus,
        ),
      ),
    },
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


import { ApiClientError } from "@/shared/api";
import type { UserDetailFieldItemLike } from "../model/get-user-detail-field-items";

export type StatusVariant = "success" | "warning" | "destructive" | "default";

export interface UserDetailCardSection {
  title: string;
  className: string;
  headerClassName: string;
  contentClassName: string;
  items: UserDetailFieldItemLike[];
}

const STATUS_VARIANT_BY_STATUS: Record<string, StatusVariant> = {
  ACTIVE: "success",
  PENDING: "warning",
  BLOCKED: "destructive",
  INACTIVE: "destructive",
};

/**
 * Maps customer status to badge variant.
 *
 * @param normalizedStatus - Uppercase status value.
 * @returns Badge variant for user status display.
 */
export function toStatusVariant(normalizedStatus: string): StatusVariant {
  return STATUS_VARIANT_BY_STATUS[normalizedStatus] ?? "default";
}

/**
 * Maps detail query errors to user-facing message.
 *
 * @param error - Query error object.
 * @returns Safe error message for page rendering.
 */
export function getUserDetailErrorMessage(error: unknown): string {
  const apiError = error instanceof ApiClientError ? error : null;
  if (apiError?.status === 404) {
    return "Customer detail not found.";
  }
  return "Failed to load customer detail. Please try again.";
}

/**
 * Builds card section definitions for customer detail page.
 *
 * @param fieldItems - Derived grouped field items.
 * @returns Ordered card section definitions for rendering.
 */
export function buildUserDetailCardSections(fieldItems: {
  customerFields: UserDetailFieldItemLike[];
  personalInformationFields: UserDetailFieldItemLike[];
  accessFields: UserDetailFieldItemLike[];
  metadataFields: UserDetailFieldItemLike[];
}): UserDetailCardSection[] {
  return [
    {
      title: "Customer Details",
      className: "border-primary/25 bg-primary/5",
      headerClassName: "bg-primary/10",
      contentClassName: "pt-4 md:pt-5",
      items: fieldItems.customerFields,
    },
    {
      title: "Personal Information",
      className: "border-success/25 bg-success/5",
      headerClassName: "bg-success/10",
      contentClassName: "pt-4 md:pt-5",
      items: fieldItems.personalInformationFields,
    },
    {
      title: "Access",
      className: "border-warning/30 bg-warning/5",
      headerClassName: "bg-warning/10",
      contentClassName: "pt-4 md:pt-5",
      items: fieldItems.accessFields,
    },
    {
      title: "Metadata",
      className: "border-secondary/50 bg-secondary/20",
      headerClassName: "bg-secondary/35",
      contentClassName: "pt-4 md:pt-5",
      items: fieldItems.metadataFields,
    },
  ];
}


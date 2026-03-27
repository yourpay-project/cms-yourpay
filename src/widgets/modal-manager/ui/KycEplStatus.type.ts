import type { BaseModalCallbacks } from "./BaseModalCallbacks.type";

/**
 * Limited EPL status set used by the modal.
 */
export type EplStatusValue = "pending" | "approved" | "rejected";

/**
 * Payload for KYC EPL status update modal.
 */
export interface KycEplStatusData {
  submissionId: string;
  countryCode?: string;
  currentStatus: EplStatusValue;
  onSubmitted?: () => void;
}

/**
 * Form values for `KycEplStatus` modal form.
 */
export interface KycEplStatusFormValues {
  status: string;
  rejectionCode: string;
}

/**
 * Full props for `KycEplStatus`.
 */
export type KycEplStatusProps = KycEplStatusData & BaseModalCallbacks;


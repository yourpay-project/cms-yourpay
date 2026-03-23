import type { EplStatusValue } from "../lib/epl-status-options";

/**
 * Props for `KycSubmissionDetailPageHeader`.
 */
export interface KycSubmissionDetailPageHeaderProps {
  id: string;
  fullname?: string;
  currentStatus: EplStatusValue;
  eplStatusClass: string;
  isStatusEditable: boolean;
  onOpenStatusModal: () => void;
}


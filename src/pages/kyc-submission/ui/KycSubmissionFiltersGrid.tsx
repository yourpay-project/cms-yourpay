import type { FC } from "react";
import {
  KYC_STATUS_OPTIONS,
  KYC_DOCUMENT_TYPE_OPTIONS,
  REVERIFY_OPTIONS,
} from "..";
import { FilterSelectWithClear } from "@/shared/ui";
import { DateRangePickerWithPresets } from "./DateRangePickerWithPresets";

export interface KycSubmissionFiltersGridProps {
  status: string;
  setStatus: (v: string) => void;
  statusSelectRef: React.RefObject<HTMLSelectElement>;
  documentType: string;
  setDocumentType: (v: string) => void;
  documentTypeSelectRef: React.RefObject<HTMLSelectElement>;
  reverifyStatus: string;
  setReverifyStatus: (v: string) => void;
  reverifySelectRef: React.RefObject<HTMLSelectElement>;
  kycFrom: string;
  kycTo: string;
  kycPresetLabel: string | null;
  setKycFrom: (v: string) => void;
  setKycTo: (v: string) => void;
  setKycPresetLabel: (v: string | null) => void;
  lastUpdateFrom: string;
  lastUpdateTo: string;
  lastUpdatePresetLabel: string | null;
  setLastUpdateFrom: (v: string) => void;
  setLastUpdateTo: (v: string) => void;
  setLastUpdatePresetLabel: (v: string | null) => void;
  resetPageIndex: () => void;
}

/**
 * Grid of filter controls (Status, Document Type, Country, date ranges, Reverify).
 */
export const KycSubmissionFiltersGrid: FC<KycSubmissionFiltersGridProps> = (props) => {
  const { resetPageIndex } = props;
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
      <FilterSelectWithClear
        label="Status"
        value={props.status}
        options={KYC_STATUS_OPTIONS}
        selectRef={props.statusSelectRef}
        onChange={(v) => {
          props.setStatus(v);
          resetPageIndex();
        }}
        onClear={() => {
          props.setStatus("all");
          resetPageIndex();
        }}
      />
      <FilterSelectWithClear
        label="Document Type"
        value={props.documentType}
        options={KYC_DOCUMENT_TYPE_OPTIONS}
        selectRef={props.documentTypeSelectRef}
        onChange={(v) => {
          props.setDocumentType(v);
          resetPageIndex();
        }}
        onClear={() => {
          props.setDocumentType("all");
          resetPageIndex();
        }}
      />
      <DateRangePickerWithPresets
        label="KYC Submission"
        from={props.kycFrom}
        to={props.kycTo}
        presetLabel={props.kycPresetLabel}
        onRangeChange={(from, to, label) => {
          props.setKycFrom(from);
          props.setKycTo(to);
          props.setKycPresetLabel(label ?? null);
          resetPageIndex();
        }}
      />
      <DateRangePickerWithPresets
        label="Last Update"
        from={props.lastUpdateFrom}
        to={props.lastUpdateTo}
        presetLabel={props.lastUpdatePresetLabel}
        onRangeChange={(from, to, label) => {
          props.setLastUpdateFrom(from);
          props.setLastUpdateTo(to);
          props.setLastUpdatePresetLabel(label ?? null);
          resetPageIndex();
        }}
      />
      <FilterSelectWithClear
        label="Reverify Status"
        value={props.reverifyStatus}
        options={REVERIFY_OPTIONS}
        selectRef={props.reverifySelectRef}
        onChange={(v) => {
          props.setReverifyStatus(v);
          resetPageIndex();
        }}
        onClear={() => {
          props.setReverifyStatus("all");
          resetPageIndex();
        }}
      />
    </div>
  );
};

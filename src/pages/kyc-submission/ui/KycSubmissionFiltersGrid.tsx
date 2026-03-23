import type { FC } from "react";
import {
  KYC_STATUS_OPTIONS,
  KYC_DOCUMENT_TYPE_OPTIONS,
  KYC_COUNTRY_OPTIONS,
  REVERIFY_OPTIONS,
} from "..";
import { DateRangePicker, FilterSelectWithClear } from "@/shared/ui";
import { PRESETS } from "../lib/date-range-presets";

export interface KycSubmissionFiltersGridProps {
  status: string;
  setStatus: (v: string) => void;
  documentType: string;
  setDocumentType: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  reverifyStatus: string;
  setReverifyStatus: (v: string) => void;
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
        onChange={(v) => {
          props.setDocumentType(v);
          resetPageIndex();
        }}
        onClear={() => {
          props.setDocumentType("all");
          resetPageIndex();
        }}
      />
      <FilterSelectWithClear
        label="Country"
        value={props.country}
        options={KYC_COUNTRY_OPTIONS}
        onChange={(v) => {
          props.setCountry(v);
          resetPageIndex();
        }}
        onClear={() => {
          props.setCountry("all");
          resetPageIndex();
        }}
      />
      <DateRangePicker
        label="KYC Submission"
        from={props.kycFrom}
        to={props.kycTo}
        presetLabel={props.kycPresetLabel}
        presets={PRESETS}
        onRangeChange={(from, to, label) => {
          props.setKycFrom(from);
          props.setKycTo(to);
          props.setKycPresetLabel(label ?? null);
          resetPageIndex();
        }}
      />
      <DateRangePicker
        label="Last Update"
        from={props.lastUpdateFrom}
        to={props.lastUpdateTo}
        presetLabel={props.lastUpdatePresetLabel}
        presets={PRESETS}
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

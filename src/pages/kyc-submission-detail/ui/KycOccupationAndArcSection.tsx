import type { FC } from "react";

import { Input, LabeledSelectField } from "@/shared/ui";

import type { KycOccupationAndArcSectionProps } from "./KycOccupationAndArcSection.type";
import { toDateInputValue } from "../lib/kyc-verification-form-options";

/**
 * Occupation select + ARC fields (non-Indonesia).
 */
export const KycOccupationAndArcSection: FC<KycOccupationAndArcSectionProps> = ({
  draft,
  setDraft,
  isEditable,
  locked,
  isIndonesia,
  occupationOptions,
  occupationsLoading,
  onOccupationChange,
}) => {
  return (
    <>
      <LabeledSelectField
        containerClassName="md:col-span-2"
        id="kyc-submission-occupation"
        label="Occupation"
        size="sm"
        value={draft.occupationId ?? ""}
        onChange={onOccupationChange}
        options={occupationOptions}
        placeholder="Select an option"
        disabled={locked}
        isLoading={occupationsLoading}
        searchable
        allowClear={isEditable}
      />

      {!isIndonesia ? (
        <>
          <Input
            id="kyc-submission-arc-number"
            size="sm"
            type="text"
            label="ARC Number"
            allowClear={isEditable}
            readOnly={locked}
            value={draft.arcNumber ?? ""}
            onChange={(e) => setDraft((prev) => ({ ...prev, arcNumber: e.target.value }))}
          />
          <Input
            id="kyc-submission-arc-expiry-date"
            size="sm"
            type={isEditable ? "date" : "text"}
            label="ARC Expiry Date"
            allowClear={isEditable}
            readOnly={locked}
            value={isEditable ? toDateInputValue(draft.arcExpiryDate) : (draft.arcExpiryDate ?? "")}
            onChange={(e) => setDraft((prev) => ({ ...prev, arcExpiryDate: e.target.value }))}
          />
        </>
      ) : null}
    </>
  );
};


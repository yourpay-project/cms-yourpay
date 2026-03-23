import type { FC } from "react";

import { Card, CardContent, CardHeader, CardTitle, Input, LabeledSelectField } from "@/shared/ui";

import { KYC_MARRIAGE_STATUS_OPTIONS, KYC_NATIONALITY_OPTIONS } from "../lib/kyc-verification-form-options";
import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

export interface KycPersonalInformationCardProps {
  draft: KycLeftEditDraft;
  setDraft: (next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft)) => void;
  isEditable: boolean;
}

/**
 * Secondary personal fields: **mobile** — one column; **desktop (`md+`)** — two-column grid with **Mother's Name** full width.
 */
export const KycPersonalInformationCard: FC<KycPersonalInformationCardProps> = ({ draft, setDraft, isEditable }) => {
  const locked = !isEditable;

  return (
    <Card className="min-w-0 max-w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 max-w-full">
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            id="kyc-submission-email"
            size="md"
            type="email"
            label="Email"
            allowClear={isEditable}
            readOnly={locked}
            value={draft.email ?? ""}
            onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
          />

          <Input
            id="kyc-submission-birth-place"
            size="md"
            type="text"
            label="Place of Birth"
            allowClear={isEditable}
            readOnly={locked}
            value={draft.birthPlace ?? ""}
            onChange={(e) => setDraft((prev) => ({ ...prev, birthPlace: e.target.value }))}
          />

          <div className="md:col-span-2">
            <Input
              id="kyc-submission-mother-name"
              size="md"
              type="text"
              label="Mother's Name"
              allowClear={isEditable}
              readOnly={locked}
              value={draft.motherName ?? ""}
              onChange={(e) => setDraft((prev) => ({ ...prev, motherName: e.target.value }))}
            />
          </div>

          <LabeledSelectField
            id="kyc-submission-marriage-status"
            label="Marriage Status"
            value={draft.marriageStatus ?? ""}
            onChange={(value) => setDraft((prev) => ({ ...prev, marriageStatus: value || undefined }))}
            options={KYC_MARRIAGE_STATUS_OPTIONS}
            placeholder="Select an option"
            disabled={locked}
            allowClear={isEditable}
          />

          <LabeledSelectField
            id="kyc-submission-nationality"
            label="Nationality"
            value={draft.nationality ?? ""}
            onChange={(value) => setDraft((prev) => ({ ...prev, nationality: value || undefined }))}
            options={KYC_NATIONALITY_OPTIONS}
            placeholder="Select an option"
            disabled={locked}
            searchable
            allowClear={isEditable}
          />
        </div>
      </CardContent>
    </Card>
  );
};

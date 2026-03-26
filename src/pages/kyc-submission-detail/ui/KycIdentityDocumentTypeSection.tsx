import type { FC } from "react";

import { Input, LabeledSelectField } from "@/shared/ui";

import type { KycIdentityDocumentTypeSectionProps } from "./KycIdentityDocumentTypeSection.type";

/**
 * Document type + document number section for `KycDocumentInformationCard`.
 */
export const KycIdentityDocumentTypeSection: FC<KycIdentityDocumentTypeSectionProps> = ({
  draft,
  setDraft,
  isEditable,
  locked,
  documentTypeOptions,
  onDocumentTypeChange,
}) => {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
      <LabeledSelectField
        containerClassName="md:col-span-2"
        id="kyc-submission-identity-type"
        label="Document Type"
        required
        size="sm"
        value={draft.identityDocumentType ?? ""}
        onChange={onDocumentTypeChange}
        options={documentTypeOptions}
        placeholder="Select an option"
        disabled={locked}
        searchable
        allowClear={isEditable}
      />

      <div
        className={`flex min-h-12 items-center gap-3 rounded-md border border-input px-3 py-2 md:min-h-[3rem] ${
          locked ? "bg-muted/20" : "bg-background"
        }`}
      >
        <input
          id="kyc-submission-is-photocopy"
          type="checkbox"
          className="h-4 w-4 shrink-0 rounded border border-input bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          checked={draft.isPhotocopy ?? false}
          disabled={locked}
          onChange={(e) => setDraft((prev) => ({ ...prev, isPhotocopy: e.target.checked }))}
        />
        <label htmlFor="kyc-submission-is-photocopy" className="text-sm font-medium leading-tight text-foreground">
          Fotokopi
        </label>
      </div>

      <Input
        id="kyc-submission-identity-number"
        size="sm"
        type="text"
        label="Document Number"
        allowClear={isEditable}
        readOnly={locked}
        value={draft.identityDocumentNumber ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, identityDocumentNumber: e.target.value }))}
      />
    </div>
  );
};


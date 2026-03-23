import type { FC } from "react";

import { Input } from "@/shared/ui";

import type { KycPassportDatesSectionProps } from "./KycPassportDatesSection.type";
import { toDateInputValue } from "../lib/kyc-verification-form-options";

/**
 * Issue/Expiry dates fields shown only for Passport.
 */
export const KycPassportDatesSection: FC<KycPassportDatesSectionProps> = ({ draft, setDraft, isEditable, locked }) => {
  if (draft.identityDocumentType !== "PASSPORT") return null;

  return (
    <>
      <Input
        id="kyc-submission-identity-issue-date"
        size="md"
        type={isEditable ? "date" : "text"}
        label="Issue Date"
        allowClear={isEditable}
        readOnly={locked}
        value={isEditable ? toDateInputValue(draft.identityDocumentIssueDate) : (draft.identityDocumentIssueDate ?? "")}
        onChange={(e) => setDraft((prev) => ({ ...prev, identityDocumentIssueDate: e.target.value }))}
      />
      <Input
        id="kyc-submission-identity-expiry-date"
        size="md"
        type={isEditable ? "date" : "text"}
        label="Expiry Date"
        allowClear={isEditable}
        readOnly={locked}
        value={isEditable ? toDateInputValue(draft.identityDocumentExpireDate) : (draft.identityDocumentExpireDate ?? "")}
        onChange={(e) => setDraft((prev) => ({ ...prev, identityDocumentExpireDate: e.target.value }))}
      />
    </>
  );
};


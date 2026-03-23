import type { FC } from "react";
import { useMemo } from "react";

import { useOccupationsQuery } from "@/entities/occupation";
import { Card, CardContent, CardHeader, CardTitle, Input, LabeledSelectField } from "@/shared/ui";

import {
  KYC_ALL_DOCUMENT_TYPE_OPTIONS,
  KYC_INDONESIA_DOCUMENT_TYPE_OPTIONS,
  mergeDocumentTypeOptions,
  mergeOccupationDropdownOptions,
  toDateInputValue,
} from "../lib/kyc-verification-form-options";
import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

export interface KycDocumentInformationCardProps {
  countryCode?: string;
  draft: KycLeftEditDraft;
  setDraft: (next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft)) => void;
  isEditable: boolean;
}

/**
 * Document Information: standard {@link Input} / {@link SelectDropdown}; required marker is a red asterisk on the Document Type label; Fotokopi + Document Number share one row on `md+`.
 */
export const KycDocumentInformationCard: FC<KycDocumentInformationCardProps> = ({
  countryCode,
  draft,
  setDraft,
  isEditable,
}) => {
  const locked = !isEditable;
  const isIndonesia = String(countryCode ?? "").toUpperCase() === "ID";

  const occupationsQuery = useOccupationsQuery(true);

  const documentTypeOptions = useMemo(() => {
    const base = isIndonesia ? KYC_INDONESIA_DOCUMENT_TYPE_OPTIONS : KYC_ALL_DOCUMENT_TYPE_OPTIONS;
    return mergeDocumentTypeOptions(base, draft.identityDocumentType);
  }, [isIndonesia, draft.identityDocumentType]);

  const occupationOptions = useMemo(() => {
    const list = occupationsQuery.data?.data?.list ?? [];
    const base = list.map((o) => ({
      value: o.id,
      label: `${o.label_english} (${o.name})`,
    }));
    return mergeOccupationDropdownOptions(base, draft.occupationId, draft.occupationName);
  }, [occupationsQuery.data?.data?.list, draft.occupationId, draft.occupationName]);

  const onOccupationChange = (value: string) => {
    const list = occupationsQuery.data?.data?.list ?? [];
    const found = list.find((o) => o.id === value);
    setDraft((prev) => ({
      ...prev,
      occupationId: value || undefined,
      occupationName: found ? found.label_english : value ? prev.occupationName : undefined,
    }));
  };

  const onDocumentTypeChange = (value: string) => {
    setDraft((prev) => {
      const next: KycLeftEditDraft = {
        ...prev,
        identityDocumentType: value || undefined,
      };
      if (value !== "PASSPORT") {
        next.identityDocumentIssueDate = undefined;
        next.identityDocumentExpireDate = undefined;
      }
      return next;
    });
  };

  const isPassport = draft.identityDocumentType === "PASSPORT";

  return (
    <Card className="min-w-0 max-w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Document Information</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 max-w-full">
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          <LabeledSelectField
            containerClassName="md:col-span-2"
            id="kyc-submission-identity-type"
            label="Document Type"
            required
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
            size="md"
            type="text"
            label="Document Number"
            allowClear={isEditable}
            readOnly={locked}
            value={draft.identityDocumentNumber ?? ""}
            onChange={(e) => setDraft((prev) => ({ ...prev, identityDocumentNumber: e.target.value }))}
          />

          {isPassport ? (
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
          ) : null}

          <LabeledSelectField
            containerClassName="md:col-span-2"
            id="kyc-submission-occupation"
            label="Occupation"
            value={draft.occupationId ?? ""}
            onChange={onOccupationChange}
            options={occupationOptions}
            placeholder="Select an option"
            disabled={locked}
            isLoading={occupationsQuery.isLoading}
            searchable
            allowClear={isEditable}
          />

          {!isIndonesia ? (
            <>
              <Input
                id="kyc-submission-arc-number"
                size="md"
                type="text"
                label="ARC Number"
                allowClear={isEditable}
                readOnly={locked}
                value={draft.arcNumber ?? ""}
                onChange={(e) => setDraft((prev) => ({ ...prev, arcNumber: e.target.value }))}
              />
              <Input
                id="kyc-submission-arc-expiry-date"
                size="md"
                type={isEditable ? "date" : "text"}
                label="ARC Expiry Date"
                allowClear={isEditable}
                readOnly={locked}
                value={isEditable ? toDateInputValue(draft.arcExpiryDate) : (draft.arcExpiryDate ?? "")}
                onChange={(e) => setDraft((prev) => ({ ...prev, arcExpiryDate: e.target.value }))}
              />
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

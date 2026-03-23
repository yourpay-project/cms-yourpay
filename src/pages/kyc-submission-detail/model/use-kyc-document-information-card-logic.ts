import { useMemo } from "react";

import { useOccupationsQuery } from "@/entities/occupation";

import {
  KYC_ALL_DOCUMENT_TYPE_OPTIONS,
  KYC_INDONESIA_DOCUMENT_TYPE_OPTIONS,
  mergeDocumentTypeOptions,
  mergeOccupationDropdownOptions,
} from "../lib/kyc-verification-form-options";
import type { KycLeftEditDraft } from "./use-kyc-submission-detail-logic";

export interface UseKycDocumentInformationCardLogicResult {
  locked: boolean;
  isIndonesia: boolean;
  isPassport: boolean;

  documentTypeOptions: Array<{ value: string; label: string }>;
  occupationOptions: Array<{ value: string; label: string }>;
  occupationsLoading: boolean;

  onOccupationChange: (value: string) => void;
  onDocumentTypeChange: (value: string) => void;
}

/**
 * Business/interaction logic for `KycDocumentInformationCard`.
 */
export function useKycDocumentInformationCardLogic(params: {
  countryCode?: string;
  draft: KycLeftEditDraft;
  setDraft: (next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft)) => void;
  isEditable: boolean;
}): UseKycDocumentInformationCardLogicResult {
  const { countryCode, draft, setDraft, isEditable } = params;

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

  return {
    locked,
    isIndonesia,
    isPassport: draft.identityDocumentType === "PASSPORT",
    documentTypeOptions,
    occupationOptions,
    occupationsLoading: occupationsQuery.isLoading,
    onOccupationChange,
    onDocumentTypeChange,
  };
}


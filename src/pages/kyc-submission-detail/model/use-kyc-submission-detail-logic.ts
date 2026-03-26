import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { KycSubmissionDetail } from "@/entities/kyc-submission";
import type { KycDocumentImage } from "@/entities/kyc-submission";
import type { KycSubmissionDetailQueryParams } from "@/entities/kyc-submission";

import type { EplStatusValue } from "../lib/epl-status-options";
import { EPL_STATUS_OPTIONS } from "../lib/epl-status-options";
import {
  useKycSubmissionDetailPageQuery,
} from "./use-kyc-submission-detail-query";

import {
  useTriggerVerificationChecksMutation,
  useUpdateVerificationSubmissionMutation,
} from "@/features/kyc-submission-verification";
import type {
  UpdateVerificationRequest,
  TriggerVerificationDocCheckRequest,
  verificationdocument_VerificationDocument,
  customer_Religion,
  gender_Gender,
} from "@/shared/api/generated";

const RELIGION_VALUES: readonly customer_Religion[] = ["Islam", "Kristen", "Hindu", "Budha", "Konghucu"] as const;

function parseReligion(value?: string): customer_Religion | undefined {
  if (!value) return undefined;
  return RELIGION_VALUES.includes(value as customer_Religion) ? (value as customer_Religion) : undefined;
}

const GENDER_VALUES: readonly gender_Gender[] = ["M", "F"] as const;

function parseGender(value?: string): gender_Gender | undefined {
  if (!value) return undefined;
  return GENDER_VALUES.includes(value as gender_Gender) ? (value as gender_Gender) : undefined;
}

export interface UseKycSubmissionDetailPageLogicReturn {
  query: ReturnType<typeof useKycSubmissionDetailPageQuery>;
  detail?: KycSubmissionDetail;

  isLeftLocked: boolean;
  onConfirmEnableEdit: () => void;
  onCancelLeftEdit: () => void;
  onSaveLeftEdit: () => void;
  isSavingLeftEdit: boolean;
  /** True when at least one editable field differs from the loaded detail. */
  isLeftDraftDirty: boolean;
  leftDraft: KycLeftEditDraft;
  setLeftDraft: (next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft)) => void;

  currentStatus: EplStatusValue;
  isStatusEditable: boolean;
  onConfirmGenerateFromOcr: () => void;
  onEditDocument: (docType?: string) => void;

  isRunningVerificationChecks: boolean;
  onRunVerificationChecks: () => Promise<void>;

  idDocumentPreview?: KycDocumentImage;
  selfieDocumentPreview?: KycDocumentImage;

  onIdDocumentFilesSelected: (files: File[]) => void;
  onSelfieFilesSelected: (files: File[]) => void;
}

/**
 * Page-level state and action handlers for `/kyc-submission/$id`.
 */
export interface KycLeftEditDraft {
  fullname?: string;
  gender?: string;
  birthDate?: string;
  countryCode?: string;
  mobile?: string;
  email?: string;
  nationality?: string;
  religion?: string;
  birthPlace?: string;
  motherName?: string;
  marriageStatus?: string;
  occupationId?: string;
  occupationName?: string;
  rejectionNote?: string;

  identityDocumentType?: string;
  identityDocumentNumber?: string;
  identityDocumentIssueDate?: string;
  identityDocumentExpireDate?: string;

  arcNumber?: string;
  arcExpiryDate?: string;
  addressLine?: string;
  provinceId?: string;
  provinceName?: string;
  cityId?: string;
  cityName?: string;
  districtId?: string;
  districtName?: string;
  subdistrictId?: string;
  subdistrictName?: string;
  postalCode?: string;
  rt?: string;
  rw?: string;
  isPhotocopy?: boolean;
}

const LEFT_DRAFT_KEYS: ReadonlyArray<keyof KycLeftEditDraft> = [
  "fullname",
  "gender",
  "birthDate",
  "countryCode",
  "mobile",
  "email",
  "nationality",
  "religion",
  "birthPlace",
  "motherName",
  "marriageStatus",
  "occupationId",
  "occupationName",
  "rejectionNote",
  "identityDocumentType",
  "identityDocumentNumber",
  "identityDocumentIssueDate",
  "identityDocumentExpireDate",
  "arcNumber",
  "arcExpiryDate",
  "addressLine",
  "provinceId",
  "provinceName",
  "cityId",
  "cityName",
  "districtId",
  "districtName",
  "subdistrictId",
  "subdistrictName",
  "postalCode",
  "rt",
  "rw",
  "isPhotocopy",
] as const;

function normalizeDraftValue(value: unknown): unknown {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }
  return value;
}

function isLeftDraftDirty(current: KycLeftEditDraft, initial: KycLeftEditDraft): boolean {
  for (const key of LEFT_DRAFT_KEYS) {
    const a = normalizeDraftValue(current[key]);
    const b = normalizeDraftValue(initial[key]);
    if (a !== b) return true;
  }
  return false;
}

export function useKycSubmissionDetailPageLogic({
  id,
}: KycSubmissionDetailQueryParams): UseKycSubmissionDetailPageLogicReturn {
  const query = useKycSubmissionDetailPageQuery({ id });
  const detail = query.data;

  const [isLeftEditEnabled, setIsLeftEditEnabled] = useState(false);
  const isLeftLocked = !isLeftEditEnabled;

  const [leftDraft, setLeftDraft] = useState<KycLeftEditDraft>({});

  const initialLeftDraft = useMemo<KycLeftEditDraft>(() => {
    if (!detail) return {};
    return {
      fullname: detail.fullname,
      gender: detail.gender,
      birthDate: detail.birthDate,
      countryCode: detail.countryCode,
      mobile: detail.mobile,
      email: detail.email,
      nationality: detail.nationality,
      religion: detail.religion,
      birthPlace: detail.birthPlace,
      motherName: detail.motherName,
      marriageStatus: detail.marriageStatus,
      occupationId: detail.occupationId,
      occupationName: detail.occupationName,
      rejectionNote: detail.rejectionNote,
      identityDocumentType: detail.identityDocumentType,
      identityDocumentNumber: detail.identityDocumentNumber,
      identityDocumentIssueDate: detail.identityDocumentIssueDate,
      identityDocumentExpireDate: detail.identityDocumentExpireDate,
      arcNumber: detail.arcNumber,
      arcExpiryDate: detail.arcExpiryDate,
      addressLine: detail.addressLine,
      provinceId: detail.provinceId !== undefined ? String(detail.provinceId) : undefined,
      provinceName: detail.provinceName,
      cityId: detail.cityId !== undefined ? String(detail.cityId) : undefined,
      cityName: detail.cityName,
      districtId: detail.districtId !== undefined ? String(detail.districtId) : undefined,
      districtName: detail.districtName,
      subdistrictId: detail.subdistrictId !== undefined ? String(detail.subdistrictId) : undefined,
      subdistrictName: detail.subdistrictName,
      postalCode: detail.postalCode,
      rt: detail.rt,
      rw: detail.rw,
      isPhotocopy: detail.isPhotocopy,
    };
  }, [detail]);

  const leftDraftDirty = useMemo(() => isLeftDraftDirty(leftDraft, initialLeftDraft), [initialLeftDraft, leftDraft]);

  useEffect(() => {
    if (!detail) return;
    setLeftDraft({
      ...initialLeftDraft,
    });
    setIsLeftEditEnabled(false);
  }, [detail, initialLeftDraft]);

  const onConfirmEnableEdit = useCallback(() => {
    setIsLeftEditEnabled(true);
  }, []);

  const onCancelLeftEdit = useCallback(() => {
    setLeftDraft({ ...initialLeftDraft });
    setIsLeftEditEnabled(false);
  }, [initialLeftDraft]);

  const updateSubmissionMutation = useUpdateVerificationSubmissionMutation();
  const onSaveLeftEdit = useCallback(() => {
    if (!detail) return;
    if (!leftDraftDirty) return;

    const parseNumber = (value?: string): number | undefined => {
      if (!value) return undefined;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    };
    const documentTypes: verificationdocument_VerificationDocument[] = [
      "KTP",
      "KK",
      "PASSPORT",
      "SELFIE_PHOTO",
      "HK_ID",
      "Empty",
      "OTHER",
      "SG_WORKING_PERMIT",
      "SG_WORKING_PERMIT_BACK",
      "ARC_FRONT",
      "ARC_BACK",
    ];
    const identityDocumentType = leftDraft.identityDocumentType;
    const normalizedDocumentType =
      identityDocumentType && documentTypes.includes(identityDocumentType as verificationdocument_VerificationDocument)
        ? (identityDocumentType as verificationdocument_VerificationDocument)
        : undefined;

    const body: UpdateVerificationRequest = {
      submission_data: {
        person: {
          name: leftDraft.fullname,
          phone_number: leftDraft.mobile,
          gender: parseGender(leftDraft.gender),
          birth_date: leftDraft.birthDate,
        },
        personal_information: {
          email: leftDraft.email,
          nationality: leftDraft.nationality,
          religion: parseReligion(leftDraft.religion),
          birth_place: leftDraft.birthPlace,
          mother_name: leftDraft.motherName,
          marriage_status: leftDraft.marriageStatus,
          occupation_id: leftDraft.occupationId,
        },
        address: {
          street_name: leftDraft.addressLine,
          province_id: parseNumber(leftDraft.provinceId),
          province_name: leftDraft.provinceName,
          city_id: parseNumber(leftDraft.cityId),
          city_name: leftDraft.cityName,
          district_id: parseNumber(leftDraft.districtId),
          district_name: leftDraft.districtName,
          subdistrict_id: parseNumber(leftDraft.subdistrictId),
          subdistrict_name: leftDraft.subdistrictName,
          postal_code: leftDraft.postalCode,
          rt: leftDraft.rt,
          rw: leftDraft.rw,
        },
        identity_document: {
          type: normalizedDocumentType,
          number: leftDraft.identityDocumentNumber,
          issue_date: leftDraft.identityDocumentIssueDate,
          expire_date: leftDraft.identityDocumentExpireDate,
          is_photocopy: leftDraft.isPhotocopy,
        },
        arc: {
          number: leftDraft.arcNumber,
          expiry_date: leftDraft.arcExpiryDate,
        },
      },
    };

    updateSubmissionMutation.mutate(
      { id: detail.id, body },
      {
        onSuccess: () => {
          setIsLeftEditEnabled(false);
        },
      },
    );
  }, [detail, leftDraft, leftDraftDirty, updateSubmissionMutation]);

  const normalizedStatus = String(detail?.status ?? "pending").toLowerCase();
  const availableStatusValues = new Set(EPL_STATUS_OPTIONS.map((item) => item.value));
  const currentStatus = (availableStatusValues.has(normalizedStatus as EplStatusValue)
    ? normalizedStatus
    : "pending") as EplStatusValue;
  const isStatusEditable = currentStatus !== "approved";

  const checkMutation = useTriggerVerificationChecksMutation();

  const idDocumentPreview = detail?.idDocument;
  const selfieDocumentPreview = detail?.selfieDocument;

  const verificationCheckRequest = useMemo<TriggerVerificationDocCheckRequest | null>(() => {
    if (!detail) return null;
    if (!detail.arcNumber || !idDocumentPreview?.imageUrl || !selfieDocumentPreview?.imageUrl) {
      return null;
    }

    return {
      arc_number: detail.arcNumber,
      id_file_path: idDocumentPreview.imageUrl,
      selfie_file_path: selfieDocumentPreview.imageUrl,
    };
  }, [detail, idDocumentPreview, selfieDocumentPreview]);

  const onRunVerificationChecks = useCallback(async () => {
    if (!detail) return;

    if (!verificationCheckRequest) {
      toast.error("Document verification prerequisites are missing (arc number or images).");
      return;
    }

    await checkMutation.mutateAsync({
      id: detail.id,
      body: verificationCheckRequest,
    });
  }, [checkMutation, detail, verificationCheckRequest]);

  const onConfirmGenerateFromOcr = useCallback(() => {
    setIsLeftEditEnabled(true);
    toast.info("Generate data from OCR: no action yet.");
  }, []);

  const onEditDocument = useCallback((docType?: string) => {
    toast.info(`Edit document action is not available yet (${docType ?? "unknown"}).`);
  }, []);

  const onIdDocumentFilesSelected = useCallback(() => {
    toast.info("ID document upload is not connected to an API yet.");
  }, []);

  const onSelfieFilesSelected = useCallback(() => {
    toast.info("Selfie upload is not connected to an API yet.");
  }, []);

  return {
    query,
    detail,
    isLeftLocked,
    onConfirmEnableEdit,
    onCancelLeftEdit,
    onSaveLeftEdit,
    isSavingLeftEdit: updateSubmissionMutation.isPending,
    isLeftDraftDirty: leftDraftDirty,
    leftDraft,
    setLeftDraft,
    currentStatus,
    isStatusEditable,

    isRunningVerificationChecks: checkMutation.isPending,
    onRunVerificationChecks,
    onConfirmGenerateFromOcr,
    onEditDocument,

    idDocumentPreview,
    selfieDocumentPreview,

    onIdDocumentFilesSelected,
    onSelfieFilesSelected,
  };
}


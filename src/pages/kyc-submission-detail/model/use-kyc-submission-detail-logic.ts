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
  useRejectReasonsQuery,
  useTriggerVerificationChecksMutation,
  useUpdateVerificationSubmissionMutation,
  useUpdateVerificationStatusMutation,
} from "@/features/kyc-submission-verification";
import type { RejectReasonOption } from "@/features/kyc-submission-verification";
import type {
  UpdateVerificationRequest,
  TriggerVerificationDocCheckRequest,
  UpdateStatusVerifSubmissionRequest,
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
  isEnableEditConfirmOpen: boolean;
  setIsEnableEditConfirmOpen: (next: boolean) => void;
  onOpenEnableEditConfirm: () => void;
  onConfirmEnableEdit: () => void;
  onCancelLeftEdit: () => void;
  onSaveLeftEdit: () => void;
  isSavingLeftEdit: boolean;
  leftDraft: KycLeftEditDraft;
  setLeftDraft: (next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft)) => void;

  currentStatus: EplStatusValue;
  eplStatusDraft: EplStatusValue;
  hasEplStatusChanged: boolean;
  setEplStatusDraft: (next: EplStatusValue) => void;
  isStatusModalOpen: boolean;
  setIsStatusModalOpen: (next: boolean) => void;
  isStatusEditable: boolean;
  rejectReasons: RejectReasonOption[];
  isRejectReasonsLoading: boolean;
  selectedRejectReasonCode: string;
  setSelectedRejectReasonCode: (next: string) => void;

  isSavingEplStatus: boolean;
  onSaveEplStatus: () => void;

  isCheckModalOpen: boolean;
  setIsCheckModalOpen: (next: boolean) => void;
  isRunningVerificationChecks: boolean;
  onRunVerificationChecks: () => Promise<void>;

  isGenerateFromOcrModalOpen: boolean;
  setIsGenerateFromOcrModalOpen: (next: boolean) => void;
  onUpdateDataFromOcr: () => void;
  onConfirmGenerateFromOcr: () => void;
  onEditDocument: (docType?: string) => void;

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

export function useKycSubmissionDetailPageLogic({
  id,
}: KycSubmissionDetailQueryParams): UseKycSubmissionDetailPageLogicReturn {
  const query = useKycSubmissionDetailPageQuery({ id });
  const detail = query.data;

  const [isLeftEditEnabled, setIsLeftEditEnabled] = useState(false);
  const isLeftLocked = !isLeftEditEnabled;
  const [isEnableEditConfirmOpen, setIsEnableEditConfirmOpen] = useState(false);

  const [leftDraft, setLeftDraft] = useState<KycLeftEditDraft>({});

  useEffect(() => {
    if (!detail) return;
    setLeftDraft({
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
    });
    setIsLeftEditEnabled(false);
  }, [detail]);

  const onOpenEnableEditConfirm = useCallback(() => {
    setIsEnableEditConfirmOpen(true);
  }, []);

  const onConfirmEnableEdit = useCallback(() => {
    setIsEnableEditConfirmOpen(false);
    setIsLeftEditEnabled(true);
  }, []);

  const onCancelLeftEdit = useCallback(() => {
    if (detail) {
      setLeftDraft({
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
      });
    }
    setIsLeftEditEnabled(false);
  }, [detail]);

  const updateSubmissionMutation = useUpdateVerificationSubmissionMutation();
  const onSaveLeftEdit = useCallback(() => {
    if (!detail) return;

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
  }, [detail, leftDraft, updateSubmissionMutation]);

  const normalizedStatus = String(detail?.status ?? "pending").toLowerCase();
  const availableStatusValues = new Set(EPL_STATUS_OPTIONS.map((item) => item.value));
  const currentStatus = (availableStatusValues.has(normalizedStatus as EplStatusValue)
    ? normalizedStatus
    : "pending") as EplStatusValue;
  const isStatusEditable = currentStatus !== "approved";

  const [eplStatusDraft, setEplStatusDraft] = useState<EplStatusValue>(currentStatus);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedRejectReasonCode, setSelectedRejectReasonCode] = useState("");
  const rejectReasonsQuery = useRejectReasonsQuery(detail?.countryCode);

  useEffect(() => {
    setEplStatusDraft(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    setSelectedRejectReasonCode("");
  }, [detail?.id]);

  useEffect(() => {
    if (eplStatusDraft !== "rejected") {
      setSelectedRejectReasonCode("");
    }
  }, [eplStatusDraft]);

  useEffect(() => {
    if (isStatusModalOpen && detail?.countryCode) {
      void rejectReasonsQuery.refetch();
    }
  }, [detail?.countryCode, isStatusModalOpen, rejectReasonsQuery]);

  const hasEplStatusChanged = eplStatusDraft !== currentStatus;

  const updateStatusMutation = useUpdateVerificationStatusMutation();
  const checkMutation = useTriggerVerificationChecksMutation();

  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isGenerateFromOcrModalOpen, setIsGenerateFromOcrModalOpen] = useState(false);

  const idDocumentPreview = detail?.idDocument;
  const selfieDocumentPreview = detail?.selfieDocument;

  const onSaveEplStatus = useCallback(() => {
    if (!detail) {
      return;
    }
    if (!hasEplStatusChanged) {
      return;
    }

    const body: UpdateStatusVerifSubmissionRequest = {};
    if (eplStatusDraft === "rejected") {
      const selectedReason = rejectReasonsQuery.data?.find((item) => item.code === selectedRejectReasonCode);
      if (!selectedReason) {
        toast.error("Please select a rejection reason.");
        return;
      }
      body.rejection_code = selectedReason.code;
      body.rejection_notes = selectedReason.description || selectedReason.title;
    }

    updateStatusMutation.mutate({
      id: detail.id,
      status: eplStatusDraft,
      body,
    });
  }, [
    detail,
    eplStatusDraft,
    hasEplStatusChanged,
    rejectReasonsQuery.data,
    selectedRejectReasonCode,
    updateStatusMutation,
  ]);

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

  const onUpdateDataFromOcr = useCallback(() => {
    setIsGenerateFromOcrModalOpen(true);
  }, []);

  const onConfirmGenerateFromOcr = useCallback(() => {
    setIsGenerateFromOcrModalOpen(false);
    setIsEnableEditConfirmOpen(false);
    setIsLeftEditEnabled(true);
    toast.info("Generate data from OCR: no action yet.");
  }, []);

  const onEditDocument = useCallback((docType?: string) => {
    toast.info(`Edit document action is not available yet (${docType ?? "unknown"}).`);
  }, []);

  const onIdDocumentFilesSelected = useCallback((_files: File[]) => {
    toast.info("ID document upload is not connected to an API yet.");
  }, []);

  const onSelfieFilesSelected = useCallback((_files: File[]) => {
    toast.info("Selfie upload is not connected to an API yet.");
  }, []);

  return {
    query,
    detail,
    isLeftLocked,
    isEnableEditConfirmOpen,
    setIsEnableEditConfirmOpen,
    onOpenEnableEditConfirm,
    onConfirmEnableEdit,
    onCancelLeftEdit,
    onSaveLeftEdit,
    isSavingLeftEdit: updateSubmissionMutation.isPending,
    leftDraft,
    setLeftDraft,
    currentStatus,
    eplStatusDraft,
    hasEplStatusChanged,
    setEplStatusDraft,
    isStatusModalOpen,
    setIsStatusModalOpen,
    isStatusEditable,
    rejectReasons: rejectReasonsQuery.data ?? [],
    isRejectReasonsLoading: rejectReasonsQuery.isLoading,
    selectedRejectReasonCode,
    setSelectedRejectReasonCode,
    isSavingEplStatus: updateStatusMutation.isPending,
    onSaveEplStatus,

    isCheckModalOpen,
    setIsCheckModalOpen,
    isRunningVerificationChecks: checkMutation.isPending,
    onRunVerificationChecks,

    isGenerateFromOcrModalOpen,
    setIsGenerateFromOcrModalOpen,
    onUpdateDataFromOcr,
    onConfirmGenerateFromOcr,
    onEditDocument,

    idDocumentPreview,
    selfieDocumentPreview,

    onIdDocumentFilesSelected,
    onSelfieFilesSelected,
  };
}


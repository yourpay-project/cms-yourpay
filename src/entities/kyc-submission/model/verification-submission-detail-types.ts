import { z } from "zod";

/**
 * UI document image representation for verification submissions.
 */
export const kycDocumentImageSchema = z.object({
  type: z.string().optional(),
  label: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type KycDocumentImage = z.infer<typeof kycDocumentImageSchema>;

/**
 * A single verification check (AML, ARC uniqueness, KTP checks, etc).
 */
export const kycCheckDetailSchema = z.object({
  status: z.string().optional(),
  score: z.number().optional(),
  failedReason: z.string().optional(),
  lastSubmitAt: z.string().optional(),
});

export type KycCheckDetail = z.infer<typeof kycCheckDetailSchema>;

export const kycDocumentVerificationSchema = z.object({
  aml: kycCheckDetailSchema.optional(),
  arc_unique: kycCheckDetailSchema.optional(),
  ktp_data_feedback: kycCheckDetailSchema.optional(),
  ktp_data_valid: kycCheckDetailSchema.optional(),
  ktp_unique: kycCheckDetailSchema.optional(),
  passport_unique: kycCheckDetailSchema.optional(),
  selfie_liveness_valid: kycCheckDetailSchema.optional(),
  similar_photo: kycCheckDetailSchema.optional(),
});

export type KycDocumentVerification = z.infer<typeof kycDocumentVerificationSchema>;

/**
 * UI-friendly detail view model for `/kyc-submission/$id`.
 */
export const kycSubmissionDetailSchema = z.object({
  id: z.string(),
  status: z.string().optional(),
  rejectionNote: z.string().optional(),

  // High-level submitter info (best-effort mapping from `submission_data`).
  fullname: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  countryCode: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  birthPlace: z.string().optional(),
  motherName: z.string().optional(),
  marriageStatus: z.string().optional(),
  occupationId: z.string().optional(),
  occupationName: z.string().optional(),

  // Identity + arc metadata (best-effort mapping from `submission_data`).
  identityDocumentType: z.string().optional(),
  identityDocumentNumber: z.string().optional(),
  identityDocumentIssueDate: z.string().optional(),
  identityDocumentExpireDate: z.string().optional(),

  arcNumber: z.string().optional(),
  arcExpiryDate: z.string().optional(),
  addressLine: z.string().optional(),
  provinceId: z.number().optional(),
  provinceName: z.string().optional(),
  cityId: z.number().optional(),
  cityName: z.string().optional(),
  districtId: z.number().optional(),
  districtName: z.string().optional(),
  subdistrictId: z.number().optional(),
  subdistrictName: z.string().optional(),
  postalCode: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
  isPhotocopy: z.boolean().optional(),

  // Document images and verification progress.
  documents: z.array(kycDocumentImageSchema),
  idDocument: kycDocumentImageSchema.optional(),
  selfieDocument: kycDocumentImageSchema.optional(),
  documentVerification: kycDocumentVerificationSchema.optional(),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type KycSubmissionDetail = z.infer<typeof kycSubmissionDetailSchema>;

/**
 * Raw API response schema for `GET /v1/operators/verification-submissions/{id}`.
 * We validate only the fields we use for the UI, keeping the schema resilient.
 */
export const apiVerificationSubmissionHeadersResponseSchema = z.object({
  data: z
    .object({
      header_id: z.string().optional(),
      status: z.string().optional(),
      rejection_note: z.string().optional(),
      country_code: z.string().optional(),
      document_list: z
        .array(
          z.object({
            image_url: z.string().optional(),
            label: z.string().optional(),
            type: z.string().optional(),
          }),
        )
        .optional(),
      document_verification: z
        .object({
          aml: z
            .object({
              status: z.string().optional(),
              score: z.number().optional(),
              failed_reason: z.string().optional(),
              last_submit_at: z.string().optional(),
            })
            .nullable()
            .optional(),
          arc_unique: z
            .object({
              status: z.string().optional(),
              score: z.number().optional(),
              failed_reason: z.string().optional(),
              last_submit_at: z.string().optional(),
            })
            .nullable()
            .optional(),
          ktp_data_feedback: z
            .object({
              status: z.string().optional(),
              score: z.number().optional(),
              failed_reason: z.string().optional(),
              last_submit_at: z.string().optional(),
            })
            .nullable()
            .optional(),
          ktp_data_valid: z
            .object({
              status: z.string().optional(),
              score: z.number().optional(),
              failed_reason: z.string().optional(),
              last_submit_at: z.string().optional(),
            })
            .nullable()
            .optional(),
          ktp_unique: z
            .object({
              status: z.string().optional(),
              score: z.number().optional(),
              failed_reason: z.string().optional(),
              last_submit_at: z.string().optional(),
            })
            .nullable()
            .optional(),
          passport_unique: z
            .object({
              status: z.string().optional(),
              score: z.number().optional(),
              failed_reason: z.string().optional(),
              last_submit_at: z.string().optional(),
            })
            .nullable()
            .optional(),
          selfie_liveness_valid: z
            .object({
              status: z.string().optional(),
              score: z.number().optional(),
              failed_reason: z.string().optional(),
              last_submit_at: z.string().optional(),
            })
            .nullable()
            .optional(),
          similar_photo: z
            .object({
              status: z.string().optional(),
              score: z.number().optional(),
              failed_reason: z.string().optional(),
              last_submit_at: z.string().optional(),
            })
            .nullable()
            .optional(),
        })
        .nullable()
        .optional(),
      submission_data: z
        .object({
          address: z
            .object({
              province_id: z.number().optional(),
              street: z.string().optional(),
              street_name: z.string().optional(),
              province_name: z.string().optional(),
              city_id: z.number().optional(),
              city_name: z.string().optional(),
              district_id: z.number().optional(),
              district_name: z.string().optional(),
              subdistrict_id: z.number().optional(),
              subdistrict_name: z.string().optional(),
              postal_code: z.string().optional(),
              rt: z.string().optional(),
              rw: z.string().optional(),
            })
            .optional(),
          arc: z
            .object({
              number: z.string().optional(),
              expiry_date: z.string().optional(),
            })
            .optional(),
          identity_document: z
            .object({
              type: z.string().optional(),
              number: z.string().optional(),
              issue_date: z.string().optional(),
              expire_date: z.string().optional(),
              is_photocopy: z.boolean().optional(),
            })
            .optional(),
          person: z
            .object({
              name: z.string().optional(),
              phone_number: z.string().optional(),
              birth_date: z.string().optional(),
              gender: z.string().optional(),
            })
            .optional(),
          personal_information: z
            .object({
              email: z.string().optional(),
              nationality: z.string().optional(),
              religion: z.string().optional(),
              birth_place: z.string().optional(),
              mother_name: z.string().optional(),
              marriage_status: z.string().optional(),
              occupation_id: z.string().optional(),
              occupation_name: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      metadata: z
        .object({
          created_at: z.string().optional(),
          updated_at: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  request_id: z.string().optional(),
});

/**
 * Maps validated API response into the UI view model.
 */
export function mapVerificationSubmissionDetailResponse(
  api: z.infer<typeof apiVerificationSubmissionHeadersResponseSchema>,
  fallbackId: string,
): KycSubmissionDetail {
  const detail = api.data;
  const id =
    detail?.header_id ??
    // Best-effort fallbacks: different backend implementations may name this differently.
    (detail as { id?: string; kyc_header_id?: string } | undefined)?.id ??
    (detail as { kyc_header_id?: string } | undefined)?.kyc_header_id ??
    fallbackId;

  const documents = (detail?.document_list ?? []).map((doc): KycDocumentImage => ({
    type: doc.type,
    label: doc.label,
    imageUrl: doc.image_url,
  }));

  const idDocument = documents.find((d) => d.type && d.type !== "SELFIE_PHOTO");
  const selfieDocument = documents.find((d) => d.type === "SELFIE_PHOTO");

  const address = detail?.submission_data?.address;
  const addressLineParts = [
    address?.street_name ?? address?.street,
    address?.city_name,
    address?.province_name,
    address?.postal_code,
  ].filter(Boolean) as string[];
  const addressLine = addressLineParts.length ? addressLineParts.join(", ") : undefined;

  const arc = detail?.submission_data?.arc;
  const identityDocument = detail?.submission_data?.identity_document;
  const person = detail?.submission_data?.person;
  const personalInfo = detail?.submission_data?.personal_information;

  const documentVerification: KycDocumentVerification | undefined = detail?.document_verification
    ? {
        aml: detail.document_verification.aml
          ? {
              status: detail.document_verification.aml.status,
              score: detail.document_verification.aml.score,
              failedReason: detail.document_verification.aml.failed_reason,
              lastSubmitAt: detail.document_verification.aml.last_submit_at,
            }
          : undefined,
        arc_unique: detail.document_verification.arc_unique
          ? {
              status: detail.document_verification.arc_unique.status,
              score: detail.document_verification.arc_unique.score,
              failedReason: detail.document_verification.arc_unique.failed_reason,
              lastSubmitAt: detail.document_verification.arc_unique.last_submit_at,
            }
          : undefined,
        ktp_data_feedback: detail.document_verification.ktp_data_feedback
          ? {
              status: detail.document_verification.ktp_data_feedback.status,
              score: detail.document_verification.ktp_data_feedback.score,
              failedReason: detail.document_verification.ktp_data_feedback.failed_reason,
              lastSubmitAt: detail.document_verification.ktp_data_feedback.last_submit_at,
            }
          : undefined,
        ktp_data_valid: detail.document_verification.ktp_data_valid
          ? {
              status: detail.document_verification.ktp_data_valid.status,
              score: detail.document_verification.ktp_data_valid.score,
              failedReason: detail.document_verification.ktp_data_valid.failed_reason,
              lastSubmitAt: detail.document_verification.ktp_data_valid.last_submit_at,
            }
          : undefined,
        ktp_unique: detail.document_verification.ktp_unique
          ? {
              status: detail.document_verification.ktp_unique.status,
              score: detail.document_verification.ktp_unique.score,
              failedReason: detail.document_verification.ktp_unique.failed_reason,
              lastSubmitAt: detail.document_verification.ktp_unique.last_submit_at,
            }
          : undefined,
        passport_unique: detail.document_verification.passport_unique
          ? {
              status: detail.document_verification.passport_unique.status,
              score: detail.document_verification.passport_unique.score,
              failedReason: detail.document_verification.passport_unique.failed_reason,
              lastSubmitAt: detail.document_verification.passport_unique.last_submit_at,
            }
          : undefined,
        selfie_liveness_valid: detail.document_verification.selfie_liveness_valid
          ? {
              status: detail.document_verification.selfie_liveness_valid.status,
              score: detail.document_verification.selfie_liveness_valid.score,
              failedReason: detail.document_verification.selfie_liveness_valid.failed_reason,
              lastSubmitAt: detail.document_verification.selfie_liveness_valid.last_submit_at,
            }
          : undefined,
        similar_photo: detail.document_verification.similar_photo
          ? {
              status: detail.document_verification.similar_photo.status,
              score: detail.document_verification.similar_photo.score,
              failedReason: detail.document_verification.similar_photo.failed_reason,
              lastSubmitAt: detail.document_verification.similar_photo.last_submit_at,
            }
          : undefined,
      }
    : undefined;

  const mapped: KycSubmissionDetail = {
    id,
    status: detail?.status,
    rejectionNote: detail?.rejection_note,

    fullname: person?.name,
    gender: person?.gender,
    birthDate: person?.birth_date,
    countryCode: detail?.country_code,
    mobile: person?.phone_number,
    email: personalInfo?.email,
    nationality: personalInfo?.nationality,
    religion: personalInfo?.religion,
    birthPlace: personalInfo?.birth_place,
    motherName: personalInfo?.mother_name,
    marriageStatus: personalInfo?.marriage_status,
    occupationId: personalInfo?.occupation_id,
    occupationName: personalInfo?.occupation_name,

    identityDocumentType: identityDocument?.type,
    identityDocumentNumber: identityDocument?.number,
    identityDocumentIssueDate: identityDocument?.issue_date,
    identityDocumentExpireDate: identityDocument?.expire_date,

    arcNumber: arc?.number,
    arcExpiryDate: arc?.expiry_date,
    addressLine,
    provinceId: address?.province_id,
    provinceName: address?.province_name,
    cityId: address?.city_id,
    cityName: address?.city_name,
    districtId: address?.district_id,
    districtName: address?.district_name,
    subdistrictId: address?.subdistrict_id,
    subdistrictName: address?.subdistrict_name,
    postalCode: address?.postal_code,
    rt: address?.rt,
    rw: address?.rw,
    isPhotocopy: identityDocument?.is_photocopy,

    documents,
    idDocument,
    selfieDocument,
    documentVerification,

    createdAt: detail?.metadata?.created_at,
    updatedAt: detail?.metadata?.updated_at,
  };

  return kycSubmissionDetailSchema.parse(mapped);
}


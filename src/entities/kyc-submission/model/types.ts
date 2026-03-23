import { z } from "zod";

/**
 * Zod schema for a single KYC submission row in the list.
 *
 * View model derived from the backend response of
 * `GET v1/operators/verification-submissions` (items array).
 *
 * Aligned with Laravel KycFormAdapterService::mapListViewItem and
 * KYCSubmissionHeadersApi model fields.
 */
export const kycSubmissionSchema = z.object({
  /** KYC header / submission ID (primary identifier). */
  id: z.string().optional(),
  /** Backend kyc_header_id (used for detail link). */
  kycHeaderId: z.string().optional(),
  /** Customer ID. */
  customerId: z.string().optional(),
  /** Full name of the submitter. */
  fullname: z.string().optional(),
  /** Country code (e.g. ID, SG, HK). */
  countryCode: z.string().optional(),
  /** Mobile / phone number. */
  mobile: z.string().optional(),
  /** Phone number (alias). */
  phoneNumber: z.string().optional(),
  /** Submission status: pending, approved, rejected. */
  status: z.string().optional(),
  /** Document type (e.g. KTP, SG Working Permit). */
  documentType: z.string().optional(),
  /** Upload date (display string from metadata.created_at). */
  uploadDate: z.string().optional(),
  /** Last update (display string from metadata.updated_at). */
  lastUpdate: z.string().optional(),
  /** Raw created_at from metadata. */
  createdAt: z.string().optional(),
  /** Raw updated_at from metadata. */
  updatedAt: z.string().optional(),
  /** Verified by (admin/user identifier). */
  verifiedBy: z.string().optional(),
  /** Rejection note (for rejected submissions). */
  rejectionNote: z.string().optional(),
  /** ARC number (e.g. for SG). */
  arcNumber: z.string().optional(),
  /** ARC expiry date. */
  arcExpiryDate: z.string().optional(),
  /** Reverify status: Yes / No. */
  reverifyStatus: z.string().optional(),
});

/**
 * KYC submission entity as displayed in the list table.
 */
export type KycSubmission = z.infer<typeof kycSubmissionSchema>;

/**
 * Zod schema for a single filter option returned by backend metadata.
 */
export const kycFilterOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export type KycFilterOption = z.infer<typeof kycFilterOptionSchema>;
export const kycFilterTypeSchema = z.enum(["control", "options", "date_range"]);
export type KycFilterType = z.infer<typeof kycFilterTypeSchema>;

/**
 * Zod schema for a backend filter descriptor used by dynamic filter rendering.
 */
export const kycFilterDefinitionSchema = z.object({
  key: z.string(),
  name: z.string().optional(),
  type: kycFilterTypeSchema,
  options: z.array(kycFilterOptionSchema),
  format: z.string().optional(),
});

export type KycFilterDefinition = z.infer<typeof kycFilterDefinitionSchema>;

/**
 * Normalized map representation for quick lookup by filter key.
 */
export const kycFiltersSchema = z.record(z.array(kycFilterOptionSchema));
export type KycFilters = z.infer<typeof kycFiltersSchema>;

const generatedFilterOptionSchema = z.object({
  key: z.string().optional(),
  label: z.string().optional(),
  value: z.string().optional(),
});

const generatedFilterConfigSchema = z.object({
  format: z.string().optional(),
  key: z.string().optional(),
  list: z.array(z.string()).optional(),
  name: z.string().optional(),
  options: z.array(generatedFilterOptionSchema).optional(),
  type: z.enum(["control", "options", "date_range"]).optional(),
});

const generatedKycItemSchema = z
  .object({
    id: z.string().optional(),
    customer_id: z.string().optional(),
    fullname: z.string().optional(),
    country_code: z.string().optional(),
    phone_number: z.string().optional(),
    document_type: z.string().optional(),
    status: z.string().optional(),
    verified_by: z.string().optional(),
    rejection_note: z.string().optional(),
    arc_number: z.string().optional(),
    arc_expiry_date: z.string().optional(),
    is_reverification: z.boolean().optional(),
    metadata: z
      .object({
        created_at: z.string().optional(),
        updated_at: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

const generatedPaginationSchema = z.object({
  current_page: z.number().int().optional(),
  items: z.array(generatedKycItemSchema).optional(),
  limit: z.number().int().optional(),
  total_items: z.number().int().optional(),
  total_page: z.number().int().optional(),
  filters: z.array(generatedFilterConfigSchema).optional(),
});

export const kycVerificationSubmissionsResponseSchema = z.object({
  data: generatedPaginationSchema.optional(),
  request_id: z.string().optional(),
});
export type KycVerificationSubmissionsResponse = z.infer<
  typeof kycVerificationSubmissionsResponseSchema
>;

/**
 * Paginated KYC list response for the page (mapped from API).
 */
export const kycSubmissionsResponseSchema = z.object({
  data: z.array(kycSubmissionSchema),
  total: z.number(),
  filters: kycFiltersSchema.optional(),
  filterDefinitions: z.array(kycFilterDefinitionSchema).optional(),
});

export type KycSubmissionsResponse = z.infer<typeof kycSubmissionsResponseSchema>;

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
 * Zod schema for the raw API pagination payload from
 * GET v1/operators/verification-submissions.
 */
const apiKycItemSchema = z.object({
  id: z.unknown().optional(),
  kyc_header_id: z.unknown().optional(),
  customer_id: z.string().optional(),
  fullname: z.string().optional(),
  country_code: z.string().optional(),
  phone_number: z.string().optional(),
  mobile: z.string().optional(),
  status: z.unknown().optional(),
  document_type: z.string().optional(),
  verified_by: z.string().optional(),
  rejection_note: z.string().optional(),
  arc_number: z.string().optional(),
  arc_expiry_date: z.string().optional(),
  metadata: z
    .object({
      created_at: z.string().optional(),
      updated_at: z.string().optional(),
    })
    .passthrough()
    .optional(),
  is_reverification: z.boolean().optional(),
});

const apiPaginationSchema = z.object({
  current_page: z.number().int().optional(),
  items: z.array(apiKycItemSchema).optional(),
  limit: z.number().int().optional(),
  total_items: z.number().int().optional(),
  total_page: z.number().int().optional(),
});

/**
 * Raw API response schema for verification-submissions list.
 */
export const apiKycListResponseSchema = z.object({
  data: apiPaginationSchema.optional(),
  req_id: z.string().optional(),
});

export type ApiKycListResponse = z.infer<typeof apiKycListResponseSchema>;

/**
 * Paginated KYC list response for the page (mapped from API).
 */
export const kycSubmissionsResponseSchema = z.object({
  data: z.array(kycSubmissionSchema),
  total: z.number(),
});

export type KycSubmissionsResponse = z.infer<typeof kycSubmissionsResponseSchema>;

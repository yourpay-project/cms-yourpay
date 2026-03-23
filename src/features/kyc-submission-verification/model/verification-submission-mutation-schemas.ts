import { z } from "zod";

export const updateVerificationStatusResponseSchema = z.object({
  kyc_approval_id: z.string().optional(),
  kyc_history_id: z.string().optional(),
});

export type UpdateVerificationStatusResponse = z.infer<typeof updateVerificationStatusResponseSchema>;

export const triggerVerificationChecksResponseSchema = z.object({
  data: z.object({
    message: z.string().optional(),
    status: z.string().optional(),
  }),
  request_id: z.string().optional(),
});

export type TriggerVerificationChecksResponse = z.infer<typeof triggerVerificationChecksResponseSchema>;

export const updateVerificationSubmissionResponseSchema = z.object({
  data: z
    .object({
      id: z.string().optional(),
      updated_at: z.string().optional(),
    })
    .optional(),
  request_id: z.string().optional(),
});

export type UpdateVerificationSubmissionResponse = z.infer<
  typeof updateVerificationSubmissionResponseSchema
>;


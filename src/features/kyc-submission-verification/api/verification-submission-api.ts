import { parseApiData } from "@/shared/api";
import {
  putV1OperatorsVerificationSubmissionsById,
  postV1OperatorsVerificationSubmissionsByIdCheck,
  putV1OperatorsVerificationSubmissionsByIdById,
} from "@/shared/api/generated";
import type {
  TriggerVerificationDocCheckRequest,
  UpdateStatusVerifSubmissionRequest,
  UpdateVerificationRequest,
} from "@/shared/api/generated";

import {
  triggerVerificationChecksResponseSchema,
  updateVerificationSubmissionResponseSchema,
  updateVerificationStatusResponseSchema,
  type TriggerVerificationChecksResponse,
  type UpdateVerificationSubmissionResponse,
  type UpdateVerificationStatusResponse,
} from "../model/verification-submission-mutation-schemas";

export interface UpdateVerificationStatusParams {
  id: string;
  status: string;
  body: UpdateStatusVerifSubmissionRequest;
  signal?: AbortSignal;
}

export interface TriggerVerificationChecksParams {
  id: string;
  body: TriggerVerificationDocCheckRequest;
  signal?: AbortSignal;
}

export interface UpdateVerificationSubmissionParams {
  id: string;
  body: UpdateVerificationRequest;
  signal?: AbortSignal;
}

export async function updateVerificationStatusApi({
  id,
  status,
  body,
  signal,
}: UpdateVerificationStatusParams): Promise<UpdateVerificationStatusResponse> {
  const res = await putV1OperatorsVerificationSubmissionsByIdById(body, {
    signal,
    pathParams: { id, status },
  });
  return parseApiData(updateVerificationStatusResponseSchema, res);
}

export async function triggerVerificationChecksApi({
  id,
  body,
  signal,
}: TriggerVerificationChecksParams): Promise<TriggerVerificationChecksResponse> {
  const res = await postV1OperatorsVerificationSubmissionsByIdCheck(body, {
    signal,
    pathParams: { id },
  });
  return parseApiData(triggerVerificationChecksResponseSchema, res);
}

export async function updateVerificationSubmissionApi({
  id,
  body,
  signal,
}: UpdateVerificationSubmissionParams): Promise<UpdateVerificationSubmissionResponse> {
  const res = await putV1OperatorsVerificationSubmissionsById(body, {
    signal,
    pathParams: { id },
  });
  return parseApiData(updateVerificationSubmissionResponseSchema, res);
}


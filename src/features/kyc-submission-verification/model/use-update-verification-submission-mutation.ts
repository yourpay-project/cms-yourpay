import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateVerificationSubmissionApi,
  type UpdateVerificationSubmissionParams,
} from "../api/verification-submission-api";

export interface UpdateVerificationSubmissionPayload {
  id: string;
  body: UpdateVerificationSubmissionParams["body"];
}

const DETAIL_QUERY_KEY_BASE = ["operators-verification-submission-detail"];

export function useUpdateVerificationSubmissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateVerificationSubmissionPayload) => {
      return updateVerificationSubmissionApi({
        id: payload.id,
        body: payload.body,
      });
    },
    onSuccess: (_, payload) => {
      void queryClient.invalidateQueries({ queryKey: [...DETAIL_QUERY_KEY_BASE, payload.id] });
      toast.success("Submission data updated.");
    },
    onError: () => {
      toast.error("Failed to update submission data.");
    },
  });
}

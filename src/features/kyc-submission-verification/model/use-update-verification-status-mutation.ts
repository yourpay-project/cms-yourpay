import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateVerificationStatusApi, type UpdateVerificationStatusParams } from "../api/verification-submission-api";

export interface UpdateVerificationStatusPayload {
  id: string;
  status: string;
  body: UpdateVerificationStatusParams["body"];
}

const DETAIL_QUERY_KEY_BASE = ["operators-verification-submission-detail"];

export function useUpdateVerificationStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateVerificationStatusPayload) => {
      return updateVerificationStatusApi({
        id: payload.id,
        status: payload.status,
        body: payload.body,
      });
    },
    onSuccess: (_, payload) => {
      void queryClient.invalidateQueries({ queryKey: [...DETAIL_QUERY_KEY_BASE, payload.id] });
      toast.success("Verification status updated.");
    },
    onError: () => {
      toast.error("Failed to update verification status.");
    },
  });
}


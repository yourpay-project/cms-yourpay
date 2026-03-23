import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  triggerVerificationChecksApi,
  type TriggerVerificationChecksParams,
} from "../api/verification-submission-api";

export interface TriggerVerificationChecksPayload {
  id: string;
  body: TriggerVerificationChecksParams["body"];
}

const DETAIL_QUERY_KEY_BASE = ["operators-verification-submission-detail"];

export function useTriggerVerificationChecksMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TriggerVerificationChecksPayload) => {
      return triggerVerificationChecksApi({
        id: payload.id,
        body: payload.body,
      });
    },
    onSuccess: (_, payload) => {
      void queryClient.invalidateQueries({ queryKey: [...DETAIL_QUERY_KEY_BASE, payload.id] });
      toast.success("Verification checks triggered.");
    },
    onError: () => {
      toast.error("Failed to trigger verification checks.");
    },
  });
}


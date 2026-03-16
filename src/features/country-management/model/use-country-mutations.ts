import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiClientError } from "@/shared/api";
import type { Country } from "@/entities/country";

import { countryApi, type NewCountryRequest, type UpdateCountryRequest } from "../api";

const COUNTRIES_QUERY_KEY = ["operator-countries"];

export interface CreateCountryPayload extends NewCountryRequest {}

export interface UpdateCountryPayload extends UpdateCountryRequest {}

export interface DeleteCountryPayload {
  code: string;
}

export function useCreateCountryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCountryPayload) => {
      const res = await countryApi.create(payload);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COUNTRIES_QUERY_KEY });
      toast.success("Country created.");
    },
    onError: (error: ApiClientError | Error) => {
      const message = "Failed to create country.";
      toast.error(message);
    },
  });
}

export function useUpdateCountryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCountryPayload) => {
      const res = await countryApi.update(payload);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COUNTRIES_QUERY_KEY });
      toast.success("Country updated.");
    },
    onError: () => {
      toast.error("Failed to update country.");
    },
  });
}

export function useDeleteCountryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ code }: DeleteCountryPayload) => {
      const res = await countryApi.remove({ pathParams: { countryCode: code } });
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: COUNTRIES_QUERY_KEY });
      toast.success("Country deleted.");
    },
    onError: () => {
      toast.error("Failed to delete country.");
    },
  });
}


import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { apiClient, type ApiResponse } from "@/shared/api";
import { usersResponseSchema, type UsersResponse } from "../model";

/**
 * Parameters for the customers list query (pagination + filters).
 */
export interface UseUsersQueryParams {
  pageIndex: number;
  pageSize: number;
  /** Debounced search keyword (name, phone, etc.). */
  search?: string;
  /** User status filter (e.g. active, inactive, blocked, all). */
  status?: string;
  /** Gender filter (M / F / all). */
  gender?: string;
  /** Country of registration filter (e.g. ID, HK, SG, ALL). */
  country?: string;
}

/**
 * Zod schema for the raw backend pagination payload returned by
 * `GET v1/operators/customers`.
 */
const apiCustomerSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone_number: z.string().optional(),
  is_phone_active: z.boolean().optional(),
  country_of_registration: z.string().optional(),
  nationality: z.string().optional(),
  status: z.string().optional(),
  gender: z.string().optional(),
  metadata: z
    .object({
      created_at: z.string().optional(),
    })
    .partial()
    .optional(),
});

const apiPaginationSchema = z.object({
  current_page: z.number().int().optional(),
  items: z.array(apiCustomerSchema).optional(),
  limit: z.number().int().optional(),
  total_items: z.number().int().optional(),
  total_page: z.number().int().optional(),
});

const apiCustomersResponseSchema = z.object({
  data: apiPaginationSchema.optional(),
  req_id: z.string().optional(),
});

/**
 * TanStack Query hook for fetching a paginated list of YourPay customers.
 *
 * Uses `GET v1/operators/customers` with query params:
 * - `page`, `limit`
 * - `country_of_registration`
 * - `gender`
 * - `status`
 * - `keyword`
 *
 * The raw response is validated with Zod and then mapped into the
 * `UsersResponse` shape consumed by the rest of the app.
 */
export function useUsersQuery({
  pageIndex,
  pageSize,
  search,
  status,
  gender,
  country,
}: UseUsersQueryParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(pageIndex + 1));
  searchParams.set("limit", String(pageSize));

  if (country && country !== "ALL") {
    searchParams.set("country_of_registration", country);
  }

  if (status && status !== "all") {
    searchParams.set("status", status);
  }

  if (gender && gender !== "all") {
    searchParams.set("gender", gender);
  }

  if (search && search.trim() !== "") {
    searchParams.set("keyword", search.trim());
  }

  const path = `v1/operators/customers?${searchParams.toString()}`;

  return useQuery<ApiResponse<unknown>, Error, UsersResponse>({
    queryKey: ["operators-customers", pageIndex, pageSize, search, status, gender, country],
    queryFn: async ({ signal }): Promise<ApiResponse<unknown>> =>
      apiClient.get<unknown>(path, { signal }),
    // Keep showing previous page data while new filters/pagination are loading
    // to avoid visual glitches in the table.
    placeholderData: (previousData) => previousData,
    select: (res): UsersResponse => {
      // Helpful console for local debugging (no user-facing side effects).
      // eslint-disable-next-line no-console
      console.debug("Fetching customers from v1/operators/customers", {
        path,
        status,
        gender,
        country,
      });

      const validated = apiCustomersResponseSchema.parse(res.data);
      const page = validated.data;

      const items = page?.items ?? [];
      const total = page?.total_items ?? 0;

      const mapped = items.map((item) => {
        const firstName = item.first_name ?? "";
        const lastName = item.last_name ?? "";

        return {
          id: item.id ?? "",
          userId: item.user_id ?? "",
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          phoneNumber: item.phone_number ?? undefined,
          isPhoneActive: item.is_phone_active ?? undefined,
          countryOfRegistration: item.country_of_registration ?? undefined,
          nationality: item.nationality ?? undefined,
          status: item.status ?? undefined,
          createdAt: item.metadata?.created_at ?? undefined,
          gender: item.gender ? (item.gender as "M" | "F") : undefined,
        };
      });

      return usersResponseSchema.parse({
        data: mapped,
        total,
      });
    },
  });
}


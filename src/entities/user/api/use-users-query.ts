import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { apiClient, type ApiResponse } from "@/shared/api";
import {
  usersFilterDefinitionSchema,
  usersFiltersSchema,
  usersResponseSchema,
  type UsersFilterDefinition,
  type UsersFilterOption,
  type UsersFilters,
  type UsersFilterType,
  type UsersResponse,
} from "../model";

/**
 * Parameters for the customers list query (pagination + filters).
 */
export interface UseUsersQueryParams {
  pageIndex: number;
  pageSize: number;
  /** Debounced search keyword (name, phone, etc.). */
  search?: string;
  /** Dynamic filter values keyed by backend query param name. */
  filters?: Record<string, string>;
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
  filters: z.unknown().optional(),
});

const apiCustomersResponseSchema = z.object({
  data: apiPaginationSchema.optional(),
  req_id: z.string().optional(),
});

interface NormalizedUsersFiltersResult {
  filters: UsersFilters;
  filterDefinitions: UsersFilterDefinition[];
}

function normalizeControlListOption(rawValue: string): UsersFilterOption {
  const normalized = String(rawValue ?? "").trim();
  if (normalized.toLowerCase() === "all") {
    return { label: "All", value: "" };
  }
  const upper = normalized.toUpperCase();
  return { label: upper, value: upper };
}

function normalizeOptionRecord(option: unknown): UsersFilterOption | null {
  if (typeof option === "string") {
    return {
      label: option,
      value: option,
    };
  }

  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    const labelCandidate =
      record.label ?? record.text ?? record.name ?? record.title ?? record.display_value;
    const valueCandidate = record.value ?? record.id ?? record.code ?? record.key ?? record.identifier;
    const hasUsableLabelOrValue = labelCandidate != null || valueCandidate != null;
    if (!hasUsableLabelOrValue) {
      return null;
    }
    return {
      label: String(labelCandidate ?? valueCandidate ?? ""),
      value: String(valueCandidate ?? ""),
    };
  }

  return null;
}

function normalizeUsersFilters(input: unknown): NormalizedUsersFiltersResult | undefined {
  if (!input || typeof input !== "object") {
    return undefined;
  }

  if (Array.isArray(input)) {
    const map: Record<string, UsersFilterOption[]> = {};
    const definitions: UsersFilterDefinition[] = [];

    for (const item of input) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const record = item as Record<string, unknown>;
      const key = typeof record.key === "string" ? record.key : "";
      if (!key) {
        continue;
      }

      const rawType = typeof record.type === "string" ? record.type : "options";
      const type: UsersFilterType =
        rawType === "control" || rawType === "date_range" ? rawType : "options";
      const rawOptions = Array.isArray(record.options) ? record.options : [];
      const rawList = Array.isArray(record.list) ? record.list : [];

      const mappedOptions: UsersFilterOption[] =
        type === "control"
          ? rawList
              .map((item): UsersFilterOption | null =>
                typeof item === "string" ? normalizeControlListOption(item) : null
              )
              .filter((option): option is UsersFilterOption => option !== null)
          : rawOptions
              .map((option) => normalizeOptionRecord(option))
              .filter((option): option is UsersFilterOption => option !== null);

      if (type !== "date_range" && mappedOptions.length === 0) {
        continue;
      }

      if (mappedOptions.length > 0) {
        map[key] = mappedOptions;
      }
      const definition = usersFilterDefinitionSchema.safeParse({
        key,
        name: typeof record.name === "string" ? record.name : key,
        type,
        options: mappedOptions,
      });
      if (definition.success) {
        definitions.push(definition.data);
      }
    }

    const parsedMap = usersFiltersSchema.safeParse(map);
    if (!parsedMap.success || definitions.length === 0) {
      return undefined;
    }

    return {
      filters: parsedMap.data,
      filterDefinitions: definitions,
    };
  }

  const direct = usersFiltersSchema.safeParse(input);
  if (direct.success) {
    return {
      filters: direct.data,
      filterDefinitions: Object.entries(direct.data).map(([key, options]) => ({
        key,
        name: key,
        type: "options",
        options,
      })),
    };
  }

  const normalized: Record<string, UsersFilterOption[]> = {};
  for (const [key, options] of Object.entries(input)) {
    if (!Array.isArray(options)) {
      continue;
    }

    const mappedOptions: UsersFilterOption[] = options
      .map((option) => normalizeOptionRecord(option))
      .filter((option): option is UsersFilterOption => option !== null);

    if (mappedOptions.length > 0) {
      normalized[key] = mappedOptions;
    }
  }

  const parsedNormalized = usersFiltersSchema.safeParse(normalized);
  if (!parsedNormalized.success) {
    return undefined;
  }

  return {
    filters: parsedNormalized.data,
    filterDefinitions: Object.entries(parsedNormalized.data).map(([key, options]) => ({
      key,
      name: key,
      type: "options",
      options,
    })),
  };
}

function extractUsersFilters(payload: unknown): NormalizedUsersFiltersResult | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const root = payload as Record<string, unknown>;
  const data = root.data;
  const dataRecord = data && typeof data === "object" ? (data as Record<string, unknown>) : undefined;
  const nestedData = dataRecord?.data;
  const nestedDataRecord =
    nestedData && typeof nestedData === "object" ? (nestedData as Record<string, unknown>) : undefined;
  const pagination = dataRecord?.pagination;
  const paginationRecord =
    pagination && typeof pagination === "object" ? (pagination as Record<string, unknown>) : undefined;
  const meta = dataRecord?.meta;
  const metaRecord = meta && typeof meta === "object" ? (meta as Record<string, unknown>) : undefined;

  const candidates: unknown[] = [
    dataRecord?.filters,
    dataRecord?.filter,
    dataRecord?.available_filters,
    nestedDataRecord?.filters,
    nestedDataRecord?.filter,
    nestedDataRecord?.available_filters,
    paginationRecord?.filters,
    paginationRecord?.filter,
    metaRecord?.filters,
    root.filters,
    root.filter,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeUsersFilters(candidate);
    if (normalized) {
      return normalized;
    }
  }

  const visited = new WeakSet<object>();
  const queue: unknown[] = [payload];
  const maxIterations = 60;
  let iterations = 0;

  while (queue.length > 0 && iterations < maxIterations) {
    iterations += 1;
    const current = queue.shift();
    if (!current || typeof current !== "object") {
      continue;
    }

    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    const normalized = normalizeUsersFilters(current);
    if (normalized) {
      return normalized;
    }

    const record = current as Record<string, unknown>;
    for (const value of Object.values(record)) {
      if (value && typeof value === "object") {
        queue.push(value);
      }
    }
  }

  return undefined;
}

/**
 * TanStack Query hook for fetching a paginated list of YourPay customers.
 *
 * Uses `GET v1/operators/customers` with query params:
 * - `page`, `limit`
 * - dynamic filter keys from `filters` metadata (e.g. `country_of_registration`, `gender`, `status`)
 * - `keyword`
 *
 * The raw response is validated with Zod and then mapped into the
 * `UsersResponse` shape consumed by the rest of the app.
 */
export function useUsersQuery({
  pageIndex,
  pageSize,
  search,
  filters,
}: UseUsersQueryParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(pageIndex + 1));
  searchParams.set("limit", String(pageSize));

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (!value || value.trim() === "") {
        continue;
      }
      searchParams.set(key, value);
    }
  }

  if (search && search.trim() !== "") {
    searchParams.set("keyword", search.trim());
  }

  const path = `v1/operators/customers?${searchParams.toString()}`;

  return useQuery<ApiResponse<unknown>, Error, UsersResponse>({
    queryKey: ["operators-customers", pageIndex, pageSize, search, filters],
    queryFn: async ({ signal }): Promise<ApiResponse<unknown>> =>
      apiClient.get<unknown>(path, { signal }),
    // Keep showing previous page data while new filters/pagination are loading
    // to avoid visual glitches in the table.
    placeholderData: (previousData) => previousData,
    select: (res): UsersResponse => {
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

      const normalizedFilters = normalizeUsersFilters(page?.filters) ?? extractUsersFilters(res.data);

      return usersResponseSchema.parse({
        data: mapped,
        total,
        filters: normalizedFilters?.filters,
        filterDefinitions: normalizedFilters?.filterDefinitions,
      });
    },
  });
}


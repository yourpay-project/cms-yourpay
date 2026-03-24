import { formatDateOnly } from "@/shared/lib";
import {
  type KycFilterDefinition,
  type KycFilterOption,
  type KycFilterType,
  type KycFilters,
  type KycSubmission,
  type KycSubmissionsResponse,
  type KycVerificationSubmissionsResponse,
  kycFilterDefinitionSchema,
  kycFiltersSchema,
  kycSubmissionsResponseSchema,
} from "./types";

interface NormalizedKycFiltersResult {
  filters: KycFilters;
  filterDefinitions: KycFilterDefinition[];
}

type KycVerificationSubmissionItem = NonNullable<
  NonNullable<KycVerificationSubmissionsResponse["data"]>["items"]
>[number];

/**
 * Normalize a generated filter option payload into the shared filter option shape.
 */
function normalizeOptionRecord(option: unknown): KycFilterOption | null {
  if (typeof option === "string") {
    return { label: option, value: option };
  }

  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    const labelCandidate = record.label ?? record.text ?? record.name ?? record.title ?? record.value;
    const valueCandidate = record.value ?? record.id ?? record.code ?? record.key;
    if (labelCandidate == null && valueCandidate == null) return null;
    return {
      label: String(labelCandidate ?? valueCandidate ?? ""),
      value: String(valueCandidate ?? ""),
    };
  }

  return null;
}

function normalizeKycFilters(input: unknown): NormalizedKycFiltersResult | undefined {
  if (!input || !Array.isArray(input)) {
    return undefined;
  }

  const map: Record<string, KycFilterOption[]> = {};
  const definitions: KycFilterDefinition[] = [];

  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const key = typeof item.key === "string" ? item.key : "";
    if (!key) continue;

    const rawType = typeof item.type === "string" ? item.type : "options";
    const type: KycFilterType =
      rawType === "control" || rawType === "date_range" ? rawType : "options";
    const rawOptions = Array.isArray(item.options) ? item.options : [];
    const mappedOptions = rawOptions
      .map((option: unknown) => normalizeOptionRecord(option))
      .filter((option: KycFilterOption | null): option is KycFilterOption => option !== null);

    if (type !== "date_range" && mappedOptions.length === 0) {
      continue;
    }

    if (mappedOptions.length > 0) {
      map[key] = mappedOptions;
    }

    const definition = kycFilterDefinitionSchema.safeParse({
      key,
      name: typeof item.name === "string" ? item.name : key,
      type,
      options: mappedOptions,
      format: typeof item.format === "string" ? item.format : undefined,
    });
    if (definition.success) {
      definitions.push(definition.data);
    }
  }

  const parsedMap = kycFiltersSchema.safeParse(map);
  if (!parsedMap.success || definitions.length === 0) {
    return undefined;
  }

  return { filters: parsedMap.data, filterDefinitions: definitions };
}

function mapKycItem(item: KycVerificationSubmissionItem): KycSubmission {
  const created = item.metadata?.created_at;
  const updated = item.metadata?.updated_at;
  const id = item.id ? String(item.id) : "";
  const kycHeaderId = item.id ? String(item.id) : id;

  return {
    id,
    kycHeaderId,
    customerId: item.customer_id,
    fullname: item.fullname,
    countryCode: item.country_code,
    mobile: item.phone_number,
    phoneNumber: item.phone_number,
    status: item.status,
    documentType: item.document_type,
    uploadDate: formatDateOnly(created),
    lastUpdate: formatDateOnly(updated),
    createdAt: created,
    updatedAt: updated,
    verifiedBy: item.verified_by,
    rejectionNote: item.rejection_note,
    arcNumber: item.arc_number,
    arcExpiryDate: item.arc_expiry_date,
    reverifyStatus: item.is_reverification ? "Yes" : "No",
  };
}

/**
 * Maps generated KYC verification submissions response into the page-ready
 * KYC submissions response model with normalized dynamic filters.
 */
export function mapKycSubmissionsResponse(
  raw: unknown
): KycSubmissionsResponse {
  const validated = (raw ?? {}) as KycVerificationSubmissionsResponse;
  const page = validated.data;
  const items = (page?.items ?? []) as KycVerificationSubmissionItem[];
  const total = page?.total_items ?? 0;
  const data = items.map(mapKycItem);
  const normalizedFilters = normalizeKycFilters(page?.filters);
  return kycSubmissionsResponseSchema.parse({
    data,
    total,
    filters: normalizedFilters?.filters,
    filterDefinitions: normalizedFilters?.filterDefinitions,
  });
}

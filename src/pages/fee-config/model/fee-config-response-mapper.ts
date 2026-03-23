import {
  feeConfigListResponseSchema,
  feeConfigSchema,
  type FeeConfig,
} from "@/entities/fee-config";
import {
  type FeeConfigResponseDTO,
  type ListFeeConfigResponse,
} from "@/shared/api/generated";

function mapApiFeeToEntity(item: FeeConfigResponseDTO): FeeConfig | null {
  const currency = typeof item.currency === "string" ? item.currency : "";
  const feeMode = item.fee_mode === "inclusive" ? "inclusive" : "exclusive";
  const feeType =
    item.fee_type === "percentage" || item.fee_type === "tiered" ? item.fee_type : "fixed";

  const candidate: FeeConfig = {
    id: item.id ?? "",
    name: item.name ?? "",
    nominal: item.fee_value ?? 0,
    service: item.service_name ?? item.service_id ?? "",
    currency,
    feeType,
    feeMode,
    isActive: item.is_active ?? false,
  };

  const parsed = feeConfigSchema.safeParse(candidate);
  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

export function mapApiResponseToFeeConfigList(data: ListFeeConfigResponse | undefined) {
  const list = data?.data?.list ?? [];
  const mapped = list
    .map(mapApiFeeToEntity)
    .filter((item): item is FeeConfig => item !== null);

  return feeConfigListResponseSchema.parse({
    data: mapped,
    total: mapped.length,
  });
}

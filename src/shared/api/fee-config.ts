import { apiClient, type ApiResponse, type RequestOptions } from "./api-client";
import type {
  DeleteFeeConfigResponse,
  FeeConfigResponseDTO,
  ListFeeConfigDetailResponse,
  UpdateFeeConfigRequest,
} from "./generated";

export async function getFeeConfigById(
  id: string,
  init?: RequestOptions,
): Promise<ApiResponse<ListFeeConfigDetailResponse>> {
  return apiClient.get<ListFeeConfigDetailResponse>(`v1/operators/fee/${id}`, init);
}

export async function updateFeeConfigById(
  id: string,
  body: UpdateFeeConfigRequest,
  init?: RequestOptions,
): Promise<ApiResponse<FeeConfigResponseDTO>> {
  return apiClient.put<FeeConfigResponseDTO>(
    `v1/operators/fee/${id}`,
    body as unknown as Record<string, unknown>,
    init,
  );
}

export async function deleteFeeConfigById(
  id: string,
  init?: RequestOptions,
): Promise<ApiResponse<DeleteFeeConfigResponse>> {
  return apiClient.delete<DeleteFeeConfigResponse>(`v1/operators/fee/${id}`, init);
}


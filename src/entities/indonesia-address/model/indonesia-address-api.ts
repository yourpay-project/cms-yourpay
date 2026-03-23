import { parseApiData } from "@/shared/api";
import {
  getV1Cities,
  getV1Districts,
  getV1Provinces,
  getV1SubDistricts,
} from "@/shared/api/generated";

import {
  indonesiaCityResponseSchema,
  indonesiaDistrictResponseSchema,
  indonesiaProvinceResponseSchema,
  indonesiaSubDistrictResponseSchema,
} from "./indonesia-address-schemas";

/**
 * Fetches all provinces (Indonesia master data).
 */
export async function fetchIndonesiaProvinces(signal?: AbortSignal) {
  const res = await getV1Provinces({ signal });
  return parseApiData(indonesiaProvinceResponseSchema, res);
}

/**
 * Fetches all cities; filter by `province_id` in the consumer layer.
 */
export async function fetchIndonesiaCities(signal?: AbortSignal) {
  const res = await getV1Cities({ signal });
  return parseApiData(indonesiaCityResponseSchema, res);
}

/**
 * Fetches all districts; filter by `city_id` in the consumer layer.
 */
export async function fetchIndonesiaDistricts(signal?: AbortSignal) {
  const res = await getV1Districts({ signal });
  return parseApiData(indonesiaDistrictResponseSchema, res);
}

/**
 * Fetches all sub-districts; filter by `district_id` in the consumer layer.
 */
export async function fetchIndonesiaSubDistricts(signal?: AbortSignal) {
  const res = await getV1SubDistricts({ signal });
  return parseApiData(indonesiaSubDistrictResponseSchema, res);
}

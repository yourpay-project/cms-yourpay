import { parseApiData } from "@/shared/api";
import { getV1Occupations } from "@/shared/api/generated";

import { listOccupationResponseSchema } from "./occupation-schemas";

/**
 * Fetches occupation master list for KYC personal/document forms.
 */
export async function fetchOccupations(signal?: AbortSignal) {
  const res = await getV1Occupations({ signal });
  return parseApiData(listOccupationResponseSchema, res);
}

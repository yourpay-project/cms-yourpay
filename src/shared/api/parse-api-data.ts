import type { ZodTypeAny } from "zod";

import type { ApiResponse } from "./types";

/**
 * Parse and validate an API response payload with a Zod schema.
 *
 * This helper standardizes the "validate at the consumer layer" pattern:
 * `schema.parse(res.data)`.
 *
 * @param schema - Zod schema describing the expected payload shape.
 * @param res - Raw API response wrapper returned by `shared/api` client.
 * @returns The validated payload typed as the schema output.
 */
export function parseApiData<TSchema extends ZodTypeAny>(
  schema: TSchema,
  res: ApiResponse<unknown>
): TSchema["_output"] {
  return schema.parse(res.data);
}


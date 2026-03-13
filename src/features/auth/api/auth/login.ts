import { parseApiData, setTokensInCookies } from "@/shared/api";
import { postV1OperatorsLogin } from "@/shared/api/generated";
import type { OperatorLoginRequest } from "@/shared/api/generated";
import { loginResponseSchema, type LoginResponse } from "../../model";

/**
 * Perform an email/password login against the backend.
 *
 * On success:
 * - stores access/refresh tokens in cookies (via `shared/api` helpers),
 * - returns the raw `LoginResponse` including the resolved `AuthUser`.
 */
export const login = async (payload: OperatorLoginRequest): Promise<LoginResponse> => {
  const res = await postV1OperatorsLogin(payload);
  const envelope = parseApiData(loginResponseSchema, res);
  setTokensInCookies(envelope.data.token, undefined, 60 * 15);
  return envelope.data;
};


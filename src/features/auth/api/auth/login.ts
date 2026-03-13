import { parseApiData } from "@/shared/api";
import { postV1OperatorsLogin } from "@/shared/api/generated";
import type { OperatorLoginRequest } from "@/shared/api/generated";
import { loginResponseSchema, type LoginResponse } from "../../model";

/**
 * Perform an email/password login against the backend.
 *
 * On success, returns the raw `LoginResponse` including the resolved `AuthUser`.
 * Token storage is handled by the auth feature (Zustand store), not here.
 */
export const login = async (payload: OperatorLoginRequest): Promise<LoginResponse> => {
  const res = await postV1OperatorsLogin(payload);
  const envelope = parseApiData(loginResponseSchema, res);
  return envelope.data;
};


import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { getV1OperatorsIdentityAccesses } from "@/shared/api/generated";
import { normalizeCode } from "@/shared/lib";

/**
 * Identity access option item for selection modal.
 */
export interface IdentityAccessOption {
  code: string;
  isDefault: boolean;
}

const identityAccessListSchema = z.object({
  data: z
    .object({
      items: z
        .array(
          z.object({
            identity_access_code: z.string().optional(),
            is_default: z.boolean().optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

export function useIdentityAccessOptionsQuery() {
  return useQuery({
    queryKey: ["operators-identity-access-options"],
    queryFn: async ({ signal }) => getV1OperatorsIdentityAccesses({ signal }),
    select: (res): IdentityAccessOption[] => {
      const validated = identityAccessListSchema.parse(res.data);
      const items = validated.data?.items ?? [];

      const options = items
        .filter((item): item is { identity_access_code: string; is_default?: boolean } =>
          Boolean(item.identity_access_code)
        )
        .map((item) => ({
          code: item.identity_access_code,
          isDefault: item.is_default ?? false,
        }));

      const uniqueMap = new Map<string, IdentityAccessOption>();
      for (const option of options) {
        const key = normalizeCode(option.code);
        if (!key) continue;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, option);
        }
      }

      return Array.from(uniqueMap.values()).sort((a, b) => {
        if (a.isDefault !== b.isDefault) {
          if (a.isDefault) {
            return -1;
          }
          return 1;
        }
        return a.code.localeCompare(b.code);
      });
    },
  });
}

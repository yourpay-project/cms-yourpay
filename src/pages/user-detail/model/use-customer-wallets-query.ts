import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { getV1OperatorsCustomersByIdWallets } from "@/shared/api/generated";

/**
 * Normalized customer wallet view model.
 */
export interface CustomerWalletItem {
  id: string;
  balance?: number;
  currency?: string;
  type?: string;
  formattedBalance?: string;
  formattedName?: string;
}

interface UseCustomerWalletsQueryParams {
  customerId: string;
  enabled?: boolean;
}

const customerWalletsResponseSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.string().optional(),
        balance: z.number().optional(),
        currency: z.union([z.string(), z.number(), z.boolean()]).optional(),
        type: z.union([z.string(), z.number(), z.boolean()]).optional(),
        formatted: z
          .object({
            balance: z.string().optional(),
            name: z.string().optional(),
          })
          .optional(),
      })
    )
    .optional(),
});

/**
 * Fetches customer wallet list for wallet modal.
 *
 * @param params - Customer identifier and query enable flag.
 * @returns Customer wallets list query.
 */
export function useCustomerWalletsQuery({ customerId, enabled = true }: UseCustomerWalletsQueryParams) {
  return useQuery({
    queryKey: ["operators-customer-wallets", customerId],
    enabled: enabled && customerId.trim() !== "",
    queryFn: async ({ signal }) =>
      getV1OperatorsCustomersByIdWallets({
        signal,
        pathParams: { customer_id: customerId },
      }),
    select: (res): CustomerWalletItem[] => {
      const validated = customerWalletsResponseSchema.parse(res.data);
      const items = validated.data ?? [];

      return items.map((item, index) => ({
        id: item.id ?? `${customerId}-wallet-${index}`,
        balance: item.balance,
        currency: item.currency != null ? String(item.currency) : undefined,
        type: item.type != null ? String(item.type) : undefined,
        formattedBalance: item.formatted?.balance,
        formattedName: item.formatted?.name,
      }));
    },
  });
}

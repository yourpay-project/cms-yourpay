import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { getV1OperatorsCustomersById } from "@/shared/api/generated";
import { userDetailSchema, type UserDetail } from "../model";

const apiCustomerDetailSchema = z.object({
  data: z
    .object({
      id: z.string().optional(),
      user_id: z.string().optional(),
      identity_access: z
        .array(
          z.object({
            code: z.string().optional(),
            is_default: z.boolean().optional(),
          })
        )
        .optional(),
      access: z
        .object({
          preferred_language: z.string().optional(),
          role: z.string().optional(),
          status: z.string().optional(),
        })
        .optional(),
      personal_information: z
        .object({
          first_name: z.string().optional(),
          last_name: z.string().optional(),
          email: z.string().optional(),
          nationality: z.string().optional(),
          phone_number: z.string().optional(),
        })
        .optional(),
      metadata: z
        .object({
          created_at: z.string().optional(),
          created_by: z.string().optional(),
          updated_at: z.string().optional(),
          updated_by: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

interface UseUserDetailQueryParams {
  customerId: string;
}

export function useUserDetailQuery({ customerId }: UseUserDetailQueryParams) {
  return useQuery({
    queryKey: ["operators-customer-detail", customerId],
    enabled: customerId.trim() !== "",
    queryFn: async ({ signal }) =>
      getV1OperatorsCustomersById({
        signal,
        pathParams: { customer_id: customerId },
      }),
    select: (res): UserDetail => {
      const validated = apiCustomerDetailSchema.parse(res.data);
      const detail = validated.data;

      if (!detail?.id) {
        throw new Error("Customer detail data is unavailable.");
      }

      return userDetailSchema.parse({
        id: detail.id,
        userId: detail.user_id,
        identityAccess: (detail.identity_access ?? [])
          .filter((item): item is { code: string; is_default?: boolean } => Boolean(item.code))
          .map((item) => ({
            code: item.code,
            isDefault: item.is_default ?? false,
          })),
        access: {
          preferredLanguage: detail.access?.preferred_language,
          role: detail.access?.role,
          status: detail.access?.status,
        },
        personalInformation: {
          firstName: detail.personal_information?.first_name,
          lastName: detail.personal_information?.last_name,
          email: detail.personal_information?.email,
          nationality: detail.personal_information?.nationality,
          phoneNumber: detail.personal_information?.phone_number,
        },
        metadata: {
          createdAt: detail.metadata?.created_at,
          createdBy: detail.metadata?.created_by,
          updatedAt: detail.metadata?.updated_at,
          updatedBy: detail.metadata?.updated_by,
        },
      });
    },
  });
}

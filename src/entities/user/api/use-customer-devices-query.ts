import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { getV1OperatorsCustomersByIdDevices } from "@/shared/api/generated";

/**
 * Normalized customer device view model.
 */
export interface CustomerDeviceItem {
  id: string;
  appVersion?: string;
  deviceBrand?: string;
  deviceModel?: string;
  deviceSignature?: string;
  geoLat?: number;
  geoLng?: number;
  lastLoginAt?: string;
  osName?: string;
  osVersion?: string;
  status?: string;
}

interface UseCustomerDevicesQueryParams {
  customerId: string;
  enabled?: boolean;
}

const customerDevicesResponseSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.string().optional(),
        app_version: z.string().optional(),
        device_brand: z.string().optional(),
        device_model: z.string().optional(),
        device_signature: z.string().optional(),
        geo_lat: z.number().optional(),
        geo_lng: z.number().optional(),
        last_login_at: z.string().optional(),
        os_name: z.string().optional(),
        os_version: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .optional(),
});

/**
 * Fetches registered customer devices.
 *
 * @param params - Customer identifier and query enable flag.
 * @returns Customer devices list query.
 */
export function useCustomerDevicesQuery({ customerId, enabled = true }: UseCustomerDevicesQueryParams) {
  return useQuery({
    queryKey: ["operators-customer-devices", customerId],
    enabled: enabled && customerId.trim() !== "",
    queryFn: async ({ signal }) =>
      getV1OperatorsCustomersByIdDevices({
        signal,
        pathParams: { customer_id: customerId },
      }),
    select: (res): CustomerDeviceItem[] => {
      const validated = customerDevicesResponseSchema.parse(res.data);
      const items = validated.data ?? [];

      return items.map((item, index) => ({
        id: item.id ?? `${customerId}-device-${index}`,
        appVersion: item.app_version,
        deviceBrand: item.device_brand,
        deviceModel: item.device_model,
        deviceSignature: item.device_signature,
        geoLat: item.geo_lat,
        geoLng: item.geo_lng,
        lastLoginAt: item.last_login_at,
        osName: item.os_name,
        osVersion: item.os_version,
        status: item.status,
      }));
    },
  });
}

import { useCallback, useMemo } from "react";

import { useIndonesiaAddressMasterQueries } from "@/entities/indonesia-address";

import type { KycLeftEditDraft } from "./use-kyc-submission-detail-logic";

export interface UseKycIndonesiaAddressFieldsParams {
  countryCode?: string;
  draft: KycLeftEditDraft;
  setDraft: (next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft)) => void;
}

/**
 * Builds cascading Indonesia address dropdown state from master-data queries and draft ids.
 */
export function useKycIndonesiaAddressFields({ countryCode, draft, setDraft }: UseKycIndonesiaAddressFieldsParams) {
  const isIndonesia = String(countryCode ?? "").toUpperCase() === "ID";

  const { provincesQuery, citiesQuery, districtsQuery, subDistrictsQuery, isLoading: isMasterLoading } =
    useIndonesiaAddressMasterQueries({ enabled: isIndonesia });

  const provinces = useMemo(() => provincesQuery.data?.data ?? [], [provincesQuery.data]);
  const cities = useMemo(() => citiesQuery.data?.data ?? [], [citiesQuery.data]);
  const districts = useMemo(() => districtsQuery.data?.data ?? [], [districtsQuery.data]);
  const subDistricts = useMemo(() => subDistrictsQuery.data?.data ?? [], [subDistrictsQuery.data]);

  const withFallbackOption = (
    base: { value: string; label: string }[],
    id: string | undefined,
    name: string | undefined,
  ) => {
    if (!id || !name) return base;
    if (base.some((o) => o.value === id)) return base;
    return [{ value: id, label: name }, ...base];
  };

  const provinceOptions = useMemo(() => {
    const base = provinces.map((p) => ({ value: String(p.id), label: p.label }));
    return withFallbackOption(base, draft.provinceId, draft.provinceName);
  }, [provinces, draft.provinceId, draft.provinceName]);

  const cityOptions = useMemo(() => {
    const pid = Number(draft.provinceId);
    if (!Number.isFinite(pid)) return [];
    const base = cities.filter((c) => c.province_id === pid).map((c) => ({ value: String(c.id), label: c.label }));
    return withFallbackOption(base, draft.cityId, draft.cityName);
  }, [cities, draft.provinceId, draft.cityId, draft.cityName]);

  const districtOptions = useMemo(() => {
    const cid = Number(draft.cityId);
    if (!Number.isFinite(cid)) return [];
    const base = districts.filter((d) => d.city_id === cid).map((d) => ({ value: String(d.id), label: d.label }));
    return withFallbackOption(base, draft.districtId, draft.districtName);
  }, [districts, draft.cityId, draft.districtId, draft.districtName]);

  const subDistrictOptions = useMemo(() => {
    const did = Number(draft.districtId);
    if (!Number.isFinite(did)) return [];
    const base = subDistricts.filter((s) => s.district_id === did).map((s) => ({ value: String(s.id), label: s.label }));
    return withFallbackOption(base, draft.subdistrictId, draft.subdistrictName);
  }, [subDistricts, draft.districtId, draft.subdistrictId, draft.subdistrictName]);

  const onProvinceChange = useCallback(
    (value: string) => {
      const label = provinces.find((p) => String(p.id) === value)?.label ?? "";
      setDraft((prev) => ({
        ...prev,
        provinceId: value || undefined,
        provinceName: label || undefined,
        cityId: undefined,
        cityName: undefined,
        districtId: undefined,
        districtName: undefined,
        subdistrictId: undefined,
        subdistrictName: undefined,
        postalCode: undefined,
      }));
    },
    [provinces, setDraft],
  );

  const onCityChange = useCallback(
    (value: string) => {
      const label = cities.find((c) => String(c.id) === value)?.label ?? "";
      setDraft((prev) => ({
        ...prev,
        cityId: value || undefined,
        cityName: label || undefined,
        districtId: undefined,
        districtName: undefined,
        subdistrictId: undefined,
        subdistrictName: undefined,
        postalCode: undefined,
      }));
    },
    [cities, setDraft],
  );

  const onDistrictChange = useCallback(
    (value: string) => {
      const label = districts.find((d) => String(d.id) === value)?.label ?? "";
      setDraft((prev) => ({
        ...prev,
        districtId: value || undefined,
        districtName: label || undefined,
        subdistrictId: undefined,
        subdistrictName: undefined,
        postalCode: undefined,
      }));
    },
    [districts, setDraft],
  );

  const onSubDistrictChange = useCallback(
    (value: string) => {
      const label = subDistricts.find((s) => String(s.id) === value)?.label ?? "";
      setDraft((prev) => ({
        ...prev,
        subdistrictId: value || undefined,
        subdistrictName: label || undefined,
        postalCode: undefined,
      }));
    },
    [subDistricts, setDraft],
  );

  return {
    isIndonesia,
    isMasterLoading,
    provinceOptions,
    cityOptions,
    districtOptions,
    subDistrictOptions,
    onProvinceChange,
    onCityChange,
    onDistrictChange,
    onSubDistrictChange,
  };
}

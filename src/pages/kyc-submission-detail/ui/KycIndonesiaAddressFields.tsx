import type { FC } from "react";

import type { SelectDropdownOption } from "@/shared/ui";
import { Input, SelectDropdown } from "@/shared/ui";

import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";

export interface KycIndonesiaAddressFieldsProps {
  draft: KycLeftEditDraft;
  setDraft: (next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft)) => void;
  isEditable: boolean;
  isMasterLoading: boolean;
  provinceOptions: SelectDropdownOption[];
  cityOptions: SelectDropdownOption[];
  districtOptions: SelectDropdownOption[];
  subDistrictOptions: SelectDropdownOption[];
  onProvinceChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onSubDistrictChange: (value: string) => void;
}

const FieldLabel: FC<{ htmlFor?: string; children: string }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
    {children}
  </label>
);

/**
 * Indonesia address block: full address + cascading administrative selects + postal + RT/RW.
 */
export const KycIndonesiaAddressFields: FC<KycIndonesiaAddressFieldsProps> = ({
  draft,
  setDraft,
  isEditable,
  isMasterLoading,
  provinceOptions,
  cityOptions,
  districtOptions,
  subDistrictOptions,
  onProvinceChange,
  onCityChange,
  onDistrictChange,
  onSubDistrictChange,
}) => {
  const locked = !isEditable;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <Input
          id="kyc-submission-address-line"
          size="md"
          type="text"
          label="Full Address"
          allowClear={isEditable}
          readOnly={locked}
          value={draft.addressLine ?? ""}
          onChange={(e) => setDraft((prev) => ({ ...prev, addressLine: e.target.value }))}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="kyc-address-province">Province</FieldLabel>
        <SelectDropdown
          id="kyc-address-province"
          value={draft.provinceId ?? ""}
          onChange={onProvinceChange}
          options={provinceOptions}
          placeholder="Select an option"
          disabled={locked}
          isLoading={isMasterLoading}
          searchable
          allowClear={isEditable}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="kyc-address-city">City</FieldLabel>
        <SelectDropdown
          id="kyc-address-city"
          value={draft.cityId ?? ""}
          onChange={onCityChange}
          options={cityOptions}
          placeholder={draft.provinceId ? "Select an option" : "Select province first"}
          disabled={locked || !draft.provinceId}
          isLoading={isMasterLoading}
          searchable
          allowClear={isEditable}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="kyc-address-district">District</FieldLabel>
        <SelectDropdown
          id="kyc-address-district"
          value={draft.districtId ?? ""}
          onChange={onDistrictChange}
          options={districtOptions}
          placeholder={draft.cityId ? "Select an option" : "Select city first"}
          disabled={locked || !draft.cityId}
          isLoading={isMasterLoading}
          searchable
          allowClear={isEditable}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="kyc-address-subdistrict">Sub District</FieldLabel>
        <SelectDropdown
          id="kyc-address-subdistrict"
          value={draft.subdistrictId ?? ""}
          onChange={onSubDistrictChange}
          options={subDistrictOptions}
          placeholder={draft.districtId ? "Select an option" : "Select district first"}
          disabled={locked || !draft.districtId}
          isLoading={isMasterLoading}
          searchable
          allowClear={isEditable}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Input
          id="kyc-submission-postal-code"
          size="md"
          type="text"
          label="Postal Code"
          allowClear={isEditable}
          readOnly={locked}
          value={draft.postalCode ?? ""}
          onChange={(e) => setDraft((prev) => ({ ...prev, postalCode: e.target.value }))}
        />
      </div>

      <Input id="kyc-submission-rt" size="md" type="text" label="RT" allowClear={isEditable} readOnly={locked} value={draft.rt ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, rt: e.target.value }))} />
      <Input id="kyc-submission-rw" size="md" type="text" label="RW" allowClear={isEditable} readOnly={locked} value={draft.rw ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, rw: e.target.value }))} />
    </div>
  );
};

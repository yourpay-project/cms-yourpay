import type { FC } from "react";

import { Card, CardContent, CardHeader, CardTitle, Input } from "@/shared/ui";

import type { KycUserDataCardsAddressSectionProps } from "./KycUserDataCardsAddressSection.type";
import { KycIndonesiaAddressFields } from "./KycIndonesiaAddressFields";

/**
 * Address information card section for `KycUserDataCards`.
 */
export const KycUserDataCardsAddressSection: FC<KycUserDataCardsAddressSectionProps> = ({
  draft,
  setDraft,
  isEditable,
  indonesiaAddress,
}) => {
  const addressNode = indonesiaAddress.isIndonesia ? (
    <KycIndonesiaAddressFields
      draft={draft}
      setDraft={setDraft}
      isEditable={isEditable}
      isMasterLoading={indonesiaAddress.isMasterLoading}
      provinceOptions={indonesiaAddress.provinceOptions}
      cityOptions={indonesiaAddress.cityOptions}
      districtOptions={indonesiaAddress.districtOptions}
      subDistrictOptions={indonesiaAddress.subDistrictOptions}
      onProvinceChange={indonesiaAddress.onProvinceChange}
      onCityChange={indonesiaAddress.onCityChange}
      onDistrictChange={indonesiaAddress.onDistrictChange}
      onSubDistrictChange={indonesiaAddress.onSubDistrictChange}
    />
  ) : (
    <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <Input
          id="kyc-submission-address-line"
          size="sm"
          type="text"
          label="Full Address"
          allowClear={isEditable}
          readOnly={!isEditable}
          value={draft.addressLine ?? ""}
          onChange={(e) => setDraft((prev) => ({ ...prev, addressLine: e.target.value }))}
        />
      </div>
      <Input
        id="kyc-submission-province-name"
        size="sm"
        type="text"
        label="Province"
        allowClear={isEditable}
        readOnly={!isEditable}
        value={draft.provinceName ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, provinceName: e.target.value }))}
      />
      <Input
        id="kyc-submission-city-name"
        size="sm"
        type="text"
        label="City"
        allowClear={isEditable}
        readOnly={!isEditable}
        value={draft.cityName ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, cityName: e.target.value }))}
      />
      <Input
        id="kyc-submission-district-name"
        size="sm"
        type="text"
        label="District"
        allowClear={isEditable}
        readOnly={!isEditable}
        value={draft.districtName ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, districtName: e.target.value }))}
      />
      <Input
        id="kyc-submission-subdistrict-name"
        size="sm"
        type="text"
        label="Sub District"
        allowClear={isEditable}
        readOnly={!isEditable}
        value={draft.subdistrictName ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, subdistrictName: e.target.value }))}
      />
      <Input
        id="kyc-submission-postal-code"
        size="sm"
        type="text"
        label="Postal Code"
        allowClear={isEditable}
        readOnly={!isEditable}
        value={draft.postalCode ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, postalCode: e.target.value }))}
      />
      <Input
        id="kyc-submission-rt"
        size="sm"
        type="text"
        label="RT"
        allowClear={isEditable}
        readOnly={!isEditable}
        value={draft.rt ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, rt: e.target.value }))}
      />
      <Input
        id="kyc-submission-rw"
        size="sm"
        type="text"
        label="RW"
        allowClear={isEditable}
        readOnly={!isEditable}
        value={draft.rw ?? ""}
        onChange={(e) => setDraft((prev) => ({ ...prev, rw: e.target.value }))}
      />
    </div>
  );

  return (
    <Card className="min-w-0 max-w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Address Information</CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 max-w-full">
        {addressNode}
      </CardContent>
    </Card>
  );
};


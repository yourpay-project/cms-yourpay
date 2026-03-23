import type { FC } from "react";
import { useMemo } from "react";
import { FileText } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/shared/ui";

import { useKycIndonesiaAddressFields } from "../model/use-kyc-indonesia-address-fields";
import type { KycLeftEditDraft } from "../model/use-kyc-submission-detail-logic";
import { KycDocumentInformationCard } from "./KycDocumentInformationCard";
import { KycIndonesiaAddressFields } from "./KycIndonesiaAddressFields";
import { KycPersonalInformationCard } from "./KycPersonalInformationCard";
import { KycSubmissionIdentityFields } from "./KycSubmissionIdentityFields";

export interface KycUserDataCardsProps {
  countryCode?: string;
  submissionStatus: string;
  draft: KycLeftEditDraft;
  setDraft: (next: KycLeftEditDraft | ((prev: KycLeftEditDraft) => KycLeftEditDraft)) => void;
  isEditable: boolean;
  isSaving: boolean;
  onOpenEnableEditConfirm: () => void;
  onUpdateDataFromOcr: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

const COUNTRY_LABELS: Record<string, string> = {
  ID: "Indonesia",
  HK: "Hong Kong",
  SG: "Singapore",
  TW: "Taiwan",
  KR: "Korea",
};

/**
 * Left-column cards that show submitter + document metadata.
 * EPL status is intentionally excluded (it lives in the right column).
 */
export const KycUserDataCards: FC<KycUserDataCardsProps> = ({
  countryCode,
  submissionStatus,
  draft,
  setDraft,
  isEditable,
  isSaving,
  onOpenEnableEditConfirm,
  onUpdateDataFromOcr,
  onCancelEdit,
  onSaveEdit,
}) => {
  const countryLabel = COUNTRY_LABELS[String(countryCode ?? "").toUpperCase()] ?? (countryCode || "Unknown");

  const whatsappHref = useMemo(() => {
    const normalized = String(draft.mobile ?? "").replace(/[^\d]/g, "");
    if (!normalized) return undefined;
    return `https://wa.me/${normalized}`;
  }, [draft.mobile]);

  const indonesiaAddress = useKycIndonesiaAddressFields({
    countryCode,
    draft,
    setDraft,
  });

  const showRejectionNote = String(submissionStatus ?? "").toLowerCase() === "rejected";

  return (
    <Card className="min-w-0 max-w-full">
      <CardHeader className="py-4">
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-3">
          <CardTitle className="min-w-0 text-base leading-snug break-words md:text-lg">{`User Verification Submission ${countryLabel} Details`}</CardTitle>
          <div className="flex min-w-0 w-full flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-full shrink-0 gap-1.5 sm:w-auto"
              onClick={onUpdateDataFromOcr}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Update data from OCR</span>
            </Button>
            {isEditable ? null : (
              <Button
                type="button"
                variant="default"
                size="sm"
                className="h-8 w-full shrink-0 sm:w-auto"
                onClick={onOpenEnableEditConfirm}
              >
                Enable Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 max-w-full space-y-4">
        <KycSubmissionIdentityFields
          draft={draft}
          setDraft={setDraft}
          isEditable={isEditable}
          whatsappHref={whatsappHref}
        />

        <KycPersonalInformationCard draft={draft} setDraft={setDraft} isEditable={isEditable} />

        <Card className="min-w-0 max-w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Address Information</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0 max-w-full">
            {indonesiaAddress.isIndonesia ? (
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
                    size="md"
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
                  size="md"
                  type="text"
                  label="Province"
                  allowClear={isEditable}
                  readOnly={!isEditable}
                  value={draft.provinceName ?? ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, provinceName: e.target.value }))}
                />
                <Input
                  id="kyc-submission-city-name"
                  size="md"
                  type="text"
                  label="City"
                  allowClear={isEditable}
                  readOnly={!isEditable}
                  value={draft.cityName ?? ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, cityName: e.target.value }))}
                />
                <Input
                  id="kyc-submission-district-name"
                  size="md"
                  type="text"
                  label="District"
                  allowClear={isEditable}
                  readOnly={!isEditable}
                  value={draft.districtName ?? ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, districtName: e.target.value }))}
                />
                <Input
                  id="kyc-submission-subdistrict-name"
                  size="md"
                  type="text"
                  label="Sub District"
                  allowClear={isEditable}
                  readOnly={!isEditable}
                  value={draft.subdistrictName ?? ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, subdistrictName: e.target.value }))}
                />
                <Input
                  id="kyc-submission-postal-code"
                  size="md"
                  type="text"
                  label="Postal Code"
                  allowClear={isEditable}
                  readOnly={!isEditable}
                  value={draft.postalCode ?? ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, postalCode: e.target.value }))}
                />
                <Input
                  id="kyc-submission-rt"
                  size="md"
                  type="text"
                  label="RT"
                  allowClear={isEditable}
                  readOnly={!isEditable}
                  value={draft.rt ?? ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, rt: e.target.value }))}
                />
                <Input
                  id="kyc-submission-rw"
                  size="md"
                  type="text"
                  label="RW"
                  allowClear={isEditable}
                  readOnly={!isEditable}
                  value={draft.rw ?? ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, rw: e.target.value }))}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <KycDocumentInformationCard countryCode={countryCode} draft={draft} setDraft={setDraft} isEditable={isEditable} />

        {showRejectionNote ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">Rejection Note</span>
            <div className="min-h-[3rem] select-text rounded-md border border-input bg-muted/20 px-3 py-2.5 text-sm leading-relaxed text-foreground">
              {draft.rejectionNote?.trim() ? draft.rejectionNote : "—"}
            </div>
          </div>
        ) : null}

        {isEditable ? (
          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <Button type="button" variant="outline" className="h-9" onClick={onCancelEdit} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="button" className="h-9" onClick={onSaveEdit} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};


import type { FC } from "react";
import { useMemo } from "react";

import { Card, CardContent } from "@/shared/ui";

import { useKycIndonesiaAddressFields } from "../model/use-kyc-indonesia-address-fields";
import type { KycUserDataCardsProps } from "./KycUserDataCards.type";
import { getCountryLabel } from "./kyc-user-data-cards-utils";
import { KycSubmissionIdentityFields } from "./KycSubmissionIdentityFields";
import { KycPersonalInformationCard } from "./KycPersonalInformationCard";
import { KycUserDataCardsHeader } from "./KycUserDataCardsHeader";
import { KycUserDataCardsAddressSection } from "./KycUserDataCardsAddressSection";
import { KycDocumentInformationCard } from "./KycDocumentInformationCard";
import { KycUserDataCardsFooterActions } from "./KycUserDataCardsFooterActions";

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
  isDirty,
  onOpenEnableEditConfirm,
  onUpdateDataFromOcr,
  onCancelEdit,
  onSaveEdit,
}) => {
  const countryLabel = getCountryLabel(countryCode);

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
      <KycUserDataCardsHeader
        countryLabel={countryLabel}
        isEditable={isEditable}
        onUpdateDataFromOcr={onUpdateDataFromOcr}
        onOpenEnableEditConfirm={onOpenEnableEditConfirm}
      />
      <CardContent className="min-w-0 max-w-full space-y-4">
        <KycSubmissionIdentityFields
          draft={draft}
          setDraft={setDraft}
          isEditable={isEditable}
          whatsappHref={whatsappHref}
        />
        <KycPersonalInformationCard draft={draft} setDraft={setDraft} isEditable={isEditable} />

        <KycUserDataCardsAddressSection
          draft={draft}
          setDraft={setDraft}
          isEditable={isEditable}
          indonesiaAddress={indonesiaAddress}
        />

        <KycDocumentInformationCard countryCode={countryCode} draft={draft} setDraft={setDraft} isEditable={isEditable} />

        <KycUserDataCardsFooterActions
          showRejectionNote={showRejectionNote}
          draft={draft}
          isEditable={isEditable}
          isSaving={isSaving}
          isDirty={isDirty}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
        />
      </CardContent>
    </Card>
  );
};

